

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