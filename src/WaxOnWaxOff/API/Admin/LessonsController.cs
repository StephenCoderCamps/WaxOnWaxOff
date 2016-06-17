using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WaxOnWaxOff.Services;
using WaxOnWaxOff.ViewModels;
using WaxOnWaxOff.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API.Admin
{

    [Authorize]
    [Route("api/admin/[controller]")]
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
            if (_lessonService.LessonHasLabs(id))
            {
                this.ModelState.AddModelError("", "Lesson has labs.");
                return BadRequest(this.ModelState);
            }

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

            }
            else
            {
                _lessonService.EditLesson(lesson);
            }
            return Ok(lesson);
        }



    }


}
