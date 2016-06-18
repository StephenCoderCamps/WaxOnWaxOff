using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Infrastructure
{
    public class SharedSecretOptions : AuthenticationOptions
    {
     
        public string Secret { get; set; }
    }
}
