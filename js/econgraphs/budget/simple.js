/**
 * Created by cmakler on 10/30/14.
 */

econgraphs.functions.budget.SimpleBudgetConstraint = function () {

    return function (params) {

        // create linear function I - PxX - PyY; this must be positive in order for the constraint to be met.
        var b = new kg.functions.Linear({definitionType: 'standard'});

        b.updateParams = function(params) {

            if(typeof params == 'function') {
                params = params();
            }

            params = params || {income: 0, prices: [0,0]};

            var px = parseFloat(params.px || params.prices[0]),
                py = parseFloat(params.py || params.prices[1]),
                income = parseFloat(params.income);

            b.setCoefficients({a: -px, b: -py, c: income});

            return b;

        };

        b.updateParams(params);

        return econgraphs.functions.budget.addBudgetMethods(b, params);
    }

}();