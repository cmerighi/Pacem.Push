using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pacem.Push.Entities;
using Pacem.Push.Services;
using System.Threading.Tasks;

namespace Pacem.Push.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PushController : ControllerBase
    {
        private readonly ILogger<PushController> _logger;
        private readonly IPushService _push;
        private readonly IVapidDetailsStore _vapid;

        public PushController(IPushService push, IVapidDetailsStore vapid, ILogger<PushController> logger)
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

        [HttpPost("send/{userId}")]
        public async Task<ActionResult> SendAsync([FromRoute] string userId, [FromBody] Notification notification)
        {
            await _push.SendAsync(userId, notification);
            return Accepted();
        }
    }
}
