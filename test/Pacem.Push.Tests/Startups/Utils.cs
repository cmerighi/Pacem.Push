using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pacem.Push.Tests
{
    public static class Utils
    {
        public const string DEFAULT_VAPID_PUBLIC_KEY = "BDx-oyQYAQPr6TGywMm75UTvZYbbUfD-_Kr4z9Fh-jP41NvF0dTqg4iPyVjWm2HmMBzZnRWE2LsX_ABn09zESAQ";

        public static TestServer CreateTestServer(string vapidPublicKey = DEFAULT_VAPID_PUBLIC_KEY)
            => new TestServer(new WebHostBuilder()
                .ConfigureAppConfiguration((context, config) =>
                {
                    Dictionary<string, string> vapid = new Dictionary<string, string>
                    {
                        { "Vapid:Subject", "mailto:testing@pacem.it"},
                        { "Vapid:PublicKey", vapidPublicKey},
                        { "Vapid:PrivateKey", "cyiia2ULvZURE7CRwNcr2v9mEm0AT1oaXSHoQyWKf3I"}
                    };
                    config.AddInMemoryCollection(vapid);
                })
                .UseStartup<TestStartup>()
                );
    }
}
