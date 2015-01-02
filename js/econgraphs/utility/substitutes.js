/**
 * Created by cmakler on 10/27/14.
 */


econgraphs.functions.utility.PerfectSubstitutes = (function () {

    return function (params) {

        var u = new kg.functions.Linear({

            definitionType: 'standard',
            a: params.a,
            b: params.b,
            c: 0

        });

        u = econgraphs.functions.utility.addUtilityMethods(u, params);

        // Find the optimal bundle for a given budget constraint
        u._optimalBundle = function (income, px, py) {

            var onlyX = [income / px, 0],
                onlyY = [0, income / py],
                mix = [0.5 * income / px, 0.5 * income / py];

            if(u.value(onlyX) > u.value(onlyY)) {
                return onlyX;
            } else if (u.value(onlyY) > u.value(onlyX)) {
                return onlyY;
            } else {
                return mix;
            }

        };

        // Find the lowest possible cost for a given level of utility, given px and py
        // In this case, to obtain U units of utility, this can be done with U/a units of X or U/b units of Y.
        u._lowestPossibleCost = function (utility, px, py) {
            return Math.min(px * utility / u.a(), py * utility / u.b());
        };

        return u;

    }

}());