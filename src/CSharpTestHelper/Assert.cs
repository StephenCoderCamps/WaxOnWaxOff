using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpTestHelper
{
    public class Assert
    {
        private Verify _verify = new Verify();
        private Dump _dump = new Dump();

        [DebuggerHidden]
        public void AreEqual<T>(T expected, T actual, string message)
        {
            if (!_verify.AreEqual(expected, actual))
            {
                throw new Exception(message);
            }
        }

        [DebuggerHidden]
        public void IsType<T>(object thing, string message)
        {
            if (!_verify.IsType<T>(thing))
            {
                throw new Exception(message);
            }
        }

        [DebuggerHidden]
        public void Fail(string message)
        {
            throw new Exception(message);
        }

        [DebuggerHidden]
        public void CompareCollections<T>(IEnumerable<T> expected, IEnumerable<T> actual, string message)
        {
            try
            {
                Xunit.Assert.Equal(expected, actual);
            } catch
            {
                // add actual results to message and display
                message = message + _dump.Collection<T>(actual);
                throw new Exception(message);
            }
        }

    }
}
