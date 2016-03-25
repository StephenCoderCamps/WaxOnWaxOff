namespace App.Controllers {


    export class HomeController {
        public lessons;

        constructor(private lessonService: App.Services.LessonService) {
            this.lessons = lessonService.listLessons();
        }
    }


    export class LessonController {
        public activeTab = 0;
        public lesson;
        public currentLab;
        public currentLabIndex = 0;
        public answer;

        public submitAnswer() {
            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/submitAnswer.html',
                controller: SubmitAnswerDialogController,
                controllerAs: 'modal',
                resolve: {
                    labId: this.currentLab.id,
                    answer: this.answer
                }
            }).result.then((answerResult) => {
                if (answerResult.isCorrect) {
                    this.currentLabIndex++;
                    this.showLab();
                }
            });                
        }

        showLab() {
            this.answer = null;
            this.currentLab = this.lesson.labs[this.currentLabIndex];

            if (this.currentLab.showTypeScriptEditor) {
                this.activeTab = 3;
            } else if (this.currentLab.showJavaScriptEditor) {
                this.activeTab = 1;
            } else if (this.currentLab.showCSharpEditor) {
                this.activeTab = 4;
            } else if (this.currentLab.showHTMLEditor) {
                this.activeTab = 0;
            } else if (this.currentLab.showCSSEditor) {
                this.activeTab = 2;
            }
        }

        constructor(private lessonService: App.Services.LessonService, private $stateParams: ng.ui.IStateParamsService, private $uibModal: angular.ui.bootstrap.IModalService) {
            lessonService.getLesson($stateParams['id']).$promise.then((result) => {
                this.lesson = result;
                this.showLab();
            });
        }
    }


    class SubmitAnswerDialogController {
        public answerResult;
        public isWorking = true;

        public ok() {
            this.$uibModalInstance.close(this.answerResult);
        }

        constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private lessonService: App.Services.LessonService,  labId: number, answer) {
            this.lessonService.submitAnswer(labId, answer).then((result) => {
                this.answerResult = result;
                this.isWorking = false;
            });

        }
    }

}