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

        lowestCostBundle(utilityConstraint:UtilityConstraint) {
            var u = this;

            var x = (u.alpha / (1-u.alpha))*utilityConstraint.py/utilityConstraint.px,
                y = (utilityConstraint.u - u.alpha*Math.log(x))/(1-u.alpha);

            if(y < 0) {
                y = 0;
                x = Math.exp(utilityConstraint.u/u.alpha);
            }

            return {
                x: x,
                y: y
            }
        }

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

