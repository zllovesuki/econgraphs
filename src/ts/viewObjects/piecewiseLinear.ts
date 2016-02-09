/// <reference path="../kg.ts"/>

'use strict';

module KG {

    export interface PiecewiseLinearDefinition extends ViewObjectDefinition {
        sectionDefs?: any;
        sections?: any;
        arrows?: string;
        label?: string;
        xInterceptLabel?: string;
        yInterceptLabel?: string;
        areaUnderLabel?: string;
        areaOverLabel?: string;
    }

    export interface IPiecewiseLinear extends IViewObject {

        label?: string;
        sections: KGMath.Functions.Linear[];
        xInterceptLabel: string;
        yInterceptLabel: string;
        arrows: string;
        areaUnderLabel?: string;
        areaOverLabel?: string;
        xIntercept: number;
        yIntercept: number;


    }

    export class PiecewiseLinear extends ViewObject implements IPiecewiseLinear {

        public sections;
        public arrows;
        public label;
        public areaUnderLabel;
        public areaOverLabel;
        public xInterceptLabel;
        public yInterceptLabel;
        public xIntercept;
        public yIntercept;

        constructor(definition:PiecewiseLinearDefinition, modelPath?: string) {

            super(definition, modelPath);

            var piecewiseLinear = this;

            if(definition.hasOwnProperty('sectionDefs')) {
                piecewiseLinear.sections = definition.sectionDefs.map(function (def) {
                    return new KGMath.Functions.Linear(def)
                });
            }

            piecewiseLinear.viewObjectSVGtype = 'path';
            piecewiseLinear.viewObjectClass = 'line';

        }

        render(view) {

            var piecewiseLinear = this;

            if(typeof piecewiseLinear.sections == 'string') {
                piecewiseLinear.sections = view.scope.$eval(piecewiseLinear.sections);
            }

            piecewiseLinear.sections.forEach(function(section, index){
                if(index == 0){
                    var newLine = new Line({
                        name: piecewiseLinear.name + '_section' + index,
                        className: piecewiseLinear.className,
                        linear: section.linear,
                        xDomain: section.xDomain,
                        yDomain: section.yDomain,
                        yInterceptLabel: piecewiseLinear.yInterceptLabel
                    });
                    view.addObject(newLine);
                    view = newLine.createSubObjects(view);
                    newLine.render(view);
                    piecewiseLinear.yIntercept = newLine.linear.yIntercept;
                } else if(index == piecewiseLinear.sections.length - 1){
                    var newLine = new Line({
                        name: piecewiseLinear.name + '_section' + index,
                        className: piecewiseLinear.className,
                        linear: section.linear,
                        xDomain: section.xDomain,
                        yDomain: section.yDomain,
                        label: {text: piecewiseLinear.label},
                        xInterceptLabel: piecewiseLinear.xInterceptLabel
                    });
                    view.addObject(newLine);
                    view = newLine.createSubObjects(view);
                    piecewiseLinear.xIntercept = newLine.linear.xIntercept;
                    newLine.render(view);
                } else {
                    var newLine = new Line({
                        name: piecewiseLinear.name + '_section' + index,
                        className: piecewiseLinear.className,
                        xDomain: section.xDomain,
                        yDomain: section.yDomain,
                        linear: section.linear,
                        xInterceptLabel: piecewiseLinear.xInterceptLabel,
                        yInterceptLabel: piecewiseLinear.yInterceptLabel
                    });
                    view.addObject(newLine);
                    viewLine.render(view);
                }
            });

            return view;
        }

    }

}