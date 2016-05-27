using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.ViewModels;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using System.Security.Claims;
using WaxOnWaxOff.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace WaxOnWaxOff.Services
{
    public class LessonService 
    {
        private ApplicationDbContext _db;
        private IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;


        public LessonService(ApplicationDbContext db, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _mapper = mapper;
            _userManager = userManager;
        }

        public List<LessonDTO> ListLessons(ClaimsPrincipal user, int unitId)
        {
            var userId = _userManager.GetUserId(user);
            return _db.Lessons
               .Where(l => l.UnitId == unitId)
               .OrderBy(l => l.Title)
               .Select(l => new LessonDTO {
                    Id = l.Id,
                    UnitId = l.UnitId,
                    Title = l.Title,
                    Passed = l.LessonScore.Any( ls => ls.Passed && ls.UserId == userId )
               })
               .ToList(); 
        }

        public LessonDTO GetLesson(int id)
        {
            var result = _db.Lessons
                .Include(l => l.Labs)
                .Where(l => l.Id == id)
                .ProjectTo<LessonDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefault();
            return result;

        }

      

        public void AddLesson(Lesson lesson)
        {
            _db.Lessons.Add(lesson);
            _db.SaveChanges();
        }

        public void DeleteLesson(int id)
        {
            var original = _db.Lessons.FirstOrDefault(l => l.Id == id);
            _db.Lessons.Remove(original);
            _db.SaveChanges();
        }

        public void EditLesson(Lesson lesson)
        {
            var original = _db.Lessons.FirstOrDefault(l => l.Id == lesson.Id);
            original.Title = lesson.Title;
            original.UnitId = lesson.UnitId;
            _db.SaveChanges();
        }


        public void SaveScore(ClaimsPrincipal user, int lessonId)
        {
            var userId = _userManager.GetUserId(user);

            var score = _db.LessonScores.FirstOrDefault(s => s.UserId == userId && s.LessonId == lessonId);
            if (score == null)
            {
                _db.LessonScores.Add(new LessonScore
                {
                    UserId = userId,
                    LessonId = lessonId,
                    Passed =true,
                    DatePassed = DateTime.UtcNow
                });
            } else {
                score.Passed = true;
                score.DatePassed = DateTime.UtcNow;
            }
            _db.SaveChanges();
        }

    }
}
