using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.ViewModels
{
    public class LabDTO
    {
        public int Id { get; set; }
        public LabType LabType { get; set; }
        public string Title { get; set; }
        public string Instructions { get; set; }
        public string Test { get; set; }

        public bool ShowHTMLEditor { get; set; }
        public bool ShowJavaScriptEditor { get; set; }
        public bool ShowCSSEditor { get; set; }
        public bool ShowTypeScriptEditor { get; set; }
        public bool ShowCSharpEditor { get; set; }


        public string PreHTMLSolution { get; set; }
        public string PreJavaScriptSolution { get; set; }
        public string PreTypeScriptSolution { get; set; }
        public string PreCSharpSolution { get; set; }
        public string PreCSSSolution { get; set; }

    }
}
