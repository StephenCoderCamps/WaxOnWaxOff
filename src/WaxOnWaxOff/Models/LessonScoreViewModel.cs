using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Models
{
    public class LessonScoreViewModel
    {
        public int Id { get; set; }
        public string LessonTitle { get; set; }
        public DateTime DatePassed { get; set; }
    }
}
