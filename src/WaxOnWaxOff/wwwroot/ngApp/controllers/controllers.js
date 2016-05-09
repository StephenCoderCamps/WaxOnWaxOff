var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var HomeController = (function () {
            function HomeController(unitService, lessonService) {
                this.unitService = unitService;
                this.lessonService = lessonService;
                this.units = unitService.listUnits();
            }
            HomeController.prototype.listLessons = function () {
                this.lessons = this.lessonService.listLessons(this.selectedUnitId);
            };
            return HomeController;
        }());
        Controllers.HomeController = HomeController;
        var LessonController = (function () {
            function LessonController(successService, $window, lessonService, $state, $stateParams, $uibModal) {
                var _this = this;
                this.successService = successService;
                this.$window = $window;
                this.lessonService = lessonService;
                this.$state = $state;
                this.$stateParams = $stateParams;
                this.$uibModal = $uibModal;
                this.activeTab = 0;
                this.answer = new App.Models.Answer();
                this.tabs = [];
                this.lessonId = $stateParams['id'];
                lessonService.getLesson(this.lessonId).$promise.then(function (result) {
                    _this.lesson = result;
                    _this.showLab();
                });
            }
            Object.defineProperty(LessonController.prototype, "currentLabIndex", {
                get: function () {
                    return parseInt(window.sessionStorage['lesson_' + this.lessonId]) || 0;
                },
                set: function (value) {
                    window.sessionStorage['lesson_' + this.lessonId] = value.toString();
                },
                enumerable: true,
                configurable: true
            });
            LessonController.prototype.getProgress = function () {
                if (!this.lesson) {
                    return 0;
                }
                return (this.currentLabIndex) * 100 / this.lesson.labs.length;
            };
            LessonController.prototype.getProgressText = function () {
                if (!this.lesson) {
                    return '';
                }
                return 'completed lab ' + (this.currentLabIndex) + ' of ' + this.lesson.labs.length;
            };
            LessonController.prototype.submitAnswer = function () {
                var _this = this;
                this.tabs.forEach(function (tab) {
                    switch (tab.title) {
                        case 'HTML':
                            _this.answer.html = tab.text;
                            break;
                        case 'JavaScript':
                            _this.answer.javascript = tab.text;
                            break;
                        case 'CSS':
                            _this.answer.css = tab.text;
                            break;
                        case 'ECMAScript':
                            _this.answer.typescript = tab.text;
                            break;
                        case 'Answer':
                            _this.answer.plain = tab.text;
                            break;
                        case 'C#':
                            _this.answer.csharp = tab.text;
                            break;
                    }
                });
                this.$uibModal.open({
                    templateUrl: '/ngApp/dialogs/submitAnswer.html',
                    controller: SubmitAnswerDialogController,
                    controllerAs: 'modal',
                    resolve: {
                        lab: this.currentLab,
                        answer: this.answer
                    }
                }).result.then(function (answerResult) {
                    if (answerResult.isCorrect) {
                        _this.currentLabIndex++;
                        // check if all labs done
                        if (_this.currentLabIndex == _this.lesson.labs.length) {
                            _this.currentLabIndex = 0;
                            _this.lessonService.postScore(_this.lesson.id).then(function () {
                                // go to success page
                                _this.$window.sessionStorage.setItem('lessonTitle', _this.lesson.title);
                                _this.$window.sessionStorage.setItem('happyPicture', _this.successService.getHappyPicture());
                                _this.$state.go('success');
                            });
                        }
                        else {
                            _this.showLab();
                        }
                    }
                });
            };
            LessonController.prototype.showLab = function () {
                this.currentLab = this.lesson.labs[this.currentLabIndex];
                this.tabs.length = 0;
                if (this.currentLab.showHTMLEditor) {
                    this.tabs.push({
                        title: 'HTML',
                        mode: 'html',
                        text: this.currentLab.preHTMLSolution
                    });
                }
                if (this.currentLab.showJavaScriptEditor) {
                    this.tabs.push({
                        title: 'JavaScript',
                        mode: 'javascript',
                        text: this.currentLab.preJavaScriptSolution
                    });
                }
                if (this.currentLab.showCSSScriptEditor) {
                    this.tabs.push({
                        title: 'CSS',
                        mode: 'css',
                        text: this.currentLab.preCSSSolution
                    });
                }
                if (this.currentLab.showTypeScriptEditor) {
                    this.tabs.push({
                        title: 'ECMAScript',
                        mode: 'typescript',
                        text: this.currentLab.preTypeScriptSolution
                    });
                }
                if (this.currentLab.showPlainEditor) {
                    this.tabs.push({
                        title: 'Answer',
                        mode: null,
                        text: this.currentLab.prePlainSolution
                    });
                }
                if (this.currentLab.showCSharpEditor) {
                    this.tabs.push({
                        title: 'C#',
                        mode: 'csharp',
                        text: this.currentLab.preCSharpSolution
                    });
                }
            };
            return LessonController;
        }());
        Controllers.LessonController = LessonController;
        var SubmitAnswerDialogController = (function () {
            function SubmitAnswerDialogController($uibModalInstance, testService, lab, answer) {
                var _this = this;
                this.$uibModalInstance = $uibModalInstance;
                this.testService = testService;
                this.isWorking = true;
                this.testService.submitAnswer(lab, answer).then(function (result) {
                    _this.answerResult = result;
                    _this.isWorking = false;
                });
            }
            SubmitAnswerDialogController.prototype.ok = function () {
                this.$uibModalInstance.close(this.answerResult);
            };
            return SubmitAnswerDialogController;
        }());
        var SuccessController = (function () {
            function SuccessController($window) {
                this.lessonTitle = $window.sessionStorage.getItem('lessonTitle');
                this.happyPicture = $window.sessionStorage.getItem('happyPicture');
            }
            return SuccessController;
        }());
        Controllers.SuccessController = SuccessController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=controllers.js.map