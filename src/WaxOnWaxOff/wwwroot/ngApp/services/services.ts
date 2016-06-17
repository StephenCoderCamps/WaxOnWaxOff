namespace App.Services {

    declare var loopProtect;



  

    export class SuccessService {
        private happyPictures;

        public getHappyPicture(): string {
            let rnd = Math.floor(Math.random() * this.happyPictures.length);
            return this.happyPictures[rnd];
        }

        constructor() {
            this.happyPictures = [
                '/images/success/catAndDog.jpg',
                '/images/success/cookie.jpg',
                '/images/success/dog.jpg',
                '/images/success/sundae.jpg',
                '/images/success/hamster.jpg',
                '/images/success/tesla.jpg',
                '/images/success/shark.jpg',
                '/images/success/homer.png'
            ];
        }
    }

    angular.module('App').service('successService', SuccessService);

    export class LessonService {
        private lessonResource;

        public getLesson(id: number) {
            return this.lessonResource.get({ id: id });
        }


        public postScore(id: number) {
            return this.lessonResource.postScore({ id: id }).$promise;
        }

        constructor($resource: ng.resource.IResourceService, private $q: ng.IQService, private testService: App.Services.TestService) {
            this.lessonResource = $resource('/api/lessons/:id', null, {
                postScore: {
                    url: '/api/lessons/postScore/:id', method: 'POST', params: { id: '@id' }
                }
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
                    case '2':
                        this.runCSharpTest(lab, answer).then((testResult) => {
                            resolve(testResult);
                        });
                        break;
                }
            });
        }



        public runCSharpTest(lab: App.Models.Lab, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {
                this.$http.post('/api/CSharp', { lab: lab, answer: answer }).then((results) => {
                    resolve(results.data);
                });
            });
        }

        public runTypeScriptTest(lab: App.Models.Lab, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {
                let combined = (lab.setupScript||'') + ';\r\n' + answer.typescript + ';\r\n' + lab.test;
                let transpiled = this.transpile(combined);
                this.executeJavaScript(answer, transpiled).then((testResult) => {
                    resolve(testResult);
                });
            });
        }

        public runJavaScriptTest(lab: App.Models.Lab, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {
                let combined = (lab.setupScript || '') + ';\r\n' + answer.javascript + ';\r\n' + lab.test;
                this.executeJavaScript(answer, combined).then((testResult) => {
                    resolve(testResult);
                });
            });
        }


        private transpile(script: string) {
            var result = ts.transpile(script, { module: ts.ModuleKind.None, target: ts.ScriptTarget.ES5 });
            return result;
        }


        private createTestFrame() {
            this.testFrame = document.createElement('iframe');
            this.testFrame.style.display = 'none';
            document.body.appendChild(this.testFrame);
            this.testFrame.addEventListener('error', function (err) {
                console.warn('err' + err.message);
            });
        }

        private evaluate(script: string) {
            return this.testFrame.contentWindow['eval'](script);
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
            let script = `(function(){jasmine.getEnv().addReporter(customReporter);jasmine.getEnv().execute();return customReporter.testResults;})()`;
            let testResult = this.evaluate(script);
            return testResult;
        }

        private destroyTestFrame() {
            document.body.removeChild(this.testFrame);
        }


        private executeJavaScript(answer: App.Models.Answer, script: string, additionalScripts: string[] = []) {
            this.createTestFrame();

            // escape infinite loops
            loopProtect.alias = 'protect';
            script = loopProtect(script);
            this.testFrame.contentWindow['protect'] = loopProtect;
            loopProtect.hit = function (line) {
                console.error('Potential infinite loop found on line ' + line);
            };


            return this.$q((resolve, reject) => {
                this.injectHTML(answer.html);
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
                        this.evaluate(script);

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
        }


        constructor(private $q: ng.IQService, private $http: ng.IHttpService) { }
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