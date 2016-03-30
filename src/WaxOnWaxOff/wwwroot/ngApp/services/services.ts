﻿namespace App.Services {

    export class LessonService {
        private lessonResource;


        public submitAnswer(labId:number, answer) {
            //return this.lessonResource.submitAnswer({ id: labId }, answer).$promise;

            return this.$q((resolve, reject) => {
                let test = `
                describe('addNumbers', function () {
                    it('should add positive numbers', function () {
                        var result = addNumbers(1, 3);
                        expect(result).toBe(4);
                    });
                    it('should add negative numbers', function () {
                        var result = addNumbers(-1, -3);
                        expect(result).toBe(-4);
                    });
                });
                                `;
                this.testService.runJavaScriptTest(test, answer).then((testResult) => {
                    resolve(testResult);
                });
            });
        }

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


        constructor($resource: ng.resource.IResourceService, private $q:ng.IQService, private testService: App.Services.TestService) {
            this.lessonResource = $resource('/api/lessons/:id', null, {
                submitAnswer: {
                    url: '/api/lessons/submitAnswer/:id', method: 'POST', params: { id: '@id'}}
            });
        }

    }


    angular.module('App').service('lessonService', LessonService);




    export class TestService {
        private testFrame: HTMLIFrameElement;

        public runJavaScriptTest(test: string, answer: App.Models.Answer) {
            return this.$q((resolve, reject) => {
                let combined = answer.javascript + ';\r\n' + test;
                this.executeJavaScript(combined, answer.html, answer.css).then((testResult) => {
                    resolve(testResult);
                });
            });
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
                this.injectScript('/TestScripts/jasmine.js').then(() => {
                    this.injectScript('/TestScripts/boot.js').then(() => {
                        this.injectScript('/TestScripts/customReporter.js').then(() => {
                            resolve();
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
            return this.$q((resolve, reject) => {
                this.createTestFrame();
                this.injectHTML(html);
                this.injectJasmine().then(() => {
                    this.eval(script);
                    let testResult = this.runTests();
                    this.destroyTestFrame();
                    resolve(testResult);
                });
            });
        }


        constructor(private $q: ng.IQService) { }
    }

    angular.module('App').service('testService', TestService);

}