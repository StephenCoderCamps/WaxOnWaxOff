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
            }
            return Answer;
        }());
        Models.Answer = Answer;
        var Lab = (function () {
            function Lab() {
                this.labType = 0;
                this.test = "describe('addNumbers', function () {\n    it('should add positive numbers', function() {\n        var result = addNumbers(1,3);\n        expect(result).toBe(4);\n    });\n    it('should add negative numbers', function() {\n        var result = addNumbers(-1,-3);\n        expect(result).toBe(-4);\n    });\n});";
            }
            return Lab;
        }());
        Models.Lab = Lab;
    })(Models = App.Models || (App.Models = {}));
})(App || (App = {}));
//# sourceMappingURL=models.js.map