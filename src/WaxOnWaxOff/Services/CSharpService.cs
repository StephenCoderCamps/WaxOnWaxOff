﻿using Microsoft.CodeAnalysis.CSharp.Scripting;
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

        public TestResultViewModel RunTest(string setupScript, string csharp, string test)
        {
            AssemblyInfo csharpAssembly = null;
            AssemblyInfo testAssembly = null;
            try
            {
                // compile user code into assembly
                csharpAssembly = CreateDynamicAssembly("userCode", csharp);

                // compile test code into assembly
                testAssembly = CreateDynamicAssembly("testCode", test, csharpAssembly.MetadataReference);
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


        }


        private AssemblyInfo CreateDynamicAssembly(string assemblyName, string script, params MetadataReference[] additionalReferences)
        {
            // add standard references
            var references = new List<MetadataReference>
            {
                CreateLocalAssemblyReference(typeof(Helper)),
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
