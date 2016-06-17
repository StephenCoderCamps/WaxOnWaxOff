namespace App.Admin.Services {


    export class AdminUnitService {
        private UnitResource;

        public listUnits() {
            return this.UnitResource.query();
        }


        public getUnit(id: number) {
            return this.UnitResource.get({ id: id });
        }


        public editUnit(unit) {
            return this.UnitResource.save(unit).$promise;
        }

        public deleteUnit(id: number) {
            return this.UnitResource.delete({ id: id }).$promise;
        }



        constructor($resource: ng.resource.IResourceService) {
            this.UnitResource = $resource('/api/admin/units/:id');
        }
    }

    angular.module('App').service('adminUnitService', AdminUnitService);


    export class AdminLessonService {
        private lessonResource;


        public listLessons(unitId) {
            return this.lessonResource.listLessons({ unitId: unitId });
        }


        public getLesson(id: number) {
            return this.lessonResource.get({ id: id });
        }


        public editLesson(lesson) {
            return this.lessonResource.save(lesson).$promise;
        }

        public deleteLesson(id: number) {
            return this.lessonResource.delete({ id: id }).$promise;
        }

      

        constructor($resource: ng.resource.IResourceService, private $q: ng.IQService, private testService: App.Services.TestService) {
            this.lessonResource = $resource('/api/admin/lessons/:id', null, {
                listLessons: {
                    url: '/api/admin/lessons/listLessons/:unitId', method: 'GET', isArray: true, params: { unitId: '@unitId' }
                }
            });
        }

    }


    angular.module('App').service('adminLessonService', AdminLessonService);



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
            this.LabResource = $resource("/api/admin/labs/:id", null, {
                list: {url:'/api/admin/labs/list/:lessonId', method: 'GET', isArray:true}
            });
        }
    }

    angular.module('App').service('labService', LabService);



    export class AdminService {
        private AdminResource;


        public list() {
            return this.AdminResource.query();
        }



        public save(student) {
            return this.AdminResource.save(student).$promise;
        }



        public remove(studentId) {
            return this.AdminResource.delete({ id: studentId }).$promise;
        }


        constructor($resource: ng.resource.IResourceService) {
            this.AdminResource = $resource("/api/admin/admins/:id");
        }
    }

    angular.module('App').service('adminService', AdminService);



}