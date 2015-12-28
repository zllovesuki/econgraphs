/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    export interface PointParamsDefinition extends ViewObjectParamsDefinition {
        label?:string;
        xAxisLabel?:string;
        yAxisLabel?:string;
        xDragParam?:string;
        yDragParam?:string;
    }

    export interface PointDefinition extends ViewObjectDefinition {
        symbol?: string;
        size?: number;
        label?: GraphDivDefinition;
        droplines?: any;
        params?: PointParamsDefinition;
    }

    export interface IPoint extends IViewObject {

        // point-specific attributes
        symbol: string;
        size: number;
        labelDiv: IGraphDiv;
        horizontalDropline: Segment;
        verticalDropline: Segment;
    }

    export class Point extends ViewObject implements IPoint
    {

        // point-specific attributes
        public symbol;
        public size;
        public labelDiv;
        public color;
        public horizontalDropline;
        public verticalDropline;

        constructor(definition:PointDefinition, modelPath?: string) {

            if(definition.hasOwnProperty('params')) {

                var p = definition.params;

                if(p.hasOwnProperty('label')) {
                    definition.label = {
                        text: p.label
                    }
                }

                if(p.hasOwnProperty('xAxisLabel') || p.hasOwnProperty('yAxisLabel')) {
                    if(!definition.hasOwnProperty('droplines')) {
                        definition.droplines = {}
                    }
                    if(p.hasOwnProperty('xAxisLabel')) {
                        definition.droplines.vertical = p.xAxisLabel;
                    }
                    if(p.hasOwnProperty('yAxisLabel')) {
                        definition.droplines.horizontal = p.yAxisLabel;
                    }
                }

                if(p.hasOwnProperty('xDragParam')) {
                    definition.xDrag = 'params.' + p.xDragParam;
                }

                if(p.hasOwnProperty('yDragParam')) {
                    definition.yDrag = 'params.' + p.yDragParam;
                }

            }

            var defaultSize = 100;

            if(definition.hasOwnProperty('label')) {
                if(definition.label.hasOwnProperty('text')) {
                    if(definition.label.text.length > 0) {
                        defaultSize = 500;
                    }
                }
            }

            definition = _.defaults(definition, {
                coordinates: {x:0,y:0},
                size: defaultSize,
                symbol: 'circle'
            });

            super(definition, modelPath);

            var point = this;

            if(definition.label) {
                var labelDef = _.defaults(definition.label, {
                    name: definition.name + '_label',
                    className: definition.className,
                    coordinates:definition.coordinates,
                    xDrag: definition.xDrag,
                    yDrag: definition.yDrag,
                    show: definition.show
                });
                point.labelDiv = new GraphDiv(labelDef);
                point.labelDiv.parentObject = point;
                point.subObjects.push(point.labelDiv);
            }

            if(definition.droplines) {
                if(definition.droplines.hasOwnProperty('horizontal')) {
                    point.horizontalDropline = new HorizontalDropline({
                        name: definition.name,
                        coordinates: definition.coordinates,
                        draggable: definition.yDrag,
                        yDrag: definition.yDrag,
                        yDragParam: definition.yDragParam,
                        axisLabel: definition.droplines.horizontal,
                        className: definition.className,
                        show: definition.show
                    });
                    point.horizontalDropline.parentObject = point;
                    point.subObjects.push(point.horizontalDropline);
                }
                if(definition.droplines.hasOwnProperty('vertical')) {
                    point.verticalDropline = new VerticalDropline({
                        name: definition.name,
                        coordinates: definition.coordinates,
                        draggable: definition.xDrag,
                        xDrag: definition.xDrag,
                        xDragParam: definition.xDragParam,
                        axisLabel: definition.droplines.vertical,
                        className: definition.className,
                        show: definition.show
                    });
                    point.verticalDropline.parentObject = point;
                    point.subObjects.push(point.verticalDropline);
                }
            }

            point.viewObjectSVGtype = 'path';
            point.viewObjectClass = 'pointSymbol';
        }

        createSubObjects(view,scope) {
            var p = this;
            if(view instanceof KG.TwoVerticalGraphs) {
                if(p.labelDiv) {
                    view.topGraph.addObject(p.labelDiv.update(scope));
                }
                if(p.verticalDropline) {
                    var continuationDropLine = new VerticalDropline({
                        name: p.verticalDropline.name,
                        className: p.verticalDropline.className,
                        coordinates: {x: p.verticalDropline.definition.coordinates.x, y: view.bottomGraph.yAxis.domain.max},
                        draggable: p.verticalDropline.draggable,
                        axisLabel: p.verticalDropline.axisLabel
                    });
                    p.verticalDropline.parentObject = p;
                    p.verticalDropline.labelDiv = null;
                    view.topGraph.addObject(p.verticalDropline.update(scope));
                    view.bottomGraph.addObject(continuationDropLine.update(scope));
                    p.verticalDropline.createSubObjects(view.topGraph,scope); // TODO should probably make this more recursive by default
                    continuationDropLine.createSubObjects(view.bottomGraph,scope);
                }
                if(p.horizontalDropline) {
                    view.topGraph.addObject(p.horizontalDropline.update(scope));
                    p.horizontalDropline.parentObject = p;
                    p.horizontalDropline.createSubObjects(view.topGraph,scope); // TODO should probably make this more recursive by default
                }
            } else {
                if(p.labelDiv) {
                    view.addObject(p.labelDiv.update(scope));
                }
                if(p.verticalDropline) {
                    view.addObject(p.verticalDropline.update(scope));
                    p.verticalDropline.createSubObjects(view,scope); // TODO should probably make this more recursive by default
                }
                if(p.horizontalDropline) {
                    view.addObject(p.horizontalDropline.update(scope));
                    p.horizontalDropline.createSubObjects(view,scope); // TODO should probably make this more recursive by default
                }
            }

            return view;
        }

        d3selection(view) {
            var point = this,
                subview = (view instanceof KG.TwoVerticalGraphs) ? view.topGraph : view;

            return subview.objectGroup(point.name, point.initGroupFn(), true).select('.'+point.viewObjectClass);
        }

        _highlight(view) {
            var point = this,
                pointSymbol = point.d3selection(view);

            pointSymbol
                .attr('d',d3.svg.symbol().type(point.symbol).size(point.size*1.5))
                .classed('highlight',true);
        }

        _unhighlight(view) {
            var point = this,
                pointSymbol = point.d3selection(view);

            pointSymbol
                .attr('d',d3.svg.symbol().type(point.symbol).size(point.size))
                .classed('highlight',false);
        }

        render(view) {

            var point = this,
                draggable = (point.xDrag || point.yDrag);

            var subview = (view instanceof KG.TwoVerticalGraphs) ? view.topGraph : view;

            if(!point.hasOwnProperty('coordinates')) {
                return view;
            }

            if(isNaN(point.coordinates.x) || isNaN(point.coordinates.y) || point.coordinates.x == Infinity || point.coordinates.y == Infinity) {
                return view;
            }

            var group:D3.Selection = subview.objectGroup(point.name, point.initGroupFn(), true);

            if(!subview.onGraph(point.coordinates)) {
                point.show = false;
            }

            if (point.symbol === 'none') {
                point.show = false;
                point.labelDiv.show = false;
            }

            // draw the symbol at the point
            var pointSymbol:D3.Selection = group.select('.'+ point.viewObjectClass);
            try {
                pointSymbol
                    .attr({
                        'class': point.classAndVisibility(),
                        'd': d3.svg.symbol().type(point.symbol).size(point.size),
                        'transform': subview.translateByCoordinates(point.coordinates)
                    });
            } catch(error) {
                console.log(error);
            }

            if(draggable){
                return point.setHighlightBehavior(view).setDragBehavior(subview,pointSymbol);
            } else {
                point.setHighlightBehavior(view);
                return view;
            }

        }
    }



}