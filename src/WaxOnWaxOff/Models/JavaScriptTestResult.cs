using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace WaxOnWaxOff.Models
{
    public class JavaScriptTestResult
    {

        public bool Passed
        {
            get
            {
                return !this.Specs.Any(s => s.FailedExpectations.Count > 0);
            }

        }

        public List<JasmineSpec> Specs { get; set; }
    }

    public class JasmineSpec
    {
        public string Id { get; set; }

        public string Description { get; set; }

        public string FullName { get; set; }

        public string Status { get; set; }

        public List<JasmineExpectation> FailedExpectations { get; set; }

        public List<JasmineExpectation> PassedExpectations { get; set; }

    }

    public class JasmineExpectation
    {
        public string Message { get; set; }

        public string Passed { get; set; }
    }


}