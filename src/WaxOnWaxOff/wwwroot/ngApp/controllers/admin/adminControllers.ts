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

        public labTypeChange() {
            this.aceOptions.mode = this.lab.labType == 0 ? 'javascript' : 'typescript';
        }


        public saveLab() {
            this.lab.lessonId = this.lessonId;
            this.labService.save(this.lab).then(() => {
                this.$state.go('admin.labs', {lessonId:this.lessonId});
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

        constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private labService: App.Admin.Services.LabService, lab) {
            this.labService.testTest(lab).then((result) => {
                this.answerResult = result;
                this.isWorking = false;
            });
        }
    }




    export class StudentsController {
        public students;


        public getScores(student) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/scores.html',
                controller: StudentScoresController,
                controllerAs: 'modal',
                resolve: {
                    student: student
                }
            }).result.then(() => {
                this.students = this.studentService.list();
            });
        }


        public add(studentId: number) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/editStudent.html',
                controller: StudentAddController,
                controllerAs: 'modal',
                resolve: {
                    studentId: () => studentId
                }
            }).result.then(() => {
                this.students = this.studentService.list();
            });
        }



        public removeStudent(studentId: number) {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/admin/deleteStudent.html',
                controller: StudentDeleteController,
                controllerAs: 'modal',
                resolve: {
                    studentId: studentId
                }
            }).result.then(() => {
                this.students = this.studentService.list();
            });
        }

        constructor(private $stateParams: ng.ui.IStateParamsService, private studentService: App.Admin.Services.StudentService, private $uibModal: ng.ui.bootstrap.IModalService) {
            this.students = studentService.list();
        }
    }

    class StudentDeleteController {
        public student;

        public save() {
            this.studentService.remove(this.student.id).then(() => {
                this.$uibModalInstance.close();
            });;
        }

        constructor(private studentId, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private studentService: App.Admin.Services.StudentService) {
            if (studentId) {
                this.student = studentService.getStudent(studentId);
            }
        }
    }

    class StudentAddController {
        public student;

        public save() {
            this.studentService.save(this.student).then(() => {
                this.$uibModalInstance.close();
            });;
        }

        constructor(private studentId, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private studentService: App.Admin.Services.StudentService) {
            if (studentId) {
                this.student = studentService.getStudent(studentId);
            }
        }
    }



    class StudentScoresController {
        public scores;

        public ok() {
            this.$uibModalInstance.close();
        }

        constructor(public student, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private studentService: App.Admin.Services.StudentService) {
            this.scores = studentService.listScores(student.id);
        }
    }



}