using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Data;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public class LessonScoreService
    {
        private ApplicationDbContext _db;


        public IList<LessonScore> List(int lastScoreId)
        {
            return _db.LessonScores.Where(s => s.Id > lastScoreId)
                .OrderBy(s => s.Id)
                .ToList();
        }

        public void PostScore(LessonScore score)
        {
            _db.LessonScores.Add(score);
            _db.SaveChanges();
        }

        public LessonScoreService(ApplicationDbContext db)
        {
            _db = db;
        }
    }
}
