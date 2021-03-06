/* 
 A monomial function is a term of the form c(b1^p1)(b2^p2)...(bn^pn)
 where 'c' is the coefficient, 'bi' is the i'th base, and 'pi' is the i'th power.

 The initializing object, params, should be of the form

 params = {coefficient: (number), bases: (number or array), powers: (number or array)}

 Any of these parameters may be null initially and set later with the setters.
 */

module KGMath.Functions {

    export interface MonomialDefinition extends BaseDefinition {
        coefficient: any;
        powers: any[];
        bases?: any[];
    }

    export interface IMonomial extends IBase {
        coefficient: number;
        setCoefficient: (coefficient:number) => any;
        powers: number[];
        setPowers: (powers: number[]) => any;
        bases: number[];
        value: (bases?: number[]) => number;
        derivative: (n:number) => Monomial;
        average: (n:number) => Monomial;
        multiply: (x: number) => Monomial;
    }

    export class Monomial extends Base implements IMonomial {

        public coefficient;
        public powers;
        public bases;
        public monomialDefs: any;

        constructor(definition:MonomialDefinition, modelPath?: string) {
            super(definition, modelPath);
            this.monomialDefs = {
                coefficient: definition.coefficient.toString(),
                powers: definition.powers.map(function(p) {return p.toString()})
            };
            this.univariate = (definition.powers.length == 1);
        }

        // Establish setters
        setCoefficient(coefficient) {
            return this.setNumericProperty({
                name: 'coefficient',
                value: coefficient,
                defaultValue: 1
            });
        }

        setPowers(powers) {
            return this.setArrayProperty({
                name: 'powers',
                value: powers,
                defaultValue: []
            });
        }

        // Evaluate monomial for a given set of bases. If none are set, use m.bases.

        value(bases?:any[]) {
            var m = this;
            m.setBases(bases);

            var basePowerPairs = Math.min(m.bases.length, m.powers.length);

            var result = m.coefficient;
            for (var t = 0; t < basePowerPairs; t++) {
                result *= Math.pow(m.bases[t], m.powers[t]);
            }
            return result;
        }

        // Return the monomial that is the derivative of this monomial
        // with respect to the n'th variable
        derivative(n) {

            var m = this;

            // n is the index of the term; first term by default
            n = n - 1 || 0;

            return new Monomial({

                // the new coefficient is the old coefficient times
                //the power of the variable whose derivative we're taking
                coefficient: KG.multiplyDefs(m.monomialDefs.coefficient, m.monomialDefs.powers[n]),

                powers: m.monomialDefs.powers.map(function (p, index) {
                    if (index == n) {
                        return KG.subtractDefs(p,1);
                    } else {
                        return p
                    }
                }),

                bases: m.bases

            })
        }

        // Return the monomial that is the integral of this monomial
        // with respect to the n'th variable, with no constant of integration
        integral(n) {

            var m = this;

            // n is the index of the term; first term by default
            n = n - 1 || 0;

            return new Monomial({

                // the new coefficient is the old coefficient times
                //the power of the variable whose derivative we're taking
                coefficient: KG.divideDefs(m.monomialDefs.coefficient, KG.addDefs(m.monomialDefs.powers[n],1)),

                powers: m.monomialDefs.powers.map(function (p, index) {
                    if (index == n) {
                        return KG.addDefs(p,1);
                    } else {
                        return p
                    }
                }),

                bases: m.bases

            })
        }

        // Return the monomial that reduces the power of the n'th variable by 1
        average(n) {

            var m = this;

            // n is the index of the term; first term by default
            n = n - 1 || 0;

            return new Monomial({

                coefficient: m.monomialDefs.coefficient,

                // reduce the power of the n'th variable by 1
                powers: m.monomialDefs.powers.map(function (p, index) {
                    if (index == n) {
                        return p + " - 1";
                    } else {
                        return p
                    }
                }),

                bases: m.bases

            })
        }

        // Return the monomial that multiplies the coefficient by x
        multiply(x) {

            var m = this;

            // n is the index of the term; first term by default
            x = x || 1;

            return new Monomial({

                // multiply the coefficient by x
                coefficient: "(" + m.monomialDefs.coefficient + ")*(" + x + ")",
                powers: m.monomialDefs.powers,
                bases: m.bases

            })
        }

        // returns the y value corresponding to the given x value for m(x,y) = m.level
        yValue(x) {
            var m = this;
            if(m.powers.length == 1) {
                return m.coefficient * Math.pow(x,m.powers[0]);
            } else {
                return Math.pow(m.level*Math.pow(x,-m.powers[0])/m.coefficient,1/m.powers[1]);
            }

        }

        // returns the x value corresponding to the given y value for m(x,y) = m.level
        xValue(y) {
            var m = this;
            if(this.powers.length == 1) {
                return Math.pow(y/m.coefficient,1/m.powers[0]);
            } else {
                return Math.pow(m.level*Math.pow(y,-m.powers[1])/m.coefficient,1/m.powers[0]);
            }
        }

    }

}