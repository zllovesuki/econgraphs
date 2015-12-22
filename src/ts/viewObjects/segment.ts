/// <reference path="../kg.ts"/>

'use strict';

module KG {

    export interface SegmentDefinition extends CurveDefinition {
        a: any;
        b: any;
        trimPercent?: any;
    }

    export interface ISegment extends ICurve {
        a: ICoordinates;
        b: ICoordinates;
        trimPercent: number;
    }

    export class Segment extends Curve implements ISegment {

        public a;
        public b;
        public trimPercent;

        constructor(definition:SegmentDefinition, modelPath?: string) {

            definition.labelPosition = Curve.LABEL_POSITION_MIDDLE;
            definition.data = [KG.getCoordinates(definition.a), KG.getCoordinates(definition.b)];

            super(definition, modelPath);

            this.viewObjectClass = 'segment';
        }

        _update(scope) {
            var s = this;
            if(s.trimPercent > 0) {
                var diffX = (s.data[1].x - s.data[0].x)*s.trimPercent,
                    diffY = (s.data[1].y - s.data[0].y)*s.trimPercent;
                s.data[0].x += diffX;
                s.data[1].x -= diffX;
                s.data[0].y += diffY;
                s.data[1].y -= diffY;
            }
            return s;
        }

    }

}