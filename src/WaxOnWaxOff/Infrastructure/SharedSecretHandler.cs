using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Infrastructure
{
    public class SharedSecretHandler : AuthenticationHandler<SharedSecretOptions>
    {
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var userSecret = Request.Headers["X-Secret"];
            if (String.IsNullOrWhiteSpace(userSecret))
            {
                userSecret = Request.Query["secret"];
            }
            if (userSecret != this.Options.Secret)
            {
                return Task.FromResult(AuthenticateResult.Fail("Authentication Failed: Go Away!!!"));
            }

            var principal = new ClaimsPrincipal(new ClaimsIdentity("SharedSecret"));
            var props = new AuthenticationProperties();
            var ticket = new AuthenticationTicket(principal, props, "SharedSecret");
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
