using System.Text.Json.Serialization;

namespace Pacem.Push
{
    public class NotificationAction
    {

        [JsonPropertyName("action")]
        public string Action { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }
    }

}
