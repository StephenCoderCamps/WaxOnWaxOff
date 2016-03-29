var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var HomeController = (function () {
            function HomeController(lessonService) {
                this.lessonService = lessonService;
                this.lessons = lessonService.listLessons();
            }
            return HomeController;
        }());
        Controllers.HomeController = HomeController;
        var LessonController = (function () {
            function LessonController(lessonService, $state, $stateParams, $uibModal) {
                var _this = this;
                this.lessonService = lessonService;
                this.$state = $state;
                this.$stateParams = $stateParams;
                this.$uibModal = $uibModal;
                this.activeTab = 0;
                this.currentLabIndex = 0;
                lessonService.getLesson($stateParams['id']).$promise.then(function (result) {
                    _this.lesson = result;
                    _this.showLab();
                });
            }
            LessonController.prototype.getProgress = function () {
                if (!this.lesson) {
                    return 0;
                }
                return (this.currentLabIndex) * 100 / this.lesson.labs.length;
            };
            LessonController.prototype.getProgressText = function () {
                if (!this.currentLabIndex) {
                    return '';
                }
                return 'completed lab ' + (this.currentLabIndex) + ' of ' + this.lesson.labs.length;
            };
            LessonController.prototype.canSubmitAnswer = function () {
                if (!this.currentLab) {
                    return false;
                }
                if (this.currentLab.showTypeScriptEditor && !this.answer.typescript) {
                    return false;
                }
                if (this.currentLab.showJavaScriptEditor && !this.answer.javascript) {
                    return false;
                }
                return true;
            };
            LessonController.prototype.submitAnswer = function () {
                var _this = this;
                this.$uibModal.open({
                    templateUrl: '/ngApp/dialogs/submitAnswer.html',
                    controller: SubmitAnswerDialogController,
                    controllerAs: 'modal',
                    resolve: {
                        labId: this.currentLab.id,
                        answer: this.answer
                    }
                }).result.then(function (answerResult) {
                    if (answerResult.isCorrect) {
                        _this.currentLabIndex++;
                        // check if all labs done
                        if (_this.currentLabIndex == _this.lesson.labs.length) {
                            _this.$uibModal.open({
                                templateUrl: '/ngApp/dialogs/success.html',
                                controller: LessonSuccessDialogController,
                                controllerAs: 'modal',
                                resolve: {
                                    lesson: _this.lesson
                                }
                            }).result.then(function () {
                                _this.$state.go('home');
                            });
                        }
                        else {
                            _this.showLab();
                        }
                    }
                });
            };
            LessonController.prototype.showLab = function () {
                this.answer = new App.Models.Answer();
                this.currentLab = this.lesson.labs[this.currentLabIndex];
                if (this.currentLab.showTypeScriptEditor) {
                    this.activeTab = 3;
                }
                else if (this.currentLab.showJavaScriptEditor) {
                    this.activeTab = 1;
                }
                else if (this.currentLab.showCSharpEditor) {
                    this.activeTab = 4;
                }
                else if (this.currentLab.showHTMLEditor) {
                    this.activeTab = 0;
                }
                else if (this.currentLab.showCSSEditor) {
                    this.activeTab = 2;
                }
            };
            return LessonController;
        }());
        Controllers.LessonController = LessonController;
        var SubmitAnswerDialogController = (function () {
            function SubmitAnswerDialogController($uibModalInstance, lessonService, labId, answer) {
                var _this = this;
                this.$uibModalInstance = $uibModalInstance;
                this.lessonService = lessonService;
                this.isWorking = true;
                this.lessonService.submitAnswer(labId, answer).then(function (result) {
                    _this.answerResult = result;
                    _this.isWorking = false;
                });
            }
            SubmitAnswerDialogController.prototype.ok = function () {
                this.$uibModalInstance.close(this.answerResult);
            };
            return SubmitAnswerDialogController;
        }());
        var LessonSuccessDialogController = (function () {
            function LessonSuccessDialogController($uibModalInstance, lesson) {
                this.$uibModalInstance = $uibModalInstance;
                this.lesson = lesson;
                var happyPictures = [
                    '/images/success/catAndDog.jpg',
                    '/images/success/cookie.jpg'
                ];
                var rnd = Math.floor(Math.random() * happyPictures.length);
                this.happyPicture = happyPictures[rnd];
            }
            LessonSuccessDialogController.prototype.ok = function () {
                this.$uibModalInstance.close();
            };
            return LessonSuccessDialogController;
        }());
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=controllers.js.map