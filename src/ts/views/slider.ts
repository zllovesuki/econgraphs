/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    // Slider Definition
    export interface SliderDefinition extends ViewDefinition
    {
        param: string;
        precision: number;
        axisDef: AxisDefinition;
        shape?: string; //'circle' or 'bar'
    }

    export interface ISlider extends IView
    {
        shape: string;
    }

    export class Slider extends View implements ISlider {

        public axisDef;
        public shape;

        constructor(definition: SliderDefinition, modelPath?: string) {

            definition.maxDimensions = _.defaults(definition.maxDimensions || {}, { width: 500, height: 50 });
            definition.margins = _.defaults(definition.margins || {}, {top: 25, left: 25, bottom: 25, right: 25});
            definition.shape = definition.shape || 'circle';
            definition.mask = false;

            super(definition, modelPath);
            this.xAxis = new XAxis(definition.axisDef);
            this.objects = [
                new SliderControl({
                    name: definition.element_id + 'Ctrl',
                    param: 'params.' + definition.param,
                    shape: definition.shape
                })
            ]
        }

        _update(scope) {
            this.xAxis.update(scope);
            super._update(scope);
            return this;
        }

        onGraph(coordinates) {
            return true;
        }

    }
    
    export interface SliderControlDefinition extends ViewObjectDefinition {
        param: string;
        shape: string;
        coordinates?: KG.ICoordinates;
    }
    
    export interface ISliderControl extends IViewObject {
        param: string;
        shape: string;
    }
    
    

    export class SliderControl extends ViewObject implements ISliderControl {

        public param;
        public shape;

        constructor(definition:SliderControlDefinition, modelPath?: string) {
            definition.interaction = {
                xDrag: true,
                xDragParam: definition.param,
                highlight: definition.param.replace('params.','')
            };
            definition.coordinates = {x: definition.param, y:0};
            super(definition, modelPath);
            this.viewObjectSVGtype = 'g';
            this.viewObjectClass = 'sliderControl';
        }

        render(view) {

            var control = this;

            control.update(view.scope);

            var group:D3.Selection = view.objectGroup(control.name, control.initGroupFn(), true);

            if(!group) {
                return view;
            }

            var controlGroup:D3.Selection = group.select('.'+ control.viewObjectClass);

            var controlSquare = controlGroup.selectAll('rect').data([0])

            controlSquare.enter().append('rect').attr({
                opacity: 0,
                y: -view.dimensions.height*0.5,
                width: 50,
                height: view.dimensions.height
            });

            controlSquare.attr({
                'x': view.xAxis.scale(control.param) - 25
            });
            


            if(control.shape == 'circle') {
                var controlShape = controlGroup.selectAll('circle').data([0])
                controlShape.enter().append('circle').attr({
                    'class': control.classAndVisibility(),
                    r: view.dimensions.height/5,
                    cy: 0
                });
    
                controlShape.attr({
                    cx: view.xAxis.scale(control.param)
                });
            }
            
            if(control.shape == 'bar') {

                var controlShape = controlGroup.selectAll('path').data([0])
                
                var minX = view.xAxis.scale(Math.max(0,view.xAxis.domain.min)),
                    maxX = view.xAxis.scale(control.param),
                    minY = -view.dimensions.height*0.5,
                    maxY = view.dimensions.height*0;

                var bar = d3.svg.area()
                    .interpolate('linear')
                    .x(function (d) { return d.x })
                    .y0(minY)
                    .y1(maxY);
                
                controlShape.enter().append('path').attr({
                    'class': control.classAndVisibility()
                });
    
                controlShape.attr({
                    'd': bar([{x: minX},{x: maxX}])
                });
            }
            

            

            control.interactionHandler.setBehavior(view,controlSquare);
            control.interactionHandler.setBehavior(view,controlShape);

            return control;

        }
    }




}