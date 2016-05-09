namespace App {

    let app = angular.module("App", ['ui.ace', "ui.router", "ngResource", 'ui.bootstrap', 'ngSanitize', 'ng.deviceDetector']);

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
            .state('register', {
                url: '/register',
                templateUrl: '/ngApp/views/account/register.html',
                controller: App.Controllers.RegisterController,
                controllerAs: 'controller'
            })
            .state('badBrowser', {
                url: '/badBrowser',
                templateUrl: '/ngApp/views/badBrowser.html'
            })
            .state('success', {
                url: '/success',
                templateUrl: '/ngApp/views/success.html',
                controller: App.Controllers.SuccessController,
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
                controller: App.Admin.Controllers.LessonsController,
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

    app.run(($window: ng.IWindowService, $rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, accountService: App.Services.AccountService, deviceDetector) => {


        // security
        $rootScope.$on('$stateChangeStart', function (e, to) {

            // this app only works for chrome
            if (to.name != 'badBrowser') {
                let browser = deviceDetector.browser;
                if (browser != 'chrome') {
                    $state.go('badBrowser');
                    e.preventDefault();
                }
            }



            // protect non-public views
            if (['login', 'register', 'badBrowser'].indexOf(to.name) == -1) {
                if (!accountService.isLoggedIn()) {
                    e.preventDefault();
                    $window.sessionStorage.setItem('originalUrl', $window.location.pathname);
                    $state.go('login');
                }
            }

            // protect admin views
            if (to.name.substring(0, 'admin.'.length) == 'admin.' ) {
                if (!accountService.getClaim('isAdmin')) {
                    e.preventDefault();
                    $state.go('login');
                }
            }


        });
    });
}