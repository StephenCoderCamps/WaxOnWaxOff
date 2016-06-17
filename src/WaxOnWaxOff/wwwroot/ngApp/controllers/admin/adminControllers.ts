namespace App.Admin.Controllers {



    export class UnitsController {
        public units;

        public edit(unit) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/editUnit.html',
                controller: EditUnitController,
                controllerAs: 'modal',
                resolve: {
                    unit: unit
                }
            }).result.then(() => {
                this.units = this.adminUnitService.listUnits();
            });
        }

        public remove(unit: number) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/deleteUnit.html',
                controller: DeleteUnitController,
                controllerAs: 'modal',
                resolve: {
                    unit: unit
                }
            }).result.then(() => {
                this.units = this.adminUnitService.listUnits();
            });
        }


        constructor(private $uibModal: ng.ui.bootstrap.IModalService, private adminUnitService: App.Admin.Services.AdminUnitService, private adminLessonService: App.Admin.Services.AdminLessonService) {
            this.units = adminUnitService.listUnits();
        }
    }


    class EditUnitController {

        public save() {
            this.adminUnitService.editUnit(this.unit).then(() => {
                this.$uibModalInstance.close();
            });
        }

        constructor(private unit, private adminUnitService: App.Admin.Services.AdminUnitService, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private adminLessonService: App.Admin.Services.AdminLessonService) {
        }
    }


    class DeleteUnitController {

        public save() {
            this.adminUnitService.deleteUnit(this.unit.id).then(() => {
                this.$uibModalInstance.close();
            });;
        }

        constructor(private unit, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private adminUnitService: App.Admin.Services.AdminUnitService) {
        }
    }






    export class LessonsController {
        public lessons;
        public selectedUnitId;

        public edit(lesson) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/editLesson.html',
                controller: EditLessonController,
                controllerAs: 'modal',
                resolve: {
                    lesson: lesson,
                    unitId: () => this.selectedUnitId
                }
            }).result.then(() => {
                this.listLessons();
            });
        }

        public remove(lesson) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/deleteLesson.html',
                controller: DeleteLessonController,
                controllerAs: 'modal',
                resolve: {
                    lesson: lesson
                }
            }).result.then(() => {
                this.listLessons();
            });
        }

        public listLessons() {
            this.lessons = this.adminLessonService.listLessons(this.selectedUnitId);
        }

        constructor(private $uibModal: ng.ui.bootstrap.IModalService, $stateParams: ng.ui.IStateParamsService, private adminLessonService: App.Admin.Services.AdminLessonService) {
            this.selectedUnitId = $stateParams['unitId'];
            this.listLessons();
        }
    }


    class EditLessonController {

        public save() {
            this.lesson.unitId = this.unitId;
            this.adminLessonService.editLesson(this.lesson).then(() => {
                this.$uibModalInstance.close();
            });                
        }

        constructor(private lesson, private unitId, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private adminLessonService: App.Admin.Services.AdminLessonService)
        {
        }
    }


    class DeleteLessonController {

        public save() {
            this.adminLessonService.deleteLesson(this.lesson.id).then(() => {
                this.$uibModalInstance.close();
            });;
        }

        constructor(private lesson, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private adminLessonService: App.Admin.Services.AdminLessonService) {
        }
    }


    export class LabsController {
        public lessonId;
        public labs;

        public removeLab(labId: number) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/deleteLab.html',
                controller: DeleteLabController,
                controllerAs: 'modal',
                resolve: {
                    labId: labId
                }
            }).result.then(() => {
                this.labs = this.labService.list(this.lessonId);
            });
        }

        constructor(private $stateParams: ng.ui.IStateParamsService, private labService: App.Admin.Services.LabService, private $uibModal: ng.ui.bootstrap.IModalService) {
            this.lessonId = $stateParams['lessonId'];
            this.labs = labService.list(this.lessonId);
        }
    }


    class DeleteLabController {
        public lab;

        public save() {
            this.labService.remove(this.lab.id).then(() => {
                this.$uibModalInstance.close();
            });;
        }

        constructor(private labId, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private labService: App.Admin.Services.LabService) {
            if (labId) {
                this.lab = labService.getLab(labId);
            }
        }
    }

    export class LabEditController {
        public lessonId: number;
        public lab: App.Models.Lab;
        public aceOptions: any = {};
        public validationErrors;

        public labTypeChange() {
            switch (+this.lab.labType) {
                case 0: this.aceOptions.mode = 'javascript';
                    break;
                case 1: this.aceOptions.mode = 'typescript';
                    break;
                case 2: this.aceOptions.mode = 'csharp';
                    break;

            }
        }


        public saveLab() {
            this.lab.lessonId = this.lessonId;
            this.labService.save(this.lab).then(() => {
                this.$state.go('admin.labs', {lessonId:this.lessonId});
            }).catch((err) => {
                let validationErrors = [];
                for (let prop in err.data) {
                    let propErrors = err.data[prop];
                    validationErrors = validationErrors.concat(propErrors);
                }
                this.validationErrors = validationErrors;
            });
        }

        public testTest() {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/submitAnswer.html',
                controller: SubmitTestDialogController,
                controllerAs: 'modal',
                resolve: {
                    lab: this.lab
                }
            })
        }

        constructor(
            private labService: App.Admin.Services.LabService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private $state: ng.ui.IStateService,
            private $stateParams: ng.ui.IStateParamsService
        ) {
            this.lessonId = this.$stateParams['lessonId'];
            let labId = this.$stateParams['labId'];
            if (labId) {
                this.lab = this.labService.getLab(labId);
            } else {
                this.lab = new App.Models.Lab();
            }
        }
    }

    class SubmitTestDialogController {
        public answerResult;
        public isWorking = true;

        public ok() {
            this.$uibModalInstance.close(this.answerResult);
        }

        constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private testService: App.Services.TestService, lab) {
            let answer = {
                html: lab.htmlSolution,
                css: lab.cssSolution,
                javascript: lab.javaScriptSolution,
                typescript: lab.typeScriptSolution,
                csharp: lab.cSharpSolution,
                plain: lab.plainSolution
            };
            this.testService.submitAnswer(lab, answer).then((result) => {
                this.answerResult = result;
                this.isWorking = false;
            });
        }
    }




    export class AdminsController {
        public admins;


        public add() {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/addAdmin.html',
                controller: AdminAddController,
                controllerAs: 'modal'
            }).result.then(() => {
                this.admins = this.adminService.list();
            });
        }


        public remove(admin) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/deleteAdmin.html',
                controller: AdminDeleteController,
                controllerAs: 'modal',
                resolve: {
                    admin: admin
                }
            }).result.then(() => {
                this.admins = this.adminService.list();
            });
        }

        constructor(private $stateParams: ng.ui.IStateParamsService, private adminService: App.Admin.Services.AdminService, private $uibModal: ng.ui.bootstrap.IModalService) {
            this.admins = adminService.list();
        }
    }

    class AdminDeleteController {

        public save() {
            this.adminService.remove(this.admin.id).then(() => {
                this.$uibModalInstance.close();
            });;
        }

        constructor(
            public admin,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private adminService: App.Admin.Services.AdminService
        ) {}
    }

    class AdminAddController {
        public admin;
        public validationMessages;

        public save() {
            this.adminService.save(this.admin).then(() => {
                this.$uibModalInstance.close();
            }).catch((result) => {
                this.validationMessages = this.validationService.flattenValidation(result.data);
            });
        }

        constructor(
            private validationService: App.Services.ValidationService,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private adminService: App.Admin.Services.AdminService
        ) {}
    }


  



}