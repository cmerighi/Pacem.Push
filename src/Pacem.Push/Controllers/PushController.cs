using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pacem.Push.Services;

namespace Pacem.Push.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PushController : ControllerBase
    {
        private readonly ILogger<PushController> _logger;
        private readonly IPushService _push;
        private readonly IVapidDataProvider _vapid;

        public PushController(IPushService push, IVapidDataProvider vapid, ILogger<PushController> logger)
        {
            _push = push;
            _vapid = vapid;
            _logger = logger;
        }

        [HttpPost("vapidpublickey")]
        public async Task<ActionResult> VapidPublicKeyAsync()
        {
            var vapid = await _vapid.GetVapidDataAsync();
            string publicKey = vapid?.PublicKey;

            if (string.IsNullOrEmpty(publicKey))
            {
                return NotFound();
            }

            return Ok(publicKey);
        }

        [HttpPost("subscribe")]
        public async Task<ActionResult<Subscription>> SubscribeAsync([FromBody] Subscription subscription)
        {
            // TODO: replace with actual subscription request structure.
            // https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/#receive
            return await _push.SubscribeAsync(subscription);
        }

        [HttpPost("unsubscribe")]
        public async Task UnsubscribeAsync()
        {

        }

        [HttpPost("send/{userId}")]
        public async Task SendAsync([FromRoute] string userId, [FromBody] Notification notification)
        {

        }
    }
}
