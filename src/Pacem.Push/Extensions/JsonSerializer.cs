using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Pacem.Push.Serialization
{
    public static class JsonSerializer
    {
        static JsonSerializer()
        {
            Configure(JsonSerializerOptions);
        }

        public static void Configure(JsonSerializerOptions settings)
        {
            settings.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
            settings.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            settings.IgnoreNullValues = true;

            // Allow PascalCase PARSING
            settings.PropertyNameCaseInsensitive = true;
        }

        public static JsonSerializerOptions JsonSerializerOptions { get; } = new JsonSerializerOptions();
    }

}
