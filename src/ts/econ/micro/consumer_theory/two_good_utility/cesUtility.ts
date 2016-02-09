/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface CESUtilityDefinition extends TwoGoodUtilityDefinition {
        coefficient?: any;
        r?: any;
        s?: any;
        sub: any;
        alpha?: any;
        criticalPriceRatio: any;
        def?: KGMath.Functions.CESDefinition;
    }

    export interface ICESUtility extends ITwoGoodUtility {
        coefficient?: number;
        r: number;
        s: number;
        alpha: number;
        sub: number;
        criticalPriceRatio: number;
    }

    export class CESUtility extends TwoGoodUtility implements ICESUtility {

        public coefficient;
        public r;
        public s;
        public alpha;
        public sub;
        public criticalPriceRatio;

        public static title = 'CES';

        constructor(definition:CESUtilityDefinition, modelPath?:string) {

            definition.alpha = definition.alpha || 0.5;

            // Can defined with either r or s or (more commonly) 'sub', which ranges from -1 to 1
            if(definition.hasOwnProperty('r')) {
                definition.s = KG.divideDefs(1,KG.subtractDefs(1,definition.r)); // s = 1/(1-r)
            } else if(definition.hasOwnProperty('s')) {
                definition.r = KG.divideDefs(KG.subtractDefs(definition.s,1),definition.s); // r = (s-1)/s
            } else {
                definition.r = definition.sub + ' > 0 ? ' + definition.sub + ' : ' + KG.divideDefs(definition.sub,KG.addDefs(1.01,definition.sub));
                definition.s = KG.divideDefs(1,KG.subtractDefs(1,definition.r)); // s = 1/(1-r)
                console.log('oops, must instantiate a CES utility function with either r or s')
            }

            definition.criticalPriceRatio = KG.divideDefs(definition.alpha, KG.subtractDefs(1, definition.alpha));

            definition.type = 'CES';
            definition.def = {
                coefficient: definition.coefficient || 1,
                r: definition.r,
                alpha: definition.alpha
            };

            super(definition, modelPath);

            this.title = CESUtility.title;

        }

        _unconstrainedOptimalX(budgetSegment:BudgetSegment, maxIfIndifferent?: boolean) {
            var u = this;
            maxIfIndifferent = !!maxIfIndifferent;
            if(u.r == 1) {
                if(u.alpha/(1-u.alpha) > budgetSegment.px/budgetSegment.py) {
                    return budgetSegment.xDomain.max
                } else if(u.alpha/(1-u.alpha) < budgetSegment.px/budgetSegment.py) {
                    return budgetSegment.xDomain.min
                } else {
                    // need a way to handle indifference between all segments of the budget segment
                    // for now, just return midpoint
                    return maxIfIndifferent ? budgetSegment.xDomain.max : budgetSegment.xDomain.min;
                }
            } else if(u.r == 0) {
                return u.alpha*budgetSegment.income/budgetSegment.px
            } else {
                var n = budgetSegment.income * Math.pow(budgetSegment.px/u.alpha,-u.s),
                    dx = Math.pow(u.alpha,u.s) * Math.pow(budgetSegment.px, 1-u.s),
                    dy = Math.pow(1-u.alpha,u.s) * Math.pow(budgetSegment.py, 1-u.s);
                return n/(dx + dy);
            }

        }

        expenditure(utilityConstraint:UtilityConstraint) {
            var u = this,
                s= u.r/(u.r - 1);



        }

        lowestCostBundle(utilityConstraint:UtilityConstraint) {
            var u = this,
                s = 1/(1-u.r);

            var costMinimizingBudgetConstraint = new SimpleBudgetConstraint({
                income: Math.pow(Math.pow(u.alpha, s) * Math.pow(utilityConstraint.px, 1-s) + Math.pow(1 - u.alpha, s) * Math.pow(utilityConstraint.py, 1-s),1/(1-s))*utilityConstraint.u,
                px: utilityConstraint.px,
                py: utilityConstraint.py
            });

            console.log(costMinimizingBudgetConstraint);

            return u.optimalBundle(costMinimizingBudgetConstraint);
        }

        formula(values) {
            var u = this;
            if(values) {
                if(u.r == 0) {
                    return "x^{" + u.alpha.toFixed(2) +"}y^{" + (1 - u.alpha).toFixed(2) +"}";
                }
                return "\\left["+u.alpha.toFixed(2)+"x^{" + u.r.toFixed(2) +"} + " + (1-u.alpha).toFixed(2) + "y^{" + u.r.toFixed(2) +"}\\right]^{" + (1/this.r).toFixed(2) + "}";
            } else {
                return "\\left[ \\alpha x^r + (1-\\alpha)x^r\\right]^{1/r}";
            }
        }

    }
}

