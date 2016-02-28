/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface QuadraticMarginalCostDefinition extends ProductionCostDefinition
    {
        marginalCostVertexCoordinates: KG.ICoordinates;
        marginalCostControlPointCoordinates: KG.ICoordinates;
    }

    export interface IQuadraticMarginalCost extends IProductionCost
    {
        marginalCostVertexCoordinates: KG.ICoordinates;
        marginalCostControlPointCoordinates: KG.ICoordinates;
    }

    export class QuadraticMarginalCost extends ProductionCost implements IQuadraticMarginalCost
    {
        public marginalCostVertexCoordinates;
        public marginalCostControlPointCoordinates;

        constructor(definition:QuadraticMarginalCostDefinition, modelPath?: string) {

            definition.marginalCostFunctionType = 'Quadratic';
            definition.marginalCostFunctionDef = {
                vertex: definition.marginalCostVertexCoordinates,
                point: definition.marginalCostControlPointCoordinates
            };

            super(definition,modelPath);

        }

    }

}