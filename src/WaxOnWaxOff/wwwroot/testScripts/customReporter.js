var customReporter = {
    specs:[],
 
    specDone: function (result) {
        this.specs.push(result);
    },

    suiteDone: function (result) {
        for (var i = 0; i < this.specs.length; i++) {
            var spec = this.specs[i];
            if (spec.status == 'failed') {
                this.testResults = {
                    isCorrect: false,
                    message: spec.description
                };
                // only return first failure
                return;
            }

        }

        this.testResults =  {
            isCorrect: true
        };
    }

};