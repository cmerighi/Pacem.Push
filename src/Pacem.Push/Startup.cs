using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.EquivalencyExpression;
using IdentityModel.AspNetCore.OAuth2Introspection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Pacem.Push.Data;

namespace Pacem.Push
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Subscription storage
            services.AddSqlServerPushService(Configuration.GetConnectionString("Database"));

            // VapidDetails retriever
            services.AddDefaultVapidDataProvider();

            // AutoMapper
            services.AddAutoMapper(config =>
            {
                config.AddCollectionMappers();

                // specific mappings here
                config.AddPacemWebPushMappings();

            }, Assembly.GetExecutingAssembly());

            // OAuth2
            services.AddAuthentication("Bearer")
                .AddOAuth2Introspection(options =>
                {
                    options.Authority = Configuration.GetValue<string>("OAuth2:Authority");
                    options.ClientId = Configuration.GetValue<string>("OAuth2:ClientId");
                    options.ClientSecret = Configuration.GetValue<string>("OAuth2:ClientSecret");
                    options.CacheDuration = TimeSpan.FromMinutes(5D);
                    options.EnableCaching = true;
                    options.TokenRetriever = (request) => TokenRetrieval.FromAuthorizationHeader()(request) ?? /* querystring fallback */ TokenRetrieval.FromQueryString()(request);
                    options.NameClaimType = "name";
                    options.DiscoveryPolicy.RequireHttps = false;
                });

            // Controllers and output formatting
            services.AddControllers().AddJsonOptions(options =>
            {
                Pacem.Push.Serialization.JsonSerializer.Configure(options.JsonSerializerOptions);
            });

            // CORS
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(cors =>
                {
                    cors.AllowAnyMethod();
                    cors.AllowAnyOrigin();
                    cors.AllowAnyHeader();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHttpsRedirection();
            }

            app.UseCors();

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
