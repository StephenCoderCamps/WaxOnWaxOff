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
        public answer: App.Models.Answer;


        public getProgress(): number {
            if (!this.lesson) {
                return 0;
            }
            return (this.currentLabIndex) * 100 /this.lesson.labs.length;

        }

        public getProgressText(): string {
            if (!this.currentLabIndex) {
                return '';
            }
            return 'completed lab ' + (this.currentLabIndex) + ' of ' + this.lesson.labs.length;                 
        }


        public canSubmitAnswer(): boolean {
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
        }

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
                    // check if all labs done
                    if (this.currentLabIndex == this.lesson.labs.length) {
                        this.$uibModal.open({
                            templateUrl: '/ngApp/dialogs/success.html',
                            controller: LessonSuccessDialogController,
                            controllerAs: 'modal',
                            resolve: {
                                lesson: this.lesson
                            }
                        }).result.then(() => {
                            this.$state.go('home');
                        });
                    } else {
                        this.showLab();
                    }
                }
            });                
        }

        showLab() {
            this.answer = new App.Models.Answer();
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

        constructor(private lessonService: App.Services.LessonService, private $state: ng.ui.IStateService, private $stateParams: ng.ui.IStateParamsService, private $uibModal: angular.ui.bootstrap.IModalService) {
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


    class LessonSuccessDialogController {
        public ok() {
            this.$uibModalInstance.close();
        }

        constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, public lesson) {}

    }

}