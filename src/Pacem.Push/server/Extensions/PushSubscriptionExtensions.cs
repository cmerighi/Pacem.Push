namespace Pacem.Push
{
    public static class PushSubscriptionExtensions
    {
        public static string P256Dh(this PushSubscription subscription)
        {
            subscription.Keys.TryGetValue(PushSubscriptionKeyNames.P256Dh, out string value);
            return value;
        }

        public static string Auth(this PushSubscription subscription)
        {
            subscription.Keys.TryGetValue(PushSubscriptionKeyNames.Auth, out string value);
            return value;
        }
    }
}
