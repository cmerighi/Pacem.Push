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
        /// <param name="clientId">The Client application id.</param>
        /// <param name="subscription">Push subscription.</param>
        Task<PushSubscription> SubscribeAsync(string clientId, PushSubscription subscription);

        /// <summary>
        /// Un-registers a push subscription.
        /// </summary>
        /// <param name="clientId">The Client application id.</param>
        /// <param name="subscription">Push subscription.</param>
        Task UnsubscribeAsync(string clientId, PushSubscription subscription);

        /// <summary>
        /// Sends a push notification to a user.
        /// </summary>
        /// <param name="clientId">The Client application id.</param>
        /// <param name="userId">Target user identifier.</param>
        /// <param name="notification">The notification itself.</param>
        Task SendAsync(string clientId, string userId, Notification notification);

        /// <summary>
        /// Sends a push notification to all the subscribers of a specific application.
        /// </summary>
        /// <param name="clientId">The Client application id.</param>
        /// <param name="notification">The notification itself.</param>
        Task SendAsync(string clientId, Notification notification);
    }
}
