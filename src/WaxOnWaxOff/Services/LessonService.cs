using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.ViewModels;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.Data.Entity;

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

        public List<LessonDTO> ListLessons()
        {

            return _db.Lessons
                .OrderBy(l => l.Title)
                .ProjectTo<LessonDTO>(_mapper.ConfigurationProvider)
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

        public AnswerResult SubmitAnswer(int labId, Answer answer)
        {
            // load lab
            var lab = _db.Labs
                .Where(l => l.Id == labId)
                .FirstOrDefault();

            switch (lab.LabType)
            {
                case LabType.JavaScript:
                    return _testService.RunJavaScriptTest(lab, answer);
                default:
                    throw new Exception("Invalid Lab Type");
            }
        }
    }
}
