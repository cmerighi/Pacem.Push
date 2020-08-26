using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Pacem.Push.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PushController : ControllerBase
    {
        private readonly ILogger<PushController> _logger;

        public PushController(ILogger<PushController> logger)
        {
            _logger = logger;
        }

        [HttpPost("subscribe")]
        public async Task SubscribeAsync()
        {

        }

        [HttpPost("unsubscribe")]
        public async Task UnsubscribeAsync()
        {

        }

        [HttpPost("send/{userId}")]
        public async Task SendAsync([Required] string userId, [FromBody] Notification notification)
        {

        }
    }
}
