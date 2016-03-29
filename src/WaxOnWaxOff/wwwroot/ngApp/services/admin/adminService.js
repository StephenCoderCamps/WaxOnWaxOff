var App;
(function (App) {
    var Admin;
    (function (Admin) {
        var Services;
        (function (Services) {
            var LabService = (function () {
                function LabService($resource) {
                    this.LabResource = $resource("/api/labs/:lessonId", null, {
                        list: { url: '/api/labs/list/:lessonId', method: 'GET', isArray: true },
                        testTest: { url: '/api/labs/testTest', method: 'POST' }
                    });
                }
                LabService.prototype.list = function (lessonId) {
                    return this.LabResource.list({ lessonId: lessonId });
                };
                LabService.prototype.testTest = function (test) {
                    return this.LabResource.testTest(test);
                };
                return LabService;
            }());
            Services.LabService = LabService;
            angular.module('App').service('labService', LabService);
        })(Services = Admin.Services || (Admin.Services = {}));
    })(Admin = App.Admin || (App.Admin = {}));
})(App || (App = {}));
//# sourceMappingURL=adminService.js.map