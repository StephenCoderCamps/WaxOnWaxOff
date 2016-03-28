using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Models
{
    public class Lab
    {
        public int Id { get; set; }

        public Lesson Lesson { get; set; }
        public int LessonId { get; set; }
        public LabType LabType { get; set; }
        public string Test { get; set; }
        public string Title { get; set; }
        public string Instructions { get; set; }

        public string HTMLSolution { get; set; }
        public string JavaScriptSolution { get; set; }
        public string TypeScriptSolution { get; set; }
        public string CSharpSolution { get; set; }
        public string CSSSolution { get; set; }

        public ICollection<LabScore> LabScore { get; set; }

    }
}
