//Built using buildjs.py script - do not hand edit

// econgraphs.js
var econgraphs = {functions: {}};

// budget/budget.js
econgraphs.functions.budget = {

    addBudgetMethods: function (b, params) {

        b.prices = b.prices || [];

        b.income = b.income || 0;

        b.bundle = b.bundle || [];

        b.setPrice = function(price, index) {
            b.prices[index] = price;
        };

        b.setPrices = function(prices) {
            b.prices = prices || b.prices;
            return b;
        };

        b.setIncome = function(income) {
            b.income = income || b.income;
            return b;
        };

        b.update = function(params) {
            if(params) {
                b.setPrices(params.prices);
                b.setIncome(params.income);
            }
        };

        // For now, b is a simple multiplication; could be adjusted for volume discounts, etc.
        b.expenditure = function(quantity,price) {
            return quantity * price;
        };

        b.cost = function(bundle,prices) {

            // used store prices (and potentially bundle) if none passed in
            bundle = bundle || b.bundle;
            prices = prices || b.prices;

            var totalCost = 0;

            for(var good=0; good < bundle.length; good++) {
                totalCost += b.expenditure(bundle[good], prices[good])
            }

            return totalCost;
        };

        b.isAffordable = function(bundle,prices,income) {

            // Use stored income if none passed in
            income = income || b.income;

            return (b.cost(bundle, prices) <= income)
        };

        b.area = function(xDomain,yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            var areaPoints = [{x: xDomain.min, y:yDomain.min}];

            var constraintPoints = b.points(xDomain,yDomain).sort(sortObjects('x'));

            if(constraintPoints[0].y == yDomain.max) {
                areaPoints.push({x:xDomain.min, y:yDomain.max});
            }

            if (constraintPoints[1].x == xDomain.max) {
                constraintPoints.push({x: xDomain.max, y: yDomain.min});
            }

            return d3.merge([areaPoints,constraintPoints]);

        };

        b.update(params);

        return b;

    }

};

// budget/simple.js
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

// utility/utility.js
econgraphs.functions.utility = {

    addUtilityMethods: function (u, params) {

        // If utility parameter is included, either as a number or a point,
        // set the level of the function to that utility value (or the utility value of the specified point)
        if (params && params.utility) {
            u.setLevel(params.utility);
        }

        // Functions that can be called for any utility function

        u.setBundle = function (bundle) {
            u.bases = bundle || [];
            return u;
        };

        u.setBudgetConstraint = function(budgetConstraintParams) {
            if(budgetConstraintParams) {
                if (!u.budgetConstraint){
                    u.budgetConstraint = new econgraphs.functions.budget.SimpleBudgetConstraint;
                }
                u.budgetConstraint.update(budgetConstraintParams);
            }
        };

        u.mu = function (bundle, index) {
            bundle = bundle || u.bases;
            return u.derivative(index).value(bundle);
        };

        u.mux = function (bundle) {
            bundle = bundle || u.bases;
            return u.mu(bundle, 1);
        };

        u.muy = function (bundle) {
            bundle = bundle || u.bases;
            return u.mu(bundle, 2);
        };

        u.mrs = function (bundle) {
            bundle = bundle || u.bases;
            if (u.muy(bundle) == 0 || u.mux(bundle) == 'undefined') {
                return 'undefined'
            } else {
                return u.mux(bundle) / u.muy(bundle)
            }
        };

        u.mrsTangentLine = function(bundle) {
            var point = {x: bundle[0], y:bundle[1]},
                slope = -u.mrs(bundle),
                l = new kg.functions.Linear({definitionType:'point-slope', point:point, slope: slope});
            return l;
        };

        u.utility = function(bundle) {
            bundle = bundle || u.bases;
            return u.value([bundle.x,bundle.y])
        };

        u.indirectUtility = function (income,px,py) {

            return u.value(u.optimalBundle(income, px, py));

        };

        // Given two bundles, evaluates whether agent prefers first or second, or is indifferent
        u.bundlePreferred = function(bundles, t) {

            var u1 = u.utility(bundles[0]),
                u2 = u.utility(bundles[1]),
                percentUilityDifference = (u2 - u1)/(0.5*(u1 + u2)),
                tolerance = t || 0.01; // percent difference within which one is thought to be indifferent

            if(percentUilityDifference > tolerance) {
                return 2; //second bundle preferred
            }

            if(percentUilityDifference < -tolerance) {
                return 1; //first bundle preferred
            }

            return 0; //indifferent between two bundles

        };

        // Find the optimal bundle for a given income and prices
        u.optimalBundle = function (income, px, py) {

            if (u.budgetConstraint) {
                income = income || u.budgetConstraint.income;
                px = px || u.budgetConstraint.prices[0];
                py = py || u.budgetConstraint.prices[1];
            }

            return u._optimalBundle(income,px,py);
        };

        // Find the indifferece curve passing through the optimal bundle
        u.optimalIndifferenceCurve = function (income, px, py) {

            return u.setLevel(u.optimalBundle(income,px,py))

        };

        // Find the lowest possible cost for a given level of utility, given px and py
        u.lowestPossibleCost = function (utility, px, py) {

            if (u.budgetConstraint) {
                px = px || u.budgetConstraint.prices[0];
                py = py || u.budgetConstraint.prices[1];
            }

            return u._lowestPossibleCost(utility, px, py);
        };

        // Return the bundle that provides a given level of utility at lowest cost
        u.lowestCostBundle = function (utility,px,py) {

            // set income to lowest necessary to achieve utility
            var income = u.lowestPossibleCost(utility,px,py);
            return u.optimalBundle(income,px,py);

        };

        return u;

    }

};

// utility/cobbdouglas.js
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

            return returnsToScale*Math.pow(utility,1/returnsToScale)*Math.pow(px/alpha,xProportion)*Math.pow(py/alpha,yProportion);

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

// utility/complements.js
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

        u.preferred = {area: function (xDomain, yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            var points = u.points(xDomain, yDomain);

            points.push({x: xDomain.max, y: yDomain.max});

            return points;

        }};

        return econgraphs.functions.utility.addUtilityMethods(u,params);

    }

}());



// utility/substitutes.js
/**
 * Created by cmakler on 10/27/14.
 */


econgraphs.functions.utility.PerfectSubstitutes = (function () {

    return function (params) {

        var u = new kg.functions.Linear({definitionType: 'standard'});

        u = econgraphs.functions.utility.addUtilityMethods(u, params);

        u.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            if(params) {
                u.setCoefficients({a: params.a, b: params.b, c: 0});
            }

            return u;

        };

        u.preferred = {area: function (xDomain, yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            var allPoints = u.points(xDomain, yDomain);

            // TODO: this fails when horizontal
            allPoints.push({x: xDomain.max, y: yDomain.min});
            allPoints.push({x: xDomain.max, y: yDomain.max});
            allPoints.push({x: xDomain.min, y: yDomain.max});

            return allPoints;

        }};

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

