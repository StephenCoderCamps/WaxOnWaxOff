using System.Collections.Generic;
using System.Security.Claims;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.ViewModels;

namespace WaxOnWaxOff.Services
{
    public interface ILessonService
    {
        List<LessonDTO> ListLessons(ClaimsPrincipal user);
        LessonDTO GetLesson(int id);
        AnswerResult SubmitAnswer(ClaimsPrincipal user, int labId, Answer anwwer);
        void AddLesson(Lesson lesson);
        void EditLesson(Lesson lesson);
        void DeleteLesson(int id);
    }
}