using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.Services;
using WaxOnWaxOff.ViewModels;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class LessonsController : Controller
    {

        private LessonService _lessonService;

        public LessonsController(LessonService lessonService)
        {
            _lessonService = lessonService;
        }

        // GET: api/values
        [HttpGet]
        [HttpGet("listLessons/{unitId}")]
        public IEnumerable<LessonDTO> ListLessons(int unitId)
        {
            return _lessonService.ListLessons(this.User, unitId);    
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public LessonDTO Get(int id)
        {
            return _lessonService.GetLesson(id);
        }


      


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _lessonService.DeleteLesson(id);
            return Ok();
        }


        [HttpPost]
        public IActionResult Post([FromBody]Lesson lesson)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(this.ModelState);
            }

            if (lesson.Id == 0)
            {
                _lessonService.AddLesson(lesson);

            } else {
                _lessonService.EditLesson(lesson);
            }
            return Ok(lesson);
        }


        [HttpPost("postScore/{lessonId}")]
        public IActionResult PostScore(int lessonId)
        {
            _lessonService.SaveScore(this.User, lessonId);
            return Ok();
        }


    }
}
