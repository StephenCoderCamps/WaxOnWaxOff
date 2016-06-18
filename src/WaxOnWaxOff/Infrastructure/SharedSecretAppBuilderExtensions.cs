using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Infrastructure
{
    public static class SharedSecretAppBuilderExtensions
    {

        public static IApplicationBuilder UseSharedSecretAuthentication(this IApplicationBuilder app, SharedSecretOptions options)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }
            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            return app.UseMiddleware<SharedSecretMiddleware>(Options.Create(options));
        }
    }
}
