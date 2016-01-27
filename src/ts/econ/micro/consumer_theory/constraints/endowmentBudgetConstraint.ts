/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface EndowmentBudgetConstraintDefinition extends BudgetConstraintDefinition {
        endowment: KG.ICoordinates;
        px?: any;
        py?: any;
        pxBuy?: any;
        pyBuy?: any;
        pxSell?: any;
        pySell?: any;

        //these are set programmatically
        endowmentValueSellX: string;
        endowmentValueSellY: string;
    }

    export interface IEndowmentBudgetConstraint extends IBudgetConstraint {
        endowment: KG.ICoordinates;
        px: number;
        py: number;
        pxBuy: number;
        pyBuy: number;
        pxSell: number;
        pySell: number;
        endowmentValueSellX: number;
        endowmentValueSellY: number;
    }

    export class EndowmentBudgetConstraint extends BudgetConstraint implements IEndowmentBudgetConstraint {

        public endowment;
        public px;
        public py;
        public pxBuy;
        public pyBuy;
        public pxSell;
        public pySell;
        public endowmentValueSellX;
        public endowmentValueSellY;

        constructor(definition: EndowmentBudgetConstraintDefinition, modelPath: string) {

            if(definition.hasOwnProperty('px')) {
                definition.pxBuy = definition.px;
                definition.pxSell = definition.px;
            }

            if(definition.hasOwnProperty('py')) {
                definition.pyBuy = definition.py;
                definition.pySell = definition.py;
            }

            definition.endowmentValueSellX = KG.multiplyDefs(definition.endowment.x, definition.pxSell);
            definition.endowmentValueSellY = KG.multiplyDefs(definition.endowment.y, definition.pySell);

            super(definition,modelPath);

            var b = this;

            if(definition.hasOwnProperty('px') && definition.hasOwnProperty('py')) {
                b.budgetSegments = [
                    new BudgetSegment({
                        endowment: definition.endowment,
                        px: definition.px,
                        py: definition.py
                    }, b.modelProperty('budgetSegments[0]'))
                ]
            } else {
                b.budgetSegments = [
                    new BudgetSegment({
                        endowment: definition.endowment,
                        px: definition.pxSell,
                        py: definition.pyBuy,
                        xMin: 0,
                        xMax: definition.endowment.x,
                        yMin: definition.endowment.y
                    }, b.modelProperty('budgetSegments[0]')),
                    new BudgetSegment({
                        endowment: definition.endowment,
                        px: definition.pxBuy,
                        py: definition.pySell,
                        yMin: 0,
                        yMax: definition.endowment.y,
                        xMin: definition.endowment.x
                    }, b.modelProperty('budgetSegments[1]'))
                ];
            }


        }

        formula(values) {

            var b = this;

            if(b.hasOwnProperty('px') && b.hasOwnProperty('py')) {
                if(values) {
                    return b.px.toFixed(2) + "x + " + b.py.toFixed(2) + "y = "
                        + b.px.toFixed(2) + " \\times " + b.endowment.x + " + " + b.py.toFixed(2) + " \\times " + b.endowment.y;
                } else  {
                    return "P_xx + P_yy = P_xx^E + P_yy^E";
                }
            } else {
                return '';
            }



        }

    }

}