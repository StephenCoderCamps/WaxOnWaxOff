namespace App.Admin.Services {


    export class LabService {
        private LabResource;


        public list(lessonId:number) {
            return this.LabResource.list({lessonId:lessonId});
        }

        public testTest(test) {
            return this.LabResource.testTest(test);
        }

        constructor($resource: ng.resource.IResourceService) {
            this.LabResource = $resource("/api/labs/:lessonId", null, {
                list: {url:'/api/labs/list/:lessonId', method: 'GET', isArray:true},
                testTest: {url:'/api/labs/testTest', method: 'POST'}
            });
        }
    }

    angular.module('App').service('labService', LabService);

}