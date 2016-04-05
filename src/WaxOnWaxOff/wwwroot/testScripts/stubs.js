

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
    },

    STRIP_COMMENTS: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
    ARGUMENT_NAMES: /([^\s,]+)/g,

    getParamNames:function(func) {
        var fnStr = func.toString().replace(this.STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(this.ARGUMENT_NAMES);
        if(result === null)
            result = [];
        return result;
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
                },
                config: function (func) {
                    this._configureFunc = func;
                }
            })
        } 
        let match = this._modules.filter(function (module) {
            return module.moduleName == moduleName;
        });
        if (match.length) {
            return match[0];
        }
        
    }

};

angular.module('MyApp', []);


let mockStateProvider = {
    _states: {},
    state: function (stateName, stateOptions) {
        this._states[stateName] = stateOptions;
        return mockStateProvider;
    },

    getState:function(stateName) {
        return this._states[stateName] || null;
    }
};


let mockUrlRouterProvider = {

    otherwise: function (otherwise) {
        this._otherwise = otherwise;
    }

};


let mockLocationProvider = {
    html5Mode: function (enable) {
        this._enable = enable;
    }
};


let mockPromise = {
    then: function (thenFunc) {
        this._thenFunc = thenFunc;
    }
};
mockPromise['catch'] = function (catchFunc) {
    this._catchFunc = catchFunc;
};



let mockHttp = {
    get: function (url) {
        this._getUrl = url;
        return mockPromise;
    },

    post: function (url, data) {
        this._postUrl = url;
        this._postData = data;
        return mockPromise;
    }
};


let mockResource = {
    query: function() {
        this._queryCalled = true;
        return 'RESOURCE_QUERY';
    },
    get: function (parameters) {
        this._getCalled = true;
        this._getParameters = parameters;
        return 'RESOURCE_GET';
    },

    save: function (data) {
        this._saveCalled = true;
        return 'RESOURCE_SAVE';
    },

    remove: function (parameters) {
        this._deleteCalled;
        return 'RESOURCE_REMOVE';
    }
};

mockResource['delete'] = function (parameters) {
    this._deleteCalled = true;
    return 'RESOURCE_REMOVE';
}


function mockResourceFactory(url) {
    mockResourceFactory._url = url;
    return mockResource;
}

