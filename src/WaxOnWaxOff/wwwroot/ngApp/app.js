var App;
(function (App) {
    var app = angular.module("App", ['ui.ace', "ui.router", "ngResource", 'ui.bootstrap']);
    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
            url: '/',
            templateUrl: 'ngApp/views/home.html',
            controller: App.Controllers.HomeController,
            controllerAs: 'controller'
        })
            .state('lesson', {
            url: '/lesson/:id',
            templateUrl: 'ngApp/views/lesson.html',
            controller: App.Controllers.LessonController,
            controllerAs: 'controller'
        });
        $locationProvider.html5Mode(true);
    });
})(App || (App = {}));
//# sourceMappingURL=app.js.map