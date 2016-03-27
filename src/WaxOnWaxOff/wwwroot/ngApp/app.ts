namespace App {

    let app = angular.module("App", ['ui.ace', "ui.router", "ngResource", 'ui.bootstrap']);

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
                templateUrl: 'ngApp/views/account/login.html',
                controller: App.Controllers.LoginController,
                controllerAs: 'controller'
            });


        $locationProvider.html5Mode(true);
    });

    app.run(($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, accountService: App.Services.AccountService) => {
        $rootScope.$on('$stateChangeStart', function (e, to) {
            console.dir(to);

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