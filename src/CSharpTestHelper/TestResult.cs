using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpTestHelper
{
    public class TestResult:Exception
    {
        public TestResult(string message):base(message)
        {
        }
    }
}
