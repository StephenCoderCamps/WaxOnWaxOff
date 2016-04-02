

var _originalConsole = console;
var console = {
    history:[],
    log: function (message) {
        this.history.push(message);
        _originalConsole.log(message);
    },
    dir: function(obj) {
        _originalConsole.dir(obj);
    }
}
window.console = console;


var AngularJSTestHelpers = {

    

    // checks specific element for binding (using mustache or ng-bind)
    hasBinding: function (binding, element) {
        if (!element) {
            return false;
        }
        var matcher = new RegExp('({|\\s|^|\\|)' + binding + '(}|\\s|$|\\|)');
        if (element.getAttribute('ng-bind') == binding) {
            return true;
        }
        return matcher.test(element.innerHTML);
    },

    // checks whether document contains binding anywhere
    hasBindingAnywhere: function (binding) {
        var matcher = new RegExp('({|\\s|^|\\|)' + binding + '(}|\\s|$|\\|)');

        // check for ng-bind
        if (document.querySelector('[ng-bind="' + binding + '"')) {
            return true;
        }
        // check for mustache
        return matcher.test(document.documentElement.innerHTML);
    }
}


var angular = {
    _modules:[],
    module: function (moduleName, dependencies) {
        if (dependencies) {
            this._modules.push({
                _controllers: [],
                _services: [],
                moduleName: moduleName,
                dependencies: dependencies,
                controller: function (controllerName, controllerClass) {
                    this._controllers.push({
                        controllerName: controllerName,
                        controllerClass: controllerClass
                    });
                },
                service: function (serviceName, serviceClass) {
                    this._services.push({
                        serviceName: serviceName,
                        serviceClass: serviceClass
                    });
                }
            })
        } else {
            let match = this._modules.filter(function (module) {
                return module.moduleName == moduleName;
            });
            if (match.length) {
                return match[0];
            }
        }
    }

};

angular.module('MyApp', []);
