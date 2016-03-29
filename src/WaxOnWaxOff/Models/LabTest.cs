using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Models
{
    public class LabTest
    {
        public LabType LabType { get; set; }
        public string Test { get; set; }

        public string HTMLSolution { get; set; }
        public string CSSSolution { get; set; }
        public string JavaScriptSolution { get; set; }
        public string TypeScriptSolution { get; set; }
        public string CSharpSolution { get; set; }

    }
}
