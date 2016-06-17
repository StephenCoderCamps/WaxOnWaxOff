using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WaxOnWaxOff.Services;
using WaxOnWaxOff.Models;
using Microsoft.AspNetCore.Authorization;
using WaxOnWaxOff.ViewModels;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API
{
    [Route("api/admin/[controller]")]
    [Authorize]
    public class AdminsController : Controller
    {
        private AdminService _adminService;

        public AdminsController(AdminService adminService)
        {
            this._adminService = adminService;
        }

        // GET: api/values
        [HttpGet]
        public IActionResult Get()
        {
            var admins = _adminService.List();
            return Ok(admins);
        }



        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]AdminDTO admin)
        {

            var result = await _adminService.AddAdmin(admin);
            if (result.Succeeded)
            {
                return Ok(admin);
            }

            ModelState.AddModelError("", result.Errors.FirstOrDefault().Description);
            return BadRequest(ModelState);
        }

 
        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
           await _adminService.DeleteAdmin(id);
        }




    }
}
