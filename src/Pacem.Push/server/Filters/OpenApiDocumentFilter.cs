using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pacem.Push.Filters
{
    public class OpenApiDocumentFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            string version = swaggerDoc.Info.Version;
            string[] paths = swaggerDoc.Paths.Keys.ToArray();
            foreach (var path in paths)
            {
                if (!path.Contains($"api/{version}/", StringComparison.OrdinalIgnoreCase))
                {
                    swaggerDoc.Paths.Remove(path);
                }
            }
        }
    }
}
