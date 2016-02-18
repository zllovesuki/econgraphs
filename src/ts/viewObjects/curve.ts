/// <reference path="../kg.ts"/>

'use strict';

module KG {

    export interface CurveDefinition extends ViewObjectWithDomainDefinition {
        data?: any;
        interpolation?: string;
        area?: any;
        label?: GraphDivDefinition;
        labelPosition?: string;
        arrows?: string;
    }

    export interface ICurve extends IViewObjectWithDomain {

        data: ICoordinates[];
        area: string;
        interpolation: string;

        labelDiv: IGraphDiv;
        labelPosition: string;
        positionLabel: (view:IView) => void;

        startArrow: boolean;
        endArrow: boolean;

        startPoint: ICoordinates;
        midPoint: ICoordinates;
        endPoint: ICoordinates;

        //LABEL_POSITION_MIDDLE: string;
        //LABEL_POSITION_START: string;

        START_ARROW_STRING: string;
        END_ARROW_STRING: string;
        BOTH_ARROW_STRING: string;
    }

    export class Curve extends ViewObjectWithDomain implements ICurve {

        public data;
        public area;
        public startPoint;
        public midPoint;
        public endPoint;

        public interpolation;

        public label;
        public labelPosition;
        public labelDiv;

        public startArrow;
        public endArrow;

        public START_ARROW_STRING;
        public END_ARROW_STRING;
        public BOTH_ARROW_STRING;

        static LABEL_POSITION_MIDDLE ='MIDDLE';
        static LABEL_POSITION_START = 'START';

        static START_ARROW_STRING = 'START';
        static END_ARROW_STRING = 'END';
        static BOTH_ARROW_STRING = 'BOTH';


        constructor(definition:CurveDefinition, modelPath?: string) {

            definition = _.defaults(definition, {data: [], interpolation: 'linear'});

            super(definition, modelPath);

            var curve = this;

            if(definition.label) {
                var labelDef = _.defaults(definition.label, {
                    name: definition.name + '_label',
                    objectName: definition.objectName,
                    className: definition.className,
                    interaction: definition.interaction,
                    show: definition.show
                });
                //console.log(labelDef);
                curve.labelDiv = new GraphDiv(labelDef);
            }

            curve.startArrow = (definition.arrows == Curve.START_ARROW_STRING || definition.arrows == Curve.BOTH_ARROW_STRING);
            curve.endArrow = (definition.arrows == Curve.END_ARROW_STRING || definition.arrows == Curve.BOTH_ARROW_STRING);

            curve.viewObjectSVGtype = 'path';
            curve.viewObjectClass = curve.hasOwnProperty('area') ? 'curveArea' : 'curve';
        }

        createSubObjects(view) {
            var labelDiv = this.labelDiv;
            if(labelDiv) {
                return view.addObject(labelDiv);
            } else {
                return view;
            }
        }

        positionLabel(view) {
            var curve = this,
                autoAlign = 'center',
                autoVAlign = 'middle';
            if(curve.labelDiv) {
                if(!curve.startPoint) {
                    curve.labelDiv.show = false;
                } else {
                    curve.labelDiv.show = curve.show;
                    var labelViewCoordinates = (curve.labelPosition == Curve.LABEL_POSITION_START) ? curve.startPoint : (curve.labelPosition == Curve.LABEL_POSITION_MIDDLE) ? curve.midPoint : curve.endPoint;
                    var labelCoordinates = view.modelCoordinates(_.clone(labelViewCoordinates));
                    if(labelCoordinates.y > view.yAxis.domain.max) {
                        labelCoordinates.y = view.yAxis.domain.max;
                        autoVAlign = 'bottom';
                    } else if(labelCoordinates.x >= view.xAxis.domain.max) {
                        labelCoordinates.x = view.xAxis.domain.max;
                        autoAlign = 'left';
                    } else {
                        autoAlign = (view.nearRight(labelCoordinates) || view.nearLeft(labelCoordinates)) || view.nearBottom(labelCoordinates) ? 'left' : 'center';
                        autoVAlign = (view.nearTop(labelCoordinates) || view.nearBottom(labelCoordinates)) ? 'bottom' : 'middle';
                    }
                    curve.labelDiv.coordinates = labelCoordinates;
                    if(!curve.labelDiv.definition.hasOwnProperty('align')) {
                        curve.labelDiv.align = autoAlign;
                    }
                    if(!curve.labelDiv.definition.hasOwnProperty('valign')) {
                        curve.labelDiv.valign = autoVAlign;
                    }
                }
            }
        }

        addArrows(group: D3.Selection) {

            var curve = this;

            var length = KG.distanceBetweenCoordinates(curve.startPoint, curve.endPoint);

            if(length) {
                if(curve.endArrow && length > 0) {
                    curve.addArrow(group,'end');
                } else {
                    curve.removeArrow(group,'end');
                }

                if(curve.startArrow && length > 0) {
                    curve.addArrow(group,'start');
                } else {
                    curve.removeArrow(group,'start');
                }
            }


        }

        render(view) {

            var curve = this,
                area = {draw: false, left: false, right: false, above: false, below: false};

            if(curve.hasOwnProperty('area')) {
                area.draw = true;
                area.left = (curve.area.indexOf('LEFT') > -1);
                area.right = (curve.area.indexOf('RIGHT') > -1);
                area.above = (curve.area.indexOf('ABOVE') > -1);
                area.below = (curve.area.indexOf('BELOW') > -1);
            }

            //console.log(area);

            curve.updateDataForView(view);

            var dataCoordinates:ICoordinates[] = view.dataCoordinates(curve.data);

            var dataLength = dataCoordinates.length;

            curve.startPoint = dataCoordinates[0];
            curve.endPoint = dataCoordinates[dataLength - 1];
            curve.midPoint = medianDataPoint(dataCoordinates);

            var additionalObjects = [];
            if(area.left) {additionalObjects.push('Left')}
            if(area.right) {additionalObjects.push('Right')}

            var group:D3.Selection = view.objectGroup(curve.name, curve.initGroupFn(additionalObjects), false);

            curve.positionLabel(view);

            var dataLine;

            if(curve.hasOwnProperty('area')) {
                if(curve.area.indexOf('ABOVE') > -1) {
                dataLine = d3.svg.area()
                    .interpolate(curve.interpolation)
                    .x(function (d) { return d.x })
                    .y0(function (d) { return d.y })
                    .y1(view.yAxis.scale(view.yAxis.max) - 10);
            } else if (curve.area.indexOf('BELOW') > -1) {
                dataLine = d3.svg.area()
                    .interpolate(curve.interpolation)
                    .x(function (d) { return d.x })
                    .y0(function (d) { return d.y })
                    .y1(view.yAxis.scale(view.yAxis.min));
            } else {
                dataLine = d3.svg.line()
                .interpolate(curve.interpolation)
                .x(function (d) { return d.x })
                .y(function (d) { return d.y });
            }
            } else {
                    dataLine = d3.svg.line()
                .interpolate(curve.interpolation)
                .x(function (d) { return d.x })
                .y(function (d) { return d.y });
                }

            if(curve.hasOwnProperty('area') && curve.area.indexOf('ABOVE') > -1) {
                dataLine = d3.svg.area()
                    .interpolate(curve.interpolation)
                    .x(function (d) { return d.x })
                    .y0(function (d) { return d.y })
                    .y1(view.yAxis.scale(view.yAxis.max) - 10);
            } else if (curve.hasOwnProperty('area') && curve.area.indexOf('BELOW') > -1) {
                dataLine = d3.svg.area()
                    .interpolate(curve.interpolation)
                    .x(function (d) { return d.x })
                    .y0(function (d) { return d.y })
                    .y1(view.yAxis.scale(view.yAxis.min));
            } else {
                dataLine = d3.svg.line()
                .interpolate(curve.interpolation)
                .x(function (d) { return d.x })
                .y(function (d) { return d.y });
            }


            var selector = curve.hasOwnProperty('objectName') ? 'path.' + curve.objectName : 'path.' + curve.viewObjectClass;

            var dataPath:D3.Selection = group.select(selector);
            var dragHandle:D3.Selection = group.select(selector+'Handle');

            if(!curve.show) {
                var element_name = curve.name+'_label';
                //console.log('removing element ',element_name);
                d3.select('#'+element_name).remove();
            }

            dataPath
                .attr({
                    'class': curve.classAndVisibility(),
                    'd': dataLine(dataCoordinates)
                });

            curve.addArrows(dataPath);

            dragHandle
                .attr({
                    'class': curve.classAndVisibility('Handle'),
                    'd': dataLine(dataCoordinates)
                });

            if(area.left){
                group.select(selector+'Left').attr({
                    'class': curve.classAndVisibility('Left'),
                    'd': dataLine([
                        {x: view.xAxis.scale(view.xAxis.min), y:area.below ? view.yAxis.scale(view.yAxis.max) : view.yAxis.scale(view.yAxis.min)},
                        {x: KG.arrayMinCoordinate(dataCoordinates)+1, y:area.below ? view.yAxis.scale(view.yAxis.max) : view.yAxis.scale(view.yAxis.min)}
                    ])
                });
            }

            if(area.right) {
                group.select(selector+'Right').attr({
                    'class': curve.classAndVisibility('Right'),
                    'd': dataLine([
                        {x: view.xAxis.scale(view.xAxis.max), y:area.below ? view.yAxis.scale(view.yAxis.max) : view.yAxis.scale(view.yAxis.min)},
                        {x: KG.arrayMaxCoordinate(dataCoordinates)-1, y:area.below ? view.yAxis.scale(view.yAxis.max) : view.yAxis.scale(view.yAxis.min)}
                    ])
                });
            }


            curve.interactionHandler.setBehavior(view,dataPath);
            curve.interactionHandler.setBehavior(view,dragHandle);

            return view;
        }

    }

}