using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.ViewModels;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.Data.Entity;
using System.Security.Claims;

namespace WaxOnWaxOff.Services
{
    public class LessonService 
    {
        private ApplicationDbContext _db;
        private IMapper _mapper;

        public LessonService(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public List<LessonDTO> ListLessons(ClaimsPrincipal user)
        {
            return _db.Lessons
               .OrderBy(l => l.Title)
               .Select(l => new LessonDTO {
                    Id = l.Id,
                    Title = l.Title,
                    Passed = l.LessonScore.Any( ls => ls.Passed && ls.UserId == user.GetUserId())
               })
               .ToList(); 
        }

        public LessonDTO GetLesson(int id)
        {
            return _db.Lessons
                .Include(l => l.Labs)
                .Where(l => l.Id == id)
                .ProjectTo<LessonDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefault();


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
            _db.SaveChanges();
        }

    }
}
