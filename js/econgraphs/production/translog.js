/**
 * Created by cmakler on 1/26/15.
 *
 * Note: this implements the utility function described in http://www.hindawi.com/journals/isrn/2012/608645/
 */

econgraphs.functions.production.Translog = function () {

    function translogTotalCost(q,w,r,coefficients) {

        var logW = Math.log(w),
            logR = Math.log(r);

        var logQ = Math.log(q),
            variables = [
                1, logQ, logW, logR,
                    logQ * logQ, logW * logW, logR * logR,
                    logR * logW, logW * logQ, logR * logQ
            ],
            sum = 0;
        for (var i = 0; i < 10; i++) {
            sum += coefficients[i] * variables[i];
        }
        return Math.exp(sum);
    }

    return function (params) {

        var f = new kg.functions.Generic;

        f.coefficients = [1,1,1,1,1,1,1,1,1,1];

        f.w = 2;

        f.r = 2;

        f.totalCost = {
            points: function (xDomain, yDomain) {

                function totalCostOfOutput(q) {

                    return translogTotalCost(q, f.w, f.r, f.coefficients)

                }

                return functionPoints(totalCostOfOutput, xDomain, yDomain);

            }
        };

        f.marginalCost = {
            points: function (xDomain, yDomain) {

                function marginalCostOfOutput(q) {

                    return translogTotalCost(q+1, f.w, f.r, f.coefficients) - translogTotalCost(q, f.w, f.r, f.coefficients)

                }

                return functionPoints(marginalCostOfOutput, xDomain, yDomain);

            }
        };

        f.averageCost = {
            points: function (xDomain, yDomain) {

                function averageCostOfOutput(q) {

                    if(q == 0) { q = 0.01 } // avoid dividing by zero

                    return translogTotalCost(q, f.w, f.r, f.coefficients)/q

                }

                return functionPoints(averageCostOfOutput, xDomain, yDomain);

            }
        };

        f.updateParams = function(params) {

            var coefficientMeaning = {
                'constant': 0,
                'logQ' : 1,
                'logW' : 2,
                'logR' : 3,
                'logQ2' : 4,
                'logW2' : 5,
                'logR2' : 6,
                'logRlogW' : 7,
                'logQlogW' : 8,
                'logQlogR' : 9
            };

            if (typeof params == 'function') {
                params = params();
            };

            params = params || {};

            for(var term in coefficientMeaning) {
                if (params.hasOwnProperty(term)) {
                    f.coefficients[coefficientMeaning[term]] = params[term];
                }
            }

            if (params.hasOwnProperty('r')) {
                f.r = params.r;
            }

            if (params.hasOwnProperty('w')) {
                f.w = params.w;
            }



            return f;
        };

        return f;
    }

}();