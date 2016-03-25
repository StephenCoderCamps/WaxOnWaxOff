var system = require('system');

// get args
var script = system.args[1];
var html = system.args[2];
var additionalJavaScriptFiles = system.args[3];


console.error = function () {
    require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

// create page using html
var page = require('webpage').create();


// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function (msg) {
    console.log(msg);
};

page.onError = function (msg, trace) {
    console.error(msg);
}


phantom.onError = function (msg, trace) {
    console.error(msg);
}

// add html
page.content = html;


// inject Jasmine
page.injectJs('jasmine.js');
page.injectJs('boot.js');
page.injectJs('customReporter.js');


// inject additional JavaScript
if (additionalJavaScriptFiles) {
    var files = additionalJavaScriptFiles.split(',');
    for (var iii = 0; iii < files.length; iii++) {
        page.injectJs(files[iii]);
    }
}

// execute javascript
page.evaluateJavaScript(script);

// report results
var result = page.evaluate(function (done) {
    jasmine.getEnv().addReporter(customReporter);
    jasmine.getEnv().execute();
});


phantom.exit();


   