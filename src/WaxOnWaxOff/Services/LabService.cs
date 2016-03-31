using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public class LabService
    {
        private ApplicationDbContext _db;

        public LabService(ApplicationDbContext db)
        {
            _db = db;
        }


        public Lab GetLab(int id)
        {
            return _db.Labs.FirstOrDefault(l => l.Id ==id);
        }

        public IList<Lab> List(int lessonId)
        {
            return _db.Labs.Where(l => l.LessonId == lessonId).OrderBy(l => l.Title).ToList();
        }

 
        public void AddLab(Lab lab)
        {
            _db.Labs.Add(lab);
            _db.SaveChanges();
        }

        public void DeleteLab(int id)
        {
            var original = _db.Labs.FirstOrDefault(l => l.Id == id);
            _db.Labs.Remove(original);
            _db.SaveChanges();
        }

        public void EditLab(Lab lab)
        {
            var original = _db.Labs.FirstOrDefault(l => l.Id == lab.Id);
            original.LabType = lab.LabType;
            original.Title = lab.Title;
            original.Instructions = lab.Instructions;
            original.HTMLSolution = lab.HTMLSolution;
            original.CSSSolution = lab.CSSSolution;
            original.JavaScriptSolution = lab.JavaScriptSolution;
            original.TypeScriptSolution = lab.TypeScriptSolution;
            original.CSharpSolution = lab.CSharpSolution;
            _db.SaveChanges();
        }


    }
}
