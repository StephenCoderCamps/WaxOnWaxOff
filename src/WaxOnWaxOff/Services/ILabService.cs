using System.Collections.Generic;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public interface ILabService
    {
        Lab GetLab(int id);
        IList<Lab> List(int lessonId);
        AnswerResult TestTest(LabTest test);
        void EditLab(Lab lab);
        void AddLab(Lab lab);
        void DeleteLab(int id);
    }
}