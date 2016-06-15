using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using System.Reflection;
using Xunit;
using Xunit.Runners;
using Xunit.Sdk;
using System.IO;
using WaxOnWaxOff.ViewModels;
using FluentAssertions;
using CSharpTestHelper;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Emit;
using System.Runtime.Loader;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Diagnostics;

// https://github.com/xunit/xunit/issues/542
// https://github.com/xunit/samples.xunit/blob/3f55e554e7de7eb2cd9802fa9e73a706520646cd/TestRunner/Program.cs
// http://stackoverflow.com/questions/27829922/run-xunit-and-ui-tests-test-from-code-with-reflection

namespace WaxOnWaxOff.Services
{
    public class CSharpService
    {
        public async Task<TestResultViewModel> RunTest(string setupScript, string csharp, string test)
        {
            // create script options
            var references = new MetadataReference[]
            {
                CreateGlobalAssemblyReference("System.Runtime.dll"),
                CreateGlobalAssemblyReference("System.Reflection.dll"),
                CreateGlobalAssemblyReference("System.Xml.XDocument.dll"),
                CreateGlobalAssemblyReference("System.Linq.dll"),
                CreateGlobalAssemblyReference("System.Linq.Expressions.dll"),
                CreateLocalAssemblyReference(typeof(Xunit.Assert)),
                //CreateLocalAssemblyReference(typeof(Microsoft.VisualStudio.TestTools.UnitTesting.Assert)),
                CreateLocalAssemblyReference(typeof(FluentAssertions.AssertionExtensions)),
                CreateLocalAssemblyReference(typeof(Helper))

            };

          
            var scriptOptions = ScriptOptions.Default;
            scriptOptions = scriptOptions.AddReferences(references.ToArray());
            scriptOptions = scriptOptions.AddImports("System", "System.Linq", "Xunit", "FluentAssertions", "CSharpTestHelper");

            // run scripts
            try
            {

                var scriptState = await CSharpScript.RunAsync(
                    setupScript,
                    options: scriptOptions,
                    globals: new Helper(),
                    globalsType: typeof(Helper)
                );
               
                scriptState = await scriptState.ContinueWithAsync(csharp);
                scriptState = await scriptState.ContinueWithAsync(test);
            } catch (Exception ex)
            {
                return new TestResultViewModel
                {
                    IsCorrect = false,
                    Message = ex.Message
                };
            }
           

            // success
            return new TestResultViewModel
            {
                IsCorrect = true,
            };


        }


       


        private MetadataReference CreateGlobalAssemblyReference(string assemblyName)
        {
            var assemblyPath = Path.GetDirectoryName(typeof(object).GetTypeInfo().Assembly.Location);
            return MetadataReference.CreateFromFile(Path.Combine(assemblyPath, assemblyName));

        }

        private MetadataReference CreateLocalAssemblyReference(Type type)
        {
            return MetadataReference.CreateFromFile(type.GetTypeInfo().Assembly.Location);
        }

    }
}
