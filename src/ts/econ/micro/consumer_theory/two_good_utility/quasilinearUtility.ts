/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface QuasilinearUtilityDefinition extends TwoGoodUtilityDefinition {
        alpha: any;
        def?: KGMath.Functions.QuasilinearDefinition;
    }

    export interface IQuasilinearUtility extends ITwoGoodUtility {
        alpha: number;
    }

    export class QuasilinearUtility extends TwoGoodUtility implements IQuasilinearUtility {

        public coefficient;
        public alpha;

        public static title = 'Quasilinear';

        constructor(definition:QuasilinearUtilityDefinition, modelPath?:string) {

            definition.type = 'Quasilinear';
            definition.def = {
                coefficients: [definition.alpha, KG.subtractDefs(1,definition.alpha)]
            };

            super(definition, modelPath);

            this.title = QuasilinearUtility.title;

        }

        _unconstrainedOptimalX(budgetSegment:BudgetSegment) {
            var u = this;

            //MUx = a/x
            //MUy = 1-a
            //a/[(1-a)x] = px/py
            //x = [a/(1-a)](py/px)

            if(u.alpha == 1) {
                return budgetSegment.income / budgetSegment.px
            }

            return (u.alpha/(1-u.alpha))*(budgetSegment.py/budgetSegment.px);

        }

        /*lowestCostBundle(utilityConstraint:UtilityConstraint) {
            var u = this;

            var denominator = Math.pow(u.alpha, s) * Math.pow(px, 1 - s) + Math.pow(1 - u.alpha, u.s) * Math.pow(py, 1 - u.s),
                x_coefficient = Math.pow(px / u.alpha, -s) / denominator,
                y_coefficient = Math.pow(py / (1 - u.alpha), -s) / denominator,
                scale_factor = u.alpha*Math.pow(x_coefficient, u.r) + (1- u.alpha)*Math.pow(y_coefficient, u.r),

                c = Math.pow(utility/scale_factor, 1/ u.r);

            return c;

            return {
                x: Math.pow(theta,u.yShare)*utilityConstraint.u,
                y: Math.pow(1/theta,u.xShare)*utilityConstraint.u
            };
        }*/

        formula(values) {
            var u = this;
            if(values) {
                return "x^{" + u.alpha.toFixed(2) +"} + y";
            } else {
                return "\\alpha \\ln x + (1 - \\alpha) y";
            }
        }

    }
}

