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
    public class AdminService 
    {
        private ApplicationDbContext _db;
        private UserManager<ApplicationUser> _userManager;

        public AdminService(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            this._db = db;
            this._userManager = userManager;
        }

        public async Task<AdminDTO> GetStudent(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return new AdminDTO
            {
                Id = user.Id,
                UserName = user.UserName
            };
        }

        public IList<AdminDTO> List()
        {
            var query = _userManager
                .Users
                .Include(u => u.Claims)
                .OrderBy(u => u.UserName)
                .Select(u => new AdminDTO
                {
                    Id = u.Id,
                    UserName = u.UserName
                });

            

            return query.ToList();
        }

        public async Task<IdentityResult> AddAdmin(AdminDTO admin)
        {
            var user = new ApplicationUser
            {
                UserName = admin.UserName,
                Email = admin.UserName
            };
            var result = await this._userManager.CreateAsync(user, admin.Password);
            return result;
        }


      
      

        public async Task DeleteAdmin(string studentId)
        {
            var user = await _userManager.FindByIdAsync(studentId);
            await _userManager.DeleteAsync(user);
        }


    }
}
