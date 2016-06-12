/// <reference path="../kg.ts"/>

'use strict';

module KG {

    export interface FunctionMapDefinition extends ViewObjectDefinition {
        fn: any;
        levels: any[];
        numSamplePoints?: number;
    }

    export interface IFunctionMap extends IViewObject {
        fn: KGMath.Functions.Base;
        levels: number[];
        curves: KG.FunctionPlot[];
        numSamplePoints: number;
    }

    export class FunctionMap extends ViewObject implements IFunctionMap {

        public fn;
        public levels;
        public curves;
        public numSamplePoints;

        constructor(definition:FunctionMapDefinition, modelPath?: string) {
            definition = _.defaults(definition, {interpolation: 'basis', numSamplePoints: 51});
            super(definition, modelPath);
        }

        _update(scope) {
            var fmap = this;
            fmap.fn.update(scope);
            fmap.curves.forEach(function(curve) {curve.update(scope)});
            return fmap;
        }

        createSubObjects(view) {
            var fmap = this;

            fmap.levels.forEach(function(level,index) {
                view.addObject(new KG.FunctionPlot(
                    {
                        name: fmap.name + '_' + index,
                        className: fmap.className,
                        fn: fmap.fn.setLevel(level)
                    }));
            });

            return view;
        }

    }

}