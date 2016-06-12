/// <reference path="../kg.ts"/>

'use strict';

module KG
{
    
    export interface ScatterDefinition extends ViewObjectDefinition {
        data: PointDefinition[];
        symbol?: string;
        size?: number;
    }

    export interface IScatter extends IViewObject {

        data: Point[];
        symbol: string;
        size: number;
    }

    export class Scatter extends ViewObject implements IScatter
    {

        // point-specific attributes
        public data;
        public symbol;
        public size;

        constructor(definition:ScatterDefinition, modelPath?: string) {
            
            definition = _.defaults(definition, {
                data: [],
                size: 25,
                symbol: 'circle'
            });

            super(definition, modelPath);
            
        }

        _update(scope) {
            var scatter = this;
            console.log(scatter);
            return scatter;
        }
        
    }



}