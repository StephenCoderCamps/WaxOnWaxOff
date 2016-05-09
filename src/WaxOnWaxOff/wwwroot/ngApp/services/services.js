var App;
(function (App) {
    var Services;
    (function (Services) {
        var UnitService = (function () {
            function UnitService($resource) {
                this.UnitResource = $resource('api/units/:id');
            }
            UnitService.prototype.listUnits = function () {
                return this.UnitResource.query();
            };
            return UnitService;
        }());
        Services.UnitService = UnitService;
        angular.module('App').service('unitService', UnitService);
        var SuccessService = (function () {
            function SuccessService() {
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
            SuccessService.prototype.getHappyPicture = function () {
                var rnd = Math.floor(Math.random() * this.happyPictures.length);
                return this.happyPictures[rnd];
            };
            return SuccessService;
        }());
        Services.SuccessService = SuccessService;
        angular.module('App').service('successService', SuccessService);
        var LessonService = (function () {
            function LessonService($resource, $q, testService) {
                this.$q = $q;
                this.testService = testService;
                this.lessonResource = $resource('/api/lessons/:id', null, {
                    listLessons: {
                        url: '/api/lessons/listLessons/:unitId', method: 'GET', isArray: true, params: { unitId: '@unitId' }
                    },
                    postScore: {
                        url: '/api/lessons/postScore/:id', method: 'POST', params: { id: '@id' }
                    }
                });
            }
            LessonService.prototype.listLessons = function (unitId) {
                return this.lessonResource.listLessons({ unitId: unitId });
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
                return this.lessonResource.postScore({ id: id }).$promise;
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
                    var combined = (lab.setupScript || '') + ';\r\n' + answer.typescript + ';\r\n' + lab.test;
                    var transpiled = _this.transpile(combined);
                    _this.executeJavaScript(answer, transpiled).then(function (testResult) {
                        resolve(testResult);
                    });
                });
            };
            TestService.prototype.runJavaScriptTest = function (lab, answer) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var combined = (lab.setupScript || '') + ';\r\n' + answer.javascript + ';\r\n' + lab.test;
                    _this.executeJavaScript(answer, combined).then(function (testResult) {
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
            TestService.prototype.evaluate = function (script) {
                return this.testFrame.contentWindow['eval'](script);
            };
            TestService.prototype.addVariable = function (varName, varValue) {
                this.testFrame.contentWindow[varName] = varValue;
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
                var testResult = this.evaluate(script);
                return testResult;
            };
            TestService.prototype.destroyTestFrame = function () {
                document.body.removeChild(this.testFrame);
            };
            TestService.prototype.executeJavaScript = function (answer, script, additionalScripts) {
                var _this = this;
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
                    _this.injectHTML(answer.html);
                    _this.injectJasmine().then(function () {
                        var testResult;
                        try {
                            // expose source code to unit tests
                            _this.addVariable('_javaScriptSource', answer.javascript);
                            _this.addVariable('_typeScriptSource', answer.typescript);
                            _this.addVariable('_htmlSource', answer.html);
                            _this.addVariable('_cssSource', answer.css);
                            _this.addVariable('_plainSource', answer.plain);
                            // execute the scripts
                            _this.evaluate(script);
                            // execute the unit tests
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
        var ValidationService = (function () {
            function ValidationService() {
            }
            ValidationService.prototype.flattenValidation = function (modelState) {
                var messages = [];
                for (var prop in modelState) {
                    messages = messages.concat(modelState[prop]);
                }
                return messages;
            };
            return ValidationService;
        }());
        Services.ValidationService = ValidationService;
        angular.module('App').service('validationService', ValidationService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=services.js.map