/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface SubstitutesUtilityDefinition extends TwoGoodUtilityDefinition {

        // Utility function of the form u(x,y) = Ax + By
        xCoefficient?: any; // parameter A
        yCoefficient?: any; // parameter B

        // Price ratio at which consumers are indifferent between any bundles
        criticalPriceRatio?: any;    // A/B

        def?: KGMath.Functions.LinearDefinition;
    }

    export interface ISubstitutesUtility extends ITwoGoodUtility {
        xCoefficient: number;
        yCoefficient: number;
        criticalPriceRatio: number;
    }

    export class SubstitutesUtility extends TwoGoodUtility implements ISubstitutesUtility {

        public xCoefficient;
        public yCoefficient;
        public criticalPriceRatio;

        public static title = 'Perfect Substitutes';

        constructor(definition:SubstitutesUtilityDefinition, modelPath?:string) {

            definition.xCoefficient = definition.xCoefficient || 0.5;
            definition.yCoefficient = definition.yCoefficient || KG.subtractDefs(1, definition.xCoefficient);
            definition.criticalPriceRatio = KG.divideDefs(definition.xCoefficient, definition.yCoefficient);

            definition.type = 'Linear';
            definition.def = {
                coefficients:
                    {
                        a: definition.xCoefficient,
                        b: definition.yCoefficient,
                        c: 0
                    }
            };

            super(definition, modelPath);

            this.title = SubstitutesUtility.title;

        }

        _unconstrainedOptimalX(budgetSegment:BudgetSegment, maxIfIndifferent?:boolean) {
            var u = this;
            maxIfIndifferent = !!maxIfIndifferent;
            if(u.xCoefficient/u.yCoefficient > budgetSegment.px/budgetSegment.py) {
                return budgetSegment.xDomain.max;
            } else if(u.xCoefficient/u.yCoefficient < budgetSegment.px/budgetSegment.py) {
                return budgetSegment.xDomain.min;
            } else {
                // need a way to handle indifference between all segments of the budget segment
                // for now, just return midpoint
                return maxIfIndifferent ? budgetSegment.xDomain.max : budgetSegment.xDomain.min;
            }
        }

        lowestCostBundle(utilityConstraint:UtilityConstraint) {

            var u = this;

            //utility constraint is of the form ax + by = u

            // buying all X means buying u/a units of x
            var allX = utilityConstraint.u/u.xCoefficient;

            // buying all Y means buying u/b units of y
            var allY = utilityConstraint.u/u.yCoefficient;

            if(utilityConstraint.px * allX < utilityConstraint.py * allY) {
                return {
                    x: allX,
                    y: 0
                }
            } else if(utilityConstraint.px * allX > utilityConstraint.py * allY) {
                return {
                    x: allX,
                    y: 0
                }
            } else {
                // need a way to handle indifference between all segments of the budget segment
                // for now, just return midpoint
                return {
                    x: 0.5*allX,
                    y: 0.5*allY
                }
            }


        }

        formula(values) {

            var u = this;

            if(values) {
                return u.xCoefficient.toFixed(2) + "x + "+ u.yCoefficient.toFixed(2) + "y";
            } else {
                return "\\alpha x + (1 - \\alpha)y";
            }
        }

    }
}

