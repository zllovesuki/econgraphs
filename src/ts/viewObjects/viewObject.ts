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
        xDrag:boolean;
        yDrag:boolean;
        xDragParam: string;
        yDragParam: string;
        xDragDelta: number;
        yDragDelta: number;
        setDragBehavior: (view: View, obj: D3.Selection) => View;

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

        public coordinates;
        public xDrag;
        public yDrag;
        public xDragParam;
        public yDragParam;
        public xDragDelta;
        public yDragDelta;
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

            definition = _.defaults(definition, {
                name: '',
                className: '',
                color: KG.colorForClassName(definition.className),
                show: true,
                xDrag: false,
                yDrag: false,
                unmasked: false
            });

            if(definition.hasOwnProperty('xDrag') && !definition.hasOwnProperty('xDragParam')) {
                if(typeof definition.xDrag == 'string') {
                    definition.xDragParam = definition.xDrag.replace('params.','');
                    definition.xDrag = true;
                } else if(definition.hasOwnProperty('coordinates') && typeof definition.coordinates.x == 'string') {
                    definition.xDragParam = definition.coordinates.x.replace('params.','');
                }
            }

            if(definition.hasOwnProperty('yDrag') && !definition.hasOwnProperty('yDragParam')) {
                if(typeof definition.yDrag == 'string') {
                    definition.yDragParam = definition.yDrag.replace('params.','');
                    definition.yDrag = true;
                } else if(definition.hasOwnProperty('coordinates') && typeof definition.coordinates.y == 'string') {
                    definition.yDragParam = definition.coordinates.y.replace('params.','');
                }
            }

            super(definition, modelPath);

            var viewObj = this;

            /* Set drag behavior on object */
            viewObj.xDragDelta = 0;
            viewObj.yDragDelta = 0;

            if(definition.hasOwnProperty('xDomainDef')) {
                viewObj.xDomain = new KG.Domain(definition.xDomainDef.min, definition.xDomainDef.max);
            }
            if(definition.hasOwnProperty('yDomainDef')) {
                viewObj.yDomain = new KG.Domain(definition.yDomainDef.min, definition.yDomainDef.max);
            }
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

        setDragBehavior(view, obj) {
            var viewObj = this;
            obj.style('cursor', viewObj.xDrag ? (viewObj.yDrag ? 'move' : 'ew-resize') : 'ns-resize');
            obj.call(view.drag(viewObj));
            return view;
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