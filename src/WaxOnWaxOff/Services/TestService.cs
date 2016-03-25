﻿using Microsoft.Extensions.PlatformAbstractions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public class TestService : ITestService
    {
        private IApplicationEnvironment _appEnv;

        public TestService(IApplicationEnvironment appEnv)
        {
            _appEnv = appEnv;
        }


        public AnswerResult RunJavaScriptTest(Lab lab, Answer answer)
        {
            // combine javascript + test
            var combined = answer.JavaScript + ";\r\n" + lab.Test;

            return ExecuteJavaScript(combined, answer.HTML, answer.CSS);
        }

        private AnswerResult ExecuteJavaScript(string javaScript, string html, string css, params string[] additionalJavaScriptfiles)
        {
            // add function wrapper around javascript
            var script = "function(){" + javaScript + "}";

            var phantomJSPath = Path.Combine(_appEnv.ApplicationBasePath, @"DeployThis\phantomjs");

            
            var phantomJSArgs = new string[] {
                Path.Combine(_appEnv.ApplicationBasePath, @"TestScripts\Test.js"),
                script,
                html,
                String.Join(",", additionalJavaScriptfiles)
            };

            var startInfo = new ProcessStartInfo
            {
                FileName = phantomJSPath,
                Arguments = EncodeParameters(phantomJSArgs),
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardError = true,
                RedirectStandardOutput = true
            };
            var process = Process.Start(startInfo);
            process.WaitForExit();
            var output = process.StandardOutput.ReadToEnd();
            var error = process.StandardError.ReadToEnd();


            AnswerResult answerResult;

            // was the javascript unparsable?
            if (!String.IsNullOrWhiteSpace(error))
            {
                answerResult = new AnswerResult
                {
                    IsCorrect = false,
                    Issues = new List<string>
                    {
                        error
                    }
                };
            }
            else {

                // otherwise, return test result
                var javaScriptResult = JsonConvert.DeserializeObject<JavaScriptTestResult>(output);
                answerResult = new AnswerResult
                {
                    IsCorrect = javaScriptResult.Passed,
                    Issues = FlattenJavaScriptTestResults(javaScriptResult)
                };
            }
            return answerResult;
        }


        private string EncodeParameters(params string[] parameters)
        {
            var result = "";
            foreach (string param in parameters)
            {
                result += " " + EncodeParameter(param);
            }
            return result;
        }

        private string EncodeParameter(string original)
        {
            if (string.IsNullOrEmpty(original))
                return original;
            string value = Regex.Replace(original, @"(\\*)" + "\"", @"$1\$0");
            value = Regex.Replace(value, @"^(.*\s.*?)(\\*)$", "\"$1$2$2\"", RegexOptions.Singleline);

            return value;
        }

        private List<string> FlattenJavaScriptTestResults(JavaScriptTestResult testResult)
        {
            var results = new List<string>();
            testResult.Specs.ForEach((spec) => {
                spec.FailedExpectations.ForEach((message) =>
                {
                    results.Add(String.Format("{0}: {1}", spec.FullName, message.Message));
                });
            });
            return results;
        }


    }
}