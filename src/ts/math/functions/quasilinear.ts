/* 
 A Quasilinear function is a term of the form ax^b + cy^d + ...

 The initializing object, params, should be of the form

 { coefficients: [a,c,...], powers: [b,c,...] }

 */

module KGMath.Functions {

    export interface QuasilinearDefinition extends BaseDefinition {
        coefficients: any[];
        bases?: any[];
    }

    export interface IQuasilinear extends IBase {
        coefficients: number[];
        setCoefficients: (coefficients:number[]) => any;
        bases: number[];
        value: (bases?: number[]) => number;
        derivative: (n:number) => Monomial;
        average: (n:number) => Polynomial;
        multiply: (x: number) => Quasilinear;
    }


    export class Quasilinear extends Base implements IQuasilinear {

        public coefficients;
        public bases;
        public coefficientDefs: any;

        constructor(definition:QuasilinearDefinition, modelPath?: string) {
            this.coefficientDefs = definition.coefficients.map(function(c) {return c.toString()});
            super(definition, modelPath);
        }

        // Establish setters
        setCoefficients(coefficients) {
            return this.setArrayProperty({
                name: 'coefficients',
                value: coefficients,
                defaultValue: [1,1]
            });
        }

        // Evaluate Quasilinear for a given set of bases. If none are set, use q.bases.

        value(bases?:any[]) {
            var q = this;

            q.setBases(bases);

            return q.coefficients[0]*Math.log(bases[0]) + q.coefficients[1]*bases[1];
        }

        // Return the Quasilinear that is the derivative of this Quasilinear
        // with respect to the n'th variable
        derivative(n) {

            var q = this;

            if(n==2) {
                return new Monomial({
                    coefficient: q.coefficientDefs[1],
                    powers: [0],
                    bases: []
                })
            } else {
                return new Monomial({
                    coefficient: q.coefficientDefs[0],
                    powers: [-1],
                    bases: q.bases ? q.bases[0] : []
                })
            }

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
                coefficients: q.coefficientDefs.map(function(c) { return KG.multiplyDefs(c,x)}),
                bases: q.bases

            })
        }

        // returns the y value corresponding to the given x value for q(x,y) = q.level
        // a*logx + by = L => y = (L - a*logx)/b
        yValue(x) {
            var q = this;
            var by = q.level - q.coefficients[0]*Math.log(x);
            if(by > 0) {
                return by/q.coefficients[1]
            } else {
                return null;
            }

        }

        // returns the x value corresponding to the given y value for m(x,y) = m.level
        // a*logx + by = L => x = exp[(L - by)/a]
        xValue(y) {
            var q = this;
            var alogx = q.level - q.coefficients[1]*y;
            return Math.exp(alogx/q.coefficients[0]);
        }

    }

}