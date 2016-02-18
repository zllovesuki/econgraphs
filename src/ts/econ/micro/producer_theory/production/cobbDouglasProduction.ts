/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface CobbDouglasProductionDefinition extends ProductionTechnologyDefinition {
        coefficient?: any;
        xPower: any;
        yPower: any;
        xShare?: any;
        yShare?: any;
    }

    export interface ICobbDouglasProduction extends IProductionTechnology {
        coefficient: number;
        xPower: number;
        yPower: number;
        xShare: number;
        yShare: number;
    }

    export class CobbDouglasProduction extends ProductionTechnology implements ICobbDouglasProduction {

        public coefficient;
        public xPower;
        public yPower;
        public xShare;
        public yShare;

        public static title = 'Cobb-Douglas';

        constructor(definition:CobbDouglasProductionDefinition, modelPath?:string) {

            definition.coefficient = definition.coefficient || 1;

            definition.productionFunction = {
                type: 'KGMath.Functions.CobbDouglas',
                definition: {
                    coefficient: definition.coefficient,
                    xPower: definition.xPower,
                    yPower: definition.yPower
                }
            };

            var sumOfPowers = KG.addDefs(definition.xPower, definition.yPower);
            definition.xShare = KG.divideDefs(definition.xPower, sumOfPowers);
            definition.yShare = KG.divideDefs(definition.yPower, sumOfPowers);

            super(definition, modelPath);

            this.title = CobbDouglasProduction.title;

        }

        longRunOptimalKLRatio(inputPrices) {

            var f = this;

            inputPrices = _.defaults(inputPrices || {}, {w: f.w, r: f.r});

            return (inputPrices.w/inputPrices.r)*f.yPower/f.xPower;
        }

        lowestCostInputBundle(params) {

            var f = this;

            params = _.defaults(params || {}, {
                w: f.w, r: f.r, q: f.q
            });

            var theta = f.longRunOptimalKLRatio({w:params.w, r:params.r}),
                scaledQ = Math.pow(params.q/f.coefficient,1/(f.xPower + f.yPower));

            return {
                x: Math.pow(1/theta, f.yShare) * scaledQ,
                y: Math.pow(theta, f.xShare) * scaledQ
            };
        }

        formula(values) {
            if(values) {
                return this.coefficient + "x^{" + this.xPower.toFixed(2) +"}y^{" + this.yPower.toFixed(2) +"}";
            } else {
                return "Ax^\\alpha y^{1 - \\alpha}";
            }
        }

    }
}

