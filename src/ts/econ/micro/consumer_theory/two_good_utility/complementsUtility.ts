/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface ComplementsUtilityDefinition extends TwoGoodUtilityDefinition {

        // Utility function of the form u(x,y) = A * min(Bx, Cy)
        coefficient?: any; // parameter A
        xCoefficient?: any; // parameter B
        yCoefficient?: any; // parameter C

        // Author can define this function by specifying a bundle that provides U = 1;
        // in this case A = 1, B = 1/bundle.x, and C = 1/bundle.y.
        bundle?: KG.ICoordinates;

        def?: KGMath.Functions.MinAxByDefinition;
    }

    export interface IComplementsUtility extends ITwoGoodUtility {
        coefficient: number;
        xCoefficient: number;
        yCoefficient: number;
        indifferenceCurveAtUtility: (utility:number, curveParams?:KG.CurveParamsDefinition) => KG.Curve
    }

    export class ComplementsUtility extends TwoGoodUtility implements IComplementsUtility {

        public coefficient;
        public xCoefficient;
        public yCoefficient;

        public static title = 'Perfect Complements';

        constructor(definition:ComplementsUtilityDefinition, modelPath?:string) {

            definition = _.defaults(definition,{
                coefficient: 1,
                xCoefficient: 1,
                yCoefficient: 1
            });

            if(definition.hasOwnProperty('bundle')) {
                definition.xCoefficient = KG.divideDefs(1,definition.bundle.x);
                definition.yCoefficient = KG.divideDefs(1,definition.bundle.y);
            }

            definition.type = 'MinAxBy';
            definition.def = {
                xCoefficient: definition.xCoefficient,
                yCoefficient: definition.yCoefficient
            };

            super(definition, modelPath);

            this.title = ComplementsUtility.title;

        }

        _unconstrainedOptimalX(budgetSegment:BudgetSegment) {
            var u = this;

            if(u.yCoefficient == Infinity) {
                return budgetSegment.xDomain.max;
            }

            var num = budgetSegment.income * u.yCoefficient,
                den = (budgetSegment.px * u.yCoefficient) + (budgetSegment.py * u.xCoefficient);

            return num/den;
        }

        lowestCostBundle(utilityConstraint:UtilityConstraint) {
            var u = this;

            return {
                x: utilityConstraint.u / u.xCoefficient,
                y: utilityConstraint.u / u.yCoefficient
            };
        }

        formula(values) {

            var u = this;

            if(values) {
                return "\\min \\left\\{ \\frac\{x}\{ "+ (1/u.xCoefficient).toFixed(2) + " } , \\frac\{y}\{"+ (1/u.yCoefficient).toFixed(2) + "} \\right\\}";
            } else {
                return "\\min \\left\\{ \\frac\{x}\{\\alpha} , \\frac\{y}\{1 - \\alpha} \\right\\}";
            }
        }

    }
}

