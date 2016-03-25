using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Models
{
    public class Lesson
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<Lab> Labs { get; set; }
    }
}
