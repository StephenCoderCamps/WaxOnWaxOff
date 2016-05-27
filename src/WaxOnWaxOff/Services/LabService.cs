using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Data;
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
            original.Test = lab.Test;
            original.Instructions = lab.Instructions;

            original.SetupScript = lab.SetupScript;

            original.HTMLSolution = lab.HTMLSolution;
            original.CSSSolution = lab.CSSSolution;
            original.JavaScriptSolution = lab.JavaScriptSolution;
            original.TypeScriptSolution = lab.TypeScriptSolution;
            original.PlainSolution = lab.PlainSolution;
            original.CSharpSolution = lab.CSharpSolution;

            original.PreHTMLSolution = lab.PreHTMLSolution;
            original.PreCSSSolution = lab.PreCSSSolution;
            original.PreJavaScriptSolution = lab.PreJavaScriptSolution;
            original.PreTypeScriptSolution = lab.PreTypeScriptSolution;
            original.PlainSolution = lab.PlainSolution;
            original.PreCSharpSolution = lab.PreCSharpSolution;

            _db.SaveChanges();
        }


    }
}
