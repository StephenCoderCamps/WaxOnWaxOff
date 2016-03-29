namespace App.Services {

    export class LessonService {
        private lessonResource;


        public submitAnswer(labId:number, answer) {
            return this.lessonResource.submitAnswer({ id: labId }, answer).$promise;
        }

        public listLessons() {
            return this.lessonResource.query();
        }


        public getLesson(id:number) {
            return this.lessonResource.get({id:id});
        }


        public editLesson(lesson) {
            return this.lessonResource.save(lesson).$promise;
        }

        public deleteLesson(id: number) {
            return this.lessonResource.delete({ id: id }).$promise;
        }


        constructor($resource: ng.resource.IResourceService) {
            this.lessonResource = $resource('/api/lessons/:id', null, {
                submitAnswer: {
                    url: '/api/lessons/submitAnswer/:id', method: 'POST', params: { id: '@id'}}
            });
        }

    }


    angular.module('App').service('lessonService', LessonService);

}