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
    [Route("api/[controller]")]
    [Authorize(ActiveAuthenticationSchemes = "StudentSecret")]
    public class LessonsController : Controller
    {

        private LessonService _lessonService;
        private LessonScoreService _lessonScoreService;

        public LessonsController(LessonService lessonService, LessonScoreService lessonScoreService)
        {
            _lessonService = lessonService;
            _lessonScoreService = lessonScoreService;
        }


        // GET api/values/5
        [HttpGet("{id}")]
        public LessonDTO Get(int id)
        {
            return _lessonService.GetLesson(id);
        }


        [HttpPost("PostScore")]
        public IActionResult PostScore([FromBody]LessonScoreViewModel score)
        {
            _lessonScoreService.PostScore(new LessonScore
            {
                DatePassed = DateTime.UtcNow,
                StudentId = score.StudentId,
                LessonId = score.LessonId,
                Passed = true
            });
            return Ok();
        }


    }
}
