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
            }
            return Lab;
        }());
        Models.Lab = Lab;
    })(Models = App.Models || (App.Models = {}));
})(App || (App = {}));
//# sourceMappingURL=models.js.map