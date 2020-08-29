using System.Threading.Tasks;

namespace Pacem.Push.Services
{
    /// <summary>
    /// Defines how to retrieve the VAPID details.
    /// </summary>
    public interface IVapidDetailsStore
    {
        /// <summary>
        /// Retrieves the VAPID details.
        /// </summary>
        Task<VapidDetails> GetVapidDetailsAsync(string clientId);
    }
}
