/// <reference path="../kg.ts"/>

'use strict';

module KG {

    export interface SelectorOptionDefinition {
        name: string;
        label: string;
        selection: {type: string; definition: ModelDefinition}
    }

    export interface SelectorDefinition extends ModelDefinition {
        selected: string;
        options: SelectorOptionDefinition[];
    }

    export interface ISelector extends IModel {
        definition: SelectorDefinition;
        selected: string;
        options: SelectorOptionDefinition[];
        selectedObject: Model;
        getObjectByName: (name: string) => {type: string; def: ModelDefinition};
        selectOption: (name: string) => void;

    }

    export class Selector extends Model implements ISelector {

        public definition;
        public property;
        public selected;
        public options;
        public selectedObject;

        constructor(definition:SelectorDefinition, modelPath?:string) {
            super(definition, modelPath);
        }

        getObjectByName(name) {
            var s = this;
            var foundObject = getArrayObjectByProperty(s.definition.options,name);
            if(foundObject) {
                return foundObject.selection;
            } else {
                return null;
            }
        }

        selectOption(name) {
            var s = this;
            s.selectedObject = s.getObjectByName(name);
        }

        _update(scope) {
            var s = this;
            if(s.selected) {
                s.selectOption(s.selected);
            }
            if(s.selectedObject.hasOwnProperty('type') && s.selectedObject.hasOwnProperty('definition')) {
                s.selectedObject = createInstance(s.selectedObject, s.modelPath);
            }
            // hide the fact that this is a selector and update
            s.selectedObject.selector = null;
            s.selectedObject = s.selectedObject.update(scope);

            // attach selector to object again and return
            s.selectedObject.selector = s;

            function set(path, value) {
                var schema = scope;  // a moving reference to internal objects within obj
                var pList = path.split('.');
                var len = pList.length;
                for(var i = 0; i < len-1; i++) {
                    var elem = pList[i];
                    if( !schema[elem] ) schema[elem] = {}
                    schema = schema[elem];
                }

                schema[pList[len-1]] = value;
            }

            set(s.modelPath, s.selectedObject);
            return s.selectedObject;
        }

    }
}

