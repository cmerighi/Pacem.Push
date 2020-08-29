using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Org.BouncyCastle.Crypto.Tls;
using Pacem.Push.Data;
using Pacem.Push.Services;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Xunit;

namespace Pacem.Push.Tests
{
    public class VapidDataProviderTests
    {
        
        [Fact]
        public async Task Should_provide_the_public_key()
        {
            using (var server = Utils.CreateTestServer())
            {
                var db = server.Services.GetRequiredService<PushDbContext>();
                Utils.SeedPushDbContext(db);

                using (var client = server.CreateClient())
                {
                    var response = await client.GetAsync("/api/push/vapidpublickey");
                    response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
                    string publicKey = await response.Content.ReadAsStringAsync();
                    publicKey.Should().Be(Utils.DEFAULT_VAPID_PUBLIC_KEY);
                }
            }
        }
    }
}
