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
        public answer = new Models.Answer();
        public tabs = [];
        private lessonId;

        private get currentLabIndex():number {
            return parseInt(window.sessionStorage['lesson_' + this.lessonId]) || 0;
        }

        private set currentLabIndex(value) {
            window.sessionStorage['lesson_' + this.lessonId] = value.toString();
        }


        public getProgress(): number {
            if (!this.lesson) {
                return 0;
            }
            return (this.currentLabIndex) * 100 /this.lesson.labs.length;

        }

        public getProgressText(): string {
            if (!this.lesson) {
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
                    case 'ECMAScript':
                        this.answer.typescript = tab.text;
                        break;
                    case 'Answer':
                        this.answer.plain = tab.text;
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
                        this.currentLabIndex = 0;

                        this.lessonService.postScore(this.lesson.id).then(() => {
                            // go to success page
                            this.$window.sessionStorage.setItem('lessonTitle', this.lesson.title);
                            this.$window.sessionStorage.setItem('happyPicture', this.successService.getHappyPicture());
                            this.$state.go('success');
                        });
                        //this.$uibModal.open({
                        //    templateUrl: '/ngApp/dialogs/success.html',
                        //    controller: LessonSuccessDialogController,
                        //    controllerAs: 'modal',
                        //    resolve: {
                        //        lesson: this.lesson
                        //    }
                        //}).result.then(() => {
                        //    this.$state.go('home');
                        //});
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
                    mode: 'html',
                    text: this.currentLab.preHTMLSolution
                });
            }
            if (this.currentLab.showJavaScriptEditor) {
                this.tabs.push({
                    title: 'JavaScript',
                    mode: 'javascript',
                    text: this.currentLab.preJavaScriptSolution
                });
            }
            if (this.currentLab.showCSSScriptEditor) {
                this.tabs.push({
                    title: 'CSS',
                    mode: 'css',
                    text: this.currentLab.preCSSSolution
                });
            }
            if (this.currentLab.showTypeScriptEditor) {
                this.tabs.push({
                    title: 'ECMAScript',
                    mode: 'typescript',
                    text: this.currentLab.preTypeScriptSolution
                });
            }
            if (this.currentLab.showPlainEditor) {
                this.tabs.push({
                    title: 'Answer',
                    mode: null,
                    text: this.currentLab.prePlainSolution
                });
            }
            if (this.currentLab.showCSharpEditor) {
                this.tabs.push({
                    title: 'C#',
                    mode: 'csharp',
                    text: this.currentLab.preCSharpSolution
                });
            }
        }

        constructor(private successService: App.Services.SuccessService,  private $window: ng.IWindowService, private lessonService: App.Services.LessonService, private $state: ng.ui.IStateService, private $stateParams: ng.ui.IStateParamsService, private $uibModal: angular.ui.bootstrap.IModalService) {
            this.lessonId = $stateParams['id'];
            lessonService.getLesson(this.lessonId).$promise.then((result) => {
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

    export class SuccessController {
        public lessonTitle: string;
        public happyPicture: string;

        constructor($window: ng.IWindowService) {
            this.lessonTitle = $window.sessionStorage.getItem('lessonTitle');
            this.happyPicture = $window.sessionStorage.getItem('happyPicture');
        }

    }

}