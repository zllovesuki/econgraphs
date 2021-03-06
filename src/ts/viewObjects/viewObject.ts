/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    export interface ViewObjectDefinition extends ModelDefinition
    {
        name?: string;
        show?: any;
        objectName?: string;
        className?: string;
        interaction?: InteractionHandlerDefinition;
    }

    export interface IViewObject extends IModel
    {

        view: View;

        // identifiers
        name: string;
        objectName?: string;
        className?: string;

        show: boolean;
        d3group: (view: View) => D3.Selection;
        d3selection: (view:View) => D3.Selection;
        classAndVisibility: (suffix?:string) => string;

        // Creation and rendering
        initGroupFn: (additionalObjects?:string[]) => any;
        render: (view: View) => View;
        addArrow: (group:D3.Selection, startOrEnd: string) => void;
        removeArrow: (group:D3.Selection, startOrEnd: string) => void;
        createSubObjects: (view: View, scope: IScope) => View;

        // Dragging behavior
        interactionHandler: InteractionHandler;

    }

    export class ViewObject extends Model implements IViewObject
    {

        public view;

        public show;
        public className;
        public name;
        public objectName;
        public unmasked;

        public interactionHandler;

        public coordinates;
        public viewObjectSVGtype;
        public viewObjectClass;

        constructor(definition:ViewObjectDefinition, modelPath?: string) {

            definition = _.defaults(definition, {
                name: '',
                className: '',
                show: true,
                unmasked: false,
                interaction: {}
            });

            super(definition, modelPath);

            this.interactionHandler = new InteractionHandler(definition.interaction);

        }

        _update(scope) {
            var viewObj = this;
            viewObj.interactionHandler.update(scope);
            return this;
        }

        classAndVisibility(suffix?:string) {
            suffix = suffix || '';
            var classString = this.viewObjectClass + suffix;
            if(this.className) {
                classString += ' ' + this.className;
            }
            if(this.show) {
                classString += ' visible';
            } else {
                classString += ' invisible';
            }
            if(this.interactionHandler.highlightObject(this.view)) {
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
            group.attr("marker-" + startOrEnd, "url(#arrow-" + startOrEnd + "-" + colorForClassName(this.className) + ")")
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

        initGroupFn(additionalObjects?:string[]) {
            var viewObject = this,
                viewObjectSVGtype = viewObject.viewObjectSVGtype,
                viewObjectClass = viewObject.viewObjectClass;
            return function(newGroup:D3.Selection) {
                newGroup.append(viewObjectSVGtype).attr('class', viewObjectClass);
                newGroup.append(viewObjectSVGtype).attr('class', viewObjectClass + 'Handle');
                if(additionalObjects) {
                    additionalObjects.forEach(function(name){
                        newGroup.append(viewObjectSVGtype).attr('class', viewObjectClass + name);
                    })
                }
                return newGroup;
            }
        }





    }



}