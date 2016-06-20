using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Infrastructure.Policies
{
    public class SharedSecretRequirement:IAuthorizationRequirement
    {
        public SharedSecretRequirement(string secret, bool allowAdmin = false)
        {
            this.Secret = secret;
            this.AllowAdmin = allowAdmin;
        }

        public string Secret { get; set; }
        public bool AllowAdmin { get; set; }
    }
}
