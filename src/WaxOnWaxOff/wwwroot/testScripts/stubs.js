

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
