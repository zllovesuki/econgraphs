module KGMath.Simulations {

    export interface TwoCorrelatedDefinition extends BaseDefinition {
        rho: any;
        mean1?: any;
        stDev1?: any;
        mean2?: any;
        stDev2?: any;
    }

    export interface ITwoCorrelated extends KG.IModel {
        rho: number;
        mean1?: number;
        stDev1?: number;
        mean2?: number;
        stDev2?: number;
    }

    export class TwoCorrelated extends Base implements ITwoCorrelated {

        public rho;
        public mean1;
        public stDev1;
        public mean2;
        public stDev2;

        constructor(definition:TwoCorrelatedDefinition,modelPath?) {

            // if mean and/or standard deviation for the first random variable are unspecified,
            // default to mean of 0 and standard deviation of 1
            definition = _.defaults(definition, {
                mean1: 0,
                stDev1: 1
            });

            // if mean and/or standard deviation for the second random variable are unspecified,
            // default to be the same as the first distribution
            definition = _.defaults(definition,{
                mean2: definition.mean1,
                stDev2: definition.stDev1
            });

            super(definition,modelPath);

            this.shocks = this.drawShocks(100);

        }

        drawOne() {
            return [this.distribution.randomDraw(), this.distribution.randomDraw()];
        }

        // use formula from http://math.stackexchange.com/questions/446093/generate-correlated-normal-random-variables
        // to draw two correlated random variables
        transformShock(shock: number[]) {
            var sim = this;

            var x1 = shock[0],
                x2 = shock[1],
                x3 = sim.rho*x1 + Math.sqrt(1 - sim.rho*sim.rho)*x2;

            var y1 = sim.mean1 + sim.stDev1*x1,
                y2 = sim.mean2 + sim.stDev2*x3;

            return [y1,y2];

        }

        weightedMean(w: number) {
            var sim = this,
                mu1 = sim.mean1,
                mu2 = sim.mean2,
                w2 = w || 0,
                w1 = 1 - w2;
            return w1*mu1 + w2*mu2;
        }

        weightedStDev(w: number) {
            var sim = this,
                s1 = sim.stDev1,
                s2 = sim.stDev2,
                r = sim.rho,
                w2 = w || 0,
                w1 = 1 - w2;
            return Math.sqrt(w1*w1*s1*s1 + w2*w2*s2*s2 + 2*w1*w2*s1*s2*r);
        }

        weightFrontier(maxLeverage: number) {
            var sim = this,
                data = [],
                maxLeverage = maxLeverage || 0,
                min = -maxLeverage,
                max = 1+maxLeverage,
                step = 0.01*(max-min),
                w = min;
            for(var i = 0; i<100; i++) {
                data.push({x: sim.weightedStDev(w),y: sim.weightedMean(w)});
                w += step;
            }
            return data;
        }




    }

}