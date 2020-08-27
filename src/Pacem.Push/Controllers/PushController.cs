using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pacem.Push.Entities;
using Pacem.Push.Services;
using System.Threading.Tasks;

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

        [HttpGet("vapidpublickey")]
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
        public async Task<ActionResult<PushSubscription>> SubscribeAsync([FromBody] PushSubscription subscription)
        {
            return await _push.SubscribeAsync(subscription);
        }

        [HttpDelete("unsubscribe")]
        public async Task<ActionResult> UnsubscribeAsync([FromBody] PushSubscription subscription)
        {
            await _push.UnsubscribeAsync(subscription);
            return NoContent();
        }

        // 'send' endpoint has protected access (oauth2 protocol) 
        [Authorize]
        [HttpPost("send/{userId}")]
        public async Task<ActionResult> SendAsync([FromRoute] string userId, [FromBody] Notification notification)
        {
            await _push.SendAsync(userId, notification);
            return Accepted();
        }
    }
}
