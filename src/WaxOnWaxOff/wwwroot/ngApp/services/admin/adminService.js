var App;
(function (App) {
    var Admin;
    (function (Admin) {
        var Services;
        (function (Services) {
            var LabService = (function () {
                function LabService($resource) {
                    this.LabResource = $resource("/api/labs/:id", null, {
                        list: { url: '/api/labs/list/:lessonId', method: 'GET', isArray: true }
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
            var StudentService = (function () {
                function StudentService($resource) {
                    this.StudentResource = $resource("/api/students/:id", null, {
                        listScores: { url: '/api/students/scores/:id', method: 'GET', isArray: true },
                        toggleAdmin: { url: '/api/students/toggleAdmin/:id', method: 'POST' }
                    });
                }
                StudentService.prototype.getStudent = function (studentId) {
                    return this.StudentResource.get({ id: studentId });
                };
                StudentService.prototype.list = function (match) {
                    if (match === void 0) { match = ''; }
                    return this.StudentResource.query({ match: match });
                };
                StudentService.prototype.listScores = function (studentId) {
                    return this.StudentResource.listScores({ id: studentId });
                };
                StudentService.prototype.save = function (student) {
                    return this.StudentResource.save(student).$promise;
                };
                StudentService.prototype.toggleAdmin = function (studentId) {
                    return this.StudentResource.toggleAdmin({ id: studentId }, {}).$promise;
                };
                StudentService.prototype.remove = function (studentId) {
                    return this.StudentResource.delete({ id: studentId }).$promise;
                };
                return StudentService;
            }());
            Services.StudentService = StudentService;
            angular.module('App').service('studentService', StudentService);
        })(Services = Admin.Services || (Admin.Services = {}));
    })(Admin = App.Admin || (App.Admin = {}));
})(App || (App = {}));
//# sourceMappingURL=adminService.js.map