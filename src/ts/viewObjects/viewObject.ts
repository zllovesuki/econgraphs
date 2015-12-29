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
        highlight?: string;
        interaction: InteractionHandlerDefinition;
    }

    export interface IViewObject extends IModel
    {

        view: View;

        // identifiers
        name: string;
        objectName?: string;
        className?: string;
        highlight: boolean;

        show: boolean;
        d3group: (view: View) => D3.Selection;
        d3selection: (view:View) => D3.Selection;
        classAndVisibility: () => string;

        // Creation and rendering
        initGroupFn: (svgType:string, className: string) => any;
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
        public highlight;
        public name;
        public objectName;
        public unmasked;

        public interactionHandler;

        public coordinates;
        public viewObjectSVGtype;
        public viewObjectClass;

        constructor(definition:ViewObjectDefinition, modelPath?: string) {

            if(definition.hasOwnProperty('interaction') && definition.interaction.hasOwnProperty('highlightParam') && !definition.hasOwnProperty('highlight')) {
                definition.highlight = 'params.' + definition.interaction.highlightParam;
            }

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
            if(this.view && this.view.scope && this.view.scope.params.highlight) {
                if(this.interactionHandler.highlightParam == this.view.scope.params.highlight) {
                    classString += ' highlight';
                }
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

        initGroupFn() {
            var viewObjectSVGtype = this.viewObjectSVGtype,
                viewObjectClass = this.viewObjectClass;
            return function(newGroup:D3.Selection) {
                newGroup.append(viewObjectSVGtype).attr('class', viewObjectClass);
                return newGroup;
            }
        }





    }



}