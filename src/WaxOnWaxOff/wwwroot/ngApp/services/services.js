var App;
(function (App) {
    var Services;
    (function (Services) {
        var LessonService = (function () {
            function LessonService($resource, $q, testService) {
                this.$q = $q;
                this.testService = testService;
                this.lessonResource = $resource('/api/lessons/:id', null, {
                    postScore: {
                        url: '/api/lessons/postScore/:id', method: 'POST', params: { id: '@id' } }
                });
            }
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
            LessonService.prototype.postScore = function (id) {
                return this.lessonResource.postScore({ id: id });
            };
            return LessonService;
        }());
        Services.LessonService = LessonService;
        angular.module('App').service('lessonService', LessonService);
        var TestService = (function () {
            function TestService($q) {
                this.$q = $q;
            }
            TestService.prototype.submitAnswer = function (lab, answer) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    switch (lab.labType.toString()) {
                        case '0':
                            _this.runJavaScriptTest(lab, answer).then(function (testResult) {
                                resolve(testResult);
                            });
                            break;
                        case '1':
                            _this.runTypeScriptTest(lab, answer).then(function (testResult) {
                                resolve(testResult);
                            });
                            break;
                    }
                });
            };
            TestService.prototype.runTypeScriptTest = function (lab, answer) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var combined = lab.setupScript + ';\r\n' + answer.typescript + ';\r\n' + lab.test;
                    var transpiled = _this.transpile(combined);
                    _this.executeJavaScript(transpiled, answer.html, answer.css).then(function (testResult) {
                        resolve(testResult);
                    });
                });
            };
            TestService.prototype.runJavaScriptTest = function (lab, answer) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var combined = lab.setupScript + ';\r\n' + answer.javascript + ';\r\n' + lab.test;
                    _this.executeJavaScript(combined, answer.html, answer.css).then(function (testResult) {
                        resolve(testResult);
                    });
                });
            };
            TestService.prototype.transpile = function (script) {
                var result = ts.transpile(script, { module: 0 /* None */, target: 1 /* ES5 */ });
                return result;
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
                    _this.injectScript('/testScripts/jasmine.js').then(function () {
                        _this.injectScript('/testScripts/boot.js').then(function () {
                            _this.injectScript('/testScripts/customReporter.js').then(function () {
                                _this.injectScript('/testScripts/stubs.js').then(function () {
                                    resolve();
                                });
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
                this.createTestFrame();
                // escape infinite loops
                loopProtect.alias = 'protect';
                script = loopProtect(script);
                this.testFrame.contentWindow['protect'] = loopProtect;
                loopProtect.hit = function (line) {
                    console.error('Potential infinite loop found on line ' + line);
                };
                return this.$q(function (resolve, reject) {
                    _this.injectHTML(html);
                    _this.injectJasmine().then(function () {
                        var testResult;
                        try {
                            _this.eval(script);
                            testResult = _this.runTests();
                        }
                        catch (err) {
                            testResult = {
                                isCorrect: false,
                                message: err.message
                            };
                        }
                        finally {
                            _this.destroyTestFrame();
                            resolve(testResult);
                        }
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