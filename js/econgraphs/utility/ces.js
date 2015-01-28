/**
 * Created by cmakler on 1/26/15.
 */

econgraphs.functions.utility.CES = function () {

    return function (params) {

        var u = new kg.functions.Generic;

        u.alpha = 0.5;
        u.r = 0.5;

        u.value = function(bundle) {
            return u.alpha*Math.pow(bundle[0], u.r) + (1- u.alpha)*Math.pow(bundle[1], u.r)
        };

        u.xValue = function(y) {

            var num = u.level - (1- u.alpha)*Math.pow(y, u.r),
                dem = u.alpha;

            return Math.pow(num/dem,1/ u.r);

        };

        u.yValue = function (x) {

            return Math.pow((u.level - u.alpha * Math.pow(x, u.r)) / (1 - u.alpha), 1 / u.r)

        };

        u.points = function(xDomain,yDomain,yIsIndependent) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            var points = [];

            var x, y;

            for (var i = 0.01; i < 51; i++) {

                if (yIsIndependent) {
                    // Sample 51 points along the Y domain
                    y = yDomain.min + (i / 50) * (yDomain.max - yDomain.min);
                    x = u.xValue(y);
                    if (inRange(x, xDomain)) {
                        points.push({x: x, y: y});
                    }
                } else {
                    // Sample 51 points along the X domain
                    x = xDomain.min + (i / 50) * (xDomain.max - xDomain.min);
                    y = u.yValue(x);
                    if (inRange(y, yDomain)) {
                        points.push({x: x, y: y});
                    }
                }
            }

            return points;
        }

        // Add utility function methods (marginal utility, MRS, etc.)
        u = econgraphs.functions.utility.addUtilityMethods(u);

        u.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            if (params) {

                u.alpha = params['alpha'] || u.alpha;
                if(params.hasOwnProperty('substitutability')) {
                    if(params['substitutability']) {

                    }
                }
                u.r = params['r'] - 0.01 || u.r;


                if (u.r == 0) {
                    u.r = 0.01;
                }

            }

            return u;

        };

        u.updateParams(params);

        // Find the optimal bundle for a given income and prices
        u._optimalBundle = function (income, px, py) {

            var s = 1 / (1 - u.r),
                denominator = Math.pow(u.alpha,s)*Math.pow(px, 1-s) + Math.pow(1-u.alpha,s)*Math.pow(py, 1-s),
                optimal_x = income * Math.pow(px/ u.alpha,-s)/denominator,
                optimal_y = income * Math.pow(py/ (1 - u.alpha),-s) / denominator;

            return [optimal_x,optimal_y];
        };

        // Find the lowest possible cost for a given level of utility, given px and py
        u._lowestPossibleCost = function (utility, px, py) {

            return returnsToScale * Math.pow(utility, 1 / returnsToScale) * Math.pow(px / alpha, xProportion) * Math.pow(py / alpha, yProportion);

        };

        return u;
    }

}();