/**
 * Created by cmakler on 10/27/14.
 */


// This creates a utility function of the form u(x,y) = min(ax,by)
econgraphs.functions.utility.PerfectComplements = (function () {

    return function (params) {

        var xFunction = new kg.functions.Linear({definitionType: 'standard', a: 1, b: 0, c: 0}),
            yFunction = new kg.functions.Linear({definitionType: 'standard', a: 0, b: 1, c: 0});

        var u = new kg.functions.Min({minimands: [xFunction,yFunction]});

        function ensureValidNumbers() {
            u.level = u.level || 0;
            u.a = u.a || 1;
            u.b = u.b || 1;
        }

        u.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            if (params && params.hasOwnProperty('a')) {
                u.a = params.a;
                u.minimands[0].setCoefficient(1, u.a)
            }

            if (params && params.hasOwnProperty('a')) {
                u.b = params.b;
                u.minimands[1].setCoefficient(2, u.b)
            }
            return u;

        };

        u.updateParams(params);

        // Find the optimal bundle for a given budget constraint
        u._optimalBundle = function (income, px, py) {

            // The highest affordable utility comes when ax = by = highest utility
            var highestUtility = income / ((px/ u.a) + (py / u.b));

            return [highestUtility / u.a, highestUtility / u.b ];
        };

        // Find the lowest possible cost for a given level of utility, given px and py
        u._lowestPossibleCost = function (utility, px, py) {
            return utility * ((px / u.a) + (py / u.b));
        };

        u.xValue = function (y) {
            ensureValidNumbers();
            if (y > u.level / u.b) {
                return u.level / u.a;
            } else {
                return 'undefined';
            }
        };

        u.yValue = function(x) {
            ensureValidNumbers();
            if(x > u.level/ u.a) {
                return u.level / u.b;
            } else {
                return 'undefined';
            }
        };

        u.points = function(xDomain,yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            ensureValidNumbers();
            var critical_x = u.level / u.a,
                critical_y = u.level / u.b;
            if(inRange(critical_x,xDomain) && inRange(critical_y,yDomain)) {
                return [
                    {x: critical_x, y: yDomain.max},
                    {x: critical_x, y: critical_y},
                    {x: xDomain.max, y: critical_y}
                ];
            } else {
                return null;
            }
        };

        u.area = function (xDomain, yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            var points = u.points(xDomain, yDomain);

            points.push({x: xDomain.max, y: yDomain.max});

            return points;

        };

        return econgraphs.functions.utility.addUtilityMethods(u,params);

    }

}());

