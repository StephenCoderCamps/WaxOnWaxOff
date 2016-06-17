var App;
(function (App) {
    var Admin;
    (function (Admin) {
        var Services;
        (function (Services) {
            var AdminUnitService = (function () {
                function AdminUnitService($resource) {
                    this.UnitResource = $resource('/api/admin/units/:id');
                }
                AdminUnitService.prototype.listUnits = function () {
                    return this.UnitResource.query();
                };
                AdminUnitService.prototype.getUnit = function (id) {
                    return this.UnitResource.get({ id: id });
                };
                AdminUnitService.prototype.editUnit = function (unit) {
                    return this.UnitResource.save(unit).$promise;
                };
                AdminUnitService.prototype.deleteUnit = function (id) {
                    return this.UnitResource.delete({ id: id }).$promise;
                };
                return AdminUnitService;
            }());
            Services.AdminUnitService = AdminUnitService;
            angular.module('App').service('adminUnitService', AdminUnitService);
            var AdminLessonService = (function () {
                function AdminLessonService($resource, $q, testService) {
                    this.$q = $q;
                    this.testService = testService;
                    this.lessonResource = $resource('/api/admin/lessons/:id', null, {
                        listLessons: {
                            url: '/api/admin/lessons/listLessons/:unitId', method: 'GET', isArray: true, params: { unitId: '@unitId' }
                        }
                    });
                }
                AdminLessonService.prototype.listLessons = function (unitId) {
                    return this.lessonResource.listLessons({ unitId: unitId });
                };
                AdminLessonService.prototype.getLesson = function (id) {
                    return this.lessonResource.get({ id: id });
                };
                AdminLessonService.prototype.editLesson = function (lesson) {
                    return this.lessonResource.save(lesson).$promise;
                };
                AdminLessonService.prototype.deleteLesson = function (id) {
                    return this.lessonResource.delete({ id: id }).$promise;
                };
                return AdminLessonService;
            }());
            Services.AdminLessonService = AdminLessonService;
            angular.module('App').service('adminLessonService', AdminLessonService);
            var LabService = (function () {
                function LabService($resource) {
                    this.LabResource = $resource("/api/admin/labs/:id", null, {
                        list: { url: '/api/admin/labs/list/:lessonId', method: 'GET', isArray: true }
                    });
                }
                LabService.prototype.getLab = function (labId) {
                    return this.LabResource.get({ id: labId });
                };
                LabService.prototype.list = function (lessonId) {
                    return this.LabResource.list({ lessonId: lessonId });
                };
                LabService.prototype.save = function (lab) {
                    return this.LabResource.save(lab).$promise;
                };
                LabService.prototype.remove = function (labId) {
                    return this.LabResource.delete({ id: labId }).$promise;
                };
                return LabService;
            }());
            Services.LabService = LabService;
            angular.module('App').service('labService', LabService);
            var AdminService = (function () {
                function AdminService($resource) {
                    this.AdminResource = $resource("/api/admin/admins/:id");
                }
                AdminService.prototype.list = function () {
                    return this.AdminResource.query();
                };
                AdminService.prototype.save = function (student) {
                    return this.AdminResource.save(student).$promise;
                };
                AdminService.prototype.remove = function (studentId) {
                    return this.AdminResource.delete({ id: studentId }).$promise;
                };
                return AdminService;
            }());
            Services.AdminService = AdminService;
            angular.module('App').service('adminService', AdminService);
        })(Services = Admin.Services || (Admin.Services = {}));
    })(Admin = App.Admin || (App.Admin = {}));
})(App || (App = {}));
//# sourceMappingURL=adminService.js.map