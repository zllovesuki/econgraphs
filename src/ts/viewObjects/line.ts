/// <reference path="../kg.ts"/>

'use strict';

module KG {

    export interface LineDefinition extends ViewObjectDefinition {
        lineDef?: KGMath.Functions.LinearDefinition;
        linear?: any;
        arrows?: string;
        label?: GraphDivDefinition;
        xInterceptLabel?: string;
        yInterceptLabel?: string;
        x?: any;
        y?: any;
        areaUnderDef?: AreaDefinition;
        areaOverDef?: AreaDefinition;
    }

    export interface ILine extends IViewObject {

        definition: LineDefinition;
        linear: KGMath.Functions.Linear;
        labelDiv: GraphDiv;
        xInterceptLabelDiv: GraphDiv;
        yInterceptLabelDiv: GraphDiv;
        arrows: string;
        areaUnder: Area;
        areaOver: Area;
    }

    export class Line extends ViewObject implements ILine {

        public definition;
        public linear;
        public arrows;

        public labelDiv;
        public areaUnder;
        public areaOver;
        public xInterceptLabelDiv;
        public yInterceptLabelDiv;

        constructor(definition:LineDefinition, modelPath?: string) {

            super(definition, modelPath);

            var line = this;

            if(line instanceof HorizontalLine) {
                line.linear = new KGMath.Functions.HorizontalLine({y: definition.y});
            } else if(line instanceof VerticalLine) {
                line.linear = new KGMath.Functions.VerticalLine({x: definition.x});
            } else if(definition.hasOwnProperty('lineDef')) {
                line.linear = new KGMath.Functions.Linear(definition.lineDef);}

            line.viewObjectSVGtype = 'path';
            line.viewObjectClass = 'line';

            if(definition.label) {
                var labelDef:GraphDivDefinition = _.defaults(definition.label, {
                    name: definition.name + '_label',
                    className: definition.className,
                    interaction: definition.interaction,
                    show: definition.show
                });
                //console.log(labelDef);
                line.labelDiv = new GraphDiv(labelDef);
            }

            if(definition.areaUnderDef) {
                line.areaUnder = new Area(definition.areaUnderDef);
            }

            if(definition.areaOverDef) {
                line.areaOver = new Area(definition.areaOverDef);
            }

            if(definition.hasOwnProperty('xInterceptLabel')) {
                var xInterceptLabelDef:GraphDivDefinition = {
                    name: definition.name + 'x_intercept_label',
                    className: definition.className,
                    text: definition.xInterceptLabel,
                    dimensions: {width: 25, height:20},
                    interaction: definition.interaction,
                    backgroundColor: 'white',
                    show: definition.show
                };
                line.xInterceptLabelDiv = new KG.GraphDiv(xInterceptLabelDef);
            }

            if(definition.hasOwnProperty('yInterceptLabel')) {
                var yInterceptLabelDef:GraphDivDefinition = {
                    name: definition.name + 'y_intercept_label',
                    className: definition.className + ' axisLabel',
                    text: definition.yInterceptLabel,
                    dimensions: {width: 25, height:20},
                    interaction: definition.interaction,
                    show: definition.show
                };
                line.yInterceptLabelDiv = new KG.GraphDiv(yInterceptLabelDef);
            }

        }

        _update(scope) {
            var line = this;
            line.linear.update(scope);
            return line;
        }

        createSubObjects(view) {

            var line = this;

            if(line.xInterceptLabelDiv) {
                view.addObject(line.xInterceptLabelDiv)
            }

            if(line.yInterceptLabelDiv) {
                view.addObject(line.yInterceptLabelDiv)
            }

            if(line.labelDiv) {
                view.addObject(line.labelDiv)
            }

            if(line.areaUnder) {
                view.addObject(line.areaUnder);
                view.addObject(line.areaUnder.labelDiv);
            }

            return view;
        }

        render(view) {

            var NO_ARROW_STRING = 'NONE',
                BOTH_ARROW_STRING = 'BOTH',
                OPEN_ARROW_STRING = 'OPEN';

            var line = this,
                linear = this.linear;

            var group:D3.Selection = view.objectGroup(line.name, line.initGroupFn(), false);

            var startPoint = linear.points(view)[0],
                endPoint = linear.points(view)[1];

            if(startPoint == undefined || endPoint == undefined) {
                console.log('point is undefined')
            } else {
                var yIntercept = isAlmostTo(startPoint.x,view.xAxis.min) ? startPoint : isAlmostTo(endPoint.x,view.xAxis.min) ? endPoint : null;
                var xIntercept = isAlmostTo(startPoint.y,view.yAxis.min) ? startPoint : isAlmostTo(endPoint.y,view.yAxis.min) ? endPoint : null;
                var yRightEdge = isAlmostTo(startPoint.x,view.xAxis.max) ? startPoint : isAlmostTo(endPoint.x,view.xAxis.max) ? endPoint : null;
                var xTopEdge = isAlmostTo(startPoint.y,view.yAxis.max) ? startPoint : isAlmostTo(endPoint.y,view.yAxis.max) ? endPoint : null;
                var startIsOpen = (startPoint !== yIntercept && startPoint !== xIntercept);
                var endIsOpen = (endPoint !== yIntercept && endPoint !== xIntercept);

                if(line.arrows == BOTH_ARROW_STRING) {
                    line.addArrow(group,'start');
                    line.addArrow(group,'end');
                } else if(line.arrows == OPEN_ARROW_STRING) {
                    if(startIsOpen) {
                        line.addArrow(group,'start');
                    } else {
                        line.removeArrow(group,'start');
                    }
                    if(endIsOpen) {
                        line.addArrow(group,'end');
                    } else {
                        line.removeArrow(group,'end');
                    }
                } else if(line.arrows == NO_ARROW_STRING) {
                    line.removeArrow(group,'start');
                    line.removeArrow(group,'end');
                }

                if(line.labelDiv) {

                    var labelPoint,
                        labelAlign = (line.definition.hasOwnProperty('label') && line.definition.label.hasOwnProperty('align')) ? line.definition.label.align : 'left',
                        labelValign = (line.definition.hasOwnProperty('label') && line.definition.label.hasOwnProperty('valign')) ? line.definition.label.valign : 'bottom';

                    if(line instanceof VerticalLine) {
                        labelPoint = xTopEdge;
                        labelAlign = 'center';
                    } else if (line instanceof HorizontalLine) {
                        labelPoint = yRightEdge;
                        labelValign = 'middle';
                    } else if (linear.slope > 0) {
                        labelPoint = (startPoint.y > endPoint.y) ? startPoint : endPoint;
                    } else {
                        labelPoint = (startPoint.x > endPoint.x) ? startPoint : endPoint;
                    }

                    var yMin = view.yAxis.min + (view.yAxis.max - view.yAxis.min)*0.02;
                    line.labelDiv.coordinates = {x: labelPoint.x, y: Math.max(yMin, labelPoint.y)};
                    line.labelDiv.align = labelAlign;
                    line.labelDiv.valign = labelValign;

                }

                if(line.areaUnder) {
                    var areaData = [view.corners.bottom.left];
                    if(xIntercept) {
                        if(yIntercept) {
                            // line connects x-axis and y-intercept; color triangle below and to the left
                            areaData.push(xIntercept);
                            areaData.push(yIntercept);
                        } else if(xTopEdge) {
                            // line connects x-axis and top of graph; color quadrilateral formed by line and y-axis
                            areaData.push(xIntercept);
                            areaData.push(xTopEdge);
                            areaData.push(view.corners.top.left);
                        } else if(yRightEdge) {
                            // line connects x-axis and right of graph; color everything but the triangle in the lower-right
                            areaData.push(xIntercept);
                            areaData.push(yRightEdge);
                            areaData.push(view.corners.top.right);
                            areaData.push(view.corners.top.left);
                        }
                    } else if(yIntercept) {
                        if(xTopEdge && areNotTheSamePoint(xTopEdge,yIntercept)) {
                            // line connects y-axis and top of graph; color everything but the triangle in upper-left
                            areaData.push(yIntercept);
                            areaData.push(xTopEdge);
                            areaData.push(view.corners.top.right);
                            areaData.push(view.corners.bottom.right);
                        } else if(yRightEdge) {
                            // line connects y-axis and right of graph; color quadrilateral beneath the line
                            areaData.push(yIntercept);
                            areaData.push(yRightEdge);
                            areaData.push(view.corners.bottom.right);
                        }
                    } else {
                        // line connects top and right of graph; color everything except triangle in upper right
                        areaData.push(view.corners.top.left);
                        areaData.push(xTopEdge);
                        areaData.push(yRightEdge);
                        areaData.push(view.corners.bottom.right);
                    }
                    line.areaUnder.data = areaData;
                }

                if(line.areaOver) {
                    var areaData = [view.corners.top.right];
                    if(xIntercept) {
                        if(yIntercept) {
                            // line connects x-axis and y-intercept; color everything but the triangle below and to the left
                            areaData.push(view.corners.bottom.right);
                            areaData.push(xIntercept);
                            areaData.push(yIntercept);
                            areaData.push(view.corners.top.left);
                        } else if(xTopEdge) {
                            // line connects x-axis and top of graph; color quadrilateral formed by line and right edge
                            areaData.push(xTopEdge);
                            areaData.push(xIntercept);
                            areaData.push(view.corners.bottom.right);
                        } else if(yRightEdge) {
                            // line connects x-axis and right of graph; color everything but the triangle in the lower-right
                            areaData.push(yRightEdge);
                            areaData.push(xIntercept);
                            areaData.push(view.corners.bottom.left);
                            areaData.push(view.corners.top.left);
                        }
                    } else if(yIntercept) {
                        if(xTopEdge) {
                            // line connects y-axis and top of graph; color everything but the triangle in upper-left
                            areaData.push(xTopEdge);
                            areaData.push(yIntercept);
                            areaData.push(view.corners.bottom.left);
                            areaData.push(view.corners.bottom.right);
                        } else if(yRightEdge) {
                            // line connects y-axis and right of graph; color quadrilateral above the line
                            areaData.push(yRightEdge);
                            areaData.push(yIntercept);
                            areaData.push(view.corners.top.left);
                        }
                    } else {
                        // line connects top and right of graph; color triangle in upper right
                        areaData.push(xTopEdge);
                        areaData.push(yRightEdge);
                    }
                    line.areaOver.data = areaData;
                }

                if(line.xInterceptLabelDiv) {
                    line.xInterceptLabelDiv.coordinates = {x: line.linear.xValue(view.yAxis.min), y: 'AXIS'};
                }

                if(line.yInterceptLabelDiv) {
                    line.yInterceptLabelDiv.coordinates = {x: 'AXIS', y: line.linear.yValue(view.xAxis.min)};
                }

                var dataLine = d3.svg.line()
                    .x(function (d) { return view.xAxis.scale(d.x) })
                    .y(function (d) { return view.yAxis.scale(d.y) });

                var lineSelection:D3.Selection = group.select('.'+ line.viewObjectClass);
                var lineHandle:D3.Selection = group.select('.'+ line.viewObjectClass + 'Handle');

                lineSelection
                    .attr({
                        'class': line.classAndVisibility(),
                        'd': dataLine([startPoint,endPoint])
                    });

                lineHandle
                    .attr({
                        'class': line.classAndVisibility('Handle'),
                        'd': dataLine([startPoint,endPoint])
                    });

                line.interactionHandler.setBehavior(view,lineSelection);
                line.interactionHandler.setBehavior(view,lineHandle);
                return view;
            }

        }

    }

    export class VerticalLine extends Line {

        constructor(definition, modelPath?: string) {
            super(definition, modelPath);
        }
    }

    export class HorizontalLine extends Line {

        constructor(definition, modelPath?: string) {
            super(definition, modelPath);
        }
    }

}