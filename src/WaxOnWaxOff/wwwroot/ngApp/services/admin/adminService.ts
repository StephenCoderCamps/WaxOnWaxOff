namespace App.Admin.Services {


    export class LabService {
        private LabResource;

        public getLab(labId: number) {
            return this.LabResource.get({id:labId});
        }

        public list(lessonId:number) {
            return this.LabResource.list({lessonId:lessonId});
        }

        public save(lab) {
            return this.LabResource.save(lab).$promise;
        }


        public remove(labId) {
            return this.LabResource.delete({id: labId }).$promise;
        }


        public testTest(test) {
            return this.LabResource.testTest(test).$promise;
        }

        constructor($resource: ng.resource.IResourceService) {
            this.LabResource = $resource("/api/labs/:id", null, {
                list: {url:'/api/labs/list/:lessonId', method: 'GET', isArray:true},
                testTest: {url:'/api/labs/testTest', method: 'POST'}
            });
        }
    }

    angular.module('App').service('labService', LabService);

}