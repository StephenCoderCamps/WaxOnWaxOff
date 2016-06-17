namespace App {

    let app = angular.module("App", ['ui.ace', "ui.router", "ngResource", 'ui.bootstrap', 'ngSanitize', 'ng.deviceDetector']);

    app.config((
        $stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider,
        $locationProvider: angular.ILocationProvider) => {

        $urlRouterProvider.otherwise('/');

        $stateProvider
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
            .state('badBrowser', {
                url: '/badBrowser',
                templateUrl: '/ngApp/views/badBrowser.html'
            })
            .state('coderCampsOnly', {
                url: '/coderCampsOnly',
                templateUrl: '/ngApp/views/coderCampsOnly.html'
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
            .state('admin.units', {
                url: '/',
                templateUrl: '/ngApp/views/admin/units.html',
                controller: App.Admin.Controllers.UnitsController,
                controllerAs: 'controller'
            })
            .state('admin.lessons', {
                url: '/units/:unitId/lessons',
                templateUrl: '/ngApp/views/admin/lessons.html',
                controller: App.Admin.Controllers.LessonsController,
                controllerAs: 'controller'
            })
            .state('admin.labs', {
                url: '/labs/:lessonId',
                templateUrl: '/ngApp/views/admin/labs.html',
                controller: App.Admin.Controllers.LabsController,
                controllerAs: 'controller'
            }).state('admin.editLab', {
                url: '/lab/:lessonId/:labId',
                templateUrl: '/ngApp/views/admin/editLab.html',
                controller: App.Admin.Controllers.LabEditController,
                controllerAs: 'controller'
            }).state('admin.admins', {
                url: '/admins',
                templateUrl: '/ngApp/views/admin/admins.html',
                controller: App.Admin.Controllers.AdminsController,
                controllerAs: 'controller'
            });


        $urlRouterProvider.otherwise('/coderCampsOnly');
        $locationProvider.html5Mode(true);
    });

    app.run(($window: ng.IWindowService, $rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, accountService: App.Services.AccountService, deviceDetector, $location: ng.ILocationService) => {


        // security
        $rootScope.$on('$stateChangeStart', function (e, to) {

            // prevent infinite loop
            if (['login', 'badBrowser', 'coderCampsOnly'].indexOf(to.name) > -1) {
                return;
            }


            // this app only works for chrome
            let browser = deviceDetector.browser;
            if (browser != 'chrome') {
                $state.go('badBrowser');
                e.preventDefault();
                return;
            }


            // if going to admin view then better be an admin, otherwise, better have a student id
            if (to.name.substring(0, 'admin.'.length) == 'admin.') {
                if (!accountService.isLoggedIn()) {
                    e.preventDefault();
                    $state.go('login');
                }
                return;
            }


            // check for student id/secret
            let studentId = $window.sessionStorage.getItem('studentId');
            if (!studentId) {
                let studentId = $location.search().studentid;
                let secret = $location.search().secret;

                if (!studentId || !secret) {
                    e.preventDefault();
                    $state.go('coderCampsOnly');
                } else {
                    $window.sessionStorage.setItem('studentId', studentId);
                    $window.sessionStorage.setItem('secret', secret);
                }
            }



 

        });
    });



    angular.module('App').factory('authInterceptor', (
        $q: ng.IQService,
        $window: ng.IWindowService,
        $location: ng.ILocationService
    ) =>
        ({
            request: function (config) {
                config.headers = config.headers || {};
                config.headers['X-Requested-With'] = 'XMLHttpRequest';
                config.headers['X-StudentId'] = $window.sessionStorage.getItem('studentId');
                config.headers['X-Secret'] = $window.sessionStorage.getItem('secret');
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401 || rejection.status === 403) {
                    $location.path('/coderCampsOnly');
                }
                return $q.reject(rejection);
            }
        })
    );

    angular.module('App').config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });



}