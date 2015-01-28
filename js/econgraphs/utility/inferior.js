/**
 * Created by cmakler on 1/26/15.
 *
 * Note: this implements the utility function described in http://www.hindawi.com/journals/isrn/2012/608645/
 */

econgraphs.functions.utility.Inferior = function () {

    return function (params) {

        var u = new kg.functions.Generic;

        u.xmin = 10;
        u.ymax = 40;
        u.alpha = 1;
        u.delta = 1;

        u.valueOfX = function(x) {return u.alpha * Math.log(x - u.xmin)};
        u.valueOfY = function(y) {return -(u.alpha + u.delta) * Math.log(u.ymax - y)};

        u.value = function (bundle) {
            return u.valueOfX(bundle[0]) + u.valueOfY(bundle[1]);
        };

        u.xValue = function (y) {

            return u.xmin + Math.exp((u.level - u.valueOfY(y))/ u.alpha);

        };

        u.yValue = function (x) {

            return u.ymax + Math.exp((u.valueOfX(x) - u.level)/(u.alpha + u.delta));

        };

        u.points = function (xDomain, yDomain, yIsIndependent) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            xDomain.min = u.xmin;
            yDomain.max = u.ymax;

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
        };

        // Add utility function methods (marginal utility, MRS, etc.)
        u = econgraphs.functions.utility.addUtilityMethods(u);

        u.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            if (params) {

                u.xmin = params['xmin'] || u.xmin;
                u.ymax = params['ymax'] || u.ymax;
                u.alpha = params['alpha'] || u.alpha;
                u.delta = params['delta'] || u.delta;

            }

            return u;

        };

        u.updateParams(params);

        // Find the optimal bundle for a given income and prices
        u._optimalBundle = function (income, px, py) {

            var extremeBundleCost = income - px* u.xmin - py* u.ymax;

            if(extremeBundleCost < 0) {

                var alpha_1 = u.alpha,
                    alpha_2 = u.alpha + u.delta,
                    beta_1 = alpha_1 / (alpha_2 - alpha_1),
                    beta_2 = alpha_2 / (alpha_2 - alpha_1);

                var optimal_x = u.xmin - beta_1 * extremeBundleCost / px,
                    optimal_y = u.ymax + beta_2 * extremeBundleCost / py;

                return [optimal_x, optimal_y];

                if(optimal_x >= u.xmin && optimal_y > 0) {
                    return [optimal_x, optimal_y];
                }

                // Corner solution if buy no y
                if(optimal_y <= 0) {
                    return [income/px, 0]
                }

                // Corner solution if X is as subsistence level
                if(optimal_x < u.xmin) {
                    return [u.xmin, (income - u.xmin * px)/py]
                }

            }

        };

        // Find the lowest possible cost for a given level of utility, given px and py
        u._lowestPossibleCost = function (utility, px, py) {

            return u.xmin*px + u.ymax*py - 0.25/Math.exp(utility); // TODO This is wrong. Needs more math.

        };

        return u;
    }

}();