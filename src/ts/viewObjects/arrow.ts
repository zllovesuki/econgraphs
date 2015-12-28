/// <reference path="../kg.ts"/>

'use strict';

module KG {

    export interface ArrowDefinition extends SegmentDefinition {
        begin: any;
        end: any;
    }

    export interface IArrow extends ISegment {
        begin: ICoordinates;
        end: ICoordinates;
    }

    export class Arrow extends Segment implements IArrow {

        public begin;
        public end;

        constructor(definition:ArrowDefinition, modelPath?: string) {

            definition.a = definition.begin;
            definition.b = definition.end;
            definition.arrows = Curve.END_ARROW_STRING;

            super(definition, modelPath);

            this.viewObjectClass = 'arrow';
        }

    }

}