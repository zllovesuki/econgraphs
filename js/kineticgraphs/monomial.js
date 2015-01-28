/* 
 A monomial function is a term of the form c(b1^p1)(b2^p2)...(bn^pn)
 where 'c' is the coefficient, 'bi' is the i'th base, and 'pi' is the i'th power.

 The initializing object, params, should be of the form

 params = {coefficient: (number), bases: (number or array), powers: (number or array)}

 Any of these parameters may be null initially and set later with the setters.
 */


kg.functions.Monomial = (function () {

    return function (params) {

        var m = new kg.functions.Generic;

        // Establish setters
        m.setCoefficient = function (coefficient) {
            m.coefficient = coefficient || 0;
            return m;
        };

        m.setPowers = function (powers) {
            m.powers = powers || m.powers;
            return m;
        };

        // Initialize based on parameters p

        m.setCoefficient(params.coefficient);
        m.setBases(params.bases);
        m.setPowers(params.powers);
        m.setLevel(params.level);

        // Evaluate monomial for a given set of bases. If none are set, use m.bases.

        m.value = function (bases) {

            if (bases) {
                m.setBases(bases);
            }

            var basePowerPairs = Math.min(m.bases.length, m.powers.length);

            var result = m.coefficient;
            for (var t = 0; t < basePowerPairs; t++) {
                result *= Math.pow(m.bases[t], m.powers[t]);
            }

            return result;
        };

        // Return the (x,y) points within the domain [xDomain,yDomain]
        m.points = function (xDomain, yDomain, yIsIndependent) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            var points = [];

            var x, y;

            switch (m.powers.length) {

                case 1:
                    for (var i = 0; i < 51; i++) {

                        if (yIsIndependent) {
                            // Sample 51 points along the Y domain
                            y = yDomain.min + (i / 50) * (yDomain.max - yDomain.min);
                            x = m.xValue(y);
                            if (inRange(x, xDomain)) {
                                points.push({x: x, y: y});
                            }
                        } else {
                            // Sample 51 points along the X domain
                            x = xDomain.min + (i / 50) * (xDomain.max - xDomain.min);
                            y = m.yValue(x);
                            if (inRange(y, yDomain)) {
                                points.push({x: x, y: y});
                            }
                        }
                    }
                    break;

                case 2:
                    for (i = 0; i < 51; i++) {

                        if (yIsIndependent) {

                            // Sample 101 points along the Y domain
                            y = yDomain.min + (i / 50) * (yDomain.max - yDomain.min);
                            x = m.xValue(y);
                            if (inRange(x, xDomain)) {
                                points.push({x: x, y: y});
                            }

                        } else {

                            // Sample 101 points along the X domain
                            x = xDomain.min + (i / 50) * (xDomain.max - xDomain.min);
                            y = m.yValue(x);
                            if(inRange(y,yDomain)) {
                                points.push({x: x, y: y});
                            }

                        }
                    }
            }

            return points;
        };

        // Return the monomial that is the derivative of this monomial
        // with respect to the n'th variable
        m.derivative = function (n) {

            // n is the index of the term; first term by default
            n = n - 1 || 0;

            return new kg.functions.Monomial({

                // the new coefficient is the old coefficient times
                //the power of the variable whose derivative we're taking
                coefficient: m.coefficient * m.powers[n],

                powers: m.powers.map(function (p, index) {
                    if (index == n) {
                        return p - 1;
                    } else {
                        return p
                    }
                }),

                bases: m.bases

            })
        };

        // Return the monomial that solves the function c(b1^p1)(b2^p2) = level for bn
        // For example, to find the level curve where 3(x^2)(y^3) = 6 and express it as y(x), this would return
        // y = [6/(3x^-2)]^(1/3) = [(6/2)^1/3][(x^-2)^1/3] = [(6/2)^1/3][x^-2/3]
        // Note that the indices of the bases in the returned monomial are the same as the original.
        m.levelCurve = function (n, level) {


            // note: level can be a numerical value or an array of bases at which to evaluate the monomial
            if (level) {
                m.setLevel(level);
            }

            // n is the index of the term; first term by default
            n = n - 1 || 0;

            // pn is the power to which the base variable we're solving for is raised
            var pn = m.powers[n];

            if (pn == 0) {
                return null;
            }

            return new kg.functions.Monomial({

                // the coefficient of the new monomial is (level/c)^1/p
                coefficient: Math.pow(m.level / m.coefficient, 1 / pn),

                // each of the powers for the remaining bases is divided by -p
                powers: m.powers.map(function (p, index) {
                    if (index == n) {
                        return 0;
                    } else {
                        return -p / pn;
                    }
                }),

                bases: m.bases

            })

        };

        // returns the y value corresponding to the given x value for m(x,y) = m.level
        m.yValue = function (x, optionalBases) {

            var bases = [x, 1];
            if (optionalBases) {
                bases = bases.concat(optionalBases)
            }
            if (m.levelCurve(2)) {
                return m.levelCurve(2).value(bases);
            }

        };

        // returns the x value corresponding to the given y value for m(x,y) = m.level
        m.xValue = function (y, optionalBases) {

            var bases = [1, y];
            if (optionalBases) {
                bases = bases.concat(optionalBases)
            }
            if (m.levelCurve(1)) {
                return m.levelCurve(1).value(bases);
            }
        };

        return m;

    };


}());