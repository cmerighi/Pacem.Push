using AutoMapper;
using AutoMapper.EquivalencyExpression;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Pacem.Push.Data;
using Pacem.Push.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pacem.Push.Tests
{
    public class TestStartup
    {
        public TestStartup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<PushDbContext>(options =>
            {
                options.UseInMemoryDatabase("PushDatabase");
            }, ServiceLifetime.Transient);
            services.AddScoped<IPushService, SqlServerPushService>();
            services.AddScoped<IVapidDetailsStore, SqlServerVapidDetailStore>();

            var testedAssembly = typeof(Push.Controllers.V1.PushController).Assembly;

            services.AddAuthentication("Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    "Test", options => { });

            // AutoMapper
            services.AddAutoMapper(config =>
            {
                config.AddCollectionMappers();

                // specific mappings here
                config.AddPacemWebPushMappings();

            }, testedAssembly);

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    Pacem.Push.Serialization.JsonSerializer.Configure(options.JsonSerializerOptions);
                })
                .AddApplicationPart(testedAssembly);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }
}
