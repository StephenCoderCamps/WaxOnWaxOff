var customReporter = {

    testResults: {
        specs:[]
    },

    specDone: function(result) {
        this.testResults.specs.push(result);
    },

    suiteDone: function (result) {
        this.testResults.bigResult = result;
        console.log(JSON.stringify(this.testResults));
    }

};