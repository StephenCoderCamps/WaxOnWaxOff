namespace App {

    let app = angular.module("App", ['ui.ace', "ui.router", "ngResource", 'ui.bootstrap', 'ngSanitize']);

    app.config((
        $stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider,
        $locationProvider: angular.ILocationProvider) => {

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
            }).state('admin.students', {
                url: '/students',
                templateUrl: '/ngApp/views/admin/students.html',
                controller: App.Admin.Controllers.StudentsController,
                controllerAs: 'controller'
            });



        $locationProvider.html5Mode(true);
    });

    app.run(($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, accountService: App.Services.AccountService) => {
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
}