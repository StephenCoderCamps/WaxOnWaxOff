using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Models
{
    public class Lesson
    {
        public Lesson()
        {
            this.Labs = new List<Lab>();
            this.LessonScore = new List<LessonScore>();
        }


        public int Id { get; set; }

       
        public int? UnitId { get; set; }
        public Unit Unit { get; set; }

        [Required(ErrorMessage = "Lesson title is required.")]
        public string Title { get; set; }
        public ICollection<Lab> Labs { get; set; }

        public ICollection<LessonScore> LessonScore { get; set; }
    }
}
