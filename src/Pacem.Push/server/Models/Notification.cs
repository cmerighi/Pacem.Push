using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Pacem.Push
{
    /// <summary>
    ///     <see href="https://notifications.spec.whatwg.org/#dictdef-notificationoptions">Notification API Standard</see>
    /// </summary>
    public class Notification
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("lang")]
        public string Lang { get; set; }

        [JsonPropertyName("body")]
        public string Body { get; set; }

        [JsonPropertyName("tag")]
        public string Tag { get; set; }

        [JsonPropertyName("image")]
        public string Image { get; set; }

        [JsonPropertyName("icon")]
        public string Icon { get; set; }

        [JsonPropertyName("badge")]
        public string Badge { get; set; }

        [JsonPropertyName("timestamp")]
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        [JsonPropertyName("requireInteraction")]
        public bool RequireInteraction { get; set; } = false;

        [JsonPropertyName("renotify")]
        public bool Renotify { get; set; } = false;

        [JsonPropertyName("silent")]
        public bool Silent { get; set; } = false;

        [JsonPropertyName("data")]
        public object Data { get; set; }

        [JsonPropertyName("vibrate")]
        public long[] Vibrate { get; set; }

        [JsonPropertyName("actions")]
        public List<NotificationAction> Actions { get; set; } = new List<NotificationAction>();

        [JsonPropertyName("dir")]
        public string Direction { get; set; } = NotificationDirections.Auto;
    }
}
