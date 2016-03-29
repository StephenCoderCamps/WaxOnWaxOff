var App;
(function (App) {
    var Admin;
    (function (Admin) {
        var Controllers;
        (function (Controllers) {
            var LessonsControllers = (function () {
                function LessonsControllers($uibModal, lessonService) {
                    this.$uibModal = $uibModal;
                    this.lessonService = lessonService;
                    this.lessons = lessonService.listLessons();
                }
                LessonsControllers.prototype.edit = function (lessonId) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/editLesson.html',
                        controller: EditLessonController,
                        controllerAs: 'modal',
                        resolve: {
                            lessonId: lessonId
                        }
                    }).result.then(function () {
                        _this.lessons = _this.lessonService.listLessons();
                    });
                };
                LessonsControllers.prototype.remove = function (lessonId) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/deleteLesson.html',
                        controller: DeleteLessonController,
                        controllerAs: 'modal',
                        resolve: {
                            lessonId: lessonId
                        }
                    }).result.then(function () {
                        _this.lessons = _this.lessonService.listLessons();
                    });
                };
                return LessonsControllers;
            }());
            Controllers.LessonsControllers = LessonsControllers;
            var EditLessonController = (function () {
                function EditLessonController(lessonId, $uibModalInstance, lessonService) {
                    this.lessonId = lessonId;
                    this.$uibModalInstance = $uibModalInstance;
                    this.lessonService = lessonService;
                    if (lessonId) {
                        this.lesson = lessonService.getLesson(lessonId);
                    }
                }
                EditLessonController.prototype.save = function () {
                    var _this = this;
                    this.lessonService.editLesson(this.lesson).then(function () {
                        _this.$uibModalInstance.close();
                    });
                    ;
                };
                return EditLessonController;
            }());
            var DeleteLessonController = (function () {
                function DeleteLessonController(lessonId, $uibModalInstance, lessonService) {
                    this.lessonId = lessonId;
                    this.$uibModalInstance = $uibModalInstance;
                    this.lessonService = lessonService;
                    if (lessonId) {
                        this.lesson = lessonService.getLesson(lessonId);
                    }
                }
                DeleteLessonController.prototype.save = function () {
                    var _this = this;
                    this.lessonService.deleteLesson(this.lesson.id).then(function () {
                        _this.$uibModalInstance.close();
                    });
                    ;
                };
                return DeleteLessonController;
            }());
            var LabsController = (function () {
                function LabsController($stateParams, labService) {
                    this.$stateParams = $stateParams;
                    this.labService = labService;
                    this.labs = labService.list($stateParams['lessonId']);
                }
                return LabsController;
            }());
            Controllers.LabsController = LabsController;
            var LabEditController = (function () {
                function LabEditController(labService) {
                    this.labService = labService;
                    this.aceOptions = {};
                    this.lab = new App.Models.Lab();
                }
                LabEditController.prototype.labTypeChange = function () {
                    this.aceOptions.mode = this.lab.labType == 0 ? 'javascript' : 'typescript';
                };
                LabEditController.prototype.testTest = function () {
                    this.labService.testTest(this.lab);
                };
                return LabEditController;
            }());
            Controllers.LabEditController = LabEditController;
        })(Controllers = Admin.Controllers || (Admin.Controllers = {}));
    })(Admin = App.Admin || (App.Admin = {}));
})(App || (App = {}));
//# sourceMappingURL=adminControllers.js.map