var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var AccountController = (function () {
            function AccountController(accountService, $location) {
                var _this = this;
                this.accountService = accountService;
                this.$location = $location;
                this.getExternalLogins().then(function (results) {
                    _this.externalLogins = results;
                });
            }
            AccountController.prototype.getUserName = function () {
                return this.accountService.getUserName();
            };
            AccountController.prototype.getClaim = function (type) {
                return this.accountService.getClaim(type);
            };
            AccountController.prototype.isLoggedIn = function () {
                return this.accountService.isLoggedIn();
            };
            AccountController.prototype.logout = function () {
                this.accountService.logout();
                this.$location.path('/login');
            };
            AccountController.prototype.getExternalLogins = function () {
                return this.accountService.getExternalLogins();
            };
            return AccountController;
        }());
        Controllers.AccountController = AccountController;
        angular.module('App').controller('AccountController', AccountController);
        var LoginController = (function () {
            function LoginController(accountService, $location) {
                this.accountService = accountService;
                this.$location = $location;
            }
            LoginController.prototype.login = function () {
                var _this = this;
                this.accountService.login(this.loginUser).then(function () {
                    _this.$location.path('/');
                }).catch(function (results) {
                    _this.validationMessages = results;
                });
            };
            return LoginController;
        }());
        Controllers.LoginController = LoginController;
        var RegisterController = (function () {
            function RegisterController(accountService, $location) {
                this.accountService = accountService;
                this.$location = $location;
            }
            RegisterController.prototype.register = function () {
                var _this = this;
                this.accountService.register(this.registerUser).then(function () {
                    _this.$location.path('/');
                }).catch(function (results) {
                    _this.validationMessages = results;
                });
            };
            return RegisterController;
        }());
        Controllers.RegisterController = RegisterController;
        var ExternalRegisterController = (function () {
            function ExternalRegisterController(accountService, $location) {
                this.accountService = accountService;
                this.$location = $location;
            }
            ExternalRegisterController.prototype.register = function () {
                var _this = this;
                this.accountService.registerExternal(this.registerUser.email)
                    .then(function (result) {
                    _this.$location.path('/');
                }).catch(function (result) {
                    _this.validationMessages = result;
                });
            };
            return ExternalRegisterController;
        }());
        Controllers.ExternalRegisterController = ExternalRegisterController;
        var ConfirmEmailController = (function () {
            function ConfirmEmailController(accountService, $http, $stateParams, $location) {
                var _this = this;
                this.accountService = accountService;
                this.$http = $http;
                this.$stateParams = $stateParams;
                this.$location = $location;
                var userId = $stateParams['userId'];
                var code = $stateParams['code'];
                accountService.confirmEmail(userId, code)
                    .then(function (result) {
                    _this.$location.path('/');
                }).catch(function (result) {
                    _this.validationMessages = result;
                });
            }
            return ConfirmEmailController;
        }());
        Controllers.ConfirmEmailController = ConfirmEmailController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=accountController.js.map