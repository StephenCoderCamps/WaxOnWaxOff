var App;
(function (App) {
    var Services;
    (function (Services) {
        var LessonService = (function () {
            function LessonService($resource, $q, testService) {
                this.$q = $q;
                this.testService = testService;
                this.lessonResource = $resource('/api/lessons/:id', null, {
                    submitAnswer: {
                        url: '/api/lessons/submitAnswer/:id', method: 'POST', params: { id: '@id' } }
                });
            }
            LessonService.prototype.submitAnswer = function (labId, answer) {
                //return this.lessonResource.submitAnswer({ id: labId }, answer).$promise;
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var test = "\n                describe('addNumbers', function () {\n                    it('should add positive numbers', function () {\n                        var result = addNumbers(1, 3);\n                        expect(result).toBe(4);\n                    });\n                    it('should add negative numbers', function () {\n                        var result = addNumbers(-1, -3);\n                        expect(result).toBe(-4);\n                    });\n                });\n                                ";
                    _this.testService.runJavaScriptTest(test, answer).then(function (testResult) {
                        resolve(testResult);
                    });
                });
            };
            LessonService.prototype.listLessons = function () {
                return this.lessonResource.query();
            };
            LessonService.prototype.getLesson = function (id) {
                return this.lessonResource.get({ id: id });
            };
            LessonService.prototype.editLesson = function (lesson) {
                return this.lessonResource.save(lesson).$promise;
            };
            LessonService.prototype.deleteLesson = function (id) {
                return this.lessonResource.delete({ id: id }).$promise;
            };
            return LessonService;
        }());
        Services.LessonService = LessonService;
        angular.module('App').service('lessonService', LessonService);
        var TestService = (function () {
            function TestService($q) {
                this.$q = $q;
            }
            TestService.prototype.runJavaScriptTest = function (test, answer) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var combined = answer.javascript + ';\r\n' + test;
                    _this.executeJavaScript(combined, answer.html, answer.css).then(function (testResult) {
                        resolve(testResult);
                    });
                });
            };
            TestService.prototype.createTestFrame = function () {
                this.testFrame = document.createElement('iframe');
                this.testFrame.style.display = 'none';
                document.body.appendChild(this.testFrame);
                this.testFrame.addEventListener('error', function (err) {
                    console.warn('err' + err.message);
                });
            };
            TestService.prototype.eval = function (script) {
                return this.testFrame.contentWindow['eval'](script);
            };
            TestService.prototype.injectScript = function (url) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var scriptEl = document.createElement('script');
                    scriptEl.src = url;
                    _this.testFrame.contentDocument.documentElement.appendChild(scriptEl);
                    scriptEl.addEventListener('load', function () {
                        resolve();
                    });
                });
            };
            TestService.prototype.injectJasmine = function () {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    _this.injectScript('/TestScripts/jasmine.js').then(function () {
                        _this.injectScript('/TestScripts/boot.js').then(function () {
                            _this.injectScript('/TestScripts/customReporter.js').then(function () {
                                resolve();
                            });
                        });
                    });
                });
            };
            TestService.prototype.injectHTML = function (html) {
                this.testFrame.contentDocument.documentElement.innerHTML = html;
            };
            TestService.prototype.runTests = function () {
                var script = "(function(){jasmine.getEnv().addReporter(customReporter);jasmine.getEnv().execute();return customReporter.testResults;})()";
                var testResult = this.eval(script);
                return testResult;
            };
            TestService.prototype.destroyTestFrame = function () {
                document.body.removeChild(this.testFrame);
            };
            TestService.prototype.executeJavaScript = function (script, html, css, additionalScripts) {
                var _this = this;
                if (html === void 0) { html = ''; }
                if (css === void 0) { css = ''; }
                if (additionalScripts === void 0) { additionalScripts = []; }
                return this.$q(function (resolve, reject) {
                    _this.createTestFrame();
                    _this.injectHTML(html);
                    _this.injectJasmine().then(function () {
                        _this.eval(script);
                        var testResult = _this.runTests();
                        _this.destroyTestFrame();
                        resolve(testResult);
                    });
                });
            };
            return TestService;
        }());
        Services.TestService = TestService;
        angular.module('App').service('testService', TestService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=services.js.map