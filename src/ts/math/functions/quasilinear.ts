/* 
 A Quasilinear function is a term of the form ax^b + cy^d + ...

 The initializing object, params, should be of the form

 { coefficients: [a,c,...], powers: [b,c,...] }

 */

module KGMath.Functions {

    export interface QuasilinearDefinition extends BaseDefinition {
        coefficients: any[];
        powers: any[];
        bases?: any[];
    }

    export interface IQuasilinear extends IBase {
        coefficients: number[];
        setCoefficients: (coefficients:number[]) => any;
        powers: number[];
        setPowers: (powers: number[]) => any;
        bases: number[];
        value: (bases?: number[]) => number;
        derivative: (n:number) => Monomial;
        average: (n:number) => Polynomial;
        multiply: (x: number) => Quasilinear;
    }

    export class Quasilinear extends Base implements IQuasilinear {

        public coefficients;
        public powers;
        public bases;
        public quasilinearDefs: any;

        constructor(definition:QuasilinearDefinition, modelPath?: string) {
            this.quasilinearDefs = {
                coefficients: definition.coefficients.map(function(c) {return c.toString()}),
                powers: definition.powers.map(function(p) {return p.toString()})
            };
            super(definition, modelPath);
        }

        // Establish setters
        setCoefficients(coefficients) {
            return this.setArrayProperty({
                name: 'coefficients',
                value: coefficients,
                defaultValue: []
            });
        }

        setPowers(powers) {
            return this.setArrayProperty({
                name: 'powers',
                value: powers,
                defaultValue: []
            });
        }

        // Evaluate Quasilinear for a given set of bases. If none are set, use q.bases.

        value(bases?:any[]) {
            var q = this;

            q.setBases(bases);

            var basePowerPairs = Math.min(q.bases.length, q.powers.length, q.coefficients.length);

            var result = 0;
            for (var t = 0; t < basePowerPairs; t++) {
                result += q.coefficients[t]*Math.pow(q.bases[t], q.powers[t]);
            }
            return result;
        }

        // Return the Quasilinear that is the derivative of this Quasilinear
        // with respect to the n'th variable
        derivative(n) {

            var q = this;

            // n is the index of the term; first term by default
            n = n - 1 || 0;

            return new Monomial({

                // the new coefficient is the old coefficient times
                //the power of the variable whose derivative we're taking
                coefficient: KG.multiplyDefs(q.quasilinearDefs.coefficients[n], q.quasilinearDefs.powers[n]),

                powers: [KG.subtractDefs(q.quasilinearDefs.powers[n],1)],

                bases: q.bases ? [q.bases[n]] : []

            })
        }

        // Return the Polynomial that is the integral of this Quasilinear
        // with respect to the n'th variable, with no constant of integration
        integral(n) {

            var q = this;

            // n is the index of the term; first term by default
            n = n - 1 || 0;

            return new Polynomial({

                termDefs: [] //TODO add this in

            })
        }

        // Return the Quasilinear that reduces the power of the n'th variable by 1
        average(n) {

            var q = this;

            // n is the index of the term; first term by default
            n = n - 1 || 0;

            return new Polynomial({

                termDefs: [] // TODO add this in

            })
        }

        // Return the Quasilinear that multiplies the coefficient by x
        multiply(x) {

            var q = this;

            x = x || 1;

            return new Quasilinear({

                // multiply each coefficient by x
                coefficients: q.quasilinearDefs.coefficients.map(function(c) { return KG.multiplyDefs(c,x)}),
                powers: q.quasilinearDefs.powers,
                bases: q.bases

            })
        }

        // returns the y value corresponding to the given x value for m(x,y) = m.level
        yValue(x) {
            var q = this;
            var cyToTheD = q.level - q.coefficients[0]*Math.pow(x,q.powers[0]);
            if(cyToTheD > 0) {
                return Math.pow(cyToTheD/q.coefficients[1],1/q.powers[1])
            } else {
                return null;
            }

        }

        // returns the x value corresponding to the given y value for m(x,y) = m.level
        xValue(y) {
            var q = this;
            var axToTheB = q.level - q.coefficients[1]*Math.pow(y,q.powers[1]);
            if(axToTheB > 0) {
                return Math.pow(axToTheB/q.coefficients[0],1/q.powers[0])
            } else {
                return null;
            }
        }

    }

}