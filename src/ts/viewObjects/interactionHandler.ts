/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    export interface InteractionHandlerDefinition extends ModelDefinition
    {

        // If there's an obvious way the object can be dragged, can just set 'draggable' to 'true'
        // The view object class will use this to set xDrag and yDrag appropriately.
        draggable?: any;

        // xDrag and yDrag may be parameters ('params.x') or expressions that evaluate to booleans ('!model.snap')
        xDrag?: any;
        yDrag?: any;

        // xDragParam and yDragParam are parameter names ('x', not 'params.x')
        xDragParam?: string;
        yDragParam?: string;

        highlight?: any;
    }

    export interface IInteractionHandler extends IModel
    {
        xDrag:boolean;
        yDrag:boolean;
        xDragParam: string;
        yDragParam: string;
        highlight: string;
        setBehavior: (view: View, selection: D3.Selection) => View;
    }

    export class InteractionHandler extends Model implements IInteractionHandler
    {

        public xDrag;
        public yDrag;
        public xDragParam;
        public yDragParam;
        public highlight;

        constructor(definition:InteractionHandlerDefinition, modelPath?: string) {

            definition = definition || {};

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

            super(definition, modelPath);

        }

        setBehavior(view, selection) {

            var interactionHandler = this;

            function drag() {
                var xAxis = view.xAxis;
                var yAxis = view.yAxis;
                return d3.behavior.drag()
                    .on('drag', function () {
                        d3.event.sourceEvent.preventDefault();
                        var dragUpdate = {};
                        view.scope.updateParams({highlight: interactionHandler.highlight});
                        var relativeElement = view.unmasked[0][0],
                            mouseX = d3.mouse(relativeElement)[0],
                            mouseY = d3.mouse(relativeElement)[1];
                        if(xAxis && interactionHandler.xDragParam !== null) {
                            dragUpdate[interactionHandler.xDragParam] = xAxis.domain.closestValueTo(xAxis.scale.invert(mouseX));
                        }
                        if(yAxis && interactionHandler.yDragParam !== null) {
                            dragUpdate[interactionHandler.yDragParam] = yAxis.domain.closestValueTo(yAxis.scale.invert(mouseY));
                        }
                        view.scope.updateParams(dragUpdate);
                    })
                    .on('dragend', function() {
                        d3.event.sourceEvent.preventDefault();
                        view.scope.updateParams({highlight: null});
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

            selection.style('cursor', cursor(interactionHandler.xDrag, interactionHandler.yDrag));
            if(this.xDrag || this.yDrag) {
                selection.call(drag());
            }

            if(interactionHandler.hasOwnProperty('highlight')) {
                selection.on('mouseover', function() {
                    view.scope.updateParams({highlight: interactionHandler.highlight});
                });
            }

            return view;
        }

    }



}