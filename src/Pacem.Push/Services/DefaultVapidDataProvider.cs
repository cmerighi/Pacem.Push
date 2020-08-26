using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Pacem.Push.Services
{
    /// <summary>
    /// Implements <see cref="IVapidDataProvider"/> exploiting the environment configuration.
    /// </summary>
    public class DefaultVapidDataProvider : IVapidDataProvider
    {
        private readonly IConfiguration _configuration;

        public DefaultVapidDataProvider(IConfiguration configuration)
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
