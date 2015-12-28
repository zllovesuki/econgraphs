/// <reference path="../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface MidpointElasticityDefinition extends ElasticityDefinition
    {
        point1?: KG.ICoordinates;
        point2?: KG.ICoordinates;
    }

    export interface IMidpointElasticity extends IElasticity
    {
        point1: KG.ICoordinates;
        point2: KG.ICoordinates;
        xDiff: number;
        yDiff: number;
        xAvg: number;
        yAvg: number;
        xPercentDiff: number;
        yPercentDiff: number;
        line: KG.Line;
    }

    export class MidpointElasticity extends Elasticity implements IMidpointElasticity
    {
        public point1;
        public point2;
        public midpoint;
        public xDiff;
        public yDiff;
        public xAvg;
        public yAvg;
        public xPercentDiff;
        public yPercentDiff;

        constructor(definition:MidpointElasticityDefinition, modelPath?:string) {
            super(definition, modelPath);

        }

        _calculateElasticity(inputs) {
            var e = this;

            if(inputs) {
                if(inputs.hasOwnProperty('point1') && inputs.hasOwnProperty('point2')) {
                    e.point1 = inputs.point1;
                    e.point2 = inputs.point2;
                }
            }

            e.xDiff = e.point1.x - e.point2.x;
            e.yDiff = e.point1.y - e.point2.y;
            e.xAvg = 0.5*(e.point1.x + e.point2.x);
            e.yAvg = 0.5*(e.point1.y + e.point2.y);
            e.xPercentDiff = e.xDiff / e.xAvg;
            e.yPercentDiff = e.yDiff / e.yAvg;
            e.elasticity = e.xPercentDiff / e.yPercentDiff;

            console.log('calculating elasticity');

            return e;
        }

    }

}