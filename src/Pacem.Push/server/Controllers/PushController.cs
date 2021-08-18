using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pacem.Push.Entities;
using Pacem.Push.Services;
using System.Threading.Tasks;

namespace Pacem.Push.Controllers.V1
{
    [Authorize] // <- OAuth2 introspection
    [ApiController]
    [Route("api/v1/push")]
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
            string clientId = User.FindFirst(JwtClaimTypes.ClientId)?.Value;
            if (string.IsNullOrEmpty(clientId))
            {
                return Unauthorized();
            }

            var vapid = await _vapid.GetVapidDetailsAsync(clientId);
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
            string clientId = User.FindFirst(JwtClaimTypes.ClientId)?.Value;
            if (string.IsNullOrEmpty(clientId))
            {
                return Unauthorized();
            }

            return await _push.SubscribeAsync(clientId, subscription);
        }

        [HttpPost("unsubscribe")]
        public async Task<ActionResult> UnsubscribeAsync([FromBody] PushSubscription subscription)
        {
            string clientId = User.FindFirst(JwtClaimTypes.ClientId)?.Value;
            if (string.IsNullOrEmpty(clientId))
            {
                return Unauthorized();
            }

            await _push.UnsubscribeAsync(clientId, subscription);
            return NoContent();
        }

        [HttpPost("send/{userId?}")]
        public async Task<ActionResult> SendAsync([FromRoute] string userId, [FromBody] Notification notification)
        {
            string clientId = User.FindFirst(JwtClaimTypes.ClientId)?.Value;
            if (string.IsNullOrEmpty(clientId))
            {
                return Unauthorized();
            }

            await _push.SendAsync(clientId, userId, notification);
            return Accepted();
        }
    }
}
