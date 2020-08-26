using System.Threading.Tasks;

namespace Pacem.Push.Services
{
    /// <summary>
    /// Defines how to retrieve the VAPID details.
    /// </summary>
    public interface IVapidDataProvider
    {
        /// <summary>
        /// Retrieves the VAPID details.
        /// </summary>
        Task<VapidData> GetVapidDataAsync();
    }
}
