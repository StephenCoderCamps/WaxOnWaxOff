using System.Collections.Generic;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public interface ILabService
    {
        IList<Lab> List(int lessonId);
        AnswerResult TestTest(LabTest test);
    }
}