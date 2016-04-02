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
        public answer = new Models.Answer();
        public tabs = [];


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


       

        public submitAnswer() {
            this.tabs.forEach((tab) => {
                switch (tab.title) {
                    case 'HTML':
                        this.answer.html = tab.text;
                        break;
                    case 'JavaScript':
                        this.answer.javascript = tab.text;
                        break;
                    case 'CSS':
                        this.answer.css = tab.text;
                        break;
                    case 'TypeScript':
                        this.answer.typescript = tab.text;
                        break;
                    case 'C#':
                        this.answer.csharp = tab.text;
                        break;

                }
            });


            this.$uibModal.open({
                templateUrl: '/ngApp/dialogs/submitAnswer.html',
                controller: SubmitAnswerDialogController,
                controllerAs: 'modal',
                resolve: {
                    lab: this.currentLab,
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
            this.currentLab = this.lesson.labs[this.currentLabIndex];
            this.tabs.length = 0;
            if (this.currentLab.showHTMLEditor) {
                this.tabs.push({
                    title: 'HTML',
                    text: this.currentLab.preHTMLSolution
                });
            }
            if (this.currentLab.showJavaScriptEditor) {
                this.tabs.push({
                    title: 'JavaScript',
                    text: this.currentLab.preJavaScriptSolution
                });
            }
            if (this.currentLab.showCSSScriptEditor) {
                this.tabs.push({
                    title: 'CSS',
                    text: this.currentLab.preCSSSolution
                });
            }
            if (this.currentLab.showTypeScriptEditor) {
                this.tabs.push({
                    title: 'TypeScript',
                    text: this.currentLab.preTypeScriptSolution
                });
            }
            if (this.currentLab.showCSharpEditor) {
                this.tabs.push({
                    title: 'C#',
                    text: this.currentLab.preCSharpSolution
                });
            }
        }

        constructor( private lessonService: App.Services.LessonService, private $state: ng.ui.IStateService, private $stateParams: ng.ui.IStateParamsService, private $uibModal: angular.ui.bootstrap.IModalService) {
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

        constructor(
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private testService: App.Services.TestService,
            lab: App.Models.Lab,
            answer
        ) {
            this.testService.submitAnswer(lab, answer).then((result) => {
                this.answerResult = result;
                this.isWorking = false;
            });
        }
    }


    class LessonSuccessDialogController {
        public happyPicture;

        public ok() {
            this.$uibModalInstance.close();
        }

        constructor(
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            lessonService: App.Services.LessonService,
            public lesson
        ) {
            lessonService.postScore(lesson.id);

            let happyPictures = [
                '/images/success/catAndDog.jpg',
                '/images/success/cookie.jpg',
                '/images/success/dog.jpg',
                '/images/success/sundae.jpg'
            ];
            let rnd = Math.floor(Math.random() * happyPictures.length);
            this.happyPicture = happyPictures[rnd];

        }

    }

}