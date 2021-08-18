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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
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
            string sqlConnectionString = Configuration.GetConnectionString("Database");

            // Subscription storage
            services.AddSqlServerPushService(sqlConnectionString);

            // VapidDetails retriever
            services.AddSqlServerVapidDataProvider(sqlConnectionString);

            // AutoMapper
            services.AddAutoMapper(config =>
            {
                config.AddCollectionMappers();

                // specific mappings here
                config.AddPacemWebPushMappings();

            }, Assembly.GetExecutingAssembly());

            // OAuth2
            services.AddDistributedMemoryCache();
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

            // Open API

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Pacem Push Api", Version = "v1" });
                options.DocumentFilter<Pacem.Push.Filters.OpenApiDocumentFilter>();
                // options.ResolveConflictingActions(a => a.FirstOrDefault());

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);

                // auth
                string authority = Configuration.GetValue<string>("OAuth2:Authority").EnsureTrailingSlash();
                var bearerSecurityScheme = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    In = ParameterLocation.Header,
                    OpenIdConnectUrl = new Uri(authority),
                    Reference = new OpenApiReference
                    {
                        Id = "OAuth2Auth",
                        Type = ReferenceType.SecurityScheme,
                    },
                    Scheme = "oauth2",
                    Name = "OAuth2",
                    Flows = new OpenApiOAuthFlows
                    {
                        ClientCredentials = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri(authority + "connect/authorize"),
                            TokenUrl = new Uri(authority + "connect/token"),
                            Scopes = new Dictionary<string, string>
                            {
                                { "pacem.push.api", "Pacem Push Api" }
                            }
                        }
                    }
                };
                options.AddSecurityDefinition(bearerSecurityScheme.Reference.Id, bearerSecurityScheme);
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { bearerSecurityScheme, Array.Empty<string>() }
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

            app.UseDefaultFiles().UseStaticFiles();

            #region OpenAPI/Swagger

            app.UseSwagger(options =>
            {
                options.RouteTemplate = "openapi/{documentName}/pacem-push.json";
            });
            app.UseSwaggerUI(options =>
            {
                options.InjectStylesheet("/css/openapi.css");
                options.InjectJavascript("/js/openapi.js");
                options.DefaultModelsExpandDepth(-1);
                options.SwaggerEndpoint("/openapi/v1/pacem-push.json", "Pacem Push Api V1");
                options.RoutePrefix = "openapi";
            });

            #endregion

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
