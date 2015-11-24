module KGMath.Functions {

    export interface CESDefinition extends BaseDefinition {
        coefficient?: any;
        r?: any;
        s?: any;
        alpha?: any;
    }

    export interface ICES extends IBase {
        definition: CESDefinition;
        coefficient: number;
        r: number;
        s: number;
        alpha: number;
        internalPolynomial: Polynomial;
    }

    export class CES extends Base implements ICES {

        public definition;
        public coefficient;
        public r;
        public s;
        public alpha;
        public internalPolynomial:Polynomial;

        constructor(definition:CESDefinition, modelPath?: string) {

            definition = _.defaults(definition,{
                coefficient: 1
            });

            super(definition, modelPath);

            var u = this;

            u.internalPolynomial = new Polynomial({
                termDefs: [
                    {
                        coefficient: definition.alpha,
                        powers: [definition.r, 0]
                    },
                    {
                        coefficient: KG.subtractDefs(1,definition.alpha),
                        powers: [0, definition.r]
                    }
                ]
            },u.modelProperty('internalPolynomial'));

        }

        value(bases) {
            var u = this;
            if(u.r == 0) {
                // improvised Cobb-Douglas
                if(bases) {
                    u.setBases(bases);
                }
                return Math.pow(u.bases[0],u.alpha)*Math.pow(u.bases[1],1-u.alpha);
            }
            return u.coefficient*Math.pow(u.alpha*Math.pow(bases[0],u.r) + (1 - u.alpha)*Math.pow(bases[1],u.r), 1/u.r);
        }

        /* Generic level curve is given by
            (a*x^r + (1-a)y^r)^(1/r) = U
             ax^r + (1-a)y^r = U^r */


        // y(x) = [(U^r - ax^r)/(1-a)]^(1/r)
        // y'(x) = (1/r)[(U^r - ax^r)/(1-a)]^(1/r - 1)(-arx^(x-1)
        yValue(x) {
            var u = this;

            if(u.r == 0) {
                // improvised Cobb-Douglas
                return Math.pow(u.level/Math.pow(x,u.alpha),1/(1-u.alpha));
            }

            var num = Math.pow(u.level,u.r) - u.alpha * Math.pow(x, u.r),
                dem = 1 - u.alpha;

            if(num > 0) {
                return Math.pow(num/dem, 1/u.r);
            } else {
                return null;
            }


        }

        // Returns x value for given y, for a two-dimensional function
        xValue(y) {
            var u = this;

            if(u.r == 0) {
                // improvised Cobb-Douglas
                return Math.pow(u.level/Math.pow(y,1-u.alpha),1/u.alpha);
            }

            var num = Math.pow(u.level,u.r) - (1 - u.alpha)*Math.pow(y, u.r),
                dem = u.alpha;

            if(num > 0) {
                return Math.pow(num/dem,1/u.r);
            } else {
                return null;
            }
        }

        derivative(n) {

            var u = this;

            var d = new Base({});

            d.value = function(bases) {

                if(bases) {
                    d.setBases(bases)
                }

                var common = (u.coefficient/u.r)*Math.pow(u.alpha*Math.pow(bases[0],u.r) + (1 - u.alpha)*Math.pow(bases[1],u.r),(1/u.r)-1);

                if(n==1) {
                    return common*u.alpha*u.r*Math.pow(bases[0],u.r-1);
                } else {
                    return common*(1-u.alpha)*u.r*Math.pow(bases[1],u.r-1);
                }

            };

            return d;

        }

    }

}