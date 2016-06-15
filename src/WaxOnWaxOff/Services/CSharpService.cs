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

// https://github.com/xunit/xunit/issues/542
// https://github.com/xunit/samples.xunit/blob/3f55e554e7de7eb2cd9802fa9e73a706520646cd/TestRunner/Program.cs
// http://stackoverflow.com/questions/27829922/run-xunit-and-ui-tests-test-from-code-with-reflection

namespace WaxOnWaxOff.Services
{
    public class CSharpService
    {

        public async Task<TestResultViewModel> RunTest(string setupScript, string csharp, string test)
        {
            AssemblyInfo csharpAssembly = null;
            AssemblyInfo testAssembly = null;
            try
            {
                // compile user code into assembly
                csharpAssembly = CreateDynamicAssembly(csharp);

                // compile test code into assembly
                testAssembly = CreateDynamicAssembly(test, csharpAssembly.MetadataReference);
            } catch (Exception ex)
            {
                return new TestResultViewModel
                {
                    IsCorrect = false,
                    Message = ex.Message
                };
            }

            // execute unit tests
            var testsType = testAssembly.Assembly.GetType("Tests");
            var testsInstance = Activator.CreateInstance(testsType);
            var method = testsType.GetTypeInfo().GetMethod("Run");


            try
            {
                method.Invoke(testsInstance, null);
            } catch (Exception ex)
            {
                return new TestResultViewModel
                {
                    IsCorrect = false,
                    Message = ex.InnerException.Message
                };
            }


            return new TestResultViewModel
            {
                IsCorrect = true,
            };


            //// create script options
            //var scriptOptions = ScriptOptions.Default;


            //// add references
            //scriptOptions = scriptOptions.AddReferences(
            //    CreateGlobalAssemblyReference("System.Runtime.dll"),
            //    CreateGlobalAssemblyReference("System.Linq.dll"),
            //    CreateGlobalAssemblyReference("System.Reflection.dll"),
            //    CreateGlobalAssemblyReference("System.Xml.XDocument.dll"),
            //    CreateLocalAssemblyReference(typeof(Xunit.Assert)),
            //    CreateLocalAssemblyReference(typeof(FluentAssertions.AssertionExtensions)),
            //    CreateLocalAssemblyReference(typeof(Helper))

            //);

            //// add imports
            //scriptOptions = scriptOptions.AddImports(
            //    "System", "System.Linq", "Xunit", "FluentAssertions", "CSharpTestHelper"
            //);

            //// create script state
            //var code = CSharpScript.Create(csharp, scriptOptions, globalsType: typeof(Helper));
            //var compilation = code.GetCompilation();
            //var helper = new Helper(compilation);
            //ScriptState<object> scriptState = await CSharpScript.RunAsync(setupScript, scriptOptions, globals: helper);


            //// execute setup script
            //if (!String.IsNullOrWhiteSpace(setupScript))
            //{

            //    try
            //    {
            //        scriptState = await scriptState.ContinueWithAsync(setupScript);
            //    }
            //    catch (Exception ex)
            //    {
            //        return new TestResultViewModel
            //        {
            //            IsCorrect = false,
            //            Message = "SETUP SCRIPT FAIL: " + ex.Message
            //        };
            //    }
            //}


            //// execute csharp script
            //if (!String.IsNullOrWhiteSpace(csharp))
            //{
            //    try
            //    {
            //        scriptState = await scriptState.ContinueWithAsync(csharp, scriptOptions);
            //    }
            //    catch (Exception ex)
            //    {
            //        return new TestResultViewModel
            //        {
            //            IsCorrect = false,
            //            Message = ex.Message
            //        };
            //    }
            //}


            //// execute test script
            //if (!String.IsNullOrWhiteSpace(test))
            //{
            //    try
            //    {
            //        scriptOptions = scriptOptions.AddReferences(compilation.ToMetadataReference());
            //        scriptState = await scriptState.ContinueWithAsync(test, scriptOptions);
            //    }
            //    catch (Exception ex)
            //    {
            //        return new TestResultViewModel
            //        {
            //            IsCorrect = false,
            //            Message = ex.Message
            //        };
            //    }
            //}

            //return new TestResultViewModel
            //{
            //    IsCorrect = true
            //};


            //// execute the code
            //try
            //{


            //    var code = CSharpScript.Create(csharp, scriptOptions, globalsType: typeof(Helper));
            //    var compilation = code.GetCompilation();
            //    var helper = new Helper(compilation);
            //    var result = await code.RunAsync(helper);


            //} catch (Exception ex) {
            //    return new TestResultViewModel
            //    {
            //        IsCorrect = false,
            //        Message = ex.Message
            //    };
            //}

            //return new TestResultViewModel
            //{
            //    IsCorrect = true
            //};
        }


        private AssemblyInfo CreateDynamicAssembly(string script, params MetadataReference[] additionalReferences)
        {
            // add standard references
            var references = new List<MetadataReference>
            {
                CreateLocalAssemblyReference(typeof(Queryable)),
                CreateLocalAssemblyReference(typeof(object)),
                CreateLocalAssemblyReference(typeof(Xunit.Assert)),
                CreateLocalAssemblyReference(typeof(FluentAssertions.AssertionExtensions))
            };

            foreach (var reference in additionalReferences)
            {
                references.Add(reference);
            }


            var syntaxTree = CSharpSyntaxTree.ParseText(script);

            string assemblyName = "Pickles" + Path.GetRandomFileName();
            var compilationOptions = new CSharpCompilationOptions(
                OutputKind.DynamicallyLinkedLibrary
            );
            CSharpCompilation compilation = CSharpCompilation.Create(
                assemblyName,
                syntaxTrees: new[] { syntaxTree },
                references: references.ToArray(),
                options: compilationOptions
            );
            

            using (var ms = new MemoryStream())
            {
                EmitResult result = compilation.Emit(ms);

                if (!result.Success)
                {
                    //var message = string.Join("\r\n, ", result.Diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error).Select(d => d.ToString()));
                    var firstError = result.Diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error).FirstOrDefault();
                    var message = firstError == null ? "Could not compile your code!" : firstError.ToString();
                    throw new Exception(message);
                }
                else
                {
                    ms.Seek(0, SeekOrigin.Begin);
                    Assembly assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
                    return new AssemblyInfo
                    {
                        Assembly = assembly,
                        MetadataReference = compilation.ToMetadataReference()
                    };
                }
            }
        }


        public class AssemblyInfo
        {
            public Assembly Assembly { get; set; }
            public MetadataReference MetadataReference { get; set; }
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
