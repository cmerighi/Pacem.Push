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

        public Task SendAsync(string clientId, Notification notification)
            => SendAsync(clientId, default, notification);

        public async Task SendAsync(string clientId, string userId, Notification notification)
        {
            if (string.IsNullOrEmpty(clientId))
            {
                throw new ArgumentNullException(nameof(clientId));
            }

            var subscriptions = await _db.SubscriptionSet
                .AsNoTracking()
                .Where(s =>
                    s.ClientId == clientId
                    && s.Client.IsEnabled
                    && (string.IsNullOrEmpty(userId) || s.UserId == userId)
                )
                .ProjectTo<WebPush.PushSubscription>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // no subscriptions?
            if (subscriptions.Count == 0)
            {
                // no need to go further
                return;
            }

            string jsonNotification = System.Text.Json.JsonSerializer.Serialize(notification, Pacem.Push.Serialization.JsonSerializer.JsonSerializerOptions);

            VapidDetails vapidData = await _vapid.GetVapidDetailsAsync(clientId);
            WebPush.VapidDetails vapid = _mapper.Map<WebPush.VapidDetails>(vapidData);

            foreach (var subscription in subscriptions)
            {
                try
                {
                    _logger.LogInformation("Sending {p256dh} subscription to encrypt message:\n{message}...", subscription.P256DH, jsonNotification);
                    _client.SendNotification(subscription, jsonNotification, vapid);
                    _logger.LogInformation("...sent!");
                }
                catch (WebPush.WebPushException exc)
                {
                    if (exc.Message == /* This is a magic string from the WebPush lib */ "Subscription no longer valid")
                    {
                        // tidy-up
                        await UnsubscribeAsync(clientId, subscription.P256DH);
                    }
                    else
                    {
                        // what's wrong?
                        _logger.LogError(exc, exc.Message);
                    }
                }
            }
        }

        public async Task<PushSubscription> SubscribeAsync(string clientId, PushSubscription subscription)
        {
            Subscription stored = null;
            var client = await _db.ClientSet.FindAsync(clientId);

            if (client == null)
            {
                return null;
            }

            // retrieve existing, if any
            stored = await _db.SubscriptionSet
                .Include(s => s.Client)
                .Where(i => i.ClientId == clientId
                    && ((!string.IsNullOrEmpty(subscription.UserId) && i.UserId == subscription.UserId)
                        || (string.IsNullOrEmpty(subscription.UserId) && i.P256Dh == subscription.P256Dh()))
                )
                .FirstOrDefaultAsync();

            // expired or disabled client?
            if (stored != null
                && (
                    !client.IsEnabled
                    || (stored.Expires.HasValue == true && DateTimeOffset.FromUnixTimeMilliseconds(stored.Expires.Value) < DateTimeOffset.UtcNow)
                    )
                )
            {
                // tidy up
                _db.Remove(stored);
                stored = null;
            }

            // client isn't enabled?
            if (!client.IsEnabled)
            {
                // tidy up already done, exit
                return null;
            }

            // (re)new
            if (stored == null)
            {
                stored = _mapper.Map<Subscription>(subscription);
                stored.ClientId = clientId;
                await _db.AddAsync(stored);
                await _db.SaveChangesAsync(true);
            }

            // update (userId, basically)
            _mapper.Map(stored, subscription);
            return subscription;
        }

        public Task UnsubscribeAsync(string clientId, PushSubscription subscription)
            => UnsubscribeAsync(clientId, subscription?.P256Dh() ?? throw new ArgumentNullException(nameof(subscription)));

        private async Task UnsubscribeAsync(string clientId, string p256dh)
        {
            var stored = await _db.SubscriptionSet.Where(i => i.P256Dh == p256dh && i.ClientId == clientId).FirstOrDefaultAsync();
            if (stored != null)
            {
                _db.Remove(stored);
                await _db.SaveChangesAsync();
            }
        }

    }
}
