var App;
(function (App) {
    var Admin;
    (function (Admin) {
        var Controllers;
        (function (Controllers) {
            var UnitsController = (function () {
                function UnitsController($uibModal, adminUnitService, adminLessonService) {
                    this.$uibModal = $uibModal;
                    this.adminUnitService = adminUnitService;
                    this.adminLessonService = adminLessonService;
                    this.units = adminUnitService.listUnits();
                }
                UnitsController.prototype.edit = function (unit) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/editUnit.html',
                        controller: EditUnitController,
                        controllerAs: 'modal',
                        resolve: {
                            unit: unit
                        }
                    }).result.then(function () {
                        _this.units = _this.adminUnitService.listUnits();
                    });
                };
                UnitsController.prototype.remove = function (unit) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/deleteUnit.html',
                        controller: DeleteUnitController,
                        controllerAs: 'modal',
                        resolve: {
                            unit: unit
                        }
                    }).result.then(function () {
                        _this.units = _this.adminUnitService.listUnits();
                    });
                };
                return UnitsController;
            }());
            Controllers.UnitsController = UnitsController;
            var EditUnitController = (function () {
                function EditUnitController(unit, adminUnitService, $uibModalInstance, adminLessonService) {
                    this.unit = unit;
                    this.adminUnitService = adminUnitService;
                    this.$uibModalInstance = $uibModalInstance;
                    this.adminLessonService = adminLessonService;
                }
                EditUnitController.prototype.save = function () {
                    var _this = this;
                    this.adminUnitService.editUnit(this.unit).then(function () {
                        _this.$uibModalInstance.close();
                    });
                };
                return EditUnitController;
            }());
            var DeleteUnitController = (function () {
                function DeleteUnitController(unit, $uibModalInstance, adminUnitService) {
                    this.unit = unit;
                    this.$uibModalInstance = $uibModalInstance;
                    this.adminUnitService = adminUnitService;
                }
                DeleteUnitController.prototype.save = function () {
                    var _this = this;
                    this.adminUnitService.deleteUnit(this.unit.id).then(function () {
                        _this.$uibModalInstance.close();
                    });
                    ;
                };
                return DeleteUnitController;
            }());
            var LessonsController = (function () {
                function LessonsController($uibModal, $stateParams, adminLessonService) {
                    this.$uibModal = $uibModal;
                    this.adminLessonService = adminLessonService;
                    this.selectedUnitId = $stateParams['unitId'];
                    this.listLessons();
                }
                LessonsController.prototype.edit = function (lesson) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/editLesson.html',
                        controller: EditLessonController,
                        controllerAs: 'modal',
                        resolve: {
                            lesson: lesson,
                            unitId: function () { return _this.selectedUnitId; }
                        }
                    }).result.then(function () {
                        _this.listLessons();
                    });
                };
                LessonsController.prototype.remove = function (lesson) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/deleteLesson.html',
                        controller: DeleteLessonController,
                        controllerAs: 'modal',
                        resolve: {
                            lesson: lesson
                        }
                    }).result.then(function () {
                        _this.listLessons();
                    });
                };
                LessonsController.prototype.listLessons = function () {
                    this.lessons = this.adminLessonService.listLessons(this.selectedUnitId);
                };
                return LessonsController;
            }());
            Controllers.LessonsController = LessonsController;
            var EditLessonController = (function () {
                function EditLessonController(lesson, unitId, $uibModalInstance, adminLessonService) {
                    this.lesson = lesson;
                    this.unitId = unitId;
                    this.$uibModalInstance = $uibModalInstance;
                    this.adminLessonService = adminLessonService;
                }
                EditLessonController.prototype.save = function () {
                    var _this = this;
                    this.lesson.unitId = this.unitId;
                    this.adminLessonService.editLesson(this.lesson).then(function () {
                        _this.$uibModalInstance.close();
                    });
                };
                return EditLessonController;
            }());
            var DeleteLessonController = (function () {
                function DeleteLessonController(lesson, $uibModalInstance, adminLessonService) {
                    this.lesson = lesson;
                    this.$uibModalInstance = $uibModalInstance;
                    this.adminLessonService = adminLessonService;
                }
                DeleteLessonController.prototype.save = function () {
                    var _this = this;
                    this.adminLessonService.deleteLesson(this.lesson.id).then(function () {
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
                    this.aceOptions = {
                        onLoad: function (_editor) {
                            // This is to remove following warning message on console:
                            // Automatically scrolling cursor into view after selection change this will be disabled in the next version
                            // set editor.$blockScrolling = Infinity to disable this message
                            _editor.$blockScrolling = Infinity;
                        } };
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
                    switch (+this.lab.labType) {
                        case 0:
                            this.aceOptions.mode = 'javascript';
                            this.lab.test = "describe('doSomething', function () {\n    it('doSomething() function should exist.', function() {\n        expect(doSomething).not.toBeNull();\n    });\n    it('doSomething() function should return \"Do Something!\"', function() {\n        var result = doSomething();\n        expect(result).toBe(\"Do Something!\");\n    });\n});";
                            break;
                        case 1:
                            this.aceOptions.mode = 'typescript';
                            this.lab.test = "describe('doSomething', function () {\n    it('doSomething() function should exist.', function() {\n        expect(doSomething).not.toBeNull();\n    });\n    it('doSomething() function should return \"Do Something!\"', function() {\n        var result = doSomething();\n        expect(result).toBe(\"Do Something!\");\n    });\n});";
                            break;
                        case 2:
                            this.aceOptions.mode = 'csharp';
                            this.lab.test = "// test that Calculator class exists\nvar calculatorType = Type.GetType(typeof(Calculator).AssemblyQualifiedName);\ncalculatorType.Should().NotBeNull(\"you need to create a Calculator class.\");\n\n// invoke AddNumbers method\nvar result = InvokeMethod(calculatorType, \"AddNumbers\", 2, 3);\n\n// verify\nAssert(5, result, \"Not getting expected result!\");";
                            break;
                    }
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
            var AdminsController = (function () {
                function AdminsController($stateParams, adminService, $uibModal) {
                    this.$stateParams = $stateParams;
                    this.adminService = adminService;
                    this.$uibModal = $uibModal;
                    this.admins = adminService.list();
                }
                AdminsController.prototype.add = function () {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/addAdmin.html',
                        controller: AdminAddController,
                        controllerAs: 'modal'
                    }).result.then(function () {
                        _this.admins = _this.adminService.list();
                    });
                };
                AdminsController.prototype.remove = function (admin) {
                    var _this = this;
                    this.$uibModal.open({
                        templateUrl: '/ngApp/dialogs/admin/deleteAdmin.html',
                        controller: AdminDeleteController,
                        controllerAs: 'modal',
                        resolve: {
                            admin: admin
                        }
                    }).result.then(function () {
                        _this.admins = _this.adminService.list();
                    });
                };
                return AdminsController;
            }());
            Controllers.AdminsController = AdminsController;
            var AdminDeleteController = (function () {
                function AdminDeleteController(admin, $uibModalInstance, adminService) {
                    this.admin = admin;
                    this.$uibModalInstance = $uibModalInstance;
                    this.adminService = adminService;
                }
                AdminDeleteController.prototype.save = function () {
                    var _this = this;
                    this.adminService.remove(this.admin.id).then(function () {
                        _this.$uibModalInstance.close();
                    });
                    ;
                };
                return AdminDeleteController;
            }());
            var AdminAddController = (function () {
                function AdminAddController(validationService, $uibModalInstance, adminService) {
                    this.validationService = validationService;
                    this.$uibModalInstance = $uibModalInstance;
                    this.adminService = adminService;
                }
                AdminAddController.prototype.save = function () {
                    var _this = this;
                    this.adminService.save(this.admin).then(function () {
                        _this.$uibModalInstance.close();
                    }).catch(function (result) {
                        _this.validationMessages = _this.validationService.flattenValidation(result.data);
                    });
                };
                return AdminAddController;
            }());
        })(Controllers = Admin.Controllers || (Admin.Controllers = {}));
    })(Admin = App.Admin || (App.Admin = {}));
})(App || (App = {}));
//# sourceMappingURL=adminControllers.js.map