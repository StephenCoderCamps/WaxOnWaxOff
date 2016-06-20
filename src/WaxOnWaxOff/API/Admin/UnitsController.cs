using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.Data;
using Microsoft.AspNetCore.Authorization;
using WaxOnWaxOff.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.API.Admin 
{
    [Route("api/admin/[controller]")]
    [Authorize(Policy = "Admin")]
    public class UnitsController : Controller
    {
        private UnitService _unitService;

        // GET: api/values
        [HttpGet]
        public IEnumerable<Unit> Get()
        {
            return _unitService.List();
        }



        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (_unitService.UnitHasLessons(id))
            {
                this.ModelState.AddModelError("", "Unit has lessons.");
                return BadRequest(this.ModelState);
            }

            _unitService.DeleteUnit(id);
            return Ok();
        }


        [HttpPost]
        public IActionResult Post([FromBody]Unit unit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(this.ModelState);
            }

            if (unit.Id == 0)
            {
                _unitService.AddUnit(unit);

            }
            else
            {
                _unitService.EditUnit(unit);
            }
            return Ok(unit);
        }





        public UnitsController(UnitService unitService)
        {
            this._unitService = unitService;
        }
    }
}
