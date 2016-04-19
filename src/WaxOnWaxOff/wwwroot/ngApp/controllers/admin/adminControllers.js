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
                function LabsController($stateParams, labService, $uibModal) {
                    this.$stateParams = $stateParams;
                    this.labService = labService;
                    this.$uibModal = $uibModal;
                    this.lessonId = $stateParams['lessonId'];
                    this.labs = labService.list(this.lessonId);
                }
                LabsController.prototype.removeLab = function (labId) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/deleteLab.html',
                        controller: DeleteLabController,
                        controllerAs: 'modal',
                        resolve: {
                            labId: labId
                        }
                    }).result.then(function () {
                        _this.labs = _this.labService.list(_this.lessonId);
                    });
                };
                return LabsController;
            }());
            Controllers.LabsController = LabsController;
            var DeleteLabController = (function () {
                function DeleteLabController(labId, $uibModalInstance, labService) {
                    this.labId = labId;
                    this.$uibModalInstance = $uibModalInstance;
                    this.labService = labService;
                    if (labId) {
                        this.lab = labService.getLab(labId);
                    }
                }
                DeleteLabController.prototype.save = function () {
                    var _this = this;
                    this.labService.remove(this.lab.id).then(function () {
                        _this.$uibModalInstance.close();
                    });
                    ;
                };
                return DeleteLabController;
            }());
            var LabEditController = (function () {
                function LabEditController(labService, $uibModal, $state, $stateParams) {
                    this.labService = labService;
                    this.$uibModal = $uibModal;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.aceOptions = {};
                    this.lessonId = this.$stateParams['lessonId'];
                    var labId = this.$stateParams['labId'];
                    if (labId) {
                        this.lab = this.labService.getLab(labId);
                    }
                    else {
                        this.lab = new App.Models.Lab();
                    }
                }
                LabEditController.prototype.labTypeChange = function () {
                    this.aceOptions.mode = this.lab.labType == 0 ? 'javascript' : 'typescript';
                };
                LabEditController.prototype.saveLab = function () {
                    var _this = this;
                    this.lab.lessonId = this.lessonId;
                    this.labService.save(this.lab).then(function () {
                        _this.$state.go('admin.labs', { lessonId: _this.lessonId });
                    }).catch(function (err) {
                        var validationErrors = [];
                        for (var prop in err.data) {
                            var propErrors = err.data[prop];
                            validationErrors = validationErrors.concat(propErrors);
                        }
                        _this.validationErrors = validationErrors;
                    });
                };
                LabEditController.prototype.testTest = function () {
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/submitAnswer.html',
                        controller: SubmitTestDialogController,
                        controllerAs: 'modal',
                        resolve: {
                            lab: this.lab
                        }
                    });
                };
                return LabEditController;
            }());
            Controllers.LabEditController = LabEditController;
            var SubmitTestDialogController = (function () {
                function SubmitTestDialogController($uibModalInstance, testService, lab) {
                    var _this = this;
                    this.$uibModalInstance = $uibModalInstance;
                    this.testService = testService;
                    this.isWorking = true;
                    var answer = {
                        html: lab.htmlSolution,
                        css: lab.cssSolution,
                        javascript: lab.javaScriptSolution,
                        typescript: lab.typeScriptSolution,
                        csharp: lab.cSharpSolution,
                        plain: lab.plainSolution
                    };
                    this.testService.submitAnswer(lab, answer).then(function (result) {
                        _this.answerResult = result;
                        _this.isWorking = false;
                    });
                }
                SubmitTestDialogController.prototype.ok = function () {
                    this.$uibModalInstance.close(this.answerResult);
                };
                return SubmitTestDialogController;
            }());
            var StudentsController = (function () {
                function StudentsController($stateParams, studentService, $uibModal) {
                    this.$stateParams = $stateParams;
                    this.studentService = studentService;
                    this.$uibModal = $uibModal;
                    this.students = studentService.list();
                }
                StudentsController.prototype.getScores = function (student) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/scores.html',
                        controller: StudentScoresController,
                        controllerAs: 'modal',
                        resolve: {
                            student: student
                        }
                    }).result.then(function () {
                        _this.students = _this.studentService.list();
                    });
                };
                StudentsController.prototype.add = function () {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/addStudent.html',
                        controller: StudentAddController,
                        controllerAs: 'modal'
                    }).result.then(function () {
                        _this.students = _this.studentService.list();
                    });
                };
                StudentsController.prototype.remove = function (student) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/deleteStudent.html',
                        controller: StudentDeleteController,
                        controllerAs: 'modal',
                        resolve: {
                            student: student
                        }
                    }).result.then(function () {
                        _this.students = _this.studentService.list();
                    });
                };
                return StudentsController;
            }());
            Controllers.StudentsController = StudentsController;
            var StudentDeleteController = (function () {
                function StudentDeleteController(student, $uibModalInstance, studentService) {
                    this.student = student;
                    this.$uibModalInstance = $uibModalInstance;
                    this.studentService = studentService;
                }
                StudentDeleteController.prototype.save = function () {
                    var _this = this;
                    this.studentService.remove(this.student.id).then(function () {
                        _this.$uibModalInstance.close();
                    });
                    ;
                };
                return StudentDeleteController;
            }());
            var StudentAddController = (function () {
                function StudentAddController($uibModalInstance, studentService) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.studentService = studentService;
                }
                StudentAddController.prototype.save = function () {
                    var _this = this;
                    this.studentService.save(this.student).then(function () {
                        _this.$uibModalInstance.close();
                    });
                    ;
                };
                return StudentAddController;
            }());
            var StudentScoresController = (function () {
                function StudentScoresController(student, $uibModalInstance, studentService) {
                    this.student = student;
                    this.$uibModalInstance = $uibModalInstance;
                    this.studentService = studentService;
                    this.scores = studentService.listScores(student.id);
                }
                StudentScoresController.prototype.ok = function () {
                    this.$uibModalInstance.close();
                };
                return StudentScoresController;
            }());
        })(Controllers = Admin.Controllers || (Admin.Controllers = {}));
    })(Admin = App.Admin || (App.Admin = {}));
})(App || (App = {}));
//# sourceMappingURL=adminControllers.js.map