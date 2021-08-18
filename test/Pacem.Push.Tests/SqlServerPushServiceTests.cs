using FluentAssertions;
using IdentityModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pacem.Push.Data;
using Pacem.Push.Services;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Pacem.Push.Tests
{
    public class SqlServerPushServiceTests
    {
        [Fact]
        public async Task Should_register_the_subscription_and_preserve_the_userId()
        {
            using (var server = Utils.CreateTestServer())
            {
                var db = server.Services.GetRequiredService<PushDbContext>();
                Utils.SeedPushDbContext(db);

                using (var client = server.CreateClient())
                {
                    HttpContent payload = new StringContent(System.Text.Json.JsonSerializer.Serialize(
                        new PushSubscription
                        {
                            Endpoint = "https://foo.baz/push/...",
                            Keys = new Dictionary<string, string>
                             {
                                 { PushSubscriptionKeyNames.P256Dh, "P256DH" },
                                 { PushSubscriptionKeyNames.Auth, "AUTH" }
                             }
                        }, Pacem.Push.Serialization.JsonSerializer.JsonSerializerOptions)
                    , Encoding.UTF8, "application/json");

                    var response = await client.PostAsync("/api/v1/push/subscribe", payload);
                    response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
                    string json = await response.Content.ReadAsStringAsync();
                    var subscription = System.Text.Json.JsonSerializer.Deserialize<PushSubscription>(json, Pacem.Push.Serialization.JsonSerializer.JsonSerializerOptions);
                    subscription.Should().NotBeNull();
                    subscription.UserId.Should().NotBeNullOrEmpty();

                    // repeat the subscription
                    HttpContent payload2 = new StringContent(System.Text.Json.JsonSerializer.Serialize(subscription, Pacem.Push.Serialization.JsonSerializer.JsonSerializerOptions)
                    , Encoding.UTF8, "application/json");

                    var response2 = await client.PostAsync("/api/v1/push/subscribe", payload2);
                    response2.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
                    string json2 = await response2.Content.ReadAsStringAsync();
                    var subscription2 = System.Text.Json.JsonSerializer.Deserialize<PushSubscription>(json2, Pacem.Push.Serialization.JsonSerializer.JsonSerializerOptions);
                    subscription2.Should().NotBeNull();
                    subscription2.UserId.Should().Be(subscription.UserId);
                }
            }
        }
    }
}
