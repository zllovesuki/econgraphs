/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface ProfitMaxDefinition extends KG.ModelDefinition {
        costDef: ProductionCostDefinition;
        demandDef: LinearDemandDefinition;
        quantity?: any;
        price?: any;
        snapToOptimal?: any;
        numFirms?: any;
        perfectComptition?: any;
    }

    export interface IProfitMax extends KG.IModel {

        costFunction: ProductionCost;
        demandFunction: LinearDemand;

        costSelector: KG.Selector;
        demandSelector: KG.Selector;

        profit: (quantity?:number) => number;
        profitIsPositive: (quantity?:number) => boolean;
        profitWord: (quantity?:number) => string;
        profitAreaCoordinates: (quantity?:number) => KG.ICoordinates[];

        optimalQuantity: number;
        snapToOptimal: boolean;

        quantity: number;
        price: number;
    }

    export class ProfitMax extends KG.Model implements IProfitMax {

        public costFunction;
        public demandFunction;
        public costSelector;
        public demandSelector;

        public quantity;
        public price;
        public optimalQuantity;
        public snapToOptimal;

        public numFirms;
        public industrySupply;
        public perfectCompetition;

        constructor(definition:ProfitMaxDefinition, modelPath?:string) {

            super(definition, modelPath);
        }

        _update(scope) {
            var pm = this;
            var marginalRevenue:KGMath.Functions.Linear = pm.demandFunction.marginalRevenue.update(scope);
            var marginalCost:KGMath.Functions.Base = pm.costFunction.marginalCostFunction.update(scope);
            if (marginalCost instanceof KGMath.Functions.Linear) {
                pm.optimalQuantity = marginalRevenue.linearIntersection(marginalCost).x;
            } else if (marginalCost instanceof KGMath.Functions.Quadratic) {
                pm.optimalQuantity = marginalRevenue.quadraticIntersection(marginalCost).x;
            }

            // shut down if revenues don't cover variable costs
            if(isNaN(pm.optimalQuantity) || pm.optimalQuantity < 0 || pm.demandFunction.totalRevenueAtQuantity(pm.optimalQuantity) < pm.costFunction.vc(pm.optimalQuantity)) {
                    pm.optimalQuantity = 0;
                }
            if(pm.snapToOptimal) {
                pm.quantity = pm.optimalQuantity;
            }
            pm.costFunction.quantity = pm.quantity;
            pm.demandFunction.quantity = pm.quantity;
            pm.price = pm.demandFunction.priceAtQuantity(pm.quantity);
            return pm;
        }

        profit(quantity?) {
            quantity = quantity || this.quantity;
            return this.demandFunction.totalRevenueAtQuantity(quantity) - this.costFunction.tc(quantity);
        }

        profitIsPositive(quantity?) {
            return (this.profit(quantity) >= 0);
        }

        profitWord(quantity?) {
            var profit = this.profit(quantity);
            console.log('profit: ',profit);
            if(KG.isAlmostTo(profit,0,0.05,100)) {
                return ''
            } else {
                return this.profitIsPositive(quantity) ? 'profit' : 'loss';
            }

        }

        profitAreaCoordinates(quantity) {
            var pm = this;
            quantity = quantity || pm.quantity;

            var atc = pm.costFunction.atc(quantity),
                price = pm.price;

            return [
                {x: 0, y: atc},
                {x:0, y: price},
                {x: quantity,y:price},
                {x:quantity,y:atc}
            ];
        }

        quantityAtPrice(price) {
            var pm = this;
            var marginalCost:KGMath.Functions.Linear = pm.costFunction.marginalCostFunction;
            var q = marginalCost.xValue(price);
            if(isNaN(q) || q < 0 || pm.demandFunction.totalRevenueAtQuantity(q) < pm.costFunction.vc(q)) {
                    q = 0;
                }
            return q;
        }

    }
}

