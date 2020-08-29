using Microsoft.EntityFrameworkCore;
using Pacem.Push.Data;
using Pacem.Push.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Threading.Tasks;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSqlServerVapidDataProvider(this IServiceCollection services, string connectionString)
            => services
            .AddDbContextPool<PushDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
            }).AddScoped<IVapidDetailsStore, SqlServerVapidDetailStore>();

        public static IServiceCollection AddSqlServerPushService(this IServiceCollection services, string connectionString)
            => services
            .AddDbContextPool<PushDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
            })
            .AddScoped<IPushService, SqlServerPushService>();
    }
}
