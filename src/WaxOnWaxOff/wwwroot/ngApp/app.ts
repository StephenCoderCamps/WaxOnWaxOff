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
            });


        $locationProvider.html5Mode(true);
    });

    //app.run(($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, accountService: App.Services.AccountService) => {
    //    $rootScope.$on('$stateChangeStart', function (e, to) {

    //        // protect admin views
    //        if (to.data && to.data.isAdmin) {
    //            if (!accountService.getClaim('isAdmin')) {
    //                e.preventDefault();
    //                $state.go('login');
    //            }
    //        }

    //        // protect non-public views
    //        if (!to.data || !to.data.isPublic) {
    //            if (!accountService.isLoggedIn()) {
    //                e.preventDefault();
    //                $state.go('login');
    //            }
    //        }
    //    });
    //});
}