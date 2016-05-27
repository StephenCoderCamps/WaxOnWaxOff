using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.Services;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API
{
    [Route("api/[controller]")]
    [Authorize]
    public class LabsController : Controller
    {
        private LabService _labService;


        public LabsController(LabService labService)
        {
            this._labService = labService;
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            return Ok(_labService.GetLab(id));
        }


        // GET: api/values
        [HttpGet("List/{lessonId}")]
        public IEnumerable<Lab> List(int lessonId)
        {
            return _labService.List(lessonId);
        }


     




        // POST api/values
        [HttpPost]
        public IActionResult Post([FromBody]Lab lab)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(this.ModelState);
            }

            if (lab.Id == 0)
            {
                _labService.AddLab(lab);

            }
            else {
                _labService.EditLab(lab);
            }
            return Ok(lab);
        }

   

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _labService.DeleteLab(id);
            return Ok();
        }
    }
}
