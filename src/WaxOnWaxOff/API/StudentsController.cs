using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using WaxOnWaxOff.Services;
using WaxOnWaxOff.Models;
using Microsoft.AspNet.Authorization;
using WaxOnWaxOff.ViewModels;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API
{
    [Route("api/[controller]")]
    [Authorize(Policy ="AdminOnly")]
    public class StudentsController : Controller
    {
        private StudentService _studentService;

        public StudentsController(StudentService studentService)
        {
            this._studentService = studentService;
        }

        // GET: api/values
        [HttpGet]
        public IActionResult Get(string match="")
        {
            var students = _studentService.List(match);
            return Ok(students);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(string id)
        {
            var student = await _studentService.GetStudent(id); 
            return Ok(student);
        }



        // GET api/values/5
        [HttpGet("scores/{id}")]
        public IActionResult Scores(string id)
        {
            var scores = _studentService.ListScores(id);
            return Ok(scores);
        }



        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]StudentDTO student)
        {

            var result = await _studentService.AddStudent(student);
            if (result.Succeeded)
            {
                return Ok(student);
            }

            ModelState.AddModelError("", result.Errors.FirstOrDefault().Description);
            return HttpBadRequest(ModelState);
        }

 
        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
           await _studentService.DeleteStudent(id);
        }



        // ToggleAdmin api/values/5
        [HttpPost("toggleAdmin/{id}")]
        public async Task ToggleAdmin(string id)
        {
            
            await _studentService.ToggleAdmin(id);
        }

    }
}
