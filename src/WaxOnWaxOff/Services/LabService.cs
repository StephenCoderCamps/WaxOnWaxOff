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
    }
}
