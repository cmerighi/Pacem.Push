using AutoMapper;
using AutoMapper.Configuration;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pacem.Push.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Pacem.Push.Services
{
    public class SqlServerPushService : IPushService
    {
        private readonly PushDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly IVapidDataProvider _vapid;
        private readonly IMapper _mapper;
        private readonly WebPush.WebPushClient _client;
        private readonly ILogger<SqlServerPushService> _logger;

        public SqlServerPushService(IConfiguration configuration, PushDbContext db, IMapper mapper, IVapidDataProvider vapid, ILogger<SqlServerPushService> logger)
        {
            _db = db;
            _configuration = configuration;
            _vapid = vapid;
            _mapper = mapper;
            _client = new WebPush.WebPushClient();
            _logger = logger;
        }

        public async Task SendAsync(string userId, string endpoint, Notification notification)
        {
            var subscriptions = await _db.SubscriptionSet
                .AsNoTracking()
                .Where(s => s.UserId == userId && s.Endpoint == endpoint)
                .ProjectTo<WebPush.PushSubscription>(_mapper.ConfigurationProvider)
                .ToListAsync();

            string jsonNotification = System.Text.Json.JsonSerializer.Serialize(notification);

            VapidData vapidData = await _vapid.GetVapidDataAsync();
            WebPush.VapidDetails vapid = _mapper.Map<WebPush.VapidDetails>(vapidData);

            foreach (var subscription in subscriptions)
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

        public async Task<Subscription> SubscribeAsync(Subscription subscription)
        {
            var stored = await _db.SubscriptionSet.Where(i => i.P256Dh == subscription.P256Dh).FirstOrDefaultAsync();
            if (stored == null)
            {
                await _db.AddAsync(stored = subscription);
                await _db.SaveChangesAsync(true);
            }
            return stored;
        }

        public Task UnsubscribeAsync(Subscription subscription) 
            => UnsubscribeAsync(subscription?.P256Dh ?? throw new ArgumentNullException(nameof(subscription)));

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
