using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Text.Encodings.Web;

namespace WaxOnWaxOff.Infrastructure
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class SharedSecretMiddleware : AuthenticationMiddleware<SharedSecretOptions>
    {
        private readonly RequestDelegate _next;

        public SharedSecretMiddleware(RequestDelegate next, ILoggerFactory loggerFactory, UrlEncoder encoder, IOptions<SharedSecretOptions> options) :base(next, options, loggerFactory, encoder)
        {
            
        }

        protected override AuthenticationHandler<SharedSecretOptions> CreateHandler()
        {
            return new SharedSecretHandler();
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class SharedSecretMiddlewareExtensions
    {
        public static IApplicationBuilder UseSharedSecretMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SharedSecretMiddleware>();
        }
    }
}
