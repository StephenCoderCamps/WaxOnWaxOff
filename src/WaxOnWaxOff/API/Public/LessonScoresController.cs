using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WaxOnWaxOff.Models;
using Microsoft.AspNetCore.Cors;
using WaxOnWaxOff.Services;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API.Public
{
    [Route("api/public/[controller]")]
    [EnableCors("AllowAllOrigins")]
    [Authorize(ActiveAuthenticationSchemes ="PublicAPISecret")]
    public class LessonScoresController : Controller
    {
        private LessonScoreService _lessonScoreService;

        // GET: api/values
        [HttpGet("{lastScoreId}")]
        public IActionResult Get(int lastScoreId)
        {
            return Ok(_lessonScoreService.List(lastScoreId));
        }


        public LessonScoresController(LessonScoreService lessonScoreService)
        {
            _lessonScoreService = lessonScoreService;
        }
    }
}
