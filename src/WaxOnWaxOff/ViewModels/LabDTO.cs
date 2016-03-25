using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.ViewModels
{
    public class LabDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Instructions { get; set; }

        public bool ShowHTMLEditor { get; set; }
        public bool ShowJavaScriptEditor { get; set; }
        public bool ShowCSSEditor { get; set; }
        public bool ShowTypeScriptEditor { get; set; }
        public bool ShowCSharpEditor { get; set; }
    }
}
