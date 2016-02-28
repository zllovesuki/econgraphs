/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface LinearMarginalCostDefinition extends ProductionCostDefinition
    {
        marginalCostIntercept: string;
        marginalCostControlPointCoordinates: KG.ICoordinates;
    }

    export interface ILinearMarginalCost extends IProductionCost
    {
        marginalCostIntercept: number;
        marginalCostControlPointCoordinates: KG.ICoordinates;
    }

    export class LinearMarginalCost extends ProductionCost implements ILinearMarginalCost
    {
        public marginalCostIntercept;
        public marginalCostControlPointCoordinates;

        constructor(definition:LinearMarginalCostDefinition, modelPath?: string) {

            definition.marginalCostFunctionType = 'Linear';
            definition.marginalCostFunctionDef = {
                point1: {x: 0, y: definition.marginalCostIntercept},
                point2: definition.marginalCostControlPointCoordinates
            };

            super(definition,modelPath);
        }

    }

}