using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpTestHelper
{
    public class Verify
    {

        public bool AreEqual<T>(T expected, T actual)
        {
            return expected.Equals(actual);
        }

        public bool IsType<T>(object thing)
        {
            return (thing is T);
        }


    }
}
