using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public class StudentService : IStudentService
    {
        private ApplicationDbContext _db;
        private UserManager<ApplicationUser> _userManager;

        public StudentService(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            this._db = db;
            this._userManager = userManager;
        }

        public async Task<StudentViewModel> GetStudent(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return new StudentViewModel
            {
                Id = user.Id,
                UserName = user.UserName
            };
        }

        public IList<StudentViewModel> List()
        {
            return _userManager.Users
                .OrderBy(u => u.UserName)
                .Select(u => new StudentViewModel {
                    Id =u.Id,
                    UserName = u.UserName
                }).ToList();
        }

        public async Task<IdentityResult> AddStudent(StudentViewModel student)
        {
            var user = new ApplicationUser
            {
                UserName = student.UserName,
                Email = student.UserName
            };
            var result = await this._userManager.CreateAsync(user, student.Password);
            return result;
        }

        public IList<LessonScoreViewModel> ListScores(string studentId)
        {
            return _db.LessonScores
                .Where(s => s.UserId == studentId)
                .OrderByDescending(s => s.DatePassed)
                .Select( s => new LessonScoreViewModel
                {
                    Id = s.Id,
                    LessonTitle = s.Lesson.Title,
                    DatePassed = s.DatePassed
                })
                .ToList();
        }

        public async Task DeleteStudent(string studentId)
        {
            var user = await _userManager.FindByIdAsync(studentId);
            await _userManager.DeleteAsync(user);
        }


    }
}
