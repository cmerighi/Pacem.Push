using System.Threading.Tasks;

namespace Pacem.Push.Services
{
    /// <summary>
    /// Defines a service to manage Push subscriptions and send Push notifications.
    /// </summary>
    public interface IPushService
    {
        /// <summary>
        /// Registers a push subscription.
        /// </summary>
        /// <param name="subscription">Push subscription.</param>
        Task<PushSubscription> SubscribeAsync(PushSubscription subscription);

        /// <summary>
        /// Un-registers a push subscription.
        /// </summary>
        /// <param name="subscription">Push subscription.</param>
        Task UnsubscribeAsync(PushSubscription subscription);
        
        /// <summary>
        /// Sends a push notification to a user.
        /// </summary>
        /// <param name="userId">Target user identifier.</param>
        /// <param name="notification">The notification itself.</param>
        Task SendAsync(string userId, Notification notification);
    }
}
