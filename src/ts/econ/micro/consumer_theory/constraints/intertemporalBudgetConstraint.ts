/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface IntertemporalBudgetConstraintDefinition extends EndowmentBudgetConstraintDefinition {
        c1: any;
        c2: any;
        r?: any;
        rBorrow?: any;
        rLend?: any;
    }

    export interface IIntertemporalBudgetConstraint extends IEndowmentBudgetConstraint {
        c1: number;
        c2: number;
        r: number;
        rBorrow: number;
        rLend: number;
    }

    export class IntertemporalBudgetConstraint extends EndowmentBudgetConstraint implements IIntertemporalBudgetConstraint {

        public c1;
        public c2;
        public r;
        public rBorrow;
        public rLend;

        constructor(definition: IntertemporalBudgetConstraintDefinition, modelPath: string) {

            definition.endowment = {x: definition.c1, y: definition.c2};

            if(definition.hasOwnProperty('rBorrow') && definition.hasOwnProperty('rLend')) {
                definition.pyBuy = 1;
                definition.pySell = 1;
                definition.pxBuy = KG.addDefs(1, KG.multiplyDefs(definition.rBorrow, 0.01));
                definition.pxSell = KG.addDefs(1, KG.multiplyDefs(definition.rLend, 0.01));
            } else if(definition.hasOwnProperty('r')) {
                definition.py = 1;
                definition.px = KG.addDefs(1, KG.multiplyDefs(definition.r, 0.01));
            } else {
                console.log('Must initiate an intemporal budget constraint with either r or both rBorrow and rLend')
            }

            super(definition,modelPath);

            //console.log(this);

        }

        //TODO update this formula for intertemporal
        /*formula(values) {

            var b = this;

            if(b.hasOwnProperty('px') && b.hasOwnProperty('py')) {
                if(values) {
                    return b.px.toFixed(2) + "x + " + b.py.toFixed(2) + "y = "
                        + b.px.toFixed(2) + " \\times " + b.endowment.x + " + " + b.py.toFixed(2) + " \\times " + b.endowment.y;
                } else  {
                    return "P_xx + P_yy = P_xx_E + P_yy_E";
                }
            } else {
                return '';
            }

        }*/

    }

}