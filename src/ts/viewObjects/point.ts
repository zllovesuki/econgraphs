/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    export interface PointDefinition extends ViewObjectDefinition {
        symbol?: string;
        size?: number;
        label?: GraphDivDefinition;
        droplines?: any;
        coordinates: ICoordinates;
    }

    export interface IPoint extends IViewObject {

        // point-specific attributes
        coordinates: ICoordinates;
        symbol: string;
        size: number;
        labelDiv: IGraphDiv;
        horizontalDropline: HorizontalDropline;
        verticalDropline: VerticalDropline;
    }

    export class Point extends ViewObject implements IPoint
    {

        // point-specific attributes
        public symbol;
        public size;
        public labelDiv;
        public horizontalDropline;
        public verticalDropline;

        constructor(definition:PointDefinition, modelPath?: string) {

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

            if(definition.hasOwnProperty('interaction')) {
                if(definition.interaction.hasOwnProperty('draggable')) {
                    definition.interaction.xDrag = definition.interaction.draggable;
                    definition.interaction.yDrag = definition.interaction.draggable;
                }
                if(definition.interaction.hasOwnProperty('xDrag') && !definition.interaction.hasOwnProperty('xDragParam')) {
                    definition.interaction.xDragParam = definition.coordinates.x;
                }
                if(definition.interaction.hasOwnProperty('yDrag') && !definition.interaction.hasOwnProperty('yDragParam')) {
                    definition.interaction.yDragParam = definition.coordinates.y;
                }
                if(definition.hasOwnProperty('label') && definition.hasOwnProperty('highlight')) {
                    definition.highlight = definition.highlight || definition.interaction.highlight;
                    definition.interaction.highlight = null;
                }
            }

            super(definition, modelPath);

            var point = this;

            if(definition.label) {
                var labelDef = _.defaults(definition.label, {
                    name: definition.name + '_label',
                    className: definition.className,
                    coordinates: definition.coordinates,
                    interaction: _.clone(definition.interaction),
                    show: definition.show
                });
                point.labelDiv = new GraphDiv(labelDef);
            }

            if(definition.droplines) {
                if(definition.droplines.hasOwnProperty('horizontal')) {
                    point.horizontalDropline = new HorizontalDropline({
                        name: definition.name,
                        coordinates: definition.coordinates,
                        interaction: _.clone(definition.interaction),
                        axisLabel: definition.droplines.horizontal,
                        className: definition.className,
                        show: definition.show
                    });
                }
                if(definition.droplines.hasOwnProperty('vertical')) {
                    point.verticalDropline = new VerticalDropline({
                        name: definition.name,
                        coordinates: definition.coordinates,
                        interaction: _.clone(definition.interaction),
                        axisLabel: definition.droplines.vertical,
                        className: definition.className,
                        show: definition.show
                    });
                }
            }

            point.viewObjectSVGtype = 'path';
            point.viewObjectClass = 'pointSymbol';

        }

        createSubObjects(view) {
            var p = this;
            if(view instanceof KG.TwoVerticalGraphs) {
                if(p.labelDiv) {
                    view.topGraph.addObject(p.labelDiv);
                }
                if(p.verticalDropline) {
                    var continuationDropLine = new VerticalDropline({
                        name: p.verticalDropline.name,
                        className: p.verticalDropline.className,
                        coordinates: {x: p.verticalDropline.definition.coordinates.x, y: view.bottomGraph.yAxis.domain.max},
                        interaction: p.verticalDropline.definition.interaction,
                        axisLabel: p.verticalDropline.axisLabel
                    });
                    p.verticalDropline.labelDiv = null;
                    view.topGraph.addObject(p.verticalDropline);
                    view.bottomGraph.addObject(continuationDropLine);
                    p.verticalDropline.createSubObjects(view.topGraph); // TODO should probably make this more recursive by default
                    continuationDropLine.createSubObjects(view.bottomGraph);
                }
                if(p.horizontalDropline) {
                    view.topGraph.addObject(p.horizontalDropline);
                    p.horizontalDropline.createSubObjects(view.topGraph); // TODO should probably make this more recursive by default
                }
            } else {
                if(p.labelDiv) {
                    view.addObject(p.labelDiv);
                }
                if(p.verticalDropline) {
                    view.addObject(p.verticalDropline);
                    p.verticalDropline.createSubObjects(view); // TODO should probably make this more recursive by default
                }
                if(p.horizontalDropline) {
                    view.addObject(p.horizontalDropline);
                    p.horizontalDropline.createSubObjects(view); // TODO should probably make this more recursive by default
                }
            }

            return view;
        }

        d3selection(view) {
            var point = this,
                subview = (view instanceof KG.TwoVerticalGraphs) ? view.topGraph : view;

            return subview.objectGroup(point.name, point.initGroupFn(), true).select('.'+point.viewObjectClass);
        }

        render(view) {

            var point = this;

            if(!point.hasOwnProperty('coordinates')) {
                return view;
            }

            if(isNaN(point.coordinates.x) || isNaN(point.coordinates.y) || point.coordinates.x == Infinity || point.coordinates.y == Infinity) {
                return view;
            }

            var subview = (view instanceof KG.TwoVerticalGraphs) ? view.topGraph : view;

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
            var dragHandle:D3.Selection = group.select('.'+ point.viewObjectClass + 'Handle');

            var currentSize = point.interactionHandler.highlight ? point.size*1.5 : point.size;
            try {
                pointSymbol
                    .attr({
                        'class': point.classAndVisibility(),
                        'd': d3.svg.symbol().type(point.symbol).size(currentSize),
                        'transform': subview.translateByCoordinates(point.coordinates)
                    });
                dragHandle
                    .attr({
                        'class': point.classAndVisibility(),
                        'd': d3.svg.symbol().type(point.symbol).size(currentSize*2),
                        'transform': subview.translateByCoordinates(point.coordinates)
                    });
            } catch(error) {
                console.log(error);
            }

            point.interactionHandler.setBehavior(view,pointSymbol);
            point.interactionHandler.setBehavior(view,dragHandle);

            return view;

        }
    }



}