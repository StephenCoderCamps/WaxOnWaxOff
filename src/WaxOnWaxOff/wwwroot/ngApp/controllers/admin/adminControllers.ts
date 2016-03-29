namespace App.Admin.Controllers {


    export class LessonsControllers {
        public lessons;

        public edit(lessonId: number) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/editLesson.html',
                controller: EditLessonController,
                controllerAs: 'modal',
                resolve: {
                    lessonId: lessonId
                }
            }).result.then(() => {
                this.lessons = this.lessonService.listLessons();
            });
        }

        public remove(lessonId: number) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/deleteLesson.html',
                controller: DeleteLessonController,
                controllerAs: 'modal',
                resolve: {
                    lessonId: lessonId
                }
            }).result.then(() => {
                this.lessons = this.lessonService.listLessons();
            });
        }


        constructor(private $uibModal: ng.ui.bootstrap.IModalService, private lessonService: App.Services.LessonService) {
            this.lessons = lessonService.listLessons();
        }
    }


    class EditLessonController {
        public lesson;

        public save() {
            this.lessonService.editLesson(this.lesson).then(() => {
                this.$uibModalInstance.close();
            });                ;
        }

        constructor(private lessonId, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private lessonService: App.Services.LessonService)
        {
            if (lessonId) {
                this.lesson = lessonService.getLesson(lessonId);
            }
        }
    }


    class DeleteLessonController {
        public lesson;

        public save() {
            this.lessonService.deleteLesson(this.lesson.id).then(() => {
                this.$uibModalInstance.close();
            });;
        }

        constructor(private lessonId, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private lessonService: App.Services.LessonService) {
            if (lessonId) {
                this.lesson = lessonService.getLesson(lessonId);
            }
        }
    }


    export class LabsController {
        public labs;

        constructor(private $stateParams: ng.ui.IStateParamsService, private labService: App.Admin.Services.LabService) {
            this.labs = labService.list($stateParams['lessonId']);
        }
    }



    export class LabEditController {
        public lab: App.Models.Lab;
        public aceOptions: any = {};

        public labTypeChange() {
            this.aceOptions.mode = this.lab.labType == 0 ? 'javascript' : 'typescript';
        }


        public testTest() {
            this.labService.testTest(this.lab);
        }

        constructor(private labService: App.Admin.Services.LabService) {
            this.lab = new App.Models.Lab();
        }
    }



}