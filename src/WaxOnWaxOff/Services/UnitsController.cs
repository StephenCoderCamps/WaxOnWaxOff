using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using WaxOnWaxOff.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WaxOnWaxOff.Services
{
    [Route("api/[controller]")]
    public class UnitsController : Controller
    {
        private ApplicationDbContext _db;

        // GET: api/values
        [HttpGet]
        public IEnumerable<Unit> Get()
        {
            return _db.Units.OrderBy(u=>u.Name).ToList();
        }

        public UnitsController(ApplicationDbContext db)
        {
            this._db = db;
        }
    }
}
