using System.Collections.Generic;

namespace Pacem.Push
{
    /// <summary>
    /// As of https://w3c.github.io/push-api/#dom-pushsubscriptionjson
    /// </summary>
    public class PushSubscription
    {
        // standard
        public string Endpoint { get; set; }
        public long? ExpirationTime { get; set; }
        public Dictionary<string,string> Keys { get; set; }

        // extra
        public string UserId { get; set; }
    }
}
