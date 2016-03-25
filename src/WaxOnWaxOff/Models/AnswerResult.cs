using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.Models
{
    public class AnswerResult
    {
        public bool IsCorrect { get; set; }

        public List<string> Issues { get; set; }
    }
}
