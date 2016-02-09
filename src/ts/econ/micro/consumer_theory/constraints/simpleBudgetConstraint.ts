/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface SimpleBudgetConstraintDefinition extends BudgetConstraintDefinition {
        income?: any;
        endowment?: any;
        px: any;
        py: any;
    }

    export interface ISimpleBudgetConstraint extends IBudgetConstraint {
        income: number;
        px: number;
        py: number;
        setPrice: (price:number, good?:string) => void;
    }

    export class SimpleBudgetConstraint extends BudgetConstraint implements ISimpleBudgetConstraint {

        public income;
        public px;
        public py;
        public budgetLine;

        public static title = 'Simple Budget Constraint';

        constructor(definition: SimpleBudgetConstraintDefinition, modelPath?: string) {
            super(definition,modelPath);

            var b = this;

            b.budgetSegments = [
                new BudgetSegment({
                    income: definition.income,
                    px: definition.px,
                    py: definition.py
                }, b.modelProperty('budgetSegments[0]'))
            ];
        }

        setPrice(price,good) {
            var b = this;
            good = good || 'x';
            b.budgetSegments[0].setPrice(price,good);
        }

        setIncome(income) {
            var b = this;
            b.budgetSegments[0].setIncome(income);
        }

        formula(values) {

            var b = this;

            if(values) {
                return b.px.toFixed(2) + "x + " + b.py.toFixed(2) + "y = " +b.income;
            } else {
                return "P_xx + P_yy = I";
            }
        }

    }

}