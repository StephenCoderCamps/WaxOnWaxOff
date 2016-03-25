using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public interface ITestService
    {
        AnswerResult RunJavaScriptTest(Lab lab, Answer answer);
    }
}