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
    public class LessonService : ILessonService
    {
        private ApplicationDbContext _db;
        private IMapper _mapper;
        private ITestService _testService;

        public LessonService(ApplicationDbContext db, IMapper mapper, ITestService testService)
        {
            _db = db;
            _mapper = mapper;
            _testService = testService;
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

        public AnswerResult SubmitAnswer(ClaimsPrincipal user, int labId, Answer answer)
        {
            AnswerResult answerResult;

            // load lab
            var lab = _db.Labs
                .Where(l => l.Id == labId)
                .FirstOrDefault();

            switch (lab.LabType)
            {
                case LabType.JavaScript:
                    answerResult = _testService.RunJavaScriptTest(lab, answer);
                    break;
                case LabType.TypeScript:
                    answerResult = _testService.RunTypeScriptTest(lab, answer);
                    break;
                default:
                    throw new Exception("Invalid Lab Type");
            }

            // calculate lesson and lab scores
            if (answerResult.IsCorrect)
            {
                var labScore = _db.LabScores.Where(l => l.LabId == lab.Id && l.UserId == user.GetUserId()).FirstOrDefault();
                if (labScore == null)
                {
                    labScore = new LabScore
                    {
                        UserId = user.GetUserId(),
                        LabId = lab.Id,
                        Passed = true,
                        DatePassed = DateTime.Now
                    };
                    _db.LabScores.Add(labScore);
                }  else {
                    labScore.Passed = true;
                    labScore.DatePassed = DateTime.Now;
                }
                _db.SaveChanges();

                // passed all labs for lesson?
                var labCount = _db.Labs.Count(l => l.LessonId == lab.LessonId);
                var passedCount = _db.LabScores.Count(ls => ls.Lab.LessonId == lab.LessonId && ls.UserId == user.GetUserId());
                if (labCount == passedCount)
                {
                    var lessonScore = _db.LessonScores.Where(ls => ls.LessonId == lab.LessonId && ls.UserId == user.GetUserId()).FirstOrDefault();
                    if (lessonScore == null)
                    {
                        lessonScore = new LessonScore
                        {
                            LessonId = lab.LessonId,
                            UserId = user.GetUserId(),
                            Passed = true,
                            DatePassed = DateTime.Now
                        };
                        _db.LessonScores.Add(lessonScore);
                    } else {
                        lessonScore.Passed = true;
                        lessonScore.DatePassed = DateTime.Now;
                    }
                    _db.SaveChanges();
                }
            }
            return answerResult;
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
