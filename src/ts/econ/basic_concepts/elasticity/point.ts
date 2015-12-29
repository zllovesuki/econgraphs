/// <reference path="../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface PointElasticityDefinition extends ElasticityDefinition
    {
        point?: KG.ICoordinates;
        slope?: any;
    }

    export interface IPointElasticity extends IElasticity
    {
        point: KG.ICoordinates;
        slope: number;
    }

    export class PointElasticity extends Elasticity implements IPointElasticity
    {
        public point;
        public slope;

        constructor(definition:PointElasticityDefinition, modelPath?:string) {
            super(definition,modelPath);
        }

        _calculateElasticity(inputs) {
            var e= this;
            if(inputs) {
                if(inputs.hasOwnProperty('point')) {
                    e.point = inputs.point;
                }
                if(inputs.hasOwnProperty('slope')) {
                    e.slope = inputs.slope;
                }
            }
            e.elasticity = (e.point.y / e.point.x)/e.slope;
            return e;
        }

    }

}