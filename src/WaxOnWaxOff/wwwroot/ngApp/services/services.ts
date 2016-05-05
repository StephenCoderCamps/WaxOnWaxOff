﻿namespace App.Services {

    declare var loopProtect;

    export class LessonService {
        private lessonResource;



        public listLessons() {
            return this.lessonResource.query();
        }


        public getLesson(id:number) {
            return this.lessonResource.get({id:id});
        }


        public editLesson(lesson) {
            return this.lessonResource.save(lesson).$promise;
        }

        public deleteLesson(id: number) {
            return this.lessonResource.delete({ id: id }).$promise;
        }

        public postScore(id:number) {
            return this.lessonResource.postScore({ id: id });
        }


        constructor($resource: ng.resource.IResourceService, private $q:ng.IQService, private testService: App.Services.TestService) {
            this.lessonResource = $resource('/api/lessons/:id', null, {
                postScore: {
                    url: '/api/lessons/postScore/:id', method: 'POST', params: { id: '@id'}}
            });
        }

    }


    angular.module('App').service('lessonService', LessonService);



    export class TestService {
        private testFrame: HTMLIFrameElement;

        public submitAnswer(lab: App.Models.Lab, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {

                switch (lab.labType.toString()) {
                    case '0':
                        this.runJavaScriptTest(lab, answer).then((testResult) => {
                            resolve(testResult);
                        });
                        break;
                    case '1':
                        this.runTypeScriptTest(lab, answer).then((testResult) => {
                            resolve(testResult);
                        });
                        break;
                }
            });
        }



        public runTypeScriptTest(lab: App.Models.Lab, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {
                let combined = (lab.setupScript||'') + ';' + answer.typescript + ';' + lab.test;
                //let combined = lab.setupScript + ';\r\n' + answer.typescript + ';\r\n' + lab.test;

                let transpiled = this.transpile(combined);
                this.executeJavaScript(answer, transpiled).then((testResult) => {
                    resolve(testResult);
                });
            });
        }

        public runJavaScriptTest(lab: App.Models.Lab, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {
                let combined = (lab.setupScript||'') + ';' + answer.javascript + ';' + lab.test;

                this.executeJavaScript(answer, combined).then((testResult) => {
                    resolve(testResult);
                });
            });
        }


        private transpile(script: string) {
            var result = ts.transpile(script, { module: ts.ModuleKind.None, target: ts.ScriptTarget.ES5 });
            return result;
        }


        private createTestFrame(html: string) {
            let self = this;
            return self.$q((resolve, reject) => {
                self.testFrame = document.createElement('iframe');
                self.testFrame.style.display = 'none';

                self.testFrame.onload = function () {
                    self.testFrame.contentDocument.documentElement.innerHTML = html;
                    resolve();
                };

                self.testFrame.addEventListener('error', function (err) {
                    console.warn('err' + err.message);
                });

                document.body.appendChild(self.testFrame);
            });
        }

        private eval(script:string) {
            let scriptEl = document.createElement("script");

            scriptEl.text = script;
            this.testFrame.contentDocument.head.appendChild(scriptEl).parentNode.removeChild(scriptEl);
        }

        private addVariable(varName, varValue) {
            this.testFrame.contentWindow[varName] = varValue;
        }


        private injectScript(url: string) {
            return this.$q((resolve, reject) => {
                let scriptEl = <HTMLScriptElement>document.createElement('script');
                scriptEl.src = url;
                this.testFrame.contentDocument.documentElement.appendChild(scriptEl);
                scriptEl.addEventListener('load', function () {
                    resolve();
                });
            });
        }


        private injectJasmine() {
            return this.$q((resolve, reject) => {
                this.injectScript('/testScripts/jasmine.js').then(() => {
                    this.injectScript('/testScripts/boot.js').then(() => {
                        this.injectScript('/testScripts/customReporter.js').then(() => {
                            this.injectScript('/testScripts/stubs.js').then(() => {
                                resolve();
                            });
                        });
                    });
                });
            });

        }

        private injectHTML(html: string) {
            this.testFrame.contentDocument.documentElement.innerHTML = html;
        }


        private runTests() {
            let script = `(function(){jasmine.getEnv().addReporter(customReporter);jasmine.getEnv().execute();window['_testResults'] = customReporter.testResults;})()`;
            this.eval(script);
            return this.testFrame.contentWindow['_testResults'];
        }

        private destroyTestFrame() {
            document.body.removeChild(this.testFrame);
        }


        private executeJavaScript(answer: App.Models.Answer, script: string, additionalScripts: string[] = []) {
            return this.$q((resolve, reject) => {

                this.createTestFrame(answer.html).then(() => {

                    // escape infinite loops
                    loopProtect.alias = 'protect';
                    script = loopProtect(script);
                    this.testFrame.contentWindow['protect'] = loopProtect;
                    loopProtect.hit = function (line) {
                        console.error('Potential infinite loop found on line ' + line);
                    };


                    //this.injectHTML(answer.html).then(() => {
                    this.injectJasmine().then(() => {
                        let testResult;
                        try {
                            // expose source code to unit tests
                            this.addVariable('_javaScriptSource', answer.javascript);
                            this.addVariable('_typeScriptSource', answer.typescript);
                            this.addVariable('_htmlSource', answer.html);
                            this.addVariable('_cssSource', answer.css);
                            this.addVariable('_plainSource', answer.plain);


                            // execute the scripts
                            this.eval(script);

                            // execute the unit tests
                            testResult = this.runTests();
                        } catch (err) {
                            testResult = {
                                isCorrect: false,
                                message: err.message
                            };
                        } finally {
                            this.destroyTestFrame();
                            resolve(testResult);
                        }
                    });
                });
            });
        }


        constructor(private $q: ng.IQService) { }
    }

    angular.module('App').service('testService', TestService);


    export class ValidationService {

        public flattenValidation(modelState) {
            let messages = [];
            for (let prop in modelState) {
                messages = messages.concat(modelState[prop]);
            }
            return messages;
        }
    }

    angular.module('App').service('validationService', ValidationService);


}