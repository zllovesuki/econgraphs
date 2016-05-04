/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface ProductionCostDefinition extends KG.ModelDefinition
    {
        fixedCost?: any;
        costFunctionType?: string;
        costFunctionDef?: any;
        marginalCostFunctionType?: string;
        marginalCostFunctionDef?: any;
        fixedCostDragParam?: string;
        quantityDraggable?: boolean;
    }

    export interface IProductionCost extends KG.IModel
    {
        fixedCost: number;
        costFunction: KGMath.Functions.Base;
        marginalCostFunction: KGMath.Functions.Base;
        averageCostFunction: KGMath.Functions.Base;
        variableCostFunction: KGMath.Functions.Base;
        averageVariableCostFunction: KGMath.Functions.Base;

        tc: (q:number) => number;
        atc: (q:number) => number;
        mc: (q:number) => number;
    }

    export class ProductionCost extends KG.Model implements IProductionCost
    {
        public costFunction;
        public totalCostCurve;
        public marginalCostFunction;
        public averageCostFunction;
        public variableCostFunction;
        public averageVariableCostFunction;
        public fixedCost;
        public fixedCostLine;

        constructor(definition:ProductionCostDefinition, modelPath?: string) {

            super(definition,modelPath);

            var productionCost = this;

            if(definition.hasOwnProperty('costFunctionDef')) {
                productionCost.costFunction = new KGMath.Functions[definition.costFunctionType](definition.costFunctionDef);
                productionCost.marginalCostFunction = productionCost.costFunction.derivative();
            } else if(definition.hasOwnProperty('marginalCostFunctionDef')) {
                productionCost.marginalCostFunction = new KGMath.Functions[definition.marginalCostFunctionType](definition.marginalCostFunctionDef, productionCost.modelProperty('marginalCostFunction'));
                productionCost.costFunction = productionCost.marginalCostFunction.integral(0,definition.fixedCost, productionCost.modelProperty('costFunction'));
            } else {
                console.log('must initiate production cost object with either total cost or marginal cost function!')
            }

            productionCost.averageCostFunction = productionCost.costFunction.average();
            productionCost.variableCostFunction = productionCost.costFunction.add(KG.subtractDefs(0,this.modelProperty('fixedCost')));
            productionCost.averageVariableCostFunction = productionCost.variableCostFunction.average();

        }

        _update(scope) {
            var p = this;
            p.costFunction.update(scope);
            p.fixedCost = p.tc(0);
            p.marginalCostFunction.update(scope);
            return p;
        }

        tc(q) {
            return this.costFunction.yValue(q);
        }

        vc(q) {
            return this.tc(q) - this.fixedCost;
        }

        atc(q) {
            return this.tc(q)/q;
        }

        avc(q) {
            return this.vc(q)/q;
        }

        mc(q) {
            return this.marginalCostFunction.yValue(q);
        }

    }

}