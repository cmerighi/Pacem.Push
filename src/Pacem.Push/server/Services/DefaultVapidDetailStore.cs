using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Pacem.Push.Services
{
    /// <summary>
    /// Implements <see cref="IVapidDetailsStore"/> exploiting the environment configuration.
    /// </summary>
    public class DefaultVapidDetailStore : IVapidDetailsStore
    {
        private readonly IConfiguration _configuration;

        public DefaultVapidDetailStore(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Task<VapidData> GetVapidDataAsync()
        {
            var vapid = new VapidData
            {
                PrivateKey = _configuration.GetValue<string>("Vapid:PrivateKey"),
                PublicKey = _configuration.GetValue<string>("Vapid:PublicKey"),
                Subject = _configuration.GetValue<string>("Vapid:Subject"),
            };
            return Task.FromResult(vapid);
        }
    }

}
