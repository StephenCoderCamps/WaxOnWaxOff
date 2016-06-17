using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Data;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public class UnitService
    {
        private ApplicationDbContext _db;

        public UnitService(ApplicationDbContext db)
        {
            _db = db;
        }

        public IList<Unit> List()
        {
            return _db.Units.OrderBy(u => u.Name).ToList();
        }

        public Unit GetUnit(int id)
        {
            return _db.Units.FirstOrDefault(u => u.Id == id);
        }

        public void AddUnit(Unit unit)
        {
            _db.Units.Add(unit);
            _db.SaveChanges();
        }


        public bool UnitHasLessons(int id)
        {
            return _db.Lessons.Any(l => l.UnitId == id);
        }

        public void DeleteUnit(int id)
        {
          

            var original = _db.Units.FirstOrDefault(u => u.Id == id);
            _db.Units.Remove(original);
            _db.SaveChanges();
        }

        public void EditUnit(Unit unit)
        {
            var original = _db.Units.FirstOrDefault(u => u.Id == unit.Id);
            original.Name = unit.Name;
            _db.SaveChanges();
        }


    }
}
