using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pacem.Push.Data;
using Pacem.Push.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Pacem.Push.Services
{
    public class SqlServerPushService : IPushService
    {
        private readonly PushDbContext _db;
        private readonly IVapidDetailsStore _vapid;
        private readonly IMapper _mapper;
        private readonly WebPush.WebPushClient _client;
        private readonly ILogger<SqlServerPushService> _logger;

        public SqlServerPushService(PushDbContext db, IMapper mapper, IVapidDetailsStore vapid, ILogger<SqlServerPushService> logger)
        {
            _db = db;
            _vapid = vapid;
            _mapper = mapper;
            _client = new WebPush.WebPushClient();
            _logger = logger;
        }

        public async Task SendAsync(string userId, Notification notification)
        {
            var subscriptions = await _db.SubscriptionSet
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .ProjectTo<WebPush.PushSubscription>(_mapper.ConfigurationProvider)
                .ToListAsync();

            string jsonNotification = System.Text.Json.JsonSerializer.Serialize(notification);

            VapidData vapidData = await _vapid.GetVapidDataAsync();
            WebPush.VapidDetails vapid = _mapper.Map<WebPush.VapidDetails>(vapidData);

            foreach (var subscription in subscriptions)
            {
                try
                {
                    _client.SendNotification(subscription, jsonNotification, vapid);
                }
                catch (WebPush.WebPushException exc)
                {
                    if (exc.Message == "Subscription no longer valid")
                    {
                        // tidy-up
                        await UnsubscribeAsync(subscription.P256DH);
                    }
                    else
                    {
                        // what's wrong?
                        _logger.LogError(exc, exc.Message);
                    }
                }
            }
        }

        public async Task<PushSubscription> SubscribeAsync(PushSubscription subscription)
        {
            string p256dh = subscription.P256Dh();

            // retrieve existing, if any
            var stored = await _db.SubscriptionSet.Where(i => i.P256Dh == p256dh).FirstOrDefaultAsync();

            // expired?
            if (stored?.Expires.HasValue == true && DateTimeOffset.FromUnixTimeMilliseconds(stored.Expires.Value) < DateTimeOffset.UtcNow)
            {
                _db.Remove(stored);
                stored = null;
            }

            // (re)new
            if (stored == null)
            {
                stored = _mapper.Map<Subscription>(subscription);
                await _db.AddAsync(stored);
                await _db.SaveChangesAsync(true);
            }

            // update (userId, basically)
            _mapper.Map(stored, subscription);
            return subscription;
        }

        public Task UnsubscribeAsync(PushSubscription subscription)
            => UnsubscribeAsync(subscription?.P256Dh() ?? throw new ArgumentNullException(nameof(subscription)));

        private async Task UnsubscribeAsync(string p256dh)
        {
            var stored = await _db.SubscriptionSet.Where(i => i.P256Dh == p256dh).FirstOrDefaultAsync();
            if (stored != null)
            {
                _db.Remove(stored);
                await _db.SaveChangesAsync();
            }
        }

    }
}
