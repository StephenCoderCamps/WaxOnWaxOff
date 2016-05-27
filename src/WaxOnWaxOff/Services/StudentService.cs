using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WaxOnWaxOff.Data;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.ViewModels;

namespace WaxOnWaxOff.Services
{
    public class StudentService 
    {
        private ApplicationDbContext _db;
        private UserManager<ApplicationUser> _userManager;

        public StudentService(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            this._db = db;
            this._userManager = userManager;
        }

        public async Task<StudentDTO> GetStudent(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return new StudentDTO
            {
                Id = user.Id,
                UserName = user.UserName
            };
        }

        public IList<StudentDTO> List(string match)
        {
            var query = _userManager
                .Users
                .Include(u => u.Claims)
                .OrderBy(u => u.UserName)
                .Select(u => new StudentDTO
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    IsAdmin = u.Claims.Any(c => c.ClaimType == "IsAdmin")
                });

            if (!String.IsNullOrWhiteSpace(match))
            {
                query = query.Where(u => u.UserName.Contains(match));
            }

            var results = query.Take(50).ToList();
            return results;
        }

        public async Task<IdentityResult> AddStudent(StudentDTO student)
        {
            var user = new ApplicationUser
            {
                UserName = student.UserName,
                Email = student.UserName
            };
            var result = await this._userManager.CreateAsync(user, student.Password);
            return result;
        }


        public async Task<IdentityResult> ToggleAdmin(string studentId)
        {
            var user = await _userManager.FindByIdAsync(studentId);
            var claims = await _userManager.GetClaimsAsync(user);
            if (claims.Any(c => c.Type == "IsAdmin"))
            {
                return await _userManager.RemoveClaimAsync(user, new Claim("IsAdmin", "True"));

            }
            else
            {
                return await _userManager.AddClaimAsync(user, new Claim("IsAdmin", "True"));
            }
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
