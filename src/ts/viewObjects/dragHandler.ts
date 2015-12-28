/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    export interface DragHandlerDefinition extends ModelDefinition
    {

        // xDrag and yDrag may be parameters ('params.x') or expressions that evaluate to booleans ('!model.snap')
        xDrag?: any;
        yDrag?: any;

        // xDragParam and yDragParam are parameter names ('x', not 'params.x')
        xDragParam?: string;
        yDragParam?: string;
    }

    export interface IDragHandler extends IModel
    {
        xDrag:boolean;
        yDrag:boolean;
        xDragParam: string;
        yDragParam: string;
        setDragBehavior: (view: View, selection: D3.Selection, highlightParam: string) => View;
    }

    export class DragHandler extends Model implements IDragHandler
    {

        public xDrag;
        public yDrag;
        public xDragParam;
        public yDragParam;

        constructor(definition:DragHandlerDefinition, modelPath?: string) {

            if(definition.hasOwnProperty('xDrag') && typeof definition.xDrag == 'string' && !definition.hasOwnProperty('xDragParam')) {
                definition.xDragParam = definition.xDrag;
                definition.xDrag = true;
            }

            if(definition.hasOwnProperty('yDrag') && typeof definition.yDrag == 'string' && !definition.hasOwnProperty('yDragParam')) {
                definition.yDragParam = definition.yDrag;
                definition.yDrag = true;
            }

            if(definition.hasOwnProperty('xDragParam') && typeof definition.xDragParam == 'string') {
                definition.xDragParam = definition.xDragParam.replace('params.','');
            }

            if(definition.hasOwnProperty('yDragParam') && typeof definition.yDragParam == 'string') {
                definition.yDragParam = definition.yDragParam.replace('params.','');
            }

            definition = _.defaults(definition, {
                xDrag: false,
                yDrag: false,
            });

            super(definition, modelPath);

        }

        setDragBehavior(view, selection, highlightParam) {

            var dragHandler = this;

            function drag() {
                var xAxis = view.xAxis;
                var yAxis = view.yAxis;
                return d3.behavior.drag()
                    .on('drag', function () {
                        d3.event.sourceEvent.preventDefault();
                        var dragUpdate = {};
                        dragUpdate[highlightParam] = true;
                        var relativeElement = view.unmasked[0][0],
                            mouseX = d3.mouse(relativeElement)[0],
                            mouseY = d3.mouse(relativeElement)[1];
                        if(xAxis && dragHandler.xDragParam !== null) {
                            dragUpdate[dragHandler.xDragParam] = xAxis.domain.closestValueTo(xAxis.scale.invert(mouseX));
                        }
                        if(yAxis && dragHandler.yDragParam !== null) {
                            dragUpdate[dragHandler.yDragParam] = yAxis.domain.closestValueTo(yAxis.scale.invert(mouseY));
                        }
                        view.updateParams(dragUpdate);
                    })
                    .on('dragend', function() {
                        var dragUpdate = {};
                        dragUpdate[highlightParam] = true;
                        view.updateParams(dragUpdate);
                    })
            }

            function cursor(xDrag, yDrag) {
                if(xDrag && yDrag) {
                    return 'move';
                } else if (xDrag && !yDrag) {
                    return 'ew-resize';
                } else if (!xDrag && yDrag) {
                    return 'ns-resize';
                } else {
                    return 'default'
                }

            }

            selection.style('cursor', cursor(dragHandler.xDrag, dragHandler.yDrag));
            if(this.xDrag || this.yDrag) {
                selection.call(drag());
            }
            return view;
        }

    }



}