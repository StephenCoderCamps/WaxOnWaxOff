﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

        [Required(ErrorMessage = "A lab must include a test.")]
        public string Test { get; set; }

        [Required(ErrorMessage ="A lab must include a title.")]
        public string Title { get; set; }

        [Required(ErrorMessage ="A lab must include instructions.")]
        public string Instructions { get; set; }


        public string SetupScript { get; set; }

        public string HTMLSolution { get; set; }
        public string JavaScriptSolution { get; set; }
        public string TypeScriptSolution { get; set; }
        public string PlainSolution { get; set; }
        public string CSharpSolution { get; set; }
        public string CSSSolution { get; set; }

        public string PreHTMLSolution { get; set; }
        public string PreJavaScriptSolution { get; set; }
        public string PreTypeScriptSolution { get; set; }
        public string PrePlainSolution { get; set; }
        public string PreCSharpSolution { get; set; }
        public string PreCSSSolution { get; set; }


    }
}
