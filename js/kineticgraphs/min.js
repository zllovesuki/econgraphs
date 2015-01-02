/**
 * Created by cmakler on 10/29/14.
 */

// A min function is constructed with an array of other functions (of any type).
// It returns the minimum value of any of the functions, for the given bases.

kg.functions.Min = (function () {

    return function (params) {

        var m = new kg.functions.Generic(params);

        m.minimands = params.minimands;

        m.value = function (bases) {

            if(bases) {
                m.setBases(bases);
            }

            return Math.min.apply(null, m.minimands.map(function (minimand) {
                return minimand.value(m.bases)
            }))

        };

        // The derivative of a min function is the minimum of the derivative(s) of the component function(s)
        // whose value is the current minimum.

        m.derivative = function (n) {

            var currentMinimumFunctions = [];

            // One or more functions have the current minimum value; create an array of those function(s).
            for (var i = 0; i < m.minimands.length; i++) {
                if (m.value() == m.minimands[i].value()) {
                    currentMinimumFunctions.push(m.minimands[i].derivative(n))
                }
            }

            // If there is a single function with the lowest value, return the derivative of that function.
            if(currentMinimumFunctions.length == 1) {
                return currentMinimumFunctions[0];
            }

            // Otherwise, find the function with the lowest derivative with respect to variable n
            var lowestDerivativeValue = Math.min.apply(null, currentMinimumFunctions.map(function (minimandDerivative) {
                return minimandDerivative.value();
            }));

            // and return that function
            for (var j = 0; j < currentMinimumFunctions.length; j++) {
                if (lowestDerivativeValue == currentMinimumFunctions[j].value()) {
                    return currentMinimumFunctions[j];
                }
            }

        };

        return m;

    };


}());