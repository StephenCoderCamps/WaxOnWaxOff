using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Infrastructure.Policies
{
    public class SharedSecretHandler : AuthorizationHandler<SharedSecretRequirement>
    {
        protected override void Handle(AuthorizationContext context, SharedSecretRequirement requirement)
        {

            if (requirement.AllowAdmin)
            {
                if (context.User.Identity.IsAuthenticated && context.User.Identity.Name != "Student")
                {
                    context.Succeed(requirement);
                    return;
                }
            }

            var mvcContext = context.Resource as Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext;
            var request = mvcContext.HttpContext.Request;
            var userSecret = request.Headers["X-Secret"];
            if (String.IsNullOrWhiteSpace(userSecret))
            {
                userSecret = request.Query["secret"];
            }
            if (userSecret != requirement.Secret)
            {
                return;
            }
            context.Succeed(requirement);
        }
    }
}
