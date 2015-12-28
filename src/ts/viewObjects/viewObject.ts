/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    export interface ViewObjectParamsDefinition {
        name?: string;
        objectName?: string;
        className?: string;
        xDrag?: any;
        yDrag?: any;
        show?: any;
    }

    export interface ViewObjectDefinition extends ModelDefinition
    {
        name?: string;
        show?: any;
        objectName?: string;
        className?: string;
        xDrag?: any;
        yDrag?: any;
        xDragParam?: string;
        yDragParam?: string;

        highlightParam?: string;
        highlight?: string;

        color?: string;
        coordinates?: ICoordinates;
        xDomain?: Domain;
        yDomain?: Domain;
        xDomainDef?: DomainDef;
        yDomainDef?: DomainDef;
        params?: ViewObjectParamsDefinition;
    }

    export interface IViewObject extends IModel
    {
        // identifiers
        name: string;
        objectName?: string;
        unmasked?: boolean;
        className?: string;
        color: string;

        show: boolean;
        classAndVisibility: () => string;
        xDomain?: Domain;
        yDomain?: Domain;

        // Creation and rendering
        initGroupFn: (svgType:string, className: string) => any;
        render: (view: View) => View;
        addArrow: (group:D3.Selection, startOrEnd: string) => void;
        removeArrow: (group:D3.Selection, startOrEnd: string) => void;
        createSubObjects: (view: View, scope: IScope) => View;

        // Highlighting
        highlightParam: string;
        highlight: boolean;

        // Updating
        updateDataForView: (view: View) => ViewObject

        // Hover behavior
        d3group: (view: View) => D3.Selection;
        d3selection: (view:View) => D3.Selection;
        setHighlightBehavior: (view: View) => ViewObject;

        // Dragging behavior
        coordinates: ICoordinates;
        dragHandler: DragHandler;

    }

    export class ViewObject extends Model implements IViewObject
    {

        public show;
        public className;
        public color;
        public name;
        public objectName;
        public unmasked;

        public highlightParam;
        public highlight;

        public dragHandler;

        public coordinates;
        public viewObjectSVGtype;
        public viewObjectClass;
        public xDomain;
        public yDomain;

        constructor(definition:ViewObjectDefinition, modelPath?: string) {

            if(definition.hasOwnProperty('params')) {

                var p = definition.params;

                if(p.hasOwnProperty('className')) {
                    if(definition.hasOwnProperty('className')) {
                        definition.className += ' ' + p.className;
                    } else {
                        definition.className = p.className;
                    }
                }

                if(p.hasOwnProperty('name')) {
                    if(definition.hasOwnProperty('name')) {
                        definition.name += '_' + p.name;
                    } else {
                        definition.name = p.name;
                    }
                }

                if(p.hasOwnProperty('objectName')) {
                    definition.objectName = p.objectName;
                }

                if(p.hasOwnProperty('xDrag')) {
                    definition.xDrag = p.xDrag;
                }

                if(p.hasOwnProperty('yDrag')) {
                    definition.yDrag = p.yDrag;
                }

                if(p.hasOwnProperty('show')) {
                    definition.show = p.show;
                }

            }

            var dragHandlerDefinition:DragHandlerDefinition = {
                xDrag: definition.xDrag,
                yDrag: definition.yDrag
            };

            if(definition.hasOwnProperty('xDragParam')) {
                dragHandlerDefinition.xDragParam = definition.xDragParam;
            }

            if(definition.hasOwnProperty('yDragParam')) {
                dragHandlerDefinition.yDragParam = definition.yDragParam;
            }

            definition = _.defaults(definition, {
                name: '',
                className: '',
                color: KG.colorForClassName(definition.className),
                show: true,
                unmasked: false
            });

            super(definition, modelPath);

            var viewObj = this;

            if(definition.hasOwnProperty('xDomainDef')) {
                viewObj.xDomain = new KG.Domain(definition.xDomainDef.min, definition.xDomainDef.max);
            }
            if(definition.hasOwnProperty('yDomainDef')) {
                viewObj.yDomain = new KG.Domain(definition.yDomainDef.min, definition.yDomainDef.max);
            }

            viewObj.dragHandler = new DragHandler(dragHandlerDefinition);
        }

        classAndVisibility() {
            var classString = this.viewObjectClass;
            if(this.className) {
                classString += ' ' + this.className;
            }
            if(this.show) {
                classString += ' visible';
            } else {
                classString += ' invisible';
            }
            if(this.highlight) {
                classString += ' highlight';
            }
            if(this.hasOwnProperty('objectName')) {
                classString += ' ' + this.objectName
            }
            return classString;
        }

        updateDataForView(view) {
            return this;
        }

        addArrow(group: D3.Selection, startOrEnd: string) {
            group.attr("marker-" + startOrEnd, "url(#arrow-" + startOrEnd + "-" + this.color + ")")
        }

        removeArrow(group: D3.Selection, startOrEnd: string) {
            group.attr("marker-" + startOrEnd, null);
        }

        d3group(view) {
            var viewObj = this;
            return view.objectGroup(viewObj.name, viewObj.initGroupFn(), viewObj.unmasked);
        }

        d3selection(view){
            var viewObj = this;
            var group = viewObj.d3group(view);
            if(group) {
                return group.select('.' + viewObj.viewObjectClass);
            }
        }

        render(view) {
            return view; // overridden by child class
        }

        createSubObjects(view, scope) {
            return view; // overridden by child class
        }

        initGroupFn() {
            var viewObjectSVGtype = this.viewObjectSVGtype,
                viewObjectClass = this.viewObjectClass;
            return function(newGroup:D3.Selection) {
                newGroup.append(viewObjectSVGtype).attr('class', viewObjectClass);
                return newGroup;
            }
        }

        setHighlightBehavior(view) {
            var viewObj = this,
                selection = viewObj.d3selection(view);
            if(viewObj.hasOwnProperty('highlightParam')) {
                selection.on('mouseover', function() {
                    var highlightUpdate = {};
                    highlightUpdate[viewObj.highlightParam] = true;
                    view.updateParams(highlightUpdate);
                });
                selection.on('mouseout', function() {
                    var highlightUpdate = {};
                    highlightUpdate[viewObj.highlightParam] = false;
                    view.updateParams(highlightUpdate);
                });
            }
            return viewObj;
        }



    }



}