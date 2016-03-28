using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.Services;
using WaxOnWaxOff.ViewModels;
using Microsoft.AspNet.Authorization;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class LessonsController : Controller
    {

        private ILessonService _lessonService;

        public LessonsController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<LessonDTO> Get()
        {
            return _lessonService.ListLessons(this.User);    
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public LessonDTO Get(int id)
        {
            return _lessonService.GetLesson(id);
        }


        [HttpPost("submitAnswer/{id}")]
        public AnswerResult SubmitAnswer(int id, [FromBody]Answer answer)
        {
            return _lessonService.SubmitAnswer(this.User, id, answer);
        }


    }
}
