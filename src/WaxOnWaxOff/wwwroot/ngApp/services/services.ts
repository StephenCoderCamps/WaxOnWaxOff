namespace App.Services {

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
                        this.runJavaScriptTest(lab.test, answer).then((testResult) => {
                            resolve(testResult);
                        });
                        break;
                    case '1':
                        this.runTypeScriptTest(lab.test, answer).then((testResult) => {
                            resolve(testResult);
                        });
                        break;
                }
            });
        }



        public runTypeScriptTest(test: string, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {
                let combined = answer.typescript + ';\r\n' + test;
                let transpiled = this.transpile(combined);
                this.executeJavaScript(transpiled, answer.html, answer.css).then((testResult) => {
                    resolve(testResult);
                });
            });
        }

        public runJavaScriptTest(test: string, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {
                let combined = answer.javascript + ';\r\n' + test;
                this.executeJavaScript(combined, answer.html, answer.css).then((testResult) => {
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

        private eval(script:string) {
            return this.testFrame.contentWindow['eval'](script);
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
            let testResult = this.eval(script);
            return testResult;
        }

        private destroyTestFrame() {
            document.body.removeChild(this.testFrame);
        }


        private executeJavaScript(script: string, html: string = '', css: string = '', additionalScripts: string[] = []) {
            this.createTestFrame();

            // escape infinite loops
            loopProtect.alias = 'protect';
            script = loopProtect(script);
            this.testFrame.contentWindow['protect'] = loopProtect;
            loopProtect.hit = function (line) {
                console.error('Potential infinite loop found on line ' + line);
            };


            return this.$q((resolve, reject) => {
                this.injectHTML(html);
                this.injectJasmine().then(() => {
                    let testResult;
                    try {
                        this.eval(script);
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


        constructor(private $q: ng.IQService) { }
    }

    angular.module('App').service('testService', TestService);

}