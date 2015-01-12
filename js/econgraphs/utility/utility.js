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