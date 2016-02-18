'use strict';

module KG
{
    export interface ModelDefinition
    {

    }

    export interface IPropertySetter
    {
        name: string;
        value: any;
        defaultValue: any;
    }

    export interface IModel
    {
        definition: ModelDefinition;
        updateVersion: number;
        params: any;
        modelPath: string;
        modelProperty: (name:string) => string;
        selector?: Selector;
        setNumericProperty: (propertySetter:IPropertySetter) => Model;
        setArrayProperty: (propertySetter:IPropertySetter) => Model;
        update: (scope:IScope, callback?: (any)=>any) => void;
        _update: (scope:IScope) => Model;
        _calculateValues: () => Model;
    }



    export class Model implements IModel
    {

        public updateVersion;
        public selector;
        public params;

        constructor(public definition:ModelDefinition, public modelPath?: string) {

            var model = this;

            model.modelPath = modelPath || 'model';

            for (var key in definition) {
                if(definition.hasOwnProperty(key) && definition[key] != undefined) {
                    var value = definition[key];
                    if(value.hasOwnProperty('type') && value.hasOwnProperty('definition')) {
                        model[key] = createInstance(value, model.modelPath + '.' + key)
                    } else {
                        model[key] = value;
                    }
                }
            }

            //console.log('instantiating new ',this);
        }

        modelProperty(name) {
            return this.modelPath + '.' + name;
        }

        setNumericProperty(propertySetter) {
            var model = this;
            if(!isNaN(propertySetter.value)) {
                model[propertySetter.name] = propertySetter.value;
            } else if(!model.hasOwnProperty(propertySetter.name)) {
                model[propertySetter.name] = propertySetter.defaultValue || 0;
            }
            return model;
        }

        setArrayProperty(propertySetter) {
            var model = this;
            if(propertySetter.value instanceof Array) {
                model[propertySetter.name] = propertySetter.value;
            } else if(propertySetter.value) {
                model[propertySetter.name] = [propertySetter.value];
            } else if(!model.hasOwnProperty(propertySetter.name)) {
                model[propertySetter.name] = propertySetter.defaultValue;
            }
            return model;
        }

        // Update the model
        update(scope, callback?) {

            if(scope.updateVersion == this.updateVersion) {
                return this;
            } else {
                this.updateVersion = scope.updateVersion;
            }

            //console.log('updating ',this);

            var model = this;

            if(model.selector) {
                return model.selector.update(scope,callback);
            }

            // Iterates over an object's definition, getting the current value of each property
            function parseObject(def, obj?) {

                function skip(keyName) {
                    var skippedNames = ['objects'];
                    return skippedNames.indexOf(keyName) > -1;
                }

                obj = obj || {};
                if(def.hasOwnProperty('type') && def.hasOwnProperty('definition')) {
                    return KG.createInstance(def);
                }
                for(var key in def) {
                    if(def.hasOwnProperty(key)) {
                        if(skip(key)) {
                            //console.log('not updating ',key, ' within Model.update(scope)')
                        } else if(obj[key] instanceof KG.Selector) {
                            obj[key] = obj[key].update(scope);
                        } else if(obj[key] instanceof KG.Model) {
                            if(typeof def[key] != 'string') {
                                obj[key].update(scope);
                            } else {
                                obj[key] = scope.$eval(def[key]);
                            }
                        } else if(def[key] !== undefined) {
                            // otherwise parse the current value of the property
                            obj[key] = deepParse(def[key]);
                        }
                    }
                }
                return obj;
            }

            // Returns the value of an object's property, evaluated against the current scope.
            function deepParse(value) {
                if(value == undefined) {
                    return undefined;
                }
                if(Object.prototype.toString.call(value) == '[object Array]') {
                    // If the object's property is an array, return the array mapped to its parsed values
                    // see http://stackoverflow.com/questions/4775722/check-if-object-is-array
                    return value.map(deepParse)
                } else if(typeof value == 'object') {
                    // If the object's property is an object, parses the object.
                    return parseObject(value)
                } else if(scope && value.toString() !== undefined) {
                    try{
                        var e = scope.$eval(value.toString());
                        return (e == undefined) ? value : e;
                    }
                    catch(error) {
                        return value;
                    }
                } else {
                    return value;
                }
            }

            // Parse the model object
            model = parseObject(model.definition, model);

            // Do any model-specific updating
            model = model._update(scope)._calculateValues();

            if(callback){
                callback();
            }

            return model;

        }

        _update(scope) {
            return this; // overridden by child classes
        }

        _calculateValues() {
            return this; // overridden by child classes
        }
    }
}