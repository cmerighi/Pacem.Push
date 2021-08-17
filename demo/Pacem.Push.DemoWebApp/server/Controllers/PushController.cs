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

        private HttpClient GetAuthorizedClient()
            // 'client credentials' flow under the hoods
            => _factory.CreateClient("Push").AsOpenIdConnectClient();

        [HttpGet("vapidpublic")]
        public async Task<ActionResult<string>> VapidPublicKey()
        {
            var request = CloneRequest(Request, "api/push/vapidpublickey");
            var response = await GetAuthorizedClient().SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                string output = await response.Content.ReadAsStringAsync();
                return Ok(output);
            }
            else
            {
                return StatusCode((int)response.StatusCode, response.ReasonPhrase);
            }
        }

        [HttpPost("subscribe")]
        public async Task<ActionResult> SubscribeAsync()
        {
            var request = CloneRequest(Request, "api/push/subscribe");
            var response = await GetAuthorizedClient().SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var output = await response.Content.ReadAsStringAsync();
                return Content(output, "application/json");
            }
            else
            {
                return StatusCode((int)response.StatusCode, response.ReasonPhrase);
            }
        }

        [HttpPost("unsubscribe")]
        public async Task<ActionResult> UnsubscribeAsync()
        {
            var request = CloneRequest(Request, "api/push/unsubscribe");
            var response = await GetAuthorizedClient().SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return NoContent();
            }
            else
            {
                return StatusCode((int)response.StatusCode, response.ReasonPhrase);
            }
        }

        [HttpPost("send/{userId}")]
        public Task PushNotification(string userId)
        {
            return GetAuthorizedClient().PostAsync("api/push/send/" + userId, new
            {
                title = "Demo App Notification!"
            });
        }


        private HttpRequestMessage CloneRequest(HttpRequest request, string uri)
        {
            var requestMessage = new HttpRequestMessage();

            var requestMethod = request.Method;

            if (!HttpMethods.IsGet(requestMethod) &&
              !HttpMethods.IsHead(requestMethod) &&
              !HttpMethods.IsDelete(requestMethod) &&
              !HttpMethods.IsTrace(requestMethod))
            {
                var streamContent = new StreamContent(request.Body);
                requestMessage.Content = streamContent;
            }

            requestMessage.RequestUri = new Uri(uri, UriKind.Relative);
            requestMessage.Method = new HttpMethod(request.Method);
            requestMessage.Content?.Headers.Add("Content-Type", request.ContentType);
            if (request.ContentLength.HasValue)
            {
                requestMessage.Headers.TryAddWithoutValidation("Content-Length", request.ContentLength.Value.ToString());
            }

            return requestMessage;
        }
    }
}
