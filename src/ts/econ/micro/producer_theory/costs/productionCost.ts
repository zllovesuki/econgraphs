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
        labels?: {
            fc: string;
            vc: string;
            mc: string;
            atc: string;
            tc: string;
            avc: string;
            mcSlope: string;
            atcSlope: string;
            avcSlope: string;
        }
        show?: {
            tc: any;
            fc: any;
            vc: any;
            mc: any;
            atc: any;
            avc: any;
            mcSlope: any;
            atcSlope: any;
            avcSlope: any;
        }
    }

    export interface IProductionCost extends KG.IModel
    {
        fixedCost: number;
        costFunction: KGMath.Functions.Base;
        totalCostCurve: KG.ViewObject;
        marginalCostFunction: KGMath.Functions.Base;
        marginalCostCurve: KG.ViewObject;
        averageCostFunction: KGMath.Functions.Base;
        averageCostCurve: KG.ViewObject;
        variableCostFunction: KGMath.Functions.Base;
        variableCostCurve: KG.ViewObject;
        averageVariableCostFunction: KGMath.Functions.Base;
        averageVariableCostCurve: KG.ViewObject;
        fixedCostPoint: KG.Point;
        fixedCostLine: KG.HorizontalLine;

        tc: (q:number) => number;
        atc: (q:number) => number;
        mc: (q:number) => number;

        quantityDraggable: boolean;

        labels: {
            vc: string;
            fc: string;
            mc: string;
            atc: string;
            tc: string;
            avc: string;
            mcSlope: string;
            atcSlope: string;
            avcSlope: string;
        }
        show: {
            tc: boolean;
            vc: boolean;
            fc: boolean;
            mc: boolean;
            atc: boolean;
            avc: boolean;
            mcSlope: boolean;
            atcSlope: boolean;
            avcSlope: boolean;
        }
    }

    export class ProductionCost extends KG.Model implements IProductionCost
    {
        public costFunction;
        public totalCostCurve;
        public marginalCostFunction;
        public marginalCostCurve;
        public averageCostFunction;
        public averageCostCurve;
        public variableCostFunction;
        public variableCostCurve;
        public averageVariableCostFunction;
        public averageVariableCostCurve;
        public fixedCost;
        public fixedCostPoint;
        public fixedCostLine;
        public quantityDraggable;

        public labels;
        public show;

        constructor(definition:ProductionCostDefinition, modelPath?: string) {

            definition.labels = _.defaults(definition.labels || {},{
                tc: 'TC',
                vc: 'VC',
                fc: 'FC',
                mc: 'MC',
                atc: 'ATC',
                avc: 'AVC',
                mcSlope: 'slope = MC',
                atcSlope: 'slope = ATC',
                avcSlope: 'slope = AVC'
            });

            definition = _.defaults(definition,{
                quantityDraggable: true,
            });

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
            p.fixedCostPoint.update(scope);
            return p;
        }

        tc(q) {
            return this.costFunction.yValue(q);
        }

        vc(q) {
            return this.variableCostFunction.yValue(q);
        }

        atc(q) {
            return this.averageCostFunction.yValue(q);
        }

        avc(q) {
            return this.averageVariableCostFunction.yValue(q);
        }

        mc(q) {
            return this.marginalCostFunction.yValue(q);
        }



    }

}