using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.PlatformAbstractions;
using System.IO;
using System.Diagnostics;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API
{
    [Route("api/[controller]")]
    public class DebugController : Controller
    {
        private IApplicationEnvironment _appEnv;

        public DebugController(IApplicationEnvironment appEnv)
        {
            _appEnv = appEnv;
        }

        // GET: api/values
        [HttpGet]
        public string Get()
        {
         
            var phantomJSPath = Path.Combine(_appEnv.ApplicationBasePath, @"DeployThis\phantomjs");
            try {
                var startInfo = new ProcessStartInfo
                {
                    FileName = phantomJSPath,
                    Arguments = "-v",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardError = true,
                    RedirectStandardOutput = true
                };
                var process = Process.Start(startInfo);
                process.WaitForExit();
            } catch (Exception ex)
            {
                return ex.Message;
            }
            return "hi!";
        }

     
    }
}
