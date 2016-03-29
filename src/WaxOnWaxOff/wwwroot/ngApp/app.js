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
        })
            .state('login', {
            url: '/login',
            templateUrl: '/ngApp/views/account/login.html',
            controller: App.Controllers.LoginController,
            controllerAs: 'controller'
        })
            .state('admin', {
            abstract: true,
            url: '/admin',
            templateUrl: 'ngApp/views/admin/admin.html'
        })
            .state('admin.lessons', {
            url: '/lessons',
            templateUrl: '/ngApp/views/admin/lessons.html',
            controller: App.Admin.Controllers.LessonsControllers,
            controllerAs: 'controller'
        }).state('admin.labs', {
            url: '/labs/:lessonId',
            templateUrl: '/ngApp/views/admin/labs.html',
            controller: App.Admin.Controllers.LabsController,
            controllerAs: 'controller'
        }).state('admin.editLab', {
            url: '/lab/:lessonId/:labId',
            templateUrl: '/ngApp/views/admin/editLab.html',
            controller: App.Admin.Controllers.LabEditController,
            controllerAs: 'controller'
        });
        $locationProvider.html5Mode(true);
    });
    app.run(function ($rootScope, $state, accountService) {
        $rootScope.$on('$stateChangeStart', function (e, to) {
            // protect non-public views
            if (to.name !== 'login') {
                if (!accountService.isLoggedIn()) {
                    e.preventDefault();
                    $state.go('login');
                }
            }
        });
    });
})(App || (App = {}));
//# sourceMappingURL=app.js.map