using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pacem.Push.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pacem.Push.Tests
{
    public static class Utils
    {
        public const string DEFAULT_VAPID_PUBLIC_KEY = "BDx-oyQYAQPr6TGywMm75UTvZYbbUfD-_Kr4z9Fh-jP41NvF0dTqg4iPyVjWm2HmMBzZnRWE2LsX_ABn09zESAQ";
        const string VAPID_PRIVATE_KEY = "cyiia2ULvZURE7CRwNcr2v9mEm0AT1oaXSHoQyWKf3I";
        const string VAPID_SUBJECT = "mailto:testing@pacem.it";
        public const string CLIENT_ID = "Test.Client";

        public static TestServer CreateTestServer()
            => new TestServer(new WebHostBuilder()
                .UseStartup<TestStartup>()
                );

        public static void SeedPushDbContext(PushDbContext db)
        {
            db.ClientSet.Add(new Entities.Client
            {
                ClientId = CLIENT_ID,
                IsEnabled = true,
                VapidPrivateKey = VAPID_PRIVATE_KEY,
                VapidPublicKey = DEFAULT_VAPID_PUBLIC_KEY,
                VapidSubject = VAPID_SUBJECT
            });
            db.SaveChanges(true);
        }
    }
}
