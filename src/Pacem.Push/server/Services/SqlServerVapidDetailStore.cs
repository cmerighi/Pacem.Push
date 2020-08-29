using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Pacem.Push.Data;

namespace Pacem.Push.Services
{
    /// <summary>
    /// Implements <see cref="IVapidDetailsStore"/> exploiting the environment configuration.
    /// </summary>
    public class SqlServerVapidDetailStore : IVapidDetailsStore
    {
        private readonly PushDbContext _db;
        private readonly IMapper _mapper;

        public SqlServerVapidDetailStore(PushDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<VapidDetails> GetVapidDetailsAsync(string clientId)
        {
            var vapid = await _db.ClientSet.AsNoTracking()
                    .Where(c => c.ClientId == clientId && c.IsEnabled)
                    .ProjectTo<VapidDetails>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync();
            return vapid;
        }
    }

}
