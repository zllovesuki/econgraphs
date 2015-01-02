/* 
A polynomial function is an array of monomial functions.
Its value is the sum of its component functions.
Its derivative is the array of the derivatives of its component functions.
*/

kg.functions.Polynomial = (function() {

    return function(params) {

        // Each element of the params array should be a monomial or a monomial definition.
        function createTerm(term_def) {
            if(term_def instanceof kg.functions.Monomial) {
                return term_def
            } else {
                return new kg.functions.Monomial(term_def)
            }
        }

        // Initialize the object by mapping the params array onto an array of monomial objects
        var p = new kg.functions.Generic(params);

        p.terms = params.map(createTerm);

        // Append a new term to the polynomial
        p.appendTerm = function(term_def) {
            p.terms.push(createTerm(term_def));
            return p;
        };

        // The coefficients and powers of each monomial may be get and set via the monomial's index
        p.setCoefficient = function(n, coefficient) {
            p.terms[n-1].setCoefficient(coefficient);
            return p;
        };

        p.setPowers = function(n, powers) {
            p.terms[n-1].setPowers(powers);
            return p;
        };

        // The value of a polynomial is the sum of the values of its monomial terms
        p.value = function(bases) {

            p = p.setBases(bases);
            
            var result = 0;
            for(var i=0; i<p.terms.length; i++) {
                result += p.terms[i].value(p.bases);
            }
            return result;
        };

        // The derivative of a polynomial is a new polynomial, each of whose terms is the derivative of the original polynomial's terms
        p.derivative = function(n) {
            return new kg.functions.Polynomial(p.terms.map(
                function(term) { return term.derivative(n)}
            ));
        };

        return p;

    }
}());