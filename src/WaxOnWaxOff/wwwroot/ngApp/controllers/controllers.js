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
            function LessonController(lessonService, $stateParams, $uibModal) {
                var _this = this;
                this.lessonService = lessonService;
                this.$stateParams = $stateParams;
                this.$uibModal = $uibModal;
                this.activeTab = 0;
                this.currentLabIndex = 0;
                lessonService.getLesson($stateParams['id']).$promise.then(function (result) {
                    _this.lesson = result;
                    _this.showLab();
                });
            }
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
                        _this.showLab();
                    }
                });
            };
            LessonController.prototype.showLab = function () {
                this.answer = null;
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
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=controllers.js.map