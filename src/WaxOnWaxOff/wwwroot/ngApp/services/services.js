var App;
(function (App) {
    var Services;
    (function (Services) {
        var LessonService = (function () {
            function LessonService($resource) {
                this.lessonResource = $resource('/api/lessons/:id', null, {
                    submitAnswer: {
                        url: '/api/lessons/submitAnswer/:id', method: 'POST', params: { id: '@id' } }
                });
            }
            LessonService.prototype.submitAnswer = function (labId, answer) {
                return this.lessonResource.submitAnswer({ id: labId }, answer).$promise;
            };
            LessonService.prototype.listLessons = function () {
                return this.lessonResource.query();
            };
            LessonService.prototype.getLesson = function (id) {
                return this.lessonResource.get({ id: id });
            };
            LessonService.prototype.editLesson = function (lesson) {
                return this.lessonResource.save(lesson).$promise;
            };
            LessonService.prototype.deleteLesson = function (id) {
                return this.lessonResource.delete({ id: id }).$promise;
            };
            return LessonService;
        }());
        Services.LessonService = LessonService;
        angular.module('App').service('lessonService', LessonService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=services.js.map