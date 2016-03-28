using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Models
{
    public class LessonScore
    {
            public int Id { get; set; }

            public Lesson Lesson { get; set; }

            public int LessonId { get; set; }


            public ApplicationUser User { get; set; }

            public string UserId { get; set; }

            public bool Passed { get; set; }

            public DateTime DatePassed { get; set; }
    }
}
