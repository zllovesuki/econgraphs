/**
 * Created by cmakler on 10/27/14.
 */

econgraphs.functions.utility.CobbDouglas = function () {

    return function (params) {

        var alpha, beta, returnsToScale, xProportion, yProportion;

        // Create a monomial of the form u(x,y) = (x^alpha)(y^beta)
        var u = new kg.functions.Monomial({coefficient: 1, powers: [alpha, beta]});

        // Add utility function methods (marginal utility, MRS, etc.)
        u = econgraphs.functions.utility.addUtilityMethods(u, params);

        u.updateParams = function(params) {

            if (typeof params == 'function') {
                params = params();
            }

            // Alpha is the power to which the first (x) variable is raised. Set to 0.5 by default.
            u.alpha = (params && params.hasOwnProperty('alpha')) ? params['alpha'] : 0.5;

            // Beta is the power to which the second (y) variable is raised. Set to 1 - alpha by default.
            u.beta = (params && params.hasOwnProperty('beta')) ? params['beta'] : 1 - u.alpha;

            // A Cobb-Douglas function is constant returns to scale if alpha + beta = 1,
            // diminishing returns to scale if alpha + beta < 1, and increasing returns to scale if alpha + beta > 1.
            returnsToScale = u.alpha + u.beta;

            // A nice feature of Cobb-Douglas functions is that their optimal bundles
            // are characterized by proportional spending on X and Y.
            xProportion = u.alpha / (u.alpha + u.beta),
            yProportion = u.beta / (u.alpha + u.beta);

            u.setPowers([u.alpha, u.beta]);

            return u;

        };

        u.updateParams(params);

        // Find the optimal bundle for a given income and prices
        u._optimalBundle = function (income, px, py) {

            return [xProportion * income / px, yProportion * income / py]
        };

        // Find the lowest possible cost for a given level of utility, given px and py
        u._lowestPossibleCost = function (utility, px, py) {

            return returnsToScale*Math.pow(utility,1/returnsToScale)*Math.pow(px/ u.alpha,xProportion)*Math.pow(py/ u.beta,yProportion);

        };

        u.preferred = {area: function(xDomain,yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            if(u.alpha == 0) {
                return [
                    {x: xDomain.min, y: u.yValue(xDomain.min)},
                    {x: xDomain.min, y: yDomain.max},
                    {x: xDomain.max, y: yDomain.max},
                    {x: xDomain.max, y: u.yValue(xDomain.max)}
                ]
            }

            if(u.beta == 0) {
                return [
                    {x: u.xValue(yDomain.min), y: yDomain.min},
                    {x: xDomain.max, y: yDomain.min},
                    {x: xDomain.max, y: yDomain.max},
                    {x: u.xValue(yDomain.max), y: yDomain.max}
                ]
            }

            var allPoints = d3.merge([u.points(xDomain, yDomain), u.points(xDomain, yDomain, true)]).sort(sortObjects('x'));

            allPoints.push({x: xDomain.max, y: yDomain.max});

            return allPoints;

        }};

        u.dispreferred = {area: function (xDomain, yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            /* This doesn't work yet
            if (u.alpha == 0) {
                return [
                    {x: xDomain.min, y: u.yValue(xDomain.min)},
                    {x: xDomain.min, y: yDomain.max},
                    {x: xDomain.max, y: yDomain.max},
                    {x: xDomain.max, y: u.yValue(xDomain.max)}
                ]
            }

            if (u.beta == 0) {
                return [
                    {x: u.xValue(yDomain.min), y: yDomain.min},
                    {x: xDomain.max, y: yDomain.min},
                    {x: xDomain.max, y: yDomain.max},
                    {x: u.xValue(yDomain.max), y: yDomain.max}
                ]
            }
            */

            var allPoints = d3.merge([u.points(xDomain, yDomain), u.points(xDomain, yDomain, true)]).sort(sortObjects('x'));

            allPoints.push({x: xDomain.max, y: yDomain.min});
            allPoints.push({x: xDomain.min, y: yDomain.min});
            allPoints.push({x: xDomain.min, y: yDomain.max});

            return allPoints;

        }};

        u.mrsOfX = function(bundle) {

            return {points: function (xDomain, yDomain) {

                var points = [];

                var x, y;

                for (var i = 0; i < 51; i++) {

                    x = xDomain.min + (i / 50) * (xDomain.max - xDomain.min);
                    y = u.mrs(x);
                    if (inRange(y, yDomain)) {
                        points.push({x: x, y: y});
                    }
                }
            }
            }


        };



        return u;
    }

}();