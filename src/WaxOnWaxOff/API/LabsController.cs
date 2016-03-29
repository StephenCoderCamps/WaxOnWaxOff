using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.Services;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API
{
    [Route("api/[controller]")]
    public class LabsController : Controller
    {
        private ILabService _labService;

        public LabsController(ILabService labService)
        {
            this._labService = labService;
        }

        // GET: api/values
        [HttpGet("List/{lessonId}")]
        public IEnumerable<Lab> List(int lessonId)
        {
            return _labService.List(lessonId);
        }


        [HttpPost("TestTest")]
        public AnswerResult TestTest([FromBody]LabTest test)
        {

            return _labService.TestTest(test);
        }


        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
