using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public class LabService : ILabService
    {
        private ApplicationDbContext _db;
        private ITestService _testService;

        public LabService(ApplicationDbContext db, ITestService testService)
        {
            _db = db;
            _testService = testService;
        }


        public Lab GetLab(int id)
        {
            return _db.Labs.FirstOrDefault(l => l.Id ==id);
        }

        public IList<Lab> List(int lessonId)
        {
            return _db.Labs.Where(l => l.LessonId == lessonId).OrderBy(l => l.Title).ToList();
        }

        public AnswerResult TestTest(LabTest test)
        {
            AnswerResult answerResult;
            var lab = new Lab
            {
                LabType = test.LabType,
                Test = test.Test,
                HTMLSolution = test.HTMLSolution,
                CSSSolution = test.CSSSolution,
                JavaScriptSolution = test.JavaScriptSolution,
                TypeScriptSolution = test.TypeScriptSolution,
                CSharpSolution = test.CSharpSolution
            };

            var answer = new Answer
            {
                HTML = test.HTMLSolution,
                CSS = test.CSSSolution,
                JavaScript = test.JavaScriptSolution,
                TypeScript = test.TypeScriptSolution,
                CSharp = test.CSharpSolution
            };


            switch (test.LabType)
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
            return answerResult;
        }

        public void AddLab(Lab lab)
        {
            _db.Labs.Add(lab);
            _db.SaveChanges();
        }

        public void DeleteLab(int id)
        {
            var original = _db.Labs.FirstOrDefault(l => l.Id == id);
            _db.Labs.Remove(original);
            _db.SaveChanges();
        }

        public void EditLab(Lab lab)
        {
            var original = _db.Labs.FirstOrDefault(l => l.Id == lab.Id);
            original.LabType = lab.LabType;
            original.Title = lab.Title;
            original.Instructions = lab.Instructions;
            original.HTMLSolution = lab.HTMLSolution;
            original.CSSSolution = lab.CSSSolution;
            original.JavaScriptSolution = lab.JavaScriptSolution;
            original.TypeScriptSolution = lab.TypeScriptSolution;
            original.CSharpSolution = lab.CSharpSolution;
            _db.SaveChanges();
        }


    }
}
