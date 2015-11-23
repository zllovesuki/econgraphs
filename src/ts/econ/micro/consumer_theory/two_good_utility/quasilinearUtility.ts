/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface QuasilinearUtilityDefinition extends TwoGoodUtilityDefinition {
        coefficient?: any;
        alpha: any;
        def?: KGMath.Functions.QuasilinearDefinition;
    }

    export interface IQuasilinearUtility extends ITwoGoodUtility {
        coefficient: number;
        alpha: number;
    }

    export class QuasilinearUtility extends TwoGoodUtility implements IQuasilinearUtility {

        public coefficient;
        public alpha;

        public static title = 'Quasilinear';

        constructor(definition:QuasilinearUtilityDefinition, modelPath?:string) {

            definition.coefficient = definition.coefficient || 1;
            definition.type = 'Quasilinear';
            definition.def = {
                coefficients: [definition.coefficient, 1],
                powers: [definition.alpha, 1]
            };

            super(definition, modelPath);

            this.title = QuasilinearUtility.title;

        }

        _unconstrainedOptimalX(budgetSegment:BudgetSegment) {
            var u = this;

            //ax^(a-1) = px/py
            //x = (px/apy)^(1/(a-1))

            // MRS = ax^(a-1)
            if(u.alpha == 1) {
                if(budgetSegment.px > budgetSegment.py) {
                    return 0
                } else if(budgetSegment.px < budgetSegment.py) {
                    return budgetSegment.income / budgetSegment.px
                } else {
                    return 0.5*budgetSegment.income / budgetSegment.px
                }
            }

            return Math.pow(budgetSegment.px/(u.alpha*budgetSegment.py), 1/(u.alpha-1));

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
                return "x^\\alpha + y";
            }
        }

    }
}

