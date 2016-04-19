var App;
(function (App) {
    var Models;
    (function (Models) {
        var Answer = (function () {
            function Answer() {
                this.javascript = "";
                this.typescript = "";
                this.html = "";
                this.css = "";
                this.csharp = "";
                this.plain = "";
            }
            return Answer;
        }());
        Models.Answer = Answer;
        var Lab = (function () {
            function Lab() {
                this.labType = 0;
                this.test = "describe('doSomething', function () {\n    it('doSomething() function should exist.', function() {\n        expect(doSomething).not.toBeNull();\n    });\n    it('doSomething() function should return \"Do Something!\"', function() {\n        var result = doSomething();\n        expect(result).toBe(\"Do Something!\");\n    });\n});";
            }
            return Lab;
        }());
        Models.Lab = Lab;
    })(Models = App.Models || (App.Models = {}));
})(App || (App = {}));
//# sourceMappingURL=models.js.map