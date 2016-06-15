using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WaxOnWaxOff.Models;
using Microsoft.AspNetCore.Authorization;
using WaxOnWaxOff.ViewModels;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using WaxOnWaxOff.Services;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class CSharpController : Controller
    {
        private CSharpService _csharpService;

        public CSharpController(CSharpService csharpService)
        {
            _csharpService = csharpService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TestLabViewModel testLab)
        {
            var result  = await _csharpService.RunTest(testLab.Lab.SetupScript, testLab.Answer.CSharp, testLab.Lab.Test);
            return Ok(result);
        }

     
    }
}
