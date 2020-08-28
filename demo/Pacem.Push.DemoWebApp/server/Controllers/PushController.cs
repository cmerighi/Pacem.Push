using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Pacem.Extensions.Http;
using Pacem.Net.Http;

namespace Pacem.Push.DemoWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PushController : ControllerBase
    {
        private readonly IHttpClientFactory _factory;

        public PushController(IHttpClientFactory factory)
        {
            _factory = factory;
        }

        [HttpPost("subscribe")]
        public Task SubscribeAsync()
        {
            // 'client credentials' flow under the hood
            StreamContent content = new StreamContent(Request.Body);
            return _factory.CreateClient("Push").AsOpenIdConnectClient().PostAsync("api/subscribe", content);
        }

        [HttpPost("unsubscribe")]
        public Task UnsubscribeAsync()
        {
            // 'client credentials' flow under the hood
            StreamContent content = new StreamContent(Request.Body);
            return _factory.CreateClient("Push").AsOpenIdConnectClient().PostAsync("api/unsubscribe", content);
        }
    }
}
