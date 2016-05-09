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


       

        constructor($resource: ng.resource.IResourceService) {
            this.LabResource = $resource("/api/labs/:id", null, {
                list: {url:'/api/labs/list/:lessonId', method: 'GET', isArray:true}
            });
        }
    }

    angular.module('App').service('labService', LabService);



    export class StudentService {
        private StudentResource;

        public getStudent(studentId: string) {
            return this.StudentResource.get({ id: studentId });
        }

        public list(match:string = '') {
            return this.StudentResource.query({ match: match });
        }


        public listScores(studentId) {
            return this.StudentResource.listScores({id:studentId});
        }

        public save(student) {
            return this.StudentResource.save(student).$promise;
        }

        public toggleAdmin(studentId: string) {
            return this.StudentResource.toggleAdmin({ id: studentId }, {}).$promise;
        }


        public remove(studentId) {
            return this.StudentResource.delete({ id: studentId }).$promise;
        }


        constructor($resource: ng.resource.IResourceService) {
            this.StudentResource = $resource("/api/students/:id", null, {
                listScores: { url: '/api/students/scores/:id', method: 'GET', isArray: true },
                toggleAdmin: { url: '/api/students/toggleAdmin/:id', method: 'POST'}
            });
        }
    }

    angular.module('App').service('studentService', StudentService);



}