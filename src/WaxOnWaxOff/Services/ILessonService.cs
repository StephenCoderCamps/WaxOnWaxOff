using System.Collections.Generic;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.ViewModels;

namespace WaxOnWaxOff.Services
{
    public interface ILessonService
    {
        List<LessonDTO> ListLessons();
        LessonDTO GetLesson(int id);
        AnswerResult SubmitAnswer(int labId, Answer anwwer);
    }
}