/// <reference path="kg.ts"/>
'use strict';
var KG;
(function (KG) {
    KG.CLASS_COLORS = {
        demand: 'blue',
        supply: 'orange',
        growth: 'green',
        diff1: 'purple',
        diff2: 'green',
        capital: 'orange',
        consumption: 'blue',
        asset: 'blue',
        'risk-free': 'green',
        budget: 'red'
    };
    KG.COLORS = {
        blue: {
            dark: "#1f77b4",
            light: "#aec7e8"
        },
        orange: {
            dark: "#ff7f0e",
            light: "#98df8a"
        },
        green: {
            dark: "#2ca02c",
            light: "#74c476"
        },
        red: {
            dark: "d62728",
            light: "ff9896"
        },
        purple: {
            dark: "#9467bd",
            light: "#c5b0d5"
        },
        brown: {
            dark: "#8c564b",
            light: "#c49c94"
        },
        pink: {
            dark: "#e377c2",
            light: "#f7b6d2"
        },
        gray: {
            dark: "#7f7f7f",
            light: "#c7c7c7"
        },
        tan: {
            dark: "#bcbd22",
            light: "#dbdb8d"
        },
        cyan: {
            dark: "#17becf",
            light: "#9edae5"
        }
    };
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    function colorForClassName(className, shade) {
        if (className) {
            className = className.split(' ')[0];
        }
        shade = shade || 'dark';
        var classColor = KG.CLASS_COLORS[className] || 'gray';
        return KG.COLORS[classColor][shade];
    }
    KG.colorForClassName = colorForClassName;
    function allColors() {
        var colorArray = [];
        for (var color in KG.COLORS) {
            for (var shade in KG.COLORS[color]) {
                colorArray.push(KG.COLORS[color][shade]);
            }
        }
        return colorArray;
    }
    KG.allColors = allColors;
    function isAlmostTo(a, b, t, basis) {
        t = t || 0.01;
        var diff = Math.abs(a - b), avg = basis || 0.5 * (a + b);
        if (avg > t * 10) {
            return (diff / avg < t);
        }
        else {
            return diff < t;
        }
    }
    KG.isAlmostTo = isAlmostTo;
    function areTheSamePoint(a, b) {
        return isAlmostTo(a.x, b.x) && isAlmostTo(a.y, b.y);
    }
    KG.areTheSamePoint = areTheSamePoint;
    function areNotTheSamePoint(a, b) {
        return !areTheSamePoint(a, b);
    }
    KG.areNotTheSamePoint = areNotTheSamePoint;
    function arrayDoesNotHavePoint(a, b) {
        var foundIt = true;
        a.forEach(function (p) {
            if (areTheSamePoint(b, p)) {
                foundIt = false;
            }
        });
        return foundIt;
    }
    KG.arrayDoesNotHavePoint = arrayDoesNotHavePoint;
    function arrayAverage(o) {
        var allNumbers = true;
        o.forEach(function (obj) {
            if (typeof obj !== 'number') {
                allNumbers = false;
            }
        });
        if (allNumbers) {
            var sum = 0;
            for (var i = 0; i < o.length; i++) {
                sum += o[i];
            }
            return sum / o.length;
        }
        else {
            var avgObj = {};
            for (var key in o[0]) {
                var allObjectsHaveKey = true;
                o.forEach(function (obj) {
                    if (!obj.hasOwnProperty(key)) {
                        allObjectsHaveKey = false;
                    }
                });
                if (allObjectsHaveKey) {
                    avgObj[key] = arrayAverage(o.map(function (obj) {
                        return obj[key];
                    }));
                }
            }
            return avgObj;
        }
    }
    KG.arrayAverage = arrayAverage;
    function averageTwoObjects(o1, o2) {
        if (typeof o1 == 'number' && typeof o2 == 'number') {
            return 0.5 * (o1 + o2);
        }
        else if (typeof o1 == 'object' && typeof o2 == 'object') {
            var avgObj = {};
            for (var key in o1) {
                if (o1.hasOwnProperty(key) && o2.hasOwnProperty(key)) {
                    avgObj[key] = averageTwoObjects(o1[key], o2[key]);
                }
            }
            return avgObj;
        }
    }
    KG.averageTwoObjects = averageTwoObjects;
    function medianDataPoint(data) {
        var l = data.length;
        if (l % 2) {
            return data[(l - 1) / 2];
        }
        else {
            return averageTwoObjects(data[l / 2], data[l / 2 - 1]);
        }
    }
    KG.medianDataPoint = medianDataPoint;
    function translateByPixelCoordinates(coordinates) {
        return 'translate(' + coordinates.x + ',' + coordinates.y + ')';
    }
    KG.translateByPixelCoordinates = translateByPixelCoordinates;
    function positionByPixelCoordinates(coordinates, dimension) {
        var style = 'position:relative; left: ' + coordinates.x + 'px; top: ' + coordinates.y + 'px;';
        if (dimension) {
            if (dimension.hasOwnProperty('width')) {
                style += ' width: ' + dimension.width + 'px;';
            }
        }
        return style;
    }
    KG.positionByPixelCoordinates = positionByPixelCoordinates;
    function distanceBetweenCoordinates(a, b) {
        if (a == undefined || b == undefined) {
            return null;
        }
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    KG.distanceBetweenCoordinates = distanceBetweenCoordinates;
    // Takes a variety of ways of defining x-y coordinates and returns an object with x and y properties
    function getCoordinates(def) {
        var defaultCoordinates = { x: 0, y: 0 };
        if (!def || def == undefined) {
            return defaultCoordinates;
        }
        if (def.hasOwnProperty('coordinates')) {
            return def.coordinates;
        }
        else if (def.hasOwnProperty('x') && def.hasOwnProperty('y')) {
            return def;
        }
        else if (def.hasOwnProperty('definition')) {
            return getCoordinates(def.definition);
        }
        else {
            return defaultCoordinates;
        }
    }
    KG.getCoordinates = getCoordinates;
    // Takes a variety of ways of defining x-y coordinates and returns an array [x,y]
    function getBases(def) {
        var coordinates = getCoordinates(def);
        return [coordinates.x, coordinates.y];
    }
    KG.getBases = getBases;
    function sortObjects(key, descending) {
        return function (a, b) {
            var lower = descending ? a[key] : b[key], higher = descending ? b[key] : a[key];
            return lower > higher ? -1 : lower < higher ? 1 : lower <= higher ? 0 : NaN;
        };
    }
    KG.sortObjects = sortObjects;
    function getArrayObjectByProperty(arr, match, prop) {
        arr = arr || [];
        prop = prop || 'name';
        if (arr && match && arr != undefined) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][prop] == match) {
                    return arr[i];
                }
            }
        }
        else {
            return null;
        }
    }
    KG.getArrayObjectByProperty = getArrayObjectByProperty;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    function getDefinitionProperty(def) {
        if (typeof def == 'string') {
            if (def.match(/[\*/+-]/)) {
                return '(' + def + ')';
            }
            else {
                return def;
            }
        }
        else {
            return def;
        }
    }
    KG.getDefinitionProperty = getDefinitionProperty;
    function getPropertyAsString(def) {
        var d = def;
        if (typeof d == 'number') {
            return d.toString();
        }
        else {
            return "(" + d.toString() + ")";
        }
    }
    KG.getPropertyAsString = getPropertyAsString;
    function binaryFunction(def1, def2, fn) {
        if (typeof def1 == 'number' && typeof def2 == 'number') {
            switch (fn) {
                case "+":
                    return def1 + def2;
                    break;
                case "-":
                    return def1 - def2;
                    break;
                case "/":
                    return def1 / def2;
                    break;
                case "*":
                    return def1 * def2;
                case "^":
                    return Math.pow(def1, def2);
            }
        }
        else if (fn === '^') {
            return "Math.pow(" + def1 + "," + def2 + ")";
        }
        else {
            return "(" + getDefinitionProperty(def1) + fn + getDefinitionProperty(def2) + ")";
        }
    }
    KG.binaryFunction = binaryFunction;
    function addDefs(def1, def2) {
        return binaryFunction(def1, def2, '+');
    }
    KG.addDefs = addDefs;
    function subtractDefs(def1, def2) {
        return binaryFunction(def1, def2, '-');
    }
    KG.subtractDefs = subtractDefs;
    function divideDefs(def1, def2) {
        return binaryFunction(def1, def2, '/');
    }
    KG.divideDefs = divideDefs;
    function multiplyDefs(def1, def2) {
        return binaryFunction(def1, def2, '*');
    }
    KG.multiplyDefs = multiplyDefs;
    function squareDef(def) {
        return binaryFunction(def, def, '*');
    }
    KG.squareDef = squareDef;
    function raiseDefToDef(def1, def2) {
        return binaryFunction(def1, def2, '^');
    }
    KG.raiseDefToDef = raiseDefToDef;
    function createInstance(definition, modelPath) {
        // from http://stackoverflow.com/questions/1366127/
        function typeSpecificConstructor(typeName) {
            var arr = typeName.split(".");
            var fn = (window || this);
            for (var i = 0, len = arr.length; i < len; i++) {
                fn = fn[arr[i]];
            }
            if (typeof fn !== "function") {
                throw new Error("object type " + typeName + " not found");
            }
            return fn;
        }
        // each object is a new instance of the class named in the 'type' parameter
        var newObjectConstructor = typeSpecificConstructor(definition.type);
        return new newObjectConstructor(definition.definition, modelPath);
    }
    KG.createInstance = createInstance;
})(KG || (KG = {}));
'use strict';
var KG;
(function (KG) {
    var Model = (function () {
        function Model(definition, modelPath) {
            this.definition = definition;
            this.modelPath = modelPath;
            var model = this;
            model.modelPath = modelPath || 'model';
            for (var key in definition) {
                if (definition.hasOwnProperty(key) && definition[key] != undefined) {
                    var value = definition[key];
                    if (value.hasOwnProperty('type') && value.hasOwnProperty('definition')) {
                        model[key] = KG.createInstance(value, model.modelPath + '.' + key);
                    }
                    else {
                        model[key] = value;
                    }
                }
            }
        }
        Model.prototype.modelProperty = function (name) {
            return this.modelPath + '.' + name;
        };
        Model.prototype.setNumericProperty = function (propertySetter) {
            var model = this;
            if (!isNaN(propertySetter.value)) {
                model[propertySetter.name] = propertySetter.value;
            }
            else if (!model.hasOwnProperty(propertySetter.name)) {
                model[propertySetter.name] = propertySetter.defaultValue || 0;
            }
            return model;
        };
        Model.prototype.setArrayProperty = function (propertySetter) {
            var model = this;
            if (propertySetter.value instanceof Array) {
                model[propertySetter.name] = propertySetter.value;
            }
            else if (propertySetter.value) {
                model[propertySetter.name] = [propertySetter.value];
            }
            else if (!model.hasOwnProperty(propertySetter.name)) {
                model[propertySetter.name] = propertySetter.defaultValue;
            }
            return model;
        };
        // Update the model
        Model.prototype.update = function (scope, callback) {
            var model = this;
            if (model.hasOwnProperty('selector')) {
                return model.selector.update(scope, callback);
            }
            // Iterates over an object's definition, getting the current value of each property
            function parseObject(def, obj) {
                obj = obj || {};
                for (var key in def) {
                    if (def.hasOwnProperty(key)) {
                        if (obj[key] instanceof KG.Selector) {
                            obj[key] = obj[key].update(scope);
                        }
                        else if (obj[key] instanceof KG.Model) {
                            // if the property is itself a model, update the model
                            obj[key].update(scope);
                        }
                        else if (def[key] !== undefined) {
                            // otherwise parse the current value of the property
                            obj[key] = deepParse(def[key]);
                        }
                    }
                }
                return obj;
            }
            // Returns the value of an object's property, evaluated against the current scope.
            function deepParse(value) {
                if (value == undefined) {
                    return undefined;
                }
                if (Object.prototype.toString.call(value) == '[object Array]') {
                    // If the object's property is an array, return the array mapped to its parsed values
                    // see http://stackoverflow.com/questions/4775722/check-if-object-is-array
                    return value.map(deepParse);
                }
                else if (typeof value == 'object') {
                    // If the object's property is an object, parses the object.
                    return parseObject(value);
                }
                else if (scope && value.toString() !== undefined) {
                    try {
                        var e = scope.$eval(value.toString());
                        return (e == undefined) ? value : e;
                    }
                    catch (error) {
                        return value;
                    }
                }
                else {
                    return value;
                }
            }
            // Parse the model object
            model = parseObject(model.definition, model);
            // Do any model-specific updating
            model = model._update(scope)._calculateValues();
            if (callback) {
                callback();
            }
            return model;
        };
        Model.prototype._update = function (scope) {
            return this; // overridden by child classes
        };
        Model.prototype._calculateValues = function () {
            return this; // overridden by child classes
        };
        return Model;
    })();
    KG.Model = Model;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var KG;
(function (KG) {
    var Domain = (function (_super) {
        __extends(Domain, _super);
        function Domain(min, max) {
            _super.call(this, {
                min: min || 0,
                max: max || 10
            });
        }
        Domain.prototype.toArray = function () {
            return [this.min, this.max];
        };
        Domain.prototype.contains = function (x, strict) {
            strict = strict || false;
            if (x == undefined || x == null || isNaN(x)) {
                return false;
            }
            var lowEnough = strict ? (this.max > x) : (this.max - x >= -0.0001);
            var highEnough = strict ? (this.min < x) : (this.min - x <= 0.0001);
            return lowEnough && highEnough;
        };
        Domain.prototype.closestValueTo = function (x) {
            if (x < this.min) {
                return this.min;
            }
            else if (x > this.max) {
                return this.max;
            }
            else {
                return x;
            }
        };
        Domain.prototype.samplePoints = function (numSamples) {
            var min = this.min, max = this.max, sp = [];
            for (var i = 0; i < numSamples; i++) {
                sp.push(min + (i / (numSamples - 1)) * (max - min));
            }
            return sp;
        };
        Domain.prototype.intersection = function (otherDomain) {
            var thisDomain = this;
            if (!otherDomain || otherDomain == undefined) {
                return thisDomain;
            }
            var min = Math.max(thisDomain.min, otherDomain.min), max = Math.min(thisDomain.max, otherDomain.max);
            if (max < min) {
                return null;
            }
            else {
                return new Domain(min, max);
            }
        };
        return Domain;
    })(KG.Model);
    KG.Domain = Domain;
    function samplePointsForDomain(def) {
        var domain = new Domain(def.min, def.max), sampleAdjustment = isNaN(def.min) ? 0 : def.min % 10, numSamplePoints = def.numSamplePoints || 101 - sampleAdjustment;
        return domain.samplePoints(numSamplePoints);
    }
    KG.samplePointsForDomain = samplePointsForDomain;
})(KG || (KG = {}));
'use strict';
var KG;
(function (KG) {
    var Restriction = (function (_super) {
        __extends(Restriction, _super);
        function Restriction(definition) {
            _super.call(this, definition);
        }
        Restriction.prototype.validate = function (params) {
            var r = this;
            function isSimpleParam(name) {
                var match = name.match(/params\.[a-zA-Z0-9]+/);
                if (match) {
                    return (name === match[0]);
                }
                else {
                    return false;
                }
            }
            function paramName(name) {
                return name.split('params.')[1];
            }
            if (r.restrictionType === Restriction.RANGE_TYPE) {
                if (r.min > r.max) {
                    var maxName = r.definition['max'];
                    if (isSimpleParam(maxName)) {
                        params[paramName(maxName)] = r.min;
                        return params;
                    }
                    var minName = r.definition['min'];
                    if (isSimpleParam(minName)) {
                        params[paramName(minName)] = r.max;
                        return params;
                    }
                    return false;
                }
                var e = r.definition['expression'];
                if (isSimpleParam(e)) {
                    var param = paramName(e);
                    var value = this.round();
                    if (value < r.min) {
                        params[param] = r.min;
                    }
                    else if (value > r.max) {
                        params[param] = r.max;
                    }
                    else {
                        params[param] = value;
                    }
                    return params;
                }
                else if (r.min <= r.expression && r.expression <= r.max) {
                    return params;
                }
                else {
                    return false;
                }
            }
            if (r.restrictionType === Restriction.SET_TYPE) {
                if (r.set.indexOf(r.expression) > -1) {
                    return params;
                }
                else {
                    return false;
                }
            }
            if (r.restrictionType === Restriction.BOOLEAN_TYPE) {
                if (r.expression) {
                    return params;
                }
                else {
                    return false;
                }
            }
        };
        Restriction.prototype.round = function () {
            var r = this;
            if (r.precision > 0) {
                var delta = r.expression - r.min;
                var steps = Math.round(delta / r.precision);
                return r.min + (steps * r.precision);
            }
            else {
                return r.expression;
            }
        };
        Restriction.RANGE_TYPE = "range";
        Restriction.SET_TYPE = "set";
        Restriction.BOOLEAN_TYPE = "boolean";
        return Restriction;
    })(KG.Model);
    KG.Restriction = Restriction;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Selector = (function (_super) {
        __extends(Selector, _super);
        function Selector(definition, modelPath) {
            _super.call(this, definition, modelPath);
        }
        Selector.prototype.getObjectByName = function (name) {
            var s = this;
            var foundObject = KG.getArrayObjectByProperty(s.definition.options, name);
            if (foundObject) {
                return foundObject.selection;
            }
            else {
                return null;
            }
        };
        Selector.prototype.selectOption = function (name) {
            var s = this;
            var selectedObject = s.getObjectByName(name);
            if (selectedObject) {
                s.selectedObjectDef = selectedObject;
            }
        };
        Selector.prototype._update = function (scope) {
            var s = this;
            if (s.selected) {
                s.selectOption(s.selected);
            }
            s.selectedObject = KG.createInstance(s.selectedObjectDef, s.modelPath).update(scope);
            s.selectedObject.selector = s;
            return s.selectedObject;
        };
        return Selector;
    })(KG.Model);
    KG.Selector = Selector;
})(KG || (KG = {}));
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Base = (function (_super) {
            __extends(Base, _super);
            function Base(definition, modelPath) {
                _super.call(this, definition, modelPath);
                var fn = this;
                if (definition.hasOwnProperty('xDomainDef')) {
                    fn.xDomain = new KG.Domain(definition.xDomainDef.min, definition.xDomainDef.max);
                }
                if (definition.hasOwnProperty('yDomainDef')) {
                    fn.yDomain = new KG.Domain(definition.yDomainDef.min, definition.yDomainDef.max);
                }
            }
            // Returns the slope between (a,f(a)) and (b,f(b)).
            // If inverse = true, returns the slope between (f(a),a) and (f(b),b).
            // Assumes that a and b are both scalars (for now).
            Base.prototype.slopeBetweenPoints = function (a, b, inverse) {
                var f = this;
                b = b || 0;
                inverse = inverse || false;
                var s = (f.yValue(a) - f.yValue(b)) / (a - b);
                return inverse ? 1 / s : s;
            };
            Base.prototype.setBase = function (index, base) {
                var fn = this;
                if (fn.hasOwnProperty('bases')) {
                    fn.bases[index - 1] = base;
                }
                else {
                    fn.bases = [];
                    for (var i = 0; i < index; i++) {
                        fn.bases.push((i == index - 1) ? base : 1);
                    }
                }
                return fn;
            };
            // set bases for evaluating a polynomial or monomial
            Base.prototype.setBases = function (bases) {
                return this.setArrayProperty({
                    name: 'bases',
                    value: bases,
                    defaultValue: []
                });
            };
            // set level of function (for generating level sets)
            Base.prototype.setLevel = function (level) {
                return this.setNumericProperty({
                    name: 'level',
                    value: level,
                    defaultValue: 0
                });
            };
            Base.prototype.value = function (bases) {
                return 0; // overridden by subclass
            };
            Base.prototype.yValue = function (x) {
                return null; // overridden by subclass
            };
            // Returns x value for given y, for a two-dimensional function
            Base.prototype.xValue = function (y) {
                return null;
            };
            Base.prototype.points = function (view, yIsIndependent, numSamplePoints) {
                var fn = this, points = [];
                numSamplePoints = numSamplePoints || 51;
                var xSamplePoints = view.xAxis.domain.samplePoints(numSamplePoints), ySamplePoints = view.yAxis.domain.samplePoints(numSamplePoints);
                for (var i = 0; i < numSamplePoints; i++) {
                    var x = xSamplePoints[i];
                    var yOfX = fn.yValue(x);
                    if (yOfX && !isNaN(yOfX) && yOfX != Infinity) {
                        points.push({ x: x, y: yOfX });
                    }
                    var y = ySamplePoints[i];
                    var xOfY = fn.xValue(y);
                    if (xOfY && !isNaN(xOfY) && xOfY != Infinity) {
                        points.push({ x: xOfY, y: y });
                    }
                }
                if (yIsIndependent) {
                    return points.sort(KG.sortObjects('y'));
                }
                else {
                    return points.sort(KG.sortObjects('x'));
                }
            };
            return Base;
        })(KG.Model);
        Functions.Base = Base;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Implicit = (function (_super) {
            __extends(Implicit, _super);
            function Implicit(definition, modelPath) {
                _super.call(this, definition, modelPath);
                var fn = this;
                fn.xFunction = new KGMath.Functions[definition.xFunctionType](definition.xFunctionDef, fn.modelProperty('xFunction'));
                fn.yFunction = new KGMath.Functions[definition.yFunctionType](definition.yFunctionDef, fn.modelProperty('yFunction'));
                fn.tDomain = new KG.Domain(definition.tDomainDef.min, definition.tDomainDef.max);
            }
            Implicit.prototype._update = function (scope) {
                var fn = this;
                fn.xFunction.update(scope);
                fn.yFunction.update(scope);
                fn.tDomain.update(scope);
                return fn;
            };
            Implicit.prototype.point = function (t) {
                var fn = this;
                return {
                    x: fn.xFunction.yValue(t),
                    y: fn.yFunction.yValue(t)
                };
            };
            // Returns the slope between (x(t1), y(t1)) and (x(t2),y(t2)).
            // If inverse = true, return 1 / that slope.
            Implicit.prototype.slopeBetweenPoints = function (t1, t2, inverse) {
                var p1 = this.point(t1), p2 = this.point(t2);
                inverse = inverse || false;
                var s = (p1.y - p2.y) / (p1.x - p2.x);
                return inverse ? 1 / s : s;
            };
            Implicit.prototype.points = function (view, numSamplePoints) {
                var fn = this, points = [];
                numSamplePoints = numSamplePoints || 51;
                var samplePoints = fn.tDomain.samplePoints(numSamplePoints);
                for (var i = 0; i < numSamplePoints; i++) {
                    var previousPoint = (i > 0) ? fn.point(samplePoints[i - 1]) : null, point = fn.point(samplePoints[i]), nextPoint = (i < numSamplePoints - 1) ? fn.point(samplePoints[i + 1]) : null;
                    if (view.onGraph(point) || view.onGraph(previousPoint) || view.onGraph(nextPoint)) {
                        points.push(point);
                    }
                }
                return points;
            };
            return Implicit;
        })(KG.Model);
        Functions.Implicit = Implicit;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Relation = (function (_super) {
            __extends(Relation, _super);
            function Relation(definition, modelPath) {
                definition.inverse = definition.inverse || false;
                _super.call(this, definition, modelPath);
                var f = this;
                f.fn = new KGMath.Functions[definition.functionType](definition.functionDef, f.modelProperty('fn'));
            }
            // Returns the slope between (a,f(a)) and (b,f(b)).
            // If inverse = true, returns the slope between (f(a),a) and (f(b),b).
            // Assumes that a and b are both scalars (for now).
            Relation.prototype.slopeBetweenPoints = function (a, b, inverse) {
                var f = this;
                b = b || 0;
                inverse = inverse || false;
                var s = (f.fn.yValue(a) - f.fn.yValue(b)) / (a - b);
                return (inverse != f.inverse) ? 1 / s : s;
            };
            Relation.prototype.points = function (view, numSamplePoints) {
                var f = this, points = [];
                numSamplePoints = numSamplePoints || 51;
                var independentAxis = f.inverse ? view.yAxis : view.xAxis, sampleIndependentValues = independentAxis.domain.samplePoints(numSamplePoints), sampleDependentValues = sampleIndependentValues.map(f.fn.yValue);
                for (var i = 0; i < numSamplePoints; i++) {
                    var point, previousPoint, nextPoint;
                    if (f.inverse) {
                        previousPoint = (i > 0) ? { x: sampleDependentValues[i - 1], y: sampleIndependentValues[i - 1] } : null;
                        point = { x: sampleDependentValues[i], y: sampleIndependentValues[i] };
                        nextPoint = (i < numSamplePoints - 1) ? { x: sampleDependentValues[i + 1], y: sampleIndependentValues[i + 1] } : null;
                    }
                    else {
                        previousPoint = (i > 0) ? { x: sampleIndependentValues[i - 1], y: sampleDependentValues[i - 1] } : null;
                        point = { x: sampleIndependentValues[i], y: sampleDependentValues[i] };
                        nextPoint = (i < numSamplePoints - 1) ? { x: sampleIndependentValues[i + 1], y: sampleDependentValues[i + 1] } : null;
                    }
                    if (view.onGraph(point) || view.onGraph(previousPoint) || view.onGraph(nextPoint)) {
                        points.push(point);
                    }
                }
                return points;
            };
            return Relation;
        })(KG.Model);
        Functions.Relation = Relation;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
/*
 A monomial function is a term of the form c(b1^p1)(b2^p2)...(bn^pn)
 where 'c' is the coefficient, 'bi' is the i'th base, and 'pi' is the i'th power.

 The initializing object, params, should be of the form

 params = {coefficient: (number), bases: (number or array), powers: (number or array)}

 Any of these parameters may be null initially and set later with the setters.
 */
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Monomial = (function (_super) {
            __extends(Monomial, _super);
            function Monomial(definition, modelPath) {
                this.monomialDefs = {
                    coefficient: definition.coefficient.toString(),
                    powers: definition.powers.map(function (p) {
                        return p.toString();
                    })
                };
                _super.call(this, definition, modelPath);
            }
            // Establish setters
            Monomial.prototype.setCoefficient = function (coefficient) {
                return this.setNumericProperty({
                    name: 'coefficient',
                    value: coefficient,
                    defaultValue: 1
                });
            };
            Monomial.prototype.setPowers = function (powers) {
                return this.setArrayProperty({
                    name: 'powers',
                    value: powers,
                    defaultValue: []
                });
            };
            // Evaluate monomial for a given set of bases. If none are set, use m.bases.
            Monomial.prototype.value = function (bases) {
                var m = this;
                m.setBases(bases);
                var basePowerPairs = Math.min(m.bases.length, m.powers.length);
                var result = m.coefficient;
                for (var t = 0; t < basePowerPairs; t++) {
                    result *= Math.pow(m.bases[t], m.powers[t]);
                }
                return result;
            };
            // Return the monomial that is the derivative of this monomial
            // with respect to the n'th variable
            Monomial.prototype.derivative = function (n) {
                var m = this;
                // n is the index of the term; first term by default
                n = n - 1 || 0;
                return new Monomial({
                    // the new coefficient is the old coefficient times
                    //the power of the variable whose derivative we're taking
                    coefficient: KG.multiplyDefs(m.monomialDefs.coefficient, m.monomialDefs.powers[n]),
                    powers: m.monomialDefs.powers.map(function (p, index) {
                        if (index == n) {
                            return KG.subtractDefs(p, 1);
                        }
                        else {
                            return p;
                        }
                    }),
                    bases: m.bases
                });
            };
            // Return the monomial that is the integral of this monomial
            // with respect to the n'th variable, with no constant of integration
            Monomial.prototype.integral = function (n) {
                var m = this;
                // n is the index of the term; first term by default
                n = n - 1 || 0;
                return new Monomial({
                    // the new coefficient is the old coefficient times
                    //the power of the variable whose derivative we're taking
                    coefficient: KG.divideDefs(m.monomialDefs.coefficient, KG.addDefs(m.monomialDefs.powers[n], 1)),
                    powers: m.monomialDefs.powers.map(function (p, index) {
                        if (index == n) {
                            return KG.addDefs(p, 1);
                        }
                        else {
                            return p;
                        }
                    }),
                    bases: m.bases
                });
            };
            // Return the monomial that reduces the power of the n'th variable by 1
            Monomial.prototype.average = function (n) {
                var m = this;
                // n is the index of the term; first term by default
                n = n - 1 || 0;
                return new Monomial({
                    coefficient: m.monomialDefs.coefficient,
                    // reduce the power of the n'th variable by 1
                    powers: m.monomialDefs.powers.map(function (p, index) {
                        if (index == n) {
                            return p + " - 1";
                        }
                        else {
                            return p;
                        }
                    }),
                    bases: m.bases
                });
            };
            // Return the monomial that multiplies the coefficient by x
            Monomial.prototype.multiply = function (x) {
                var m = this;
                // n is the index of the term; first term by default
                x = x || 1;
                return new Monomial({
                    // multiply the coefficient by x
                    coefficient: "(" + m.monomialDefs.coefficient + ")*(" + x + ")",
                    powers: m.monomialDefs.powers,
                    bases: m.bases
                });
            };
            // Return the monomial that solves the function c(b1^p1)(b2^p2) = level for bn
            // For example, to find the level curve where 3(x^2)(y^3) = 6 and express it as y(x), this would return
            // y = [6/(3x^-2)]^(1/3) = [(6/2)^1/3][(x^-2)^1/3] = [(6/2)^1/3][x^-2/3]
            // Note that the indices of the bases in the returned monomial are the same as the original.
            Monomial.prototype.levelCurve = function (n, level) {
                var m = this;
                // note: level can be a numerical value or an array of bases at which to evaluate the monomial
                if (level) {
                    m.setLevel(level);
                }
                // n is the index of the term; first term by default
                n = n - 1 || 0;
                // pn is the power to which the base variable we're solving for is raised
                var pn = m.powers[n];
                if (pn == 0) {
                    return null;
                }
                return new Monomial({
                    // the coefficient of the new monomial is (level/c)^1/p
                    coefficient: Math.pow(m.level / m.coefficient, 1 / pn),
                    // each of the powers for the remaining bases is divided by -p
                    powers: m.powers.map(function (p, index) {
                        if (index == n) {
                            return 0;
                        }
                        else {
                            return -p / pn;
                        }
                    }),
                    bases: m.bases
                });
            };
            // returns the y value corresponding to the given x value for m(x,y) = m.level
            Monomial.prototype.yValue = function (x) {
                var m = this;
                if (m.powers.length == 1) {
                    return m.coefficient * Math.pow(x, m.powers[0]);
                }
                else {
                    this.setBase(1, x);
                    if (this.levelCurve(2)) {
                        return this.levelCurve(2).value();
                    }
                    else {
                        return null;
                    }
                }
            };
            // returns the x value corresponding to the given y value for m(x,y) = m.level
            Monomial.prototype.xValue = function (y) {
                var m = this;
                if (this.powers.length == 1) {
                    return Math.pow(y / m.coefficient, 1 / m.powers[0]);
                }
                else {
                    this.setBase(2, y);
                    if (this.levelCurve(1)) {
                        return this.levelCurve(1).value();
                    }
                    else {
                        return null;
                    }
                }
            };
            return Monomial;
        })(Functions.Base);
        Functions.Monomial = Monomial;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var CobbDouglas = (function (_super) {
            __extends(CobbDouglas, _super);
            function CobbDouglas(definition, modelPath) {
                definition.yPower = definition.yPower || KG.subtractDefs(1, definition.xPower);
                var monomialDef = {
                    coefficient: definition.coefficient,
                    powers: [definition.xPower, definition.yPower]
                };
                _super.call(this, monomialDef, modelPath);
            }
            return CobbDouglas;
        })(Functions.Monomial);
        Functions.CobbDouglas = CobbDouglas;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
/*
 A polynomial function is an array of monomial functions.
 Its value is the sum of its component functions.
 Its derivative is the array of the derivatives of its component functions.
 */
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Polynomial = (function (_super) {
            __extends(Polynomial, _super);
            function Polynomial(definition, modelPath) {
                _super.call(this, definition, modelPath);
                if (definition.hasOwnProperty('termDefs')) {
                    this.terms = definition.termDefs.map(function (termDef) {
                        return new Functions.Monomial(termDef);
                    });
                }
                this.bases = [0];
            }
            Polynomial.prototype._update = function (scope) {
                var p = this;
                if (p.reestablishMonomials()) {
                    console.log('monomial became an object');
                }
                p.terms.forEach(function (monomial) {
                    monomial.update(scope);
                });
                return this;
            };
            // Sometimes in the update process, the monomial become objects
            Polynomial.prototype.reestablishMonomials = function () {
                var p = this;
                if (p.terms[0] instanceof Functions.Monomial) {
                    return false;
                }
                else {
                    p.terms = p.terms.map(function (def) {
                        return new Functions.Monomial(def);
                    });
                    return true;
                }
            };
            // The coefficients and powers of each term may be get and set via the term's index
            Polynomial.prototype.setCoefficient = function (n, coefficient) {
                var p = this;
                if (p.reestablishMonomials()) {
                    console.log('monomial became an object');
                }
                p.terms[n - 1].setCoefficient(coefficient);
                return p;
            };
            Polynomial.prototype.setPowers = function (n, powers) {
                var p = this;
                if (p.reestablishMonomials()) {
                    console.log('monomial became an object');
                }
                p.terms[n - 1].setPowers(powers);
                return p;
            };
            // The value of a polynomial is the sum of the values of its monomial terms
            Polynomial.prototype.value = function (bases) {
                var p = this;
                if (p.reestablishMonomials()) {
                    console.log('monomial became an object');
                }
                p.setBases(bases);
                var result = 0;
                for (var i = 0; i < p.terms.length; i++) {
                    result += p.terms[i].value(p.bases);
                }
                return result;
            };
            // The derivative of a polynomial is a new polynomial,
            // each of whose terms is the derivative of the original polynomial's terms
            Polynomial.prototype.derivative = function (n) {
                var p = this;
                if (p.reestablishMonomials()) {
                    console.log('monomial became an object');
                }
                return new Polynomial({
                    termDefs: p.terms.map(function (term) {
                        return term.derivative(n);
                    })
                });
            };
            // The derivative of a polynomial is a new polynomial,
            // each of whose terms is the integral of the original polynomial's terms,
            // plus the constant of integration c
            Polynomial.prototype.integral = function (n, c) {
                var p = this;
                if (!c) {
                    c = 0;
                }
                if (p.reestablishMonomials()) {
                    console.log('monomial became an object');
                }
                var termDefs = p.terms.map(function (term) {
                    return term.integral(n);
                });
                termDefs.push(new Functions.Monomial({ coefficient: c, powers: [0] }));
                return new Polynomial({
                    termDefs: termDefs
                });
            };
            // The average of a polynomial is a new polynomial,
            // each of whose terms is the average of the original polynomial's terms
            Polynomial.prototype.average = function (n) {
                var p = this;
                if (p.reestablishMonomials()) {
                    console.log('monomial became an object');
                }
                return new Polynomial({
                    termDefs: p.terms.map(function (term) {
                        return term.average(n);
                    })
                });
            };
            // Multiplying a polynomial by a constant means multiplying each monomial by that constant
            Polynomial.prototype.multiply = function (x) {
                var p = this;
                if (p.reestablishMonomials()) {
                    console.log('monomial became an object');
                }
                return new Polynomial({
                    termDefs: p.terms.map(function (term) {
                        return term.multiply(x);
                    })
                });
            };
            // Adding a constant to a polynomial means appending a new constant term
            Polynomial.prototype.add = function (x) {
                var p = this;
                var termDefs = _.clone(p.terms);
                termDefs.push(new Functions.Monomial({ coefficient: x, powers: [0] }));
                return new Polynomial({
                    termDefs: termDefs
                });
            };
            // Assume all bases except the first have been set; replace the base of the first variable ('x') with the x value
            Polynomial.prototype.yValue = function (x) {
                var p = this;
                var inputs = p.bases.map(function (val, index) {
                    return (index == 0) ? x : val;
                });
                return p.value(inputs);
            };
            // Not generally a valid concept for a polynomial
            Polynomial.prototype.xValue = function (y) {
                return null;
            };
            return Polynomial;
        })(Functions.Base);
        Functions.Polynomial = Polynomial;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
/*
 A linear function is a special polynomial defined either with two points or a point and a slope.
 This function takes either of those and returns a polynomial of the form ax + by + c.
 The params object is of the form: { definitionType: '', param1: foo, param2: bar }
 */
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Linear = (function (_super) {
            __extends(Linear, _super);
            function Linear(definition, modelPath) {
                _super.call(this, definition, modelPath);
                this.linearIntersection = function (otherLine, delta) {
                    var thisLine = this;
                    delta = delta || 0;
                    var a = thisLine.coefficients.a, b = thisLine.coefficients.b, c = thisLine.coefficients.c, oa = otherLine.coefficients.a, ob = otherLine.coefficients.b, oc = otherLine.coefficients.c;
                    var diffLine = new Linear({
                        coefficients: {
                            a: a * ob - b * oa,
                            b: b * ob,
                            c: ob * c - oc * b - delta
                        }
                    }).updateLine(), x = diffLine.xIntercept, y = thisLine.yValue(x);
                    return { x: x, y: y };
                };
                definition.coefficients = definition.coefficients || { a: 0, b: -1, c: 0 };
                var l = this;
                if (definition.hasOwnProperty('point1') && definition.hasOwnProperty('point2')) {
                    var p1 = KG.getCoordinates(definition.point1), p2 = KG.getCoordinates(definition.point2), rise = KG.subtractDefs(p2.y, p1.y), run = KG.subtractDefs(p2.x, p1.x);
                    definition.slope = KG.divideDefs(rise, run);
                    definition.point = p1;
                }
                if (definition.hasOwnProperty('slope') && definition.slope != undefined) {
                    definition.coefficients.a = definition.slope;
                    if (definition.hasOwnProperty('intercept')) {
                        definition.coefficients.c = definition.intercept;
                        l.interceptDef = definition.intercept;
                    }
                    else if (definition.hasOwnProperty('point') && definition.point != undefined) {
                        if (definition.slope === Infinity || definition.slope === -Infinity) {
                            definition.coefficients = {
                                a: -1,
                                b: 0,
                                c: definition.point.x
                            };
                        }
                        else {
                            var mx = KG.multiplyDefs(definition.slope, definition.point.x);
                            definition.coefficients.c = KG.subtractDefs(definition.point.y, mx);
                        }
                    }
                }
                else {
                    definition.slope = KG.multiplyDefs(-1, KG.divideDefs(definition.coefficients.a, definition.coefficients.b));
                }
                l.slopeDef = definition.slope;
                l.interceptDef = l.interceptDef || KG.multiplyDefs(-1, KG.divideDefs(definition.coefficients.c, definition.coefficients.b));
            }
            Linear.prototype._update = function (scope) {
                return this.updateLine();
            };
            Linear.prototype.updateLine = function () {
                var l = this;
                l.level = l.level || 0;
                var a = l.coefficients.a, b = l.coefficients.b, c = l.coefficients.c - l.level;
                l.isVertical = (b === 0) || (a === Infinity) || (a === -Infinity);
                l.isHorizontal = (a === 0) || (b === Infinity) || (b === -Infinity);
                l.slope = l.isVertical ? Infinity : -a / b;
                l.inverseSlope = l.isHorizontal ? Infinity : -b / a;
                l.xIntercept = l.isHorizontal ? null : (l.isVertical && l.hasOwnProperty('point')) ? l.point.x : -c / a;
                l.yIntercept = l.isVertical ? null : -c / b;
                return l;
            };
            // If we think of a linear function as a univariate function, the derivative is the slope
            // If we think of it as a multivariate function f(x,y) = ax + by + c, then df/dx = a and df/dy = b
            Linear.prototype.derivative = function (n) {
                var a = this.definition.coefficients.a;
                if (n == 1) {
                    return new HorizontalLine({
                        y: a
                    });
                }
                var b = this.definition.coefficients.b;
                if (n == 2) {
                    return new HorizontalLine({
                        y: b
                    });
                }
                var m = this.slopeDef || this.slope || 0;
                return new HorizontalLine({
                    y: m
                });
            };
            // The integral of mx + b is (m/2)x^2 + bx + c
            Linear.prototype.integral = function (n, c, name) {
                var m = this;
                if (!c) {
                    c = 0;
                }
                if (m instanceof HorizontalLine) {
                    return new Linear({
                        slope: m.y,
                        intercept: c
                    }, name);
                }
                else {
                    return new Functions.Quadratic({
                        coefficients: {
                            a: KG.multiplyDefs(0.5, m.slopeDef),
                            b: m.interceptDef,
                            c: c
                        }
                    }, name);
                }
            };
            Linear.prototype.add = function (x, name) {
                var m = this;
                return new Linear({
                    slope: m.slopeDef,
                    intercept: KG.addDefs(m.interceptDef, x)
                }, name);
            };
            // The average of ax^2 + bx + c is ax + b + cx^-2 + C
            Linear.prototype.average = function (n, name) {
                var l = this;
                name = name ? l.modelProperty(name) : null;
                return new Functions.Polynomial({
                    termDefs: [
                        {
                            coefficient: l.slopeDef,
                            powers: [0]
                        },
                        {
                            coefficient: l.interceptDef,
                            powers: [-1]
                        }
                    ]
                }, name);
            };
            Linear.prototype.value = function (bases) {
                var l = this;
                if (bases) {
                    l.setBases(bases);
                }
                return l.coefficients.a * l.bases[0] + l.coefficients.b * l.bases[1] + l.coefficients.c;
            };
            Linear.prototype.yValue = function (x) {
                var l = this.updateLine();
                var y = l.isVertical ? undefined : l.yIntercept + l.slope * x;
                return y;
            };
            Linear.prototype.xValue = function (y) {
                var l = this.updateLine();
                var x = l.isHorizontal ? undefined : l.xIntercept + l.inverseSlope * y;
                return x;
            };
            Linear.prototype.points = function (view) {
                var l = this;
                var xDomain = view.xAxis.domain.intersection(l.xDomain), yDomain = view.yAxis.domain.intersection(l.yDomain);
                var points = [];
                if (l.isVertical) {
                    points = [{ x: l.xIntercept, y: yDomain.min }, { x: l.xIntercept, y: yDomain.max }];
                }
                else if (l.isHorizontal) {
                    points = [{ x: xDomain.min, y: l.yIntercept }, { x: xDomain.max, y: l.yIntercept }];
                }
                else {
                    var xTop = l.xValue(yDomain.max), xBottom = l.xValue(yDomain.min), yLeft = l.yValue(xDomain.min), yRight = l.yValue(xDomain.max);
                    // add endpoints on the left or right sides, including the corners
                    if (yDomain.contains(yLeft)) {
                        points.push({ x: xDomain.min, y: yLeft });
                    }
                    if (yDomain.contains(yRight)) {
                        points.push({ x: xDomain.max, y: yRight });
                    }
                    // add endpoints on the top or bottom, not including the corners
                    if (xDomain.contains(xBottom, true)) {
                        if (KG.arrayDoesNotHavePoint(points, { x: xBottom, y: yDomain.min })) {
                            points.push({ x: xBottom, y: yDomain.min });
                        }
                    }
                    if (xDomain.contains(xTop, true) && yLeft != yDomain.max && yRight != yDomain.max) {
                        if (KG.arrayDoesNotHavePoint(points, { x: xTop, y: yDomain.max })) {
                            points.push({ x: xTop, y: yDomain.max });
                        }
                    }
                    // A maximimum of two points should have been added. If not, something is wrong.
                    if (points.length > 2) {
                        console.log('Oh noes! More than two points! Investigate!');
                    }
                    if (points.length < 2) {
                        console.log('Oh noes! Only one point! Investigate!');
                    }
                }
                return points.sort(KG.sortObjects('x'));
            };
            return Linear;
        })(Functions.Base);
        Functions.Linear = Linear;
        var HorizontalLine = (function (_super) {
            __extends(HorizontalLine, _super);
            function HorizontalLine(definition, modelPath) {
                definition.coefficients = {
                    a: 0,
                    b: -1,
                    c: definition.y
                };
                _super.call(this, definition, modelPath);
            }
            HorizontalLine.prototype.value = function (bases) {
                return this.y;
            };
            return HorizontalLine;
        })(Linear);
        Functions.HorizontalLine = HorizontalLine;
        var VerticalLine = (function (_super) {
            __extends(VerticalLine, _super);
            function VerticalLine(definition, modelPath) {
                definition.coefficients = {
                    a: -1,
                    b: 0,
                    c: definition.x
                };
                _super.call(this, definition, modelPath);
            }
            VerticalLine.prototype.value = function (bases) {
                return this.x;
            };
            return VerticalLine;
        })(Linear);
        Functions.VerticalLine = VerticalLine;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
/*
 A quadratic function is a special polynomial defined either with two points or a point and a slope.
 This function takes either of those and returns a polynomial of the form ax + by + c.
 The params object is of the form: { definitionType: '', param1: foo, param2: bar }
 */
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Quadratic = (function (_super) {
            __extends(Quadratic, _super);
            function Quadratic(definition, modelPath) {
                definition.coefficients = definition.coefficients || { a: 1, b: 1, c: 1 };
                // extract coefficients from vertex and point
                if (definition.hasOwnProperty('vertex') && definition.hasOwnProperty('point')) {
                    // a = (p.y - vertex.y) / (p.x - vertex.x) ^ 2
                    var yDiff = KG.subtractDefs(definition.point.y, definition.vertex.y), xDiffSquared = KG.squareDef(KG.subtractDefs(definition.point.x, definition.vertex.x));
                    definition.coefficients.a = KG.divideDefs(yDiff, xDiffSquared);
                    // b = -2a*vertex.x
                    definition.coefficients.b = KG.multiplyDefs(-2, KG.multiplyDefs(definition.coefficients.a, definition.vertex.x));
                    // c = vertex.y + a*(vertex.x)^2
                    definition.coefficients.c = KG.addDefs(definition.vertex.y, KG.multiplyDefs(definition.coefficients.a, KG.squareDef(definition.vertex.x)));
                }
                _super.call(this, definition, modelPath);
                if (!definition.hasOwnProperty('vertex') && definition.coefficients.a != 0) {
                    var negativeB = KG.multiplyDefs(-1, definition.coefficients.b), twoA = KG.multiplyDefs(2, definition.coefficients.a), vertexX = KG.divideDefs(negativeB, twoA), vertexY = this.modelProperty('yValue(' + vertexX + ')');
                    definition.vertex = {
                        x: vertexX,
                        y: vertexY
                    };
                }
            }
            Quadratic.prototype._update = function (scope) {
                var q = this;
                q.discriminant = q.coefficients.b * q.coefficients.b - 4 * q.coefficients.a * q.coefficients.c;
                return q;
            };
            // The derivative of ax^2 + bx + c is 2ax + b
            Quadratic.prototype.derivative = function (n) {
                var coefficients = this.coefficients;
                return new Functions.Linear({
                    slope: KG.multiplyDefs(coefficients.a, 2),
                    intercept: coefficients.b
                });
            };
            // The integral of ax^2 + bx + c is (a/3)x^3 + (b/2)x^2 + cx + C
            Quadratic.prototype.integral = function (n, c, name) {
                var q = this, coefficients = this.coefficients;
                if (!c) {
                    c = 0;
                }
                name = name ? q.modelProperty(name) : null;
                return new Functions.Polynomial({
                    termDefs: [
                        {
                            coefficient: KG.divideDefs(coefficients.a, 3),
                            powers: [3]
                        },
                        {
                            coefficient: KG.divideDefs(coefficients.b, 2),
                            powers: [2]
                        },
                        {
                            coefficient: coefficients.c,
                            powers: [1]
                        },
                        {
                            coefficient: c,
                            powers: [0]
                        }
                    ]
                }, name);
            };
            // The average of ax^2 + bx + c is ax + b + cx^-2 + C
            Quadratic.prototype.average = function (n, name) {
                var q = this, coefficients = q.coefficients;
                name = name ? q.modelProperty(name) : null;
                return new Functions.Polynomial({
                    termDefs: [
                        {
                            coefficient: coefficients.a,
                            powers: [1]
                        },
                        {
                            coefficient: coefficients.b,
                            powers: [0]
                        },
                        {
                            coefficient: coefficients.c,
                            powers: [-1]
                        }
                    ]
                }, name);
            };
            Quadratic.prototype.multiply = function (x) {
                var q = this;
                return new Quadratic({
                    coefficients: {
                        a: KG.multiplyDefs(q.coefficients.a, x),
                        b: KG.multiplyDefs(q.coefficients.b, x),
                        c: KG.multiplyDefs(q.coefficients.c, x)
                    }
                });
            };
            Quadratic.prototype.add = function (x) {
                var q = this;
                return new Quadratic({
                    coefficients: {
                        a: q.coefficients.a,
                        b: q.coefficients.b,
                        c: KG.addDefs(q.coefficients.c, x)
                    }
                });
            };
            Quadratic.prototype.yValue = function (x) {
                var coefficients = this.coefficients;
                return coefficients.a * x * x + coefficients.b * x + coefficients.c;
            };
            Quadratic.prototype.differenceFromVertex = function (y) {
                var q = this, a = q.coefficients.a, b = q.coefficients.b, c = q.coefficients.c - y;
                if (b * b > 4 * a * c) {
                    return Math.abs(1 / (2 * a)) * Math.sqrt(b * b - 4 * a * c);
                }
                else {
                    return null;
                }
            };
            // for xValue, use higher real root of ax^2 + bx + c - y
            Quadratic.prototype.xValue = function (y) {
                var q = this;
                if (q.coefficients.a < 0) {
                    // downward facing parabola; real roots exist if y < vertex Y
                    if (y > q.vertex.y) {
                        return null;
                    }
                }
                else if (q.coefficients.a == 0) {
                    if (q.coefficients.b == 0) {
                        return null;
                    }
                    else {
                        return (y - q.coefficients.c) / q.coefficients.b;
                    }
                }
                else {
                    if (y < q.vertex.y) {
                        return null;
                    }
                }
                return q.vertex.x + this.differenceFromVertex(y);
            };
            Quadratic.prototype.points = function (view, yIsIndependent, numSamplePoints) {
                var q = this, points = [];
                numSamplePoints = numSamplePoints || 51;
                if (q.coefficients.a == 0) {
                    var l = new KGMath.Functions.Linear({
                        coefficients: {
                            a: q.coefficients.b,
                            b: -1,
                            c: q.coefficients.c
                        }
                    });
                    return l.points(view);
                }
                var inverse = (q.coefficients.a < 0);
                var xDomain, yDomain;
                if (yIsIndependent) {
                    xDomain = inverse ? new KG.Domain(view.xAxis.min, q.vertex.y) : new KG.Domain(q.vertex.y, view.xAxis.max);
                    yDomain = view.yAxis.domain;
                }
                else {
                    xDomain = view.xAxis.domain;
                    yDomain = inverse ? new KG.Domain(view.yAxis.min, q.vertex.y) : new KG.Domain(q.vertex.y, view.yAxis.max);
                }
                var xSamplePoints = xDomain.samplePoints(numSamplePoints), ySamplePoints = yDomain.samplePoints(numSamplePoints);
                for (var i = 0; i < numSamplePoints; i++) {
                    var x = xSamplePoints[i];
                    var y = ySamplePoints[i];
                    if (yIsIndependent) {
                        var xOfY = q.yValue(y);
                        if (view.onGraph({ x: xOfY, y: y })) {
                            points.push({ x: xOfY, y: y });
                        }
                        ;
                        var yLow = q.vertex.x - q.differenceFromVertex(x);
                        if (view.onGraph({ x: x, y: yLow })) {
                            points.push({ x: x, y: yLow });
                        }
                        ;
                        var yHigh = q.vertex.x + q.differenceFromVertex(x);
                        if (view.onGraph({ x: x, y: yHigh })) {
                            points.push({ x: x, y: yHigh });
                        }
                        ;
                    }
                    else {
                        var yOfX = q.yValue(x);
                        if (view.onGraph({ x: x, y: yOfX })) {
                            points.push({ x: x, y: yOfX });
                        }
                        ;
                        var xLow = q.vertex.x - q.differenceFromVertex(y);
                        if (view.onGraph({ x: xLow, y: y })) {
                            points.push({ x: xLow, y: y });
                        }
                        ;
                        var xHigh = q.vertex.x + q.differenceFromVertex(y);
                        if (view.onGraph({ x: xHigh, y: y })) {
                            points.push({ x: xHigh, y: y });
                        }
                        ;
                    }
                }
                if (yIsIndependent) {
                    return points.sort(KG.sortObjects('y'));
                }
                else {
                    return points.sort(KG.sortObjects('x'));
                }
            };
            return Quadratic;
        })(Functions.Base);
        Functions.Quadratic = Quadratic;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Min = (function (_super) {
            __extends(Min, _super);
            function Min(definition, modelPath) {
                _super.call(this, definition, modelPath);
                var m = this;
                m.minimands = definition.minimandDefs.map(function (fnDef, index) {
                    return new KGMath.Functions[fnDef.type](fnDef.def, m.modelProperty('minimands[' + index + ']'));
                });
                console.log(m.minimands);
            }
            Min.prototype.value = function (bases) {
                var m = this;
                if (bases) {
                    m.setBases(bases);
                }
                return Math.min.apply(null, m.minimands.map(function (minimand) {
                    return minimand.value(m.bases);
                }));
            };
            // The derivative of a min function is the minimum of the derivative(s) of the component function(s)
            // whose value is the current minimum.
            // Note that the bases must be set for this to have any meaning.
            Min.prototype.derivative = function (n, bases) {
                var m = this, currentMinimumFunctions = [];
                if (bases) {
                    m.setBases(bases);
                }
                for (var i = 0; i < m.minimands.length; i++) {
                    if (m.value() == m.minimands[i].value()) {
                        currentMinimumFunctions.push(m.minimands[i].derivative(n));
                    }
                }
                // If there is a single function with the lowest value, return the derivative of that function.
                if (currentMinimumFunctions.length == 1) {
                    return currentMinimumFunctions[0];
                }
                // Otherwise, find the function with the lowest derivative with respect to variable n
                var lowestDerivativeValue = Math.min.apply(null, currentMinimumFunctions.map(function (minimandDerivative) {
                    return minimandDerivative.value();
                }));
                for (var j = 0; j < currentMinimumFunctions.length; j++) {
                    if (lowestDerivativeValue == currentMinimumFunctions[j].value()) {
                        return currentMinimumFunctions[j];
                    }
                }
            };
            return Min;
        })(Functions.Base);
        Functions.Min = Min;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var MinAxBy = (function (_super) {
            __extends(MinAxBy, _super);
            function MinAxBy(definition, modelPath) {
                _super.call(this, definition, modelPath);
            }
            MinAxBy.prototype.value = function (bases) {
                var m = this;
                if (bases) {
                    m.setBases(bases);
                }
                var xMinimand = m.xCoefficient * m.bases[0], yMinimand = m.yCoefficient * m.bases[1];
                if (isNaN(xMinimand)) {
                    return yMinimand;
                }
                else if (isNaN(yMinimand)) {
                    return xMinimand;
                }
                else {
                    return Math.min(xMinimand, yMinimand);
                }
            };
            MinAxBy.prototype.derivative = function (n) {
                var m = this;
                var d = new KGMath.Functions.Linear({
                    coefficients: {
                        a: m.definition.xCoefficient,
                        b: m.definition.yCoefficient,
                        c: 0
                    }
                });
                d.value = function (bases) {
                    if (bases) {
                        d.setBases(bases);
                    }
                    var xMinimand = d.coefficients.a * d.bases[0], yMinimand = d.coefficients.b * d.bases[1];
                    if (n == 1 && xMinimand < yMinimand) {
                        return d.coefficients.a;
                    }
                    else if (n == 2 && yMinimand < xMinimand) {
                        return d.coefficients.b;
                    }
                    else {
                        return 0;
                    }
                };
                return d;
            };
            MinAxBy.prototype.points = function (view) {
                var m = this;
                var criticalX = m.level / m.xCoefficient, criticalY = m.level / m.yCoefficient;
                return [
                    {
                        x: criticalX,
                        y: view.yAxis.max
                    },
                    {
                        x: criticalX,
                        y: criticalY
                    },
                    {
                        x: view.xAxis.max,
                        y: criticalY
                    }
                ];
            };
            return MinAxBy;
        })(Functions.Base);
        Functions.MinAxBy = MinAxBy;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var CRRA = (function (_super) {
            __extends(CRRA, _super);
            function CRRA(definition, modelPath) {
                _super.call(this, definition, modelPath);
            }
            CRRA.prototype.value = function (bases) {
                var u = this;
                if (bases) {
                    u.setBases(bases);
                }
                if (u.rho == 1) {
                    return Math.log(u.bases[0]);
                }
                else {
                    return (Math.pow(u.bases[0], 1 - u.rho) - 1) / (1 - u.rho);
                }
            };
            CRRA.prototype.yValue = function (x) {
                return this.value([x]);
            };
            // Returns x value for given y, for a two-dimensional function
            CRRA.prototype.xValue = function (y) {
                var u = this;
                if (u.rho == 1) {
                    return Math.exp(y);
                }
                else {
                    return Math.pow(y * (1 - u.rho) + 1, 1 / (1 - u.rho));
                }
            };
            CRRA.prototype.derivative = function (n) {
                var u = this;
                return new Functions.Monomial({
                    // the new coefficient is the old coefficient times
                    //the power of the variable whose derivative we're taking
                    coefficient: 1,
                    powers: [KG.subtractDefs(0, u.definition.rho)],
                    bases: u.bases
                });
            };
            return CRRA;
        })(Functions.Base);
        Functions.CRRA = CRRA;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var CES = (function (_super) {
            __extends(CES, _super);
            function CES(definition, modelPath) {
                definition = _.defaults(definition, {
                    coefficient: 1
                });
                _super.call(this, definition, modelPath);
                var u = this;
                u.internalPolynomial = new Functions.Polynomial({
                    termDefs: [
                        {
                            coefficient: definition.alpha,
                            powers: [definition.r, 0]
                        },
                        {
                            coefficient: KG.subtractDefs(1, definition.alpha),
                            powers: [0, definition.r]
                        }
                    ]
                }, u.modelProperty('internalPolynomial'));
            }
            CES.prototype.value = function (bases) {
                var u = this;
                if (u.r == 0) {
                    // improvised Cobb-Douglas
                    if (bases) {
                        u.setBases(bases);
                    }
                    return Math.pow(u.bases[0], u.alpha) * Math.pow(u.bases[1], 1 - u.alpha);
                }
                return u.coefficient * Math.pow(u.alpha * Math.pow(bases[0], u.r) + (1 - u.alpha) * Math.pow(bases[1], u.r), 1 / u.r);
            };
            /* Generic level curve is given by
                (a*x^r + (1-a)y^r)^(1/r) = U
                 ax^r + (1-a)y^r = U^r */
            // y(x) = [(U^r - ax^r)/(1-a)]^(1/r)
            // y'(x) = (1/r)[(U^r - ax^r)/(1-a)]^(1/r - 1)(-arx^(x-1)
            CES.prototype.yValue = function (x) {
                var u = this;
                if (u.r == 0) {
                    // improvised Cobb-Douglas
                    return Math.pow(u.level / Math.pow(x, u.alpha), 1 / (1 - u.alpha));
                }
                var num = Math.pow(u.level, u.r) - u.alpha * Math.pow(x, u.r), dem = 1 - u.alpha;
                if (num > 0) {
                    return Math.pow(num / dem, 1 / u.r);
                }
                else {
                    return null;
                }
            };
            // Returns x value for given y, for a two-dimensional function
            CES.prototype.xValue = function (y) {
                var u = this;
                if (u.r == 0) {
                    // improvised Cobb-Douglas
                    return Math.pow(u.level / Math.pow(y, 1 - u.alpha), 1 / u.alpha);
                }
                var num = Math.pow(u.level, u.r) - (1 - u.alpha) * Math.pow(y, u.r), dem = u.alpha;
                if (num > 0) {
                    return Math.pow(num / dem, 1 / u.r);
                }
                else {
                    return null;
                }
            };
            CES.prototype.derivative = function (n) {
                var u = this;
                var d = new Functions.Base({});
                d.value = function (bases) {
                    if (bases) {
                        d.setBases(bases);
                    }
                    var common = (u.coefficient / u.r) * Math.pow(u.alpha * Math.pow(bases[0], u.r) + (1 - u.alpha) * Math.pow(bases[1], u.r), (1 / u.r) - 1);
                    if (n == 1) {
                        return common * u.alpha * u.r * Math.pow(bases[0], u.r - 1);
                    }
                    else {
                        return common * (1 - u.alpha) * u.r * Math.pow(bases[1], u.r - 1);
                    }
                };
                return d;
            };
            return CES;
        })(Functions.Base);
        Functions.CES = CES;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
/*
 A Quasilinear function is a term of the form ax^b + cy^d + ...

 The initializing object, params, should be of the form

 { coefficients: [a,c,...], powers: [b,c,...] }

 */
var KGMath;
(function (KGMath) {
    var Functions;
    (function (Functions) {
        var Quasilinear = (function (_super) {
            __extends(Quasilinear, _super);
            function Quasilinear(definition, modelPath) {
                this.quasilinearDefs = {
                    coefficients: definition.coefficients.map(function (c) {
                        return c.toString();
                    }),
                    powers: definition.powers.map(function (p) {
                        return p.toString();
                    })
                };
                _super.call(this, definition, modelPath);
            }
            // Establish setters
            Quasilinear.prototype.setCoefficients = function (coefficients) {
                return this.setArrayProperty({
                    name: 'coefficients',
                    value: coefficients,
                    defaultValue: []
                });
            };
            Quasilinear.prototype.setPowers = function (powers) {
                return this.setArrayProperty({
                    name: 'powers',
                    value: powers,
                    defaultValue: []
                });
            };
            // Evaluate Quasilinear for a given set of bases. If none are set, use q.bases.
            Quasilinear.prototype.value = function (bases) {
                var q = this;
                q.setBases(bases);
                var basePowerPairs = Math.min(q.bases.length, q.powers.length, q.coefficients.length);
                var result = 0;
                for (var t = 0; t < basePowerPairs; t++) {
                    result += q.coefficients[t] * Math.pow(q.bases[t], q.powers[t]);
                }
                return result;
            };
            // Return the Quasilinear that is the derivative of this Quasilinear
            // with respect to the n'th variable
            Quasilinear.prototype.derivative = function (n) {
                var q = this;
                // n is the index of the term; first term by default
                n = n - 1 || 0;
                return new Functions.Monomial({
                    // the new coefficient is the old coefficient times
                    //the power of the variable whose derivative we're taking
                    coefficient: KG.multiplyDefs(q.quasilinearDefs.coefficients[n], q.quasilinearDefs.powers[n]),
                    powers: [KG.subtractDefs(q.quasilinearDefs.powers[n], 1)],
                    bases: q.bases ? [q.bases[n]] : []
                });
            };
            // Return the Polynomial that is the integral of this Quasilinear
            // with respect to the n'th variable, with no constant of integration
            Quasilinear.prototype.integral = function (n) {
                var q = this;
                // n is the index of the term; first term by default
                n = n - 1 || 0;
                return new Functions.Polynomial({
                    termDefs: [] //TODO add this in
                });
            };
            // Return the Quasilinear that reduces the power of the n'th variable by 1
            Quasilinear.prototype.average = function (n) {
                var q = this;
                // n is the index of the term; first term by default
                n = n - 1 || 0;
                return new Functions.Polynomial({
                    termDefs: [] // TODO add this in
                });
            };
            // Return the Quasilinear that multiplies the coefficient by x
            Quasilinear.prototype.multiply = function (x) {
                var q = this;
                x = x || 1;
                return new Quasilinear({
                    // multiply each coefficient by x
                    coefficients: q.quasilinearDefs.coefficients.map(function (c) {
                        return KG.multiplyDefs(c, x);
                    }),
                    powers: q.quasilinearDefs.powers,
                    bases: q.bases
                });
            };
            // returns the y value corresponding to the given x value for m(x,y) = m.level
            Quasilinear.prototype.yValue = function (x) {
                var q = this;
                var cyToTheD = q.level - q.coefficients[0] * Math.pow(x, q.powers[0]);
                if (cyToTheD > 0) {
                    return Math.pow(cyToTheD / q.coefficients[1], 1 / q.powers[1]);
                }
                else {
                    return null;
                }
            };
            // returns the x value corresponding to the given y value for m(x,y) = m.level
            Quasilinear.prototype.xValue = function (y) {
                var q = this;
                var axToTheB = q.level - q.coefficients[1] * Math.pow(y, q.powers[1]);
                if (axToTheB > 0) {
                    return Math.pow(axToTheB / q.coefficients[0], 1 / q.powers[0]);
                }
                else {
                    return null;
                }
            };
            return Quasilinear;
        })(Functions.Base);
        Functions.Quasilinear = Quasilinear;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
/// <reference path="../kg.ts"/>
/// <reference path="functions/base.ts"/>
/// <reference path="functions/implicit.ts"/>
/// <reference path="functions/relation.ts"/>
/// <reference path="functions/monomial.ts"/>
/// <reference path="functions/cobbDouglas.ts"/>
/// <reference path="functions/polynomial.ts"/>
/// <reference path="functions/linear.ts"/>
/// <reference path="functions/quadratic.ts"/>
/// <reference path="functions/min.ts"/>
/// <reference path="functions/minAxBy.ts"/>
/// <reference path="functions/crra.ts"/>
/// <reference path="functions/ces.ts"/>
/// <reference path="functions/quasilinear.ts"/>
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var ViewObject = (function (_super) {
        __extends(ViewObject, _super);
        function ViewObject(definition, modelPath) {
            if (definition.hasOwnProperty('params')) {
                var p = definition.params;
                if (p.hasOwnProperty('className')) {
                    if (definition.hasOwnProperty('className')) {
                        definition.className += ' ' + p.className;
                    }
                    else {
                        definition.className = p.className;
                    }
                }
                if (p.hasOwnProperty('name')) {
                    if (definition.hasOwnProperty('name')) {
                        definition.name += '_' + p.name;
                    }
                    else {
                        definition.name = p.name;
                    }
                }
                if (p.hasOwnProperty('objectName')) {
                    definition.objectName = p.objectName;
                }
                if (p.hasOwnProperty('xDrag')) {
                    definition.xDrag = p.xDrag;
                }
                if (p.hasOwnProperty('yDrag')) {
                    definition.yDrag = p.yDrag;
                }
                if (p.hasOwnProperty('show')) {
                    definition.show = p.show;
                }
            }
            definition = _.defaults(definition, {
                name: '',
                className: '',
                color: KG.colorForClassName(definition.className),
                show: true,
                xDrag: false,
                yDrag: false
            });
            _super.call(this, definition, modelPath);
            var viewObj = this;
            /* Set drag behavior on object */
            viewObj.xDragDelta = 0;
            viewObj.yDragDelta = 0;
            if (definition.xDrag) {
                if (typeof definition.xDrag == 'string') {
                    viewObj.xDragParam = definition.xDrag.replace('params.', '');
                    viewObj.xDrag = true;
                }
                else if (definition.hasOwnProperty('coordinates') && typeof definition.coordinates.x == 'string') {
                    this.xDragParam = definition.coordinates.x.replace('params.', '');
                }
            }
            if (definition.yDrag) {
                if (typeof definition.yDrag == 'string') {
                    viewObj.yDragParam = definition.yDrag.replace('params.', '');
                    viewObj.yDrag = true;
                }
                else if (definition.hasOwnProperty('coordinates') && typeof definition.coordinates.y == 'string') {
                    this.yDragParam = definition.coordinates.y.replace('params.', '');
                }
            }
        }
        ViewObject.prototype.classAndVisibility = function () {
            var classString = this.viewObjectClass;
            if (this.className) {
                classString += ' ' + this.className;
            }
            if (this.show) {
                classString += ' visible';
            }
            else {
                classString += ' invisible';
            }
            if (this.hasOwnProperty('objectName')) {
                classString += ' ' + this.objectName;
            }
            return classString;
        };
        ViewObject.prototype.updateDataForView = function (view) {
            return this;
        };
        ViewObject.prototype.addArrow = function (group, startOrEnd) {
            group.attr("marker-" + startOrEnd, "url(#arrow-" + startOrEnd + "-" + this.color + ")");
        };
        ViewObject.prototype.removeArrow = function (group, startOrEnd) {
            group.attr("marker-" + startOrEnd, null);
        };
        ViewObject.prototype.render = function (view) {
            return view; // overridden by child class
        };
        ViewObject.prototype.createSubObjects = function (view, scope) {
            return view; // overridden by child class
        };
        ViewObject.prototype.initGroupFn = function () {
            var viewObjectSVGtype = this.viewObjectSVGtype, viewObjectClass = this.viewObjectClass;
            return function (newGroup) {
                newGroup.append(viewObjectSVGtype).attr('class', viewObjectClass);
                return newGroup;
            };
        };
        ViewObject.prototype.setDragBehavior = function (view, obj) {
            var viewObj = this;
            obj.style('cursor', viewObj.xDrag ? (viewObj.yDrag ? 'move' : 'ew-resize') : 'ns-resize');
            obj.call(view.drag(viewObj.xDragParam, viewObj.yDragParam, viewObj.xDragDelta, viewObj.yDragDelta));
            return view;
        };
        return ViewObject;
    })(KG.Model);
    KG.ViewObject = ViewObject;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var ViewObjectGroup = (function (_super) {
        __extends(ViewObjectGroup, _super);
        function ViewObjectGroup(definition, modelPath) {
            _super.call(this, definition, modelPath);
        }
        ViewObjectGroup.prototype.createSubObjects = function (view, scope) {
            this.viewObjects.forEach(function (viewObject) {
                view.addObject(viewObject.update(scope));
                viewObject.createSubObjects(view, scope);
            });
            return view;
        };
        ViewObjectGroup.prototype.initGroupFn = function () {
            var g = this;
            return function (newGroup) {
                g.viewObjects.forEach(function (obj) {
                    newGroup.append(obj.viewObjectSVGtype).attr('class', obj.viewObjectClass + ' ' + obj.objectName);
                });
                return newGroup;
            };
        };
        ViewObjectGroup.prototype.render = function (view) {
            var g = this;
            var group = view.objectGroup(g.name, g.initGroupFn(), false);
            return view;
        };
        return ViewObjectGroup;
    })(KG.ViewObject);
    KG.ViewObjectGroup = ViewObjectGroup;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point(definition, modelPath) {
            if (definition.hasOwnProperty('params')) {
                var p = definition.params;
                if (p.hasOwnProperty('label')) {
                    definition.label = {
                        text: p.label
                    };
                }
                if (p.hasOwnProperty('xAxisLabel') || p.hasOwnProperty('yAxisLabel')) {
                    if (!definition.hasOwnProperty('droplines')) {
                        definition.droplines = {};
                    }
                    if (p.hasOwnProperty('xAxisLabel')) {
                        definition.droplines.vertical = p.xAxisLabel;
                    }
                    if (p.hasOwnProperty('yAxisLabel')) {
                        definition.droplines.horizontal = p.yAxisLabel;
                    }
                }
                if (p.hasOwnProperty('xDragParam')) {
                    definition.xDrag = 'params.' + p.xDragParam;
                }
                if (p.hasOwnProperty('yDragParam')) {
                    definition.yDrag = 'params.' + p.yDragParam;
                }
            }
            var defaultSize = 100;
            if (definition.hasOwnProperty('label')) {
                if (definition.label.hasOwnProperty('text')) {
                    if (definition.label.text.length > 0) {
                        defaultSize = 500;
                    }
                }
            }
            definition = _.defaults(definition, {
                coordinates: { x: 0, y: 0 },
                size: defaultSize,
                symbol: 'circle'
            });
            _super.call(this, definition, modelPath);
            if (definition.label) {
                var labelDef = _.defaults(definition.label, {
                    name: definition.name + '_label',
                    coordinates: definition.coordinates,
                    xDrag: definition.xDrag,
                    yDrag: definition.yDrag,
                    show: definition.show
                });
                if (!labelDef.hasOwnProperty('align')) {
                    labelDef.className = 'pointLabel';
                }
                this.labelDiv = new KG.GraphDiv(labelDef);
            }
            if (definition.droplines) {
                if (definition.droplines.hasOwnProperty('horizontal')) {
                    this.horizontalDropline = new KG.HorizontalDropline({
                        name: definition.name,
                        coordinates: definition.coordinates,
                        draggable: definition.yDrag,
                        axisLabel: definition.droplines.horizontal,
                        className: definition.className,
                        show: definition.show
                    });
                }
                if (definition.droplines.hasOwnProperty('vertical')) {
                    this.verticalDropline = new KG.VerticalDropline({
                        name: definition.name,
                        coordinates: definition.coordinates,
                        draggable: definition.xDrag,
                        axisLabel: definition.droplines.vertical,
                        className: definition.className,
                        show: definition.show
                    });
                }
            }
            this.viewObjectSVGtype = 'path';
            this.viewObjectClass = 'pointSymbol';
        }
        Point.prototype.createSubObjects = function (view, scope) {
            var p = this;
            if (view instanceof KG.TwoVerticalGraphs) {
                if (p.labelDiv) {
                    view.topGraph.addObject(p.labelDiv.update(scope));
                }
                if (p.verticalDropline) {
                    var continuationDropLine = new KG.VerticalDropline({
                        name: p.verticalDropline.name,
                        className: p.verticalDropline.className,
                        coordinates: { x: p.verticalDropline.definition.coordinates.x, y: view.bottomGraph.yAxis.domain.max },
                        draggable: p.verticalDropline.draggable,
                        axisLabel: p.verticalDropline.axisLabel
                    });
                    p.verticalDropline.labelDiv = null;
                    view.topGraph.addObject(p.verticalDropline.update(scope));
                    view.bottomGraph.addObject(continuationDropLine.update(scope));
                    p.verticalDropline.createSubObjects(view.topGraph, scope); // TODO should probably make this more recursive by default
                    continuationDropLine.createSubObjects(view.bottomGraph, scope);
                }
                if (p.horizontalDropline) {
                    view.topGraph.addObject(p.horizontalDropline.update(scope));
                    p.horizontalDropline.createSubObjects(view.topGraph, scope); // TODO should probably make this more recursive by default
                }
            }
            else {
                if (p.labelDiv) {
                    view.addObject(p.labelDiv.update(scope));
                }
                if (p.verticalDropline) {
                    view.addObject(p.verticalDropline.update(scope));
                    p.verticalDropline.createSubObjects(view, scope); // TODO should probably make this more recursive by default
                }
                if (p.horizontalDropline) {
                    view.addObject(p.horizontalDropline.update(scope));
                    p.horizontalDropline.createSubObjects(view, scope); // TODO should probably make this more recursive by default
                }
            }
            return view;
        };
        Point.prototype.render = function (view) {
            var point = this, draggable = (point.xDrag || point.yDrag);
            var subview = (view instanceof KG.TwoVerticalGraphs) ? view.topGraph : view;
            if (!point.hasOwnProperty('coordinates')) {
                return view;
            }
            if (isNaN(point.coordinates.x) || isNaN(point.coordinates.y) || point.coordinates.x == Infinity || point.coordinates.y == Infinity) {
                return view;
            }
            var group = subview.objectGroup(point.name, point.initGroupFn(), true);
            if (!subview.onGraph(point.coordinates)) {
                point.show = false;
            }
            if (point.symbol === 'none') {
                point.show = false;
                point.labelDiv.show = false;
            }
            // draw the symbol at the point
            var pointSymbol = group.select('.' + point.viewObjectClass);
            try {
                pointSymbol.attr({
                    'class': point.classAndVisibility(),
                    'fill': point.color,
                    'd': d3.svg.symbol().type(point.symbol).size(point.size),
                    'transform': subview.translateByCoordinates(point.coordinates)
                });
            }
            catch (error) {
                console.log(error);
            }
            if (draggable) {
                return point.setDragBehavior(subview, pointSymbol);
            }
            else {
                return view;
            }
            return view;
        };
        return Point;
    })(KG.ViewObject);
    KG.Point = Point;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Dropline = (function (_super) {
        __extends(Dropline, _super);
        function Dropline(definition, modelPath) {
            definition.coordinates = KG.getCoordinates(definition.coordinates);
            definition = _.defaults(definition, {
                horizontal: false,
                draggable: false,
                axisLabel: ''
            });
            _super.call(this, definition, modelPath);
            if (definition.axisLabel.length > 0) {
                var labelDef = {
                    name: definition.name + '_label',
                    className: definition.className,
                    text: definition.axisLabel,
                    dimensions: { width: 60, height: 20 },
                    backgroundColor: 'white',
                    show: definition.show
                };
                if (definition.horizontal) {
                    labelDef.coordinates = {
                        x: KG.GraphDiv.AXIS_COORDINATE_INDICATOR,
                        y: definition.coordinates.y
                    };
                    labelDef.yDrag = definition.draggable;
                }
                else {
                    labelDef.coordinates = {
                        x: definition.coordinates.x,
                        y: KG.GraphDiv.AXIS_COORDINATE_INDICATOR
                    };
                    labelDef.xDrag = definition.draggable;
                }
                this.labelDiv = new KG.GraphDiv(labelDef);
            }
            this.viewObjectSVGtype = 'line';
            this.viewObjectClass = 'dropline';
        }
        Dropline.prototype.createSubObjects = function (view, scope) {
            var p = this;
            if (p.labelDiv) {
                view.addObject(p.labelDiv.update(scope));
            }
            return view;
        };
        Dropline.prototype.render = function (view) {
            var dropline = this;
            var pointX = view.xAxis.scale(dropline.coordinates.x), pointY = view.yAxis.scale(dropline.coordinates.y), anchorX = dropline.horizontal ? view.xAxis.scale(view.xAxis.min) : pointX, anchorY = dropline.horizontal ? pointY : view.yAxis.scale(view.yAxis.min);
            if (isNaN(pointX) || isNaN(pointY)) {
                return view;
            }
            var group = view.objectGroup(dropline.name, dropline.initGroupFn(), false);
            var droplineSelection = group.select('.' + dropline.viewObjectClass);
            droplineSelection.attr({
                'x1': anchorX,
                'y1': anchorY,
                'x2': pointX,
                'y2': pointY,
                'class': dropline.classAndVisibility()
            });
            return view;
        };
        return Dropline;
    })(KG.ViewObject);
    KG.Dropline = Dropline;
    var VerticalDropline = (function (_super) {
        __extends(VerticalDropline, _super);
        function VerticalDropline(definition, modelPath) {
            definition.name += '_vDropline';
            definition.horizontal = false;
            _super.call(this, definition, modelPath);
        }
        return VerticalDropline;
    })(Dropline);
    KG.VerticalDropline = VerticalDropline;
    var HorizontalDropline = (function (_super) {
        __extends(HorizontalDropline, _super);
        function HorizontalDropline(definition, modelPath) {
            definition.name += '_hDropline';
            definition.horizontal = true;
            _super.call(this, definition, modelPath);
        }
        return HorizontalDropline;
    })(Dropline);
    KG.HorizontalDropline = HorizontalDropline;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Curve = (function (_super) {
        __extends(Curve, _super);
        function Curve(definition, modelPath) {
            if (definition.hasOwnProperty('params')) {
                var p = definition.params;
                if (p.hasOwnProperty('label')) {
                    definition.label = {
                        text: p.label
                    };
                }
                if (p.hasOwnProperty('labelPrefix')) {
                    definition.label.text = p.labelPrefix + definition.label.text;
                }
                if (p.hasOwnProperty('areaUnderLabel')) {
                }
            }
            definition = _.defaults(definition, { data: [], interpolation: 'linear' });
            _super.call(this, definition, modelPath);
            if (definition.label) {
                var labelDef = _.defaults(definition.label, {
                    name: definition.name + '_label',
                    objectName: definition.objectName,
                    className: definition.className,
                    xDrag: definition.xDrag,
                    yDrag: definition.yDrag,
                    color: definition.color,
                    show: definition.show,
                    backgroundColor: 'white'
                });
                //console.log(labelDef);
                this.labelDiv = new KG.GraphDiv(labelDef);
            }
            this.startArrow = (definition.arrows == Curve.START_ARROW_STRING || definition.arrows == Curve.BOTH_ARROW_STRING);
            this.endArrow = (definition.arrows == Curve.END_ARROW_STRING || definition.arrows == Curve.BOTH_ARROW_STRING);
            this.viewObjectSVGtype = 'path';
            this.viewObjectClass = 'curve';
        }
        Curve.prototype.createSubObjects = function (view, scope) {
            var labelDiv = this.labelDiv;
            if (labelDiv) {
                return view.addObject(labelDiv.update(scope));
            }
            else {
                return view;
            }
        };
        Curve.prototype.positionLabel = function (view) {
            var curve = this, autoAlign = 'center', autoVAlign = 'middle';
            if (curve.labelDiv) {
                if (!curve.startPoint) {
                    curve.labelDiv.show = false;
                }
                else {
                    curve.labelDiv.show = curve.show;
                    var labelViewCoordinates = (curve.labelPosition == Curve.LABEL_POSITION_START) ? curve.startPoint : (curve.labelPosition == Curve.LABEL_POSITION_MIDDLE) ? curve.midPoint : curve.endPoint;
                    var labelCoordinates = view.modelCoordinates(_.clone(labelViewCoordinates));
                    if (labelCoordinates.y > view.yAxis.domain.max) {
                        labelCoordinates.y = view.yAxis.domain.max;
                        autoVAlign = 'bottom';
                    }
                    else if (labelCoordinates.x >= view.xAxis.domain.max) {
                        labelCoordinates.x = view.xAxis.domain.max;
                        autoAlign = 'left';
                    }
                    else {
                        autoAlign = (view.nearRight(labelCoordinates) || view.nearLeft(labelCoordinates)) || view.nearBottom(labelCoordinates) ? 'left' : 'center';
                        autoVAlign = (view.nearTop(labelCoordinates) || view.nearBottom(labelCoordinates)) ? 'bottom' : 'middle';
                    }
                    curve.labelDiv.coordinates = labelCoordinates;
                    if (!curve.labelDiv.definition.hasOwnProperty('align')) {
                        curve.labelDiv.align = autoAlign;
                    }
                    if (!curve.labelDiv.definition.hasOwnProperty('valign')) {
                        curve.labelDiv.valign = autoVAlign;
                    }
                }
            }
        };
        Curve.prototype.addArrows = function (group) {
            var curve = this;
            var length = KG.distanceBetweenCoordinates(curve.startPoint, curve.endPoint);
            if (length) {
                if (curve.endArrow && length > 0) {
                    curve.addArrow(group, 'end');
                }
                else {
                    curve.removeArrow(group, 'end');
                }
                if (curve.startArrow && length > 0) {
                    curve.addArrow(group, 'start');
                }
                else {
                    curve.removeArrow(group, 'start');
                }
            }
        };
        Curve.prototype.render = function (view) {
            var curve = this;
            curve.updateDataForView(view);
            var dataCoordinates = view.dataCoordinates(curve.data);
            var dataLength = dataCoordinates.length;
            curve.startPoint = dataCoordinates[0];
            curve.endPoint = dataCoordinates[dataLength - 1];
            curve.midPoint = KG.medianDataPoint(dataCoordinates);
            var group = view.objectGroup(curve.name, curve.initGroupFn(), false);
            curve.addArrows(group);
            curve.positionLabel(view);
            var dataLine = d3.svg.line().interpolate(this.interpolation).x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            });
            var selector = curve.hasOwnProperty('objectName') ? 'path.' + curve.objectName : 'path.' + curve.viewObjectClass;
            var dataPath = group.select(selector);
            dataPath.attr({
                'class': curve.classAndVisibility(),
                'd': dataLine(dataCoordinates)
            });
            return view;
        };
        Curve.LABEL_POSITION_MIDDLE = 'MIDDLE';
        Curve.LABEL_POSITION_START = 'START';
        Curve.START_ARROW_STRING = 'START';
        Curve.END_ARROW_STRING = 'END';
        Curve.BOTH_ARROW_STRING = 'BOTH';
        return Curve;
    })(KG.ViewObject);
    KG.Curve = Curve;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Segment = (function (_super) {
        __extends(Segment, _super);
        function Segment(definition, modelPath) {
            definition.labelPosition = KG.Curve.LABEL_POSITION_MIDDLE;
            definition.data = [KG.getCoordinates(definition.a), KG.getCoordinates(definition.b)];
            _super.call(this, definition, modelPath);
            this.viewObjectClass = 'segment';
        }
        return Segment;
    })(KG.Curve);
    KG.Segment = Segment;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Arrow = (function (_super) {
        __extends(Arrow, _super);
        function Arrow(definition, modelPath) {
            definition.labelPosition = KG.Curve.LABEL_POSITION_MIDDLE;
            definition.data = [KG.getCoordinates(definition.begin), KG.getCoordinates(definition.end)];
            definition.arrows = KG.Curve.END_ARROW_STRING;
            _super.call(this, definition, modelPath);
            this.viewObjectClass = 'arrow';
        }
        return Arrow;
    })(KG.Curve);
    KG.Arrow = Arrow;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(definition, modelPath) {
            if (definition.hasOwnProperty('params')) {
                var p = definition.params;
                if (p.hasOwnProperty('label')) {
                    definition.label = {
                        text: p.label
                    };
                }
                if (p.hasOwnProperty('areaUnderLabel')) {
                    definition.areaUnderDef = {
                        name: definition.name + '_areaUnder',
                        className: definition.className,
                        label: {
                            text: p.areaUnderLabel
                        }
                    };
                }
                if (p.hasOwnProperty('areaOverLabel')) {
                    definition.areaOverDef = {
                        name: definition.name + 'areaOver',
                        className: definition.className,
                        label: {
                            text: p.areaOverLabel
                        }
                    };
                }
                if (p.hasOwnProperty('xInterceptLabel')) {
                    definition.xInterceptLabel = p.xInterceptLabel;
                }
                if (p.hasOwnProperty('yInterceptLabel')) {
                    definition.yInterceptLabel = p.yInterceptLabel;
                }
            }
            _super.call(this, definition, modelPath);
            var line = this;
            if (line instanceof HorizontalLine) {
                line.linear = new KGMath.Functions.HorizontalLine({ y: definition.y });
            }
            else if (line instanceof VerticalLine) {
                line.linear = new KGMath.Functions.VerticalLine({ x: definition.x });
            }
            else if (definition.hasOwnProperty('lineDef')) {
                line.linear = new KGMath.Functions.Linear(definition.lineDef);
            }
            line.viewObjectSVGtype = 'path';
            line.viewObjectClass = 'line';
            if (definition.label) {
                var labelDef = _.defaults(definition.label, {
                    name: definition.name + '_label',
                    className: definition.className,
                    xDrag: definition.xDrag,
                    yDrag: definition.yDrag,
                    color: definition.color,
                    show: definition.show
                });
                //console.log(labelDef);
                line.labelDiv = new KG.GraphDiv(labelDef);
            }
            if (definition.areaUnderDef) {
                line.areaUnder = new KG.Area(definition.areaUnderDef);
            }
            if (definition.areaOverDef) {
                line.areaOver = new KG.Area(definition.areaOverDef);
            }
            if (definition.hasOwnProperty('xInterceptLabel')) {
                var xInterceptLabelDef = {
                    name: definition.name + 'x_intercept_label',
                    className: definition.className,
                    text: definition.xInterceptLabel,
                    dimensions: { width: 30, height: 20 },
                    xDrag: definition.xDrag,
                    backgroundColor: 'white'
                };
                line.xInterceptLabelDiv = new KG.GraphDiv(xInterceptLabelDef);
            }
            if (definition.hasOwnProperty('yInterceptLabel')) {
                var yInterceptLabelDef = {
                    name: definition.name + 'y_intercept_label',
                    className: definition.className,
                    text: definition.yInterceptLabel,
                    dimensions: { width: 50, height: 20 },
                    yDrag: definition.yDrag,
                    backgroundColor: 'white'
                };
                line.yInterceptLabelDiv = new KG.GraphDiv(yInterceptLabelDef);
            }
        }
        Line.prototype._update = function (scope) {
            this.linear.update(scope);
            return this;
        };
        Line.prototype.createSubObjects = function (view, scope) {
            var line = this;
            if (line.xInterceptLabelDiv) {
                view.addObject(line.xInterceptLabelDiv.update(scope));
            }
            if (line.yInterceptLabelDiv) {
                view.addObject(line.yInterceptLabelDiv.update(scope));
            }
            if (line.labelDiv) {
                view.addObject(line.labelDiv.update(scope));
            }
            if (line.areaUnder) {
                view.addObject(line.areaUnder.update(scope));
                view.addObject(line.areaUnder.labelDiv.update(scope));
            }
            return view;
        };
        Line.prototype.render = function (view) {
            var NO_ARROW_STRING = 'NONE', BOTH_ARROW_STRING = 'BOTH', OPEN_ARROW_STRING = 'OPEN';
            var line = this, linear = this.linear, draggable = (line.xDrag || line.yDrag);
            var group = view.objectGroup(line.name, line.initGroupFn(), false);
            var startPoint = linear.points(view)[0], endPoint = linear.points(view)[1];
            if (startPoint == undefined || endPoint == undefined) {
                console.log('point is undefined');
            }
            else {
                var yIntercept = KG.isAlmostTo(startPoint.x, view.xAxis.min) ? startPoint : KG.isAlmostTo(endPoint.x, view.xAxis.min) ? endPoint : null;
                var xIntercept = KG.isAlmostTo(startPoint.y, view.yAxis.min) ? startPoint : KG.isAlmostTo(endPoint.y, view.yAxis.min) ? endPoint : null;
                var yRightEdge = KG.isAlmostTo(startPoint.x, view.xAxis.max) ? startPoint : KG.isAlmostTo(endPoint.x, view.xAxis.max) ? endPoint : null;
                var xTopEdge = KG.isAlmostTo(startPoint.y, view.yAxis.max) ? startPoint : KG.isAlmostTo(endPoint.y, view.yAxis.max) ? endPoint : null;
                var startIsOpen = (startPoint !== yIntercept && startPoint !== xIntercept);
                var endIsOpen = (endPoint !== yIntercept && endPoint !== xIntercept);
                if (line.arrows == BOTH_ARROW_STRING) {
                    line.addArrow(group, 'start');
                    line.addArrow(group, 'end');
                }
                else if (line.arrows == OPEN_ARROW_STRING) {
                    if (startIsOpen) {
                        line.addArrow(group, 'start');
                    }
                    else {
                        line.removeArrow(group, 'start');
                    }
                    if (endIsOpen) {
                        line.addArrow(group, 'end');
                    }
                    else {
                        line.removeArrow(group, 'end');
                    }
                }
                else if (line.arrows == NO_ARROW_STRING) {
                    line.removeArrow(group, 'start');
                    line.removeArrow(group, 'end');
                }
                if (line.labelDiv) {
                    var labelPoint, labelAlign = 'left', labelValign = 'bottom';
                    if (line instanceof VerticalLine) {
                        labelPoint = xTopEdge;
                        labelAlign = 'center';
                    }
                    else if (line instanceof HorizontalLine) {
                        labelPoint = yRightEdge;
                        labelValign = 'middle';
                    }
                    else if (linear.slope > 0) {
                        labelPoint = (startPoint.y > endPoint.y) ? startPoint : endPoint;
                    }
                    else {
                        labelPoint = (startPoint.x > endPoint.x) ? startPoint : endPoint;
                    }
                    var yMin = view.yAxis.min + (view.yAxis.max - view.yAxis.min) * 0.02;
                    line.labelDiv.coordinates = { x: labelPoint.x, y: Math.max(yMin, labelPoint.y) };
                    line.labelDiv.align = labelAlign;
                    line.labelDiv.valign = labelValign;
                }
                if (line.areaUnder) {
                    var areaData = [view.corners.bottom.left];
                    if (xIntercept) {
                        if (yIntercept) {
                            // line connects x-axis and y-intercept; color triangle below and to the left
                            areaData.push(xIntercept);
                            areaData.push(yIntercept);
                        }
                        else if (xTopEdge) {
                            // line connects x-axis and top of graph; color quadrilateral formed by line and y-axis
                            areaData.push(xIntercept);
                            areaData.push(xTopEdge);
                            areaData.push(view.corners.top.left);
                        }
                        else if (yRightEdge) {
                            // line connects x-axis and right of graph; color everything but the triangle in the lower-right
                            areaData.push(xIntercept);
                            areaData.push(yRightEdge);
                            areaData.push(view.corners.top.right);
                            areaData.push(view.corners.top.left);
                        }
                    }
                    else if (yIntercept) {
                        if (xTopEdge && KG.areNotTheSamePoint(xTopEdge, yIntercept)) {
                            // line connects y-axis and top of graph; color everything but the triangle in upper-left
                            areaData.push(yIntercept);
                            areaData.push(xTopEdge);
                            areaData.push(view.corners.top.right);
                            areaData.push(view.corners.bottom.right);
                        }
                        else if (yRightEdge) {
                            // line connects y-axis and right of graph; color quadrilateral beneath the line
                            areaData.push(yIntercept);
                            areaData.push(yRightEdge);
                            areaData.push(view.corners.bottom.right);
                        }
                    }
                    else {
                        // line connects top and right of graph; color everything except triangle in upper right
                        areaData.push(view.corners.top.left);
                        areaData.push(xTopEdge);
                        areaData.push(yRightEdge);
                        areaData.push(view.corners.bottom.right);
                    }
                    line.areaUnder.data = areaData;
                }
                if (line.areaOver) {
                    var areaData = [view.corners.top.right];
                    if (xIntercept) {
                        if (yIntercept) {
                            // line connects x-axis and y-intercept; color everything but the triangle below and to the left
                            areaData.push(view.corners.bottom.right);
                            areaData.push(xIntercept);
                            areaData.push(yIntercept);
                            areaData.push(view.corners.top.left);
                        }
                        else if (xTopEdge) {
                            // line connects x-axis and top of graph; color quadrilateral formed by line and right edge
                            areaData.push(xTopEdge);
                            areaData.push(xIntercept);
                            areaData.push(view.corners.bottom.right);
                        }
                        else if (yRightEdge) {
                            // line connects x-axis and right of graph; color everything but the triangle in the lower-right
                            areaData.push(yRightEdge);
                            areaData.push(xIntercept);
                            areaData.push(view.corners.bottom.left);
                            areaData.push(view.corners.top.left);
                        }
                    }
                    else if (yIntercept) {
                        if (xTopEdge) {
                            // line connects y-axis and top of graph; color everything but the triangle in upper-left
                            areaData.push(xTopEdge);
                            areaData.push(yIntercept);
                            areaData.push(view.corners.bottom.left);
                            areaData.push(view.corners.bottom.right);
                        }
                        else if (yRightEdge) {
                            // line connects y-axis and right of graph; color quadrilateral above the line
                            areaData.push(yRightEdge);
                            areaData.push(yIntercept);
                            areaData.push(view.corners.top.left);
                        }
                    }
                    else {
                        // line connects top and right of graph; color triangle in upper right
                        areaData.push(xTopEdge);
                        areaData.push(yRightEdge);
                    }
                    line.areaOver.data = areaData;
                }
                if (line.xInterceptLabelDiv) {
                    line.xInterceptLabelDiv.coordinates = { x: line.linear.xValue(view.yAxis.min), y: 'AXIS' };
                    if (line.xInterceptLabelDiv.definition.text == 'foo') {
                        line.xInterceptLabelDiv.text = line.linear.xValue(view.yAxis.min);
                    }
                }
                if (line.yInterceptLabelDiv) {
                    line.yInterceptLabelDiv.coordinates = { x: 'AXIS', y: line.linear.yValue(view.xAxis.min) };
                }
                var dataLine = d3.svg.line().x(function (d) {
                    return view.xAxis.scale(d.x);
                }).y(function (d) {
                    return view.yAxis.scale(d.y);
                });
                var lineSelection = group.select('.' + line.viewObjectClass);
                lineSelection.attr({
                    'class': line.classAndVisibility(),
                    'd': dataLine([startPoint, endPoint]),
                    'stroke': line.color
                });
                if (draggable) {
                    return line.setDragBehavior(view, lineSelection);
                }
                else {
                    return view;
                }
            }
        };
        return Line;
    })(KG.ViewObject);
    KG.Line = Line;
    var VerticalLine = (function (_super) {
        __extends(VerticalLine, _super);
        function VerticalLine(definition, modelPath) {
            _super.call(this, definition, modelPath);
        }
        return VerticalLine;
    })(Line);
    KG.VerticalLine = VerticalLine;
    var HorizontalLine = (function (_super) {
        __extends(HorizontalLine, _super);
        function HorizontalLine(definition, modelPath) {
            _super.call(this, definition, modelPath);
        }
        return HorizontalLine;
    })(Line);
    KG.HorizontalLine = HorizontalLine;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var PiecewiseLinear = (function (_super) {
        __extends(PiecewiseLinear, _super);
        function PiecewiseLinear(definition, modelPath) {
            if (definition.hasOwnProperty('params')) {
                var p = definition.params;
                if (p.hasOwnProperty('label')) {
                    definition.label = p.label;
                }
                if (p.hasOwnProperty('areaUnderLabel')) {
                    definition.areaUnderLabel = p.areaUnderLabel;
                }
                if (p.hasOwnProperty('areaOverLabel')) {
                    definition.areaOverLabel = p.areaOverLabel;
                }
                if (p.hasOwnProperty('xInterceptLabel')) {
                    definition.xInterceptLabel = p.xInterceptLabel;
                }
                if (p.hasOwnProperty('yInterceptLabel')) {
                    definition.yInterceptLabel = p.yInterceptLabel;
                }
            }
            _super.call(this, definition, modelPath);
            var piecewiseLinear = this;
            if (definition.hasOwnProperty('sectionDefs')) {
                piecewiseLinear.sections = definition.sectionDefs.map(function (def) {
                    return new KGMath.Functions.Linear(def);
                });
            }
            piecewiseLinear.viewObjectSVGtype = 'path';
            piecewiseLinear.viewObjectClass = 'line';
        }
        PiecewiseLinear.prototype._update = function (scope) {
            var piecewiseLinear = this;
            piecewiseLinear.sections.forEach(function (section) {
                section.update(scope);
            });
            return this;
        };
        PiecewiseLinear.prototype.createSubObjects = function (view, scope) {
            var piecewiseLinear = this;
            piecewiseLinear.sections.forEach(function (section, index) {
                if (index == 0) {
                    var newLine = new KG.Line({
                        name: piecewiseLinear.name + '_section' + index,
                        className: piecewiseLinear.className,
                        linear: section.linear,
                        xDomain: section.xDomain,
                        yDomain: section.yDomain,
                        params: {
                            yInterceptLabel: piecewiseLinear.yInterceptLabel
                        }
                    });
                    view.addObject(newLine.update(scope));
                    view = newLine.createSubObjects(view, scope);
                    piecewiseLinear.yIntercept = newLine.linear.yIntercept;
                }
                else if (index == piecewiseLinear.sections.length - 1) {
                    var newLine = new KG.Line({
                        name: piecewiseLinear.name + '_section' + index,
                        className: piecewiseLinear.className,
                        linear: section.linear,
                        xDomain: section.xDomain,
                        yDomain: section.yDomain,
                        params: {
                            label: piecewiseLinear.label,
                            xInterceptLabel: piecewiseLinear.xInterceptLabel
                        }
                    });
                    view.addObject(newLine.update(scope));
                    view = newLine.createSubObjects(view, scope);
                    piecewiseLinear.xIntercept = newLine.linear.xIntercept;
                }
                else {
                    var newLine = new KG.Line({
                        name: piecewiseLinear.name + '_section' + index,
                        className: piecewiseLinear.className,
                        xDomain: section.xDomain,
                        yDomain: section.yDomain,
                        linear: section.linear
                    });
                    view.addObject(newLine.update(scope));
                }
            });
            return view;
        };
        return PiecewiseLinear;
    })(KG.ViewObject);
    KG.PiecewiseLinear = PiecewiseLinear;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var GraphDiv = (function (_super) {
        __extends(GraphDiv, _super);
        function GraphDiv(definition, modelPath) {
            definition = _.defaults(definition, {
                dimensions: { width: 50, height: 20 },
                text: '',
                color: KG.colorForClassName(definition.className)
            });
            _super.call(this, definition, modelPath);
        }
        GraphDiv.prototype.render = function (view) {
            var divObj = this;
            if (divObj.text instanceof Array) {
                divObj.text = divObj.text.join('');
            }
            if (!divObj.hasOwnProperty('coordinates') || divObj.text.length == 0) {
                return view;
            }
            var x, y;
            if (divObj.coordinates.x == GraphDiv.AXIS_COORDINATE_INDICATOR) {
                x = view.margins.left - view.yAxis.textMargin;
                divObj.align = 'right';
                divObj.valign = 'middle';
                if (!view.yAxis.domain.contains(divObj.coordinates.y)) {
                    divObj.className = 'invisible';
                }
            }
            else {
                x = view.margins.left + view.xAxis.scale(divObj.coordinates.x);
            }
            if (divObj.coordinates.y == GraphDiv.AXIS_COORDINATE_INDICATOR) {
                y = view.dimensions.height - view.margins.bottom + view.xAxis.textMargin;
                divObj.align = 'center';
                divObj.valign = 'top';
                if (!view.xAxis.domain.contains(divObj.coordinates.x)) {
                    divObj.className = 'invisible';
                }
            }
            else {
                y = view.margins.top + view.yAxis.scale(divObj.coordinates.y);
            }
            var width = divObj.dimensions.width, height = divObj.dimensions.height, text = divObj.text, draggable = (divObj.xDrag || divObj.yDrag);
            var div = view.getDiv(this.objectName || this.name);
            div.style('cursor', 'default').style('text-align', 'center').style('position', 'absolute').style('width', width + 'px').style('height', height + 'px').style('line-height', height + 'px').style('background-color', divObj.backgroundColor).attr('class', divObj.classAndVisibility());
            // Set left pixel margin; default to centered on x coordinate
            var alignDelta = width * 0.5;
            if (divObj.align == 'left') {
                alignDelta = 0;
                div.style('text-align', 'left');
            }
            else if (this.align == 'right') {
                // move left by half the width of the div if right aligned
                alignDelta = width + 2;
                div.style('text-align', 'right');
            }
            div.style('left', (x - alignDelta) + 'px');
            // Set top pixel margin; default to centered on y coordinate
            var vAlignDelta = height * 0.5;
            // Default to centered on x coordinate
            if (this.valign == 'top') {
                vAlignDelta = 0;
            }
            else if (this.valign == 'bottom') {
                vAlignDelta = height;
            }
            div.style('top', (y - vAlignDelta) + 'px');
            katex.render(text.toString(), div[0][0]);
            if (draggable) {
                return divObj.setDragBehavior(view, div);
            }
            else {
                return view;
            }
        };
        GraphDiv.AXIS_COORDINATE_INDICATOR = 'AXIS';
        return GraphDiv;
    })(KG.ViewObject);
    KG.GraphDiv = GraphDiv;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var LinePlot = (function (_super) {
        __extends(LinePlot, _super);
        function LinePlot(definition, modelPath) {
            _super.call(this, definition, modelPath);
            this.viewObjectSVGtype = 'path';
            this.viewObjectClass = 'dataPath';
        }
        return LinePlot;
    })(KG.Curve);
    KG.LinePlot = LinePlot;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var PathFamily = (function (_super) {
        __extends(PathFamily, _super);
        function PathFamily(definition, modelPath) {
            definition = _.defaults(definition, {
                data: [],
                interpolation: 'basis'
            });
            _super.call(this, definition, modelPath);
            this.viewObjectSVGtype = 'g';
            this.viewObjectClass = 'dataPathFamily';
        }
        PathFamily.prototype.render = function (view) {
            var pathFamily = this;
            pathFamily.updateDataForView(view);
            var group = view.objectGroup(pathFamily.name, pathFamily.initGroupFn(), false);
            var dataLine = d3.svg.line().interpolate(this.interpolation).x(function (d) {
                return view.xAxis.scale(d.x);
            }).y(function (d) {
                return view.yAxis.scale(d.y);
            });
            var dataPaths = group.select('.' + pathFamily.viewObjectClass).selectAll('path').data(pathFamily.data);
            dataPaths.enter().append('path');
            dataPaths.attr({
                'd': function (d) {
                    return dataLine(d);
                },
                'class': this.classAndVisibility()
            });
            dataPaths.exit().remove();
            return view;
        };
        return PathFamily;
    })(KG.ViewObject);
    KG.PathFamily = PathFamily;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var FunctionPlot = (function (_super) {
        __extends(FunctionPlot, _super);
        function FunctionPlot(definition, modelPath) {
            definition = _.defaults(definition, { yIsIndependent: false, interpolation: 'linear', numSamplePoints: 51 });
            _super.call(this, definition, modelPath);
        }
        FunctionPlot.prototype._update = function (scope) {
            var p = this;
            p.fn.update(scope);
            return p;
        };
        FunctionPlot.prototype.updateDataForView = function (view) {
            var p = this;
            p.data = p.fn.points(view, p.yIsIndependent, p.numSamplePoints);
            return p;
        };
        return FunctionPlot;
    })(KG.Curve);
    KG.FunctionPlot = FunctionPlot;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var FunctionMap = (function (_super) {
        __extends(FunctionMap, _super);
        function FunctionMap(definition, modelPath) {
            definition = _.defaults(definition, { interpolation: 'basis', numSamplePoints: 51 });
            _super.call(this, definition, modelPath);
            var fmap = this;
        }
        FunctionMap.prototype._update = function (scope) {
            var fmap = this;
            fmap.fn.update(scope);
            fmap.curves.forEach(function (curve) {
                curve.update(scope);
            });
            return fmap;
        };
        FunctionMap.prototype.createSubObjects = function (view, scope) {
            var fmap = this;
            fmap.levels.forEach(function (level, index) {
                var curve = new KG.FunctionPlot({
                    name: fmap.name + '_' + index,
                    fn: fmap.fn.setLevel(level)
                });
                var updatedCurve = curve.update(scope);
                view.addObject(updatedCurve);
            });
            return view;
        };
        return FunctionMap;
    })(KG.ViewObject);
    KG.FunctionMap = FunctionMap;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Area = (function (_super) {
        __extends(Area, _super);
        function Area(definition, modelPath) {
            if (definition.hasOwnProperty('params')) {
                var p = definition.params;
                if (p.hasOwnProperty('label')) {
                    definition.label = {
                        text: p.label
                    };
                }
            }
            definition = _.defaults(definition, { interpolation: 'linear' });
            _super.call(this, definition, modelPath);
            if (definition.label) {
                var labelDef = _.defaults(definition.label, {
                    name: definition.name + '_label',
                    className: definition.className,
                    xDrag: definition.xDrag,
                    yDrag: definition.yDrag,
                    color: definition.color,
                    show: definition.show
                });
                //console.log(labelDef);
                this.labelDiv = new KG.GraphDiv(labelDef);
            }
            this.viewObjectSVGtype = 'path';
            this.viewObjectClass = 'area';
        }
        Area.prototype.createSubObjects = function (view, scope) {
            var labelDiv = this.labelDiv;
            if (labelDiv) {
                return view.addObject(labelDiv.update(scope));
            }
            else {
                return view;
            }
        };
        Area.prototype.positionLabel = function (view) {
            var area = this;
            if (area.labelDiv) {
                area.labelDiv.coordinates = view.modelCoordinates(KG.arrayAverage(area.data));
            }
        };
        Area.prototype.render = function (view) {
            var area = this;
            area.updateDataForView(view);
            var dataCoordinates = view.dataCoordinates(area.data);
            var group = view.objectGroup(area.name, area.initGroupFn(), false);
            area.positionLabel(view);
            var dataLine = d3.svg.line().interpolate(this.interpolation).x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            });
            var dataPath = group.select('.' + area.viewObjectClass);
            dataPath.attr({
                'class': area.classAndVisibility(),
                'd': dataLine(dataCoordinates)
            }).style('fill', KG.colorForClassName(area.className, 'light')).style('opacity', 0.5);
            return view;
        };
        return Area;
    })(KG.ViewObject);
    KG.Area = Area;
})(KG || (KG = {}));
/// <reference path='kg.ts'/>
'use strict';
var KG;
(function (KG) {
    var View = (function (_super) {
        __extends(View, _super);
        function View(definition, modelPath) {
            definition = _.defaults(definition, {
                background: 'white',
                mask: true,
                show: true
            });
            _super.call(this, definition, modelPath);
            if (definition.hasOwnProperty('xAxisDef')) {
                this.xAxis = new KG.XAxis(definition.xAxisDef);
            }
            if (definition.hasOwnProperty('yAxisDef')) {
                this.yAxis = new KG.YAxis(definition.yAxisDef);
            }
        }
        View.prototype._update = function (scope) {
            var view = this;
            view.objects.forEach(function (object) {
                if (object instanceof KG.Model) {
                    object.update(scope).createSubObjects(view, scope);
                }
            });
            return view;
        };
        View.prototype.render = function (scope, redraw) {
            var view = this;
            //console.log('calling update');
            view.update(scope, function () {
                console.log('starting update');
                view.updateParams = function (params) {
                    scope.updateParams(params);
                };
                if (redraw) {
                    view.redraw(scope);
                }
                else {
                    view.drawObjects(scope);
                }
                //console.log('finished update')
            });
        };
        View.prototype.redraw = function (scope) {
            var view = this;
            // Establish dimensions of the view
            var element = $('#' + view.element_id)[0];
            if (element == undefined) {
                return view;
            }
            view.dimensions = {
                width: Math.min(view.maxDimensions.width, element.clientWidth),
                height: Math.min(view.maxDimensions.height, window.innerHeight - (10 + $('#' + view.element_id).offset().top - $(window).scrollTop()))
            };
            var frameTranslation = KG.positionByPixelCoordinates({ x: (element.clientWidth - view.dimensions.width) / 2, y: 0 });
            var visTranslation = KG.translateByPixelCoordinates({ x: view.margins.left, y: view.margins.top });
            d3.select(element).select('div').remove();
            if (!view.show) {
                return view;
            }
            // Create new div element to contain SVG
            var frame = d3.select(element).append('div').attr({ style: frameTranslation });
            // Create new SVG element for the view visualization
            var svg = frame.append('svg').attr('width', view.dimensions.width).attr('height', view.dimensions.height);
            // Establish marker style for arrow
            var endMarkers = svg.append("svg:defs").selectAll("marker").data(KG.allColors()).enter().append("marker").attr("id", function (d) {
                return "arrow-end-" + d;
            }).attr("refX", 11).attr("refY", 6).attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
            /*endMarkers.append("svg:rect")
                .attr('x',2)
                .attr('width', 11)
                .attr('height', 13)
                .attr('fill','white');*/
            endMarkers.append("svg:path").attr("d", "M2,2 L2,11 L10,6 L2,2").attr("fill", function (d) {
                return d;
            });
            // Establish marker style for arrow
            var startMarkers = svg.append("svg:defs").selectAll("marker").data(KG.allColors()).enter().append("svg:marker").attr("id", function (d) {
                return "arrow-start-" + d;
            }).attr("refX", 2).attr("refY", 6).attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
            // TODO need a better way to mask the portion of the line that extends under the arrow
            /*startMarkers.append("svg:rect")
                .attr('x',2)
                .attr('width', 11)
                .attr('height', 13)*/
            startMarkers.append("svg:path").attr("d", "M11,2 L11,11 L2,6 L11,2").attr("fill", function (d) {
                return d;
            });
            // Add a div above the SVG for labels and controls
            view.divs = frame.append('div').attr({ style: visTranslation });
            if (view.mask) {
                // Establish SVG groups for visualization area (vis), mask, axes
                view.masked = svg.append('g').attr('transform', visTranslation);
                var mask = svg.append('g').attr('class', 'mask');
                // Put mask around vis to clip objects that extend beyond the desired viewable area
                mask.append('rect').attr({ x: 0, y: 0, width: view.dimensions.width, height: view.margins.top, fill: view.background });
                mask.append('rect').attr({ x: 0, y: view.dimensions.height - view.margins.bottom, width: view.dimensions.width, height: view.margins.bottom, fill: view.background });
                mask.append('rect').attr({ x: 0, y: 0, width: view.margins.left, height: view.dimensions.height, fill: view.background });
                mask.append('rect').attr({ x: view.dimensions.width - view.margins.right, y: 0, width: view.margins.right, height: view.dimensions.height, fill: view.background });
            }
            if (view.xAxis || view.yAxis) {
                // Establish SVG group for axes
                var axes = svg.append('g').attr('class', 'axes').attr('transform', visTranslation);
                // Establish dimensions of axes (element dimensions minus margins)
                var axisDimensions = {
                    width: view.dimensions.width - view.margins.left - view.margins.right,
                    height: view.dimensions.height - view.margins.top - view.margins.bottom
                };
                // draw axes
                if (view.xAxis) {
                    view.xAxis.update(scope).draw(axes, view.divs, axisDimensions, view.margins);
                }
                if (view.yAxis) {
                    view.yAxis.update(scope).draw(axes, view.divs, axisDimensions, view.margins);
                }
            }
            // Establish SVG group for objects that lie above the axes (e.g., points and labels)
            view.unmasked = svg.append('g').attr('transform', visTranslation);
            return view.drawObjects(scope);
        };
        View.prototype.drawObjects = function (scope) {
            var view = this;
            view.objects.forEach(function (object) {
                if (object instanceof KG.ViewObject) {
                    object.render(view);
                }
            });
            return view;
        };
        View.prototype.addObject = function (newObj) {
            this.objects.push(newObj);
        };
        View.prototype.updateParams = function (params) {
            console.log('updateParams called before scope applied');
        };
        View.prototype.objectGroup = function (name, init, unmasked) {
            var layer = unmasked ? this.unmasked : this.masked;
            if (layer == undefined) {
                return null;
            }
            var group = layer.select('#' + name);
            if (group.empty()) {
                group = layer.append('g').attr('id', name);
                group = init(group);
            }
            return group;
        };
        View.prototype.getDiv = function (name) {
            var selection = this.divs.select('#' + name);
            if (selection.empty()) {
                selection = this.divs.append('div').attr('id', name);
            }
            return selection;
        };
        View.prototype.xOnGraph = function (x) {
            return this.xAxis.domain.contains(x);
        };
        View.prototype.yOnGraph = function (y) {
            return this.yAxis.domain.contains(y);
        };
        View.prototype.nearTop = function (point) {
            return KG.isAlmostTo(point.y, this.yAxis.domain.max, 0.05);
        };
        View.prototype.nearRight = function (point) {
            return KG.isAlmostTo(point.x, this.xAxis.domain.max, 0.05);
        };
        View.prototype.nearBottom = function (point) {
            return KG.isAlmostTo(point.y, this.yAxis.domain.min, 0.05, this.yAxis.domain.max - this.yAxis.domain.min);
        };
        View.prototype.nearLeft = function (point) {
            return KG.isAlmostTo(point.x, this.xAxis.domain.min, 0.05, this.xAxis.domain.max - this.xAxis.domain.min);
        };
        View.prototype.drag = function (xParam, yParam, xDelta, yDelta) {
            var view = this;
            var xAxis = view.xAxis;
            var yAxis = view.yAxis;
            return d3.behavior.drag().on('drag', function () {
                d3.event.sourceEvent.preventDefault();
                var dragUpdate = {}, newX, newY;
                var relativeElement = view.unmasked[0][0], mouseX = d3.mouse(relativeElement)[0], mouseY = d3.mouse(relativeElement)[1];
                if (xAxis && xParam !== null) {
                    newX = xAxis.scale.invert(mouseX + xDelta);
                    if (newX < xAxis.domain.min) {
                        dragUpdate[xParam] = xAxis.domain.min;
                    }
                    else if (newX > xAxis.domain.max) {
                        dragUpdate[xParam] = xAxis.domain.max;
                    }
                    else {
                        dragUpdate[xParam] = newX;
                    }
                }
                if (yAxis && yParam !== null) {
                    newY = yAxis.scale.invert(mouseY + yDelta);
                    if (newY < yAxis.domain.min) {
                        dragUpdate[yParam] = yAxis.domain.min;
                    }
                    else if (newY > yAxis.domain.max) {
                        dragUpdate[yParam] = yAxis.domain.max;
                    }
                    else {
                        dragUpdate[yParam] = newY;
                    }
                }
                view.updateParams(dragUpdate);
            });
        };
        return View;
    })(KG.Model);
    KG.View = View;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
'use strict';
var KG;
(function (KG) {
    var Axis = (function (_super) {
        __extends(Axis, _super);
        function Axis(definition, modelPath) {
            definition = _.defaults(definition, {
                min: 0,
                max: 10,
                title: '',
                ticks: 5,
                textMargin: 8,
                axisBuffer: 30
            });
            _super.call(this, definition, modelPath);
            if (this.ticks == 0) {
                this.textMargin = 7;
            }
            this.domain = new KG.Domain(definition.min, definition.max);
        }
        Axis.prototype.draw = function (vis, divs, graph_definition, margins) {
            // overridden by child class
        };
        Axis.prototype._update = function (scope) {
            this.domain.min = this.min;
            this.domain.max = this.max;
            return this;
        };
        Axis.prototype.scaleFunction = function (pixelLength, domain) {
            return d3.scale.linear(); // overridden by child class
        };
        return Axis;
    })(KG.Model);
    KG.Axis = Axis;
    var XAxis = (function (_super) {
        __extends(XAxis, _super);
        function XAxis() {
            _super.apply(this, arguments);
        }
        XAxis.prototype.scaleFunction = function (pixelLength, domain) {
            if (this.log) {
                return d3.scale.log().range([0, pixelLength]).domain(domain.toArray());
            }
            else {
                return d3.scale.linear().range([0, pixelLength]).domain(domain.toArray());
            }
        };
        XAxis.prototype.draw = function (vis, divs, graph_dimensions, margins) {
            this.scale = this.scaleFunction(graph_dimensions.width, this.domain);
            var axis_vis = vis.append('g').attr('class', 'x axis').attr("transform", "translate(0," + graph_dimensions.height + ")");
            axis_vis.call(d3.svg.axis().scale(this.scale).orient("bottom").ticks(this.ticks).tickValues(this.tickValues));
            var title = divs.append("div").style('text-align', 'center').style('position', 'absolute').style('width', graph_dimensions.width + 'px').style('height', (margins.bottom - this.axisBuffer) + 'px').style('left', margins.left + 'px').style('top', (margins.top + graph_dimensions.height + this.axisBuffer) + 'px').attr('class', 'medium');
            katex.render(this.title.toString(), title[0][0]);
        };
        return XAxis;
    })(Axis);
    KG.XAxis = XAxis;
    var YAxis = (function (_super) {
        __extends(YAxis, _super);
        function YAxis() {
            _super.apply(this, arguments);
        }
        YAxis.prototype.scaleFunction = function (pixelLength, domain) {
            if (this.log) {
                return d3.scale.log().range([pixelLength, 0]).domain(domain.toArray());
            }
            else {
                return d3.scale.linear().range([pixelLength, 0]).domain(domain.toArray());
            }
        };
        YAxis.prototype.draw = function (vis, divs, graph_dimensions, margins) {
            this.scale = this.scaleFunction(graph_dimensions.height, this.domain);
            var axis_vis = vis.append('g').attr('class', 'y axis');
            axis_vis.call(d3.svg.axis().scale(this.scale).orient("left").ticks(this.ticks).tickValues(this.tickValues));
            var title = divs.append("div").style('text-align', 'center').style('position', 'absolute').style('width', graph_dimensions.height + 'px').style('height', (margins.left - this.axisBuffer) + 'px').style('left', 0.5 * (margins.left - graph_dimensions.height - this.axisBuffer) + 'px').style('top', margins.top + 0.5 * (graph_dimensions.height - margins.left + this.axisBuffer) + 'px').style('-webkit-transform', 'rotate(-90deg)').style('transform', 'rotate(-90deg)').attr('class', 'medium');
            katex.render(this.title.toString(), title[0][0]);
        };
        return YAxis;
    })(Axis);
    KG.YAxis = YAxis;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Graph = (function (_super) {
        __extends(Graph, _super);
        function Graph(definition, modelPath) {
            // ensure dimensions and margins are set; set any missing elements to defaults
            definition.maxDimensions = _.defaults(definition.maxDimensions || {}, { width: 800, height: 800 });
            definition.margins = _.defaults(definition.margins || {}, { top: 20, left: 100, bottom: 70, right: 20 });
            _super.call(this, definition, modelPath);
        }
        Graph.prototype._update = function (scope) {
            var g = this;
            g.corners = {
                bottom: {
                    left: { x: g.xAxis.min, y: g.yAxis.min },
                    right: { x: g.xAxis.max, y: g.yAxis.min }
                },
                top: {
                    left: { x: g.xAxis.min, y: g.yAxis.max },
                    right: { x: g.xAxis.max, y: g.yAxis.max }
                }
            };
            _super.prototype._update.call(this, scope);
            return g;
        };
        // Check to see if a point is on the graph
        Graph.prototype.onGraph = function (coordinates) {
            var ok = (coordinates != null) && (coordinates != undefined) && coordinates.hasOwnProperty('x') && coordinates.hasOwnProperty('y');
            if (!ok) {
                return false;
            }
            return (this.xOnGraph(coordinates.x) && this.yOnGraph(coordinates.y));
        };
        // Convert model coordinates to pixel coordinates for a single point
        Graph.prototype.pixelCoordinates = function (coordinates) {
            try {
                coordinates.x = this.xAxis.scale(coordinates.x);
                coordinates.y = this.yAxis.scale(coordinates.y);
            }
            catch (error) {
                console.log(error);
            }
            return coordinates;
        };
        // Convert pixel coordinates to model coordinates for a single point
        Graph.prototype.modelCoordinates = function (coordinates) {
            coordinates.x = this.xAxis.scale.invert(coordinates.x);
            coordinates.y = this.yAxis.scale.invert(coordinates.y);
            return coordinates;
        };
        // Transform pixel coordinates
        Graph.prototype.translateByCoordinates = function (coordinates) {
            return KG.translateByPixelCoordinates(this.pixelCoordinates(coordinates));
        };
        Graph.prototype.positionByCoordinates = function (coordinates, dimension) {
            return KG.positionByPixelCoordinates(this.pixelCoordinates(coordinates), dimension);
        };
        // Convert model coordinates to pixel coordinates for an array of points
        Graph.prototype.dataCoordinates = function (coordinateArray) {
            var graph = this;
            var onGraphElements = coordinateArray.map(graph.onGraph, graph);
            var dataCoordinatesOnGraph = [];
            for (var i = 0; i < coordinateArray.length; i++) {
                if (onGraphElements[i] || onGraphElements[i - 1] || onGraphElements[i + 1]) {
                    dataCoordinatesOnGraph.push(graph.pixelCoordinates(coordinateArray[i]));
                }
            }
            return dataCoordinatesOnGraph;
        };
        return Graph;
    })(KG.View);
    KG.Graph = Graph;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var TwoVerticalGraphs = (function (_super) {
        __extends(TwoVerticalGraphs, _super);
        function TwoVerticalGraphs(definition, modelPath) {
            // ensure dimensions and margins are set; set any missing elements to defaults
            definition.maxDimensions = _.defaults(definition.maxDimensions || {}, { width: 800, height: 800 });
            _super.call(this, definition, modelPath);
            // if top and bottom graphs share a common x axis, create axis elements
            if (definition.hasOwnProperty('xAxisDef')) {
                definition.topGraph.xAxisDef = _.clone(definition.xAxisDef);
                definition.topGraph.xAxisDef.title = '';
                definition.topGraph.margins = _.defaults(definition.topGraph.margins || {}, { top: 20, left: 100, bottom: 20, right: 20 });
                definition.bottomGraph.xAxisDef = _.clone(definition.xAxisDef);
                definition.bottomGraph.margins = _.defaults(definition.bottomGraph.margins || {}, { top: 20, left: 100, bottom: 70, right: 20 });
            }
            // establish definition for top and bottom graphs
            definition.topGraph.element_id = definition.element_id + '_top';
            this.topGraph = new KG.Graph(definition.topGraph);
            definition.bottomGraph.element_id = definition.element_id + '_bottom';
            this.bottomGraph = new KG.Graph(definition.bottomGraph);
        }
        TwoVerticalGraphs.prototype.redraw = function (scope) {
            var view = this;
            // Establish dimensions of the view
            var element = $('#' + view.element_id)[0];
            view.dimensions = {
                width: Math.min(view.maxDimensions.width, element.clientWidth),
                height: Math.min(view.maxDimensions.height, window.innerHeight - (10 + $('#' + view.element_id).offset().top - $(window).scrollTop()))
            };
            var graphHeight = view.dimensions.height / 2;
            var bottomGraphTranslation = KG.translateByPixelCoordinates({ x: 0, y: graphHeight });
            d3.select(element).select('div').remove();
            // Create new div element to contain SVG
            var frame = d3.select(element).append('div');
            frame.append('div').attr('id', view.topGraph.element_id);
            frame.append('div').attr({ 'id': view.bottomGraph.element_id, 'style': bottomGraphTranslation });
            view.topGraph.maxDimensions.height = graphHeight;
            view.bottomGraph.maxDimensions.height = graphHeight;
            view.topGraph.updateParams = view.updateParams;
            view.bottomGraph.updateParams = view.updateParams;
            view.bottomGraph.redraw(scope);
            view.topGraph.redraw(scope);
            return view.drawObjects(scope);
        };
        TwoVerticalGraphs.prototype.drawObjects = function (scope) {
            var view = this;
            view.topGraph.drawObjects(scope);
            view.bottomGraph.drawObjects(scope);
            if (view.hasOwnProperty('objects')) {
                view.objects.forEach(function (object) {
                    object.createSubObjects(view);
                });
                view.objects.forEach(function (object) {
                    object.update(scope).render(view);
                });
                view.topGraph.objects.forEach(function (object) {
                    object.update(scope).render(view.topGraph);
                });
                view.bottomGraph.objects.forEach(function (object) {
                    object.update(scope).render(view.bottomGraph);
                });
            }
            return view;
        };
        return TwoVerticalGraphs;
    })(KG.View);
    KG.TwoVerticalGraphs = TwoVerticalGraphs;
})(KG || (KG = {}));
/// <reference path="../kg.ts"/>
'use strict';
var KG;
(function (KG) {
    var Slider = (function (_super) {
        __extends(Slider, _super);
        function Slider(definition, modelPath) {
            definition.maxDimensions = _.defaults(definition.maxDimensions || {}, { width: 500, height: 50 });
            definition.margins = _.defaults(definition.margins || {}, { top: 25, left: 25, bottom: 25, right: 25 });
            definition.mask = false;
            _super.call(this, definition, modelPath);
            this.xAxis = new KG.XAxis(definition.axisDef);
            this.objects = [
                new SliderControl({ name: definition.element_id + 'Ctrl', param: 'params.' + definition.param })
            ];
        }
        Slider.prototype._update = function (scope) {
            this.xAxis.update(scope);
            _super.prototype._update.call(this, scope);
            return this;
        };
        Slider.prototype.onGraph = function (coordinates) {
            return true;
        };
        return Slider;
    })(KG.View);
    KG.Slider = Slider;
    var SliderControl = (function (_super) {
        __extends(SliderControl, _super);
        function SliderControl(definition, modelPath) {
            definition.xDrag = true;
            definition.yDrag = false;
            definition.coordinates = { x: definition.param, y: 0 };
            _super.call(this, definition, modelPath);
            this.viewObjectSVGtype = 'g';
            this.viewObjectClass = 'sliderControl';
        }
        SliderControl.prototype.render = function (view) {
            var control = this;
            var group = view.objectGroup(control.name, control.initGroupFn(), true);
            if (!group) {
                return view;
            }
            var controlGroup = group.select('.' + control.viewObjectClass);
            var controlSquare = controlGroup.selectAll('rect').data([0]);
            controlSquare.enter().append('rect').attr({
                opacity: 0,
                y: -view.dimensions.height * 0.5,
                width: 50,
                height: view.dimensions.height
            });
            controlSquare.attr({
                'x': view.xAxis.scale(control.param) - 25
            });
            var controlCircle = controlGroup.selectAll('circle').data([0]);
            controlCircle.enter().append('circle').attr({
                'class': control.classAndVisibility(),
                'r': view.dimensions.height / 5,
                'cy': 0
            });
            controlCircle.attr({
                'cx': view.xAxis.scale(control.param)
            });
            control.setDragBehavior(view, controlSquare);
            control.setDragBehavior(view, controlCircle);
            return control;
        };
        return SliderControl;
    })(KG.ViewObject);
    KG.SliderControl = SliderControl;
})(KG || (KG = {}));
/// <reference path="kg.ts" />
'use strict';
var KG;
(function (KG) {
    var Controller = (function () {
        function Controller($scope, $interpolate, $window) {
            this.$scope = $scope;
            this.$interpolate = $interpolate;
            $scope.interpolate = $interpolate;
            $scope.color = function (className) {
                return KG.colorForClassName(className);
            };
            $scope.init = function (definition) {
                $scope.params = definition.params;
                $scope.graphParams = {};
                if (definition.graphParams) {
                    definition.graphParams.forEach(function (key) {
                        if ($scope.params.hasOwnProperty(key)) {
                            $scope.graphParams[key] = $scope.params[key];
                        }
                    });
                }
                $scope.restrictions = definition.restrictions.map(function (restrictionDefinition) {
                    return new KG.Restriction(restrictionDefinition);
                });
                definition.views.forEach(function (viewDefinition) {
                    if (viewDefinition.type == 'KG.Slider') {
                        var sliderDefinition = viewDefinition.definition;
                        $scope.restrictions.push(new KG.Restriction({
                            expression: 'params.' + sliderDefinition['param'],
                            restrictionType: KG.Restriction.RANGE_TYPE,
                            min: sliderDefinition['axisDef'].min,
                            max: sliderDefinition['axisDef'].max,
                            precision: sliderDefinition['precision']
                        }));
                    }
                });
                $scope.model = KG.createInstance(definition.model);
                $scope.model.update($scope, function () {
                    $scope.views = definition.views.map(function (view) {
                        return KG.createInstance(view);
                    });
                });
            };
            $scope.renderMath = function () {
                var equationElements = $('equation');
                for (var i = 0; i < equationElements.length; i++) {
                    var element = equationElements[i];
                    if (!element.hasAttribute('raw')) {
                        element.setAttribute('raw', element.textContent);
                    }
                    element.innerHTML = '';
                    var lines = element.getAttribute('raw').split('||');
                    var equation = d3.select(element).append('table').attr('align', 'center');
                    for (var l = 0; l < lines.length; l++) {
                        var line = equation.append('tr');
                        if (lines[l].indexOf('frac') > -1) {
                            line.style('height', '85px');
                        }
                        ;
                        var lineElements = lines[l].split('=');
                        for (var le = 0; le < lineElements.length; le++) {
                            var lineElement = line.append('td').attr('class', 'math big').text('\\displaystyle{' + lineElements[le] + '}');
                            if (le == 0) {
                                lineElement.style('text-align', 'right');
                            }
                            else {
                                lineElement.style('text-align', 'left');
                            }
                            if (le < lineElements.length - 1) {
                                line.append('td').attr('class', 'math big').style('padding', '10px').style('valign', 'middle').text('=');
                            }
                        }
                    }
                }
                var mathElements = $('.math');
                for (var i = 0; i < mathElements.length; i++) {
                    var element = mathElements[i];
                    if (!element.hasAttribute('raw')) {
                        element.setAttribute('raw', element.textContent);
                    }
                    var textToRender = $scope.interpolate(element.getAttribute('raw'))($scope);
                    var displayMode = element.classList.contains('displayMath');
                    katex.render(textToRender, element, { displayMode: displayMode });
                }
            };
            // Updates and redraws interactive objects (graphs and sliders) when a parameter changes
            function render(redraw) {
                $scope.model.update($scope, function () {
                    $scope.views.forEach(function (view) {
                        view.render($scope, redraw);
                    });
                    $scope.renderMath();
                });
            }
            // Erase and redraw all graphs; do this when graph parameters change, or the window is resized
            function redrawGraphs() {
                render(true);
            }
            $scope.$watchCollection('graphParams', redrawGraphs);
            angular.element($window).on('resize', redrawGraphs);
            // Update objects on graphs (not the axes or graphs themselves); to this when model parameters change
            function redrawObjects() {
                render(false);
            }
            $scope.$watchCollection('params', function (newValue, oldValue) {
                var redraw = false;
                for (var key in newValue) {
                    if (newValue[key] != oldValue[key]) {
                        if ($scope.graphParams.hasOwnProperty(key)) {
                            redraw = true;
                        }
                    }
                }
                render(redraw);
            });
            $scope.updateParams = function (params) {
                var oldParams = _.clone($scope.params);
                $scope.params = _.defaults(params, $scope.params);
                $scope.$apply();
                var validChange = true;
                $scope.restrictions.forEach(function (r) {
                    r.update($scope, null);
                    var validParams = r.validate($scope.params);
                    if (validParams == false) {
                        validChange = false;
                        $scope.error = r.error;
                    }
                    else {
                        $scope.params = validParams;
                        if ($scope.graphParams) {
                            for (var key in $scope.graphParams) {
                                $scope.graphParams[key] = $scope.params[key];
                            }
                        }
                        $scope.$apply();
                        $scope.error = '';
                    }
                });
                if (!validChange) {
                    console.log('not a valid change');
                    $scope.params = oldParams;
                    $scope.$apply(redrawObjects);
                }
            };
            $scope.init(scopeDefinition);
            render(true);
        }
        return Controller;
    })();
    KG.Controller = Controller;
})(KG || (KG = {}));
'use strict';
var Sample;
(function (Sample) {
    var SinglePoint = (function (_super) {
        __extends(SinglePoint, _super);
        function SinglePoint(definition) {
            _super.call(this, definition);
            this.point = new KG.Point({
                name: definition.name + 'point',
                coordinates: { x: definition.x, y: definition.y },
                size: definition.size,
                symbol: definition.symbol,
                xDrag: definition.xDrag,
                yDrag: definition.yDrag,
                label: definition.label
            });
        }
        return SinglePoint;
    })(KG.Model);
    Sample.SinglePoint = SinglePoint;
    var TwoPoints = (function (_super) {
        __extends(TwoPoints, _super);
        function TwoPoints(definition) {
            _super.call(this, definition);
            this.s = new KG.Segment({
                name: 'twoPointSegment',
                a: definition.point1,
                b: definition.point2
            });
        }
        TwoPoints.prototype.segment = function () {
            return this.s;
        };
        return TwoPoints;
    })(KG.Model);
    Sample.TwoPoints = TwoPoints;
})(Sample || (Sample = {}));
/// <reference path="../fg.ts"/>
'use strict';
var FinanceGraphs;
(function (FinanceGraphs) {
    var Asset = (function (_super) {
        __extends(Asset, _super);
        function Asset(definition, modelPath) {
            _super.call(this, definition, modelPath);
            this.point = new KG.Point({
                name: definition.name + 'point',
                coordinates: { x: definition.stDev, y: definition.mean },
                className: 'asset',
                size: 500,
                xDrag: true,
                yDrag: true,
                label: {
                    text: definition.name
                }
            });
        }
        return Asset;
    })(KG.Model);
    FinanceGraphs.Asset = Asset;
})(FinanceGraphs || (FinanceGraphs = {}));
/// <reference path="../fg.ts"/>
'use strict';
var FinanceGraphs;
(function (FinanceGraphs) {
    var Portfolio = (function (_super) {
        __extends(Portfolio, _super);
        function Portfolio(definition, modelPath) {
            _super.call(this, definition, modelPath);
            var p = this;
            p.assets = [p.asset1, p.asset2, p.asset3];
            p.threeAssetPortfolios = new KG.PathFamily({
                name: 'threeAssetData',
                data: 'model.threeAssetData',
                interpolation: 'basis'
            });
            p.twoAssetPortfolios = new KG.PathFamily({
                name: 'twoAssetData',
                className: 'asset',
                data: 'model.twoAssetData',
                interpolation: 'basis'
            });
            p.riskFreeAsset = new KG.Point({
                name: 'riskFreeAsset',
                coordinates: { x: 0, y: 'params.riskFreeReturn' },
                className: 'risk-free',
                size: 500,
                xDrag: false,
                yDrag: true,
                label: {
                    text: 'RF'
                }
            });
            p.optimalPortfolio = new KG.Point({
                name: 'optimalPortfolio',
                coordinates: { x: 'params.optimalPortfolioStDev', y: 'params.optimalPortfolioMean' },
                className: 'risk-free',
                symbol: 'cross',
                size: 100,
                xDrag: false,
                yDrag: false,
                label: {
                    text: 'P',
                    align: 'right',
                    valign: 'bottom'
                }
            });
            p.riskReturnLine = new KG.Line({
                name: 'twoPointSegment',
                className: 'risk-free',
                arrows: 'OPEN',
                lineDef: {
                    point1: p.riskFreeAsset,
                    point2: p.optimalPortfolio
                }
            });
            p.optimalPortfolioMean = 0;
            p.optimalPortfolioStDev = 0.5;
            p.riskReturnSlope = 0;
        }
        Portfolio.prototype._update = function (scope) {
            var p = this;
            function correlation(i, j) {
                if (i == j) {
                    return 1;
                }
                else if (i > j) {
                    return correlation(j, i);
                }
                else {
                    return p['rho' + (i + 1) + (j + 1)];
                }
            }
            function calculateCorrelationMatrix() {
                var matrix = [];
                for (var i = 0; i < p.assets.length; i++) {
                    var matrixRow = [];
                    for (var j = 0; j < p.assets.length; j++) {
                        matrixRow.push(correlation(i, j));
                    }
                    matrix.push(matrixRow);
                }
                p.correlationMatrix = matrix;
                return matrix;
            }
            function calculateCovarianceMatrix() {
                var matrix = calculateCorrelationMatrix().map(function (correlationMatrixRow, i) {
                    return correlationMatrixRow.map(function (correlationMatrixCell, j) {
                        return correlationMatrixCell * p.stDevArray()[i] * p.stDevArray()[j];
                    });
                });
                p.covarianceMatrix = matrix;
                return matrix;
            }
            function checkPositiveDefinite() {
                p.positiveDefinite = true;
                var eigenvalues = numeric.eig(calculateCovarianceMatrix()).lambda.x;
                eigenvalues.forEach(function (e) {
                    if (e < 0) {
                        p.positiveDefinite = false;
                    }
                });
                return p.positiveDefinite;
            }
            if (checkPositiveDefinite()) {
                p.twoAssetData = p.data2();
                p.threeAssetData = p.data3();
                if (p.optimalPortfolio != undefined) {
                    scope.params.optimalPortfolioMean = p.optimalPortfolioMean;
                    scope.params.optimalPortfolioStDev = p.optimalPortfolioStDev;
                }
            }
            return p;
        };
        Portfolio.prototype.meanArray = function () {
            return this.assets.map(function (asset) {
                return asset.mean;
            });
        };
        Portfolio.prototype.stDevArray = function () {
            return this.assets.map(function (asset) {
                return asset.stDev;
            });
        };
        Portfolio.prototype.mean = function (weightArray) {
            return numeric.dot(this.meanArray(), weightArray);
        };
        Portfolio.prototype.stDev = function (weightArray) {
            var variance = numeric.dot(weightArray, numeric.dot(this.covarianceMatrix, weightArray));
            if (variance >= 0) {
                return Math.sqrt(variance);
            }
            else {
                console.log('oops! getting a negative variance with weights ', weightArray[0], ',', weightArray[1], ',', weightArray[2], '!');
                return 0;
            }
        };
        // Generate dataset of portfolio means and variances for various weights of two assets
        Portfolio.prototype.data2 = function () {
            var portfolio = this, maxLeverage = portfolio.maxLeverage, d = [];
            d.push(portfolio.twoAssetPortfolio(1, 2, [0, 0, 0]));
            d.push(portfolio.twoAssetPortfolio(0, 2, [0, 0, 0]));
            d.push(portfolio.twoAssetPortfolio(0, 1, [0, 0, 0]));
            return d;
        };
        // Generate dataset of portfolio means and variances for various weights of all three assets
        Portfolio.prototype.data3 = function () {
            var portfolio = this, maxLeverage = portfolio.maxLeverage, d = [], w;
            portfolio.riskReturnSlope = 0;
            var min = -maxLeverage * 0.01, max = 1 + maxLeverage * 0.01, dataPoints = 10 + maxLeverage * 0.2;
            for (var i = 0; i < dataPoints + 1; i++) {
                w = min + i * (max - min) / dataPoints;
                d.push(portfolio.twoAssetPortfolio(1, 2, [w, 0, 0]));
                d.push(portfolio.twoAssetPortfolio(0, 2, [0, w, 0]));
                d.push(portfolio.twoAssetPortfolio(0, 1, [0, 0, w]));
            }
            return d;
        };
        // Generate lines representing combinations of two assets
        Portfolio.prototype.twoAssetPortfolio = function (asset1, asset2, weightArray) {
            var portfolio = this, maxLeverage = portfolio.maxLeverage, d = [], otherAssets = 0;
            weightArray.forEach(function (w) {
                otherAssets += w;
            });
            var min = -maxLeverage * 0.01, max = 1 + maxLeverage * 0.01, dataPoints = 2 * (10 + maxLeverage * 0.2);
            var colorScale = d3.scale.linear().domain([0, 1]).range(["red", "blue"]);
            for (var i = 0; i < dataPoints + 1; i++) {
                weightArray[asset1] = min + i * (max - min) / dataPoints;
                weightArray[asset2] = 1 - weightArray[asset1] - otherAssets;
                if (weightArray[asset2] >= min) {
                    var s = portfolio.stDev(weightArray), m = portfolio.mean(weightArray);
                    d.push({
                        x: s,
                        y: m,
                        color: colorScale(weightArray[asset1]),
                        weights: weightArray
                    });
                    if (s > 0) {
                        var slope = (m - portfolio.riskFreeReturn) / s;
                        if (slope > portfolio.riskReturnSlope) {
                            portfolio.optimalPortfolioMean = m;
                            portfolio.optimalPortfolioStDev = s;
                            portfolio.riskReturnSlope = slope;
                            portfolio.optimalPortfolioWeightArray = _.clone(weightArray);
                        }
                    }
                }
            }
            return d;
        };
        return Portfolio;
    })(KG.Model);
    FinanceGraphs.Portfolio = Portfolio;
})(FinanceGraphs || (FinanceGraphs = {}));
/// <reference path="../kg.ts"/>
/// <reference path="capm/asset.ts"/>
/// <reference path="capm/portfolio.ts"/>
/// <reference path="../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var Elasticity = (function (_super) {
        __extends(Elasticity, _super);
        function Elasticity(definition, modelPath) {
            definition.inverse = _.defaults(false, definition.inverse);
            definition.terms = _.defaults({
                perfectlyElastic: "perfectly elastic",
                perfectlyInelastic: "perfectly inelastic",
                elastic: "elastic",
                inelastic: "inelastic",
                unitElastic: "unit elastic"
            }, definition.terms);
            _super.call(this, definition, modelPath);
        }
        Elasticity.prototype.calculateElasticity = function (inputs) {
            var e = this;
            e = e._calculateElasticity(inputs);
            e.absoluteElasticity = Math.abs(e.elasticity);
            if (isNaN(e.absoluteElasticity)) {
                e.absoluteElasticity == '\\emptyset';
            }
            e.elasticityComparator = e.elasticityNumber(true);
            if (e.absoluteElasticity == 0) {
                e.elasticityWord = e.terms.perfectlyInelastic;
            }
            else if (e.absoluteElasticity < 1) {
                e.elasticityWord = e.terms.inelastic;
                e.elasticityComparator += "< 1";
            }
            else if (e.absoluteElasticity == 1) {
                e.elasticityWord = e.terms.unitElastic;
            }
            else if (e.absoluteElasticity == Infinity) {
                e.elasticityWord = e.terms.perfectlyElastic;
            }
            else if (e.absoluteElasticity > 1) {
                e.elasticityWord = e.terms.elastic;
                e.elasticityComparator += "> 1";
            }
            else {
                e.elasticityWord = 'undefined';
            }
            return e;
        };
        Elasticity.prototype._calculateElasticity = function (inputs) {
            return this; // overridden by subclass
        };
        Elasticity.prototype.elasticityNumber = function (absoluteValue) {
            var e = this;
            absoluteValue = absoluteValue || false;
            if (isNaN(e.absoluteElasticity)) {
                return "\\emptyset";
            }
            var returnString = (!absoluteValue && e.elasticity < 0) ? '-' : '';
            returnString += (e.absoluteElasticity == Infinity) ? "\\infty" : (e.absoluteElasticity == 0) ? "0" : (e.absoluteElasticity == 1) ? "1" : e.absoluteElasticity.toFixed(2);
            return returnString;
        };
        Elasticity.prototype._update = function (scope) {
            return this.calculateElasticity();
        };
        return Elasticity;
    })(KG.Model);
    EconGraphs.Elasticity = Elasticity;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var MidpointElasticity = (function (_super) {
        __extends(MidpointElasticity, _super);
        function MidpointElasticity(definition, modelPath) {
            _super.call(this, definition, modelPath);
            this.point1view = new KG.Point({
                name: 'point1',
                coordinates: definition.point1,
                size: 500,
                xDrag: true,
                yDrag: true,
                label: {
                    text: 'B'
                },
                droplines: {
                    horizontal: 'P_B',
                    vertical: 'Q_B'
                }
            });
            this.point2view = new KG.Point({
                name: 'point2',
                coordinates: definition.point2,
                size: 500,
                xDrag: true,
                yDrag: true,
                label: {
                    text: 'A'
                },
                droplines: {
                    horizontal: 'P_A',
                    vertical: 'Q_A'
                }
            });
            this.midpoint = new KG.Point({
                name: 'midpoint',
                coordinates: {
                    x: 'model.xAvg',
                    y: 'model.yAvg'
                },
                symbol: 'cross',
                color: 'grey',
                size: 100,
                xDrag: false,
                yDrag: false,
                label: {
                    text: 'M',
                    align: 'right',
                    valign: 'top',
                    color: 'grey'
                }
            });
            this.line = new KG.Line({
                name: 'demand',
                className: 'demand',
                arrows: 'NONE',
                lineDef: {
                    point1: {
                        x: 'params.x1',
                        y: 'params.y1'
                    },
                    point2: {
                        x: 'params.x2',
                        y: 'params.y2'
                    }
                }
            });
            this.xDiffSegment = new KG.Arrow({
                name: 'xDiffSegment',
                className: 'diff2',
                begin: {
                    x: definition.point2.x,
                    y: 5
                },
                end: {
                    x: definition.point1.x,
                    y: 5
                },
                label: {
                    text: 'model.xPercentDiff | percentage:0',
                    valign: 'top',
                    align: 'center'
                }
            });
            this.yDiffSegment = new KG.Arrow({
                name: 'yDiffSegment',
                className: 'diff1',
                begin: {
                    x: 15,
                    y: definition.point2.y
                },
                end: {
                    x: 15,
                    y: definition.point1.y
                },
                label: {
                    text: 'model.yPercentDiff | percentage:0',
                    align: 'right'
                }
            });
        }
        MidpointElasticity.prototype._calculateElasticity = function (inputs) {
            var e = this;
            if (inputs) {
                if (inputs.hasOwnProperty('point1') && inputs.hasOwnProperty('point2')) {
                    e.point1 = inputs.point1;
                    e.point2 = inputs.point2;
                }
            }
            e.xDiff = e.point1.x - e.point2.x;
            e.yDiff = e.point1.y - e.point2.y;
            e.xAvg = 0.5 * (e.point1.x + e.point2.x);
            e.yAvg = 0.5 * (e.point1.y + e.point2.y);
            e.xPercentDiff = e.xDiff / e.xAvg;
            e.yPercentDiff = e.yDiff / e.yAvg;
            e.elasticity = e.xPercentDiff / e.yPercentDiff;
            console.log('calculating elasticity');
            return e;
        };
        return MidpointElasticity;
    })(EconGraphs.Elasticity);
    EconGraphs.MidpointElasticity = MidpointElasticity;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var PointElasticity = (function (_super) {
        __extends(PointElasticity, _super);
        function PointElasticity(definition, modelPath) {
            _super.call(this, definition, modelPath);
            this.pointView = new KG.Point({
                name: 'point',
                coordinates: definition.point,
                size: 500,
                xDrag: true,
                yDrag: true,
                droplines: {
                    horizontal: 'P',
                    vertical: 'Q'
                }
            });
            this.line = new KGMath.Functions.Linear({
                point: definition.point,
                slope: definition.slope
            });
        }
        PointElasticity.prototype._calculateElasticity = function (inputs) {
            var e = this;
            if (inputs) {
                if (inputs.hasOwnProperty('point')) {
                    e.point = inputs.point;
                }
                if (inputs.hasOwnProperty('slope')) {
                    e.slope = inputs.slope;
                }
            }
            e.elasticity = (e.point.y / e.point.x) / e.slope;
            return e;
        };
        return PointElasticity;
    })(EconGraphs.Elasticity);
    EconGraphs.PointElasticity = PointElasticity;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var ConstantElasticity = (function (_super) {
        __extends(ConstantElasticity, _super);
        function ConstantElasticity(definition, modelPath) {
            _super.call(this, definition, modelPath);
        }
        return ConstantElasticity;
    })(EconGraphs.Elasticity);
    EconGraphs.ConstantElasticity = ConstantElasticity;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var Demand = (function (_super) {
        __extends(Demand, _super);
        function Demand(definition, modelPath) {
            definition.className = definition.className || 'demand';
            definition.curveLabel = definition.curveLabel || 'D';
            _super.call(this, definition, modelPath);
            var d = this;
            d.demandFunction = new KGMath.Functions[definition.type](definition.def);
            d.elasticity = (definition.elasticityMethod == 'point') ? new EconGraphs.PointElasticity({}) : (definition.elasticityMethod = 'constant') ? new EconGraphs.ConstantElasticity({}) : new EconGraphs.MidpointElasticity({});
            var priceLineDrag = (typeof definition.price == 'string') ? definition.price.replace('params.', '') : false;
            d.priceLine = new KG.HorizontalLine({
                name: 'priceLine',
                color: 'grey',
                arrows: 'NONE',
                yDrag: definition.priceDrag,
                y: d.modelProperty('price')
            });
            this.quantityLine = new KG.VerticalLine({
                name: 'quantityLine',
                color: 'grey',
                arrows: 'NONE',
                xDrag: definition.quantityDrag,
                x: d.modelProperty('quantity')
            });
            this.quantityDemandedPoint = new KG.Point({
                name: 'quantityDemandedAtPrice',
                coordinates: { x: this.modelProperty('quantity'), y: this.modelProperty('price') },
                size: 500,
                color: 'black',
                yDrag: definition.price,
                xDrag: definition.quantity,
                label: {
                    text: 'A'
                },
                droplines: {
                    vertical: 'Q^D_A',
                    horizontal: 'P_A'
                }
            });
        }
        Demand.prototype._update = function (scope) {
            var d = this;
            if (d.price) {
                d.quantity = d.quantityAtPrice(d.price);
            }
            else if (d.quantity) {
                d.price = d.priceAtQuantity(d.quantity);
            }
            return d;
        };
        Demand.prototype.quantityAtPrice = function (price) {
            price = (price > 0) ? price : 0;
            var qd = this.demandFunction.xValue(price);
            return Math.max(0, qd);
        };
        Demand.prototype.priceAtQuantity = function (quantity) {
            quantity = (quantity > 0) ? quantity : 0;
            var pd = this.demandFunction.yValue(quantity);
            return Math.max(0, pd);
        };
        Demand.prototype.priceElasticity = function (price) {
            var d = this;
            if (d.elasticity instanceof EconGraphs.MidpointElasticity) {
                d.elasticity = d.elasticity.calculateElasticity({
                    point1: {
                        x: d.quantityAtPrice(price * 0.99),
                        y: price * 0.99
                    },
                    point2: {
                        x: d.quantityAtPrice(price * 1.01),
                        y: price * 1.01
                    }
                });
            }
            else if (d.elasticity instanceof EconGraphs.PointElasticity) {
                var point = {
                    x: d.quantityAtPrice(price),
                    y: price
                }, slope = d.demandFunction.hasOwnProperty('slope') ? d.demandFunction.slope : d.demandFunction.slopeBetweenPoints({
                    x: d.quantityAtPrice(price * 0.99),
                    y: price * 0.99
                }, {
                    x: d.quantityAtPrice(price * 1.01),
                    y: price * 1.01
                }, true);
                d.elasticity = d.elasticity.calculateElasticity({ point: point, slope: slope });
            }
            return d.elasticity;
        };
        Demand.prototype.tr = function (q) {
            return this.totalRevenueFunction.yValue(q);
        };
        Demand.prototype.mr = function (q) {
            return this.marginalRevenueFunction.yValue(q);
        };
        Demand.prototype.priceAtQuantityPoint = function (q, def) {
            return new KG.Point({
                name: 'DemandPoint',
                className: 'demand',
                coordinates: {
                    x: q,
                    y: this.priceAtQuantity(q)
                },
                label: {
                    text: def.label || ''
                },
                droplines: {
                    vertical: def.vDropline,
                    horizontal: def.hDropline
                },
                xDrag: def.xDrag
            });
        };
        Demand.prototype.marginalRevenueAtQuantitySlope = function (q, label) {
            var labelSubscript = label ? '_{' + label + '}' : '';
            return new KG.Line({
                name: 'MRslopeLine' + label,
                className: 'marginalRevenue dotted',
                lineDef: {
                    point: { x: q, y: this.modelProperty('tr(' + q + ')') },
                    slope: this.mr(q)
                },
                label: {
                    text: '\\text{slope} = MR(q' + labelSubscript + ')'
                }
            });
        };
        Demand.prototype.totalRevenueAtQuantityPoint = function (q, label, dragParam) {
            var labelSubscript = label ? '_{' + label + '}' : '';
            return new KG.Point({
                name: 'totalRevenueAtQ' + label,
                coordinates: { x: q, y: this.tr(q) },
                className: 'totalRevenue',
                xDrag: dragParam,
                label: {
                    text: label
                },
                droplines: {
                    vertical: 'q' + labelSubscript,
                    horizontal: 'TR(q' + labelSubscript + ')'
                }
            });
        };
        return Demand;
    })(KG.Model);
    EconGraphs.Demand = Demand;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var LinearDemand = (function (_super) {
        __extends(LinearDemand, _super);
        function LinearDemand(definition, modelPath) {
            _super.call(this, definition, modelPath);
            var demand = this;
            demand.priceInterceptPoint = new KG.Point({
                name: 'demandPriceIntercept',
                coordinates: { x: 0, y: demand.modelProperty('priceIntercept') },
                className: 'demand',
                yDrag: definition.priceInterceptDrag
            });
            demand.quantityInterceptPoint = new KG.Point({
                name: 'demandQuantityIntercept',
                coordinates: { x: demand.modelProperty('quantityIntercept'), y: 0 },
                className: 'demand',
                xDrag: definition.quantityInterceptDrag
            });
            demand.curve = new KG.Line({
                name: 'demand',
                className: 'demand',
                arrows: 'NONE',
                lineDef: definition.def,
                label: {
                    text: definition.curveLabel
                }
            });
            demand.consumerSurplus = new KG.Area({
                name: 'consumerSurplus',
                className: 'demand',
                data: [
                    { x: demand.modelProperty('quantity'), y: definition.price },
                    { x: 0, y: definition.price },
                    { x: 0, y: demand.modelProperty('quantityIntercept') }
                ],
                label: {
                    text: "CS"
                }
            });
            demand.marginalRevenueFunction = new KGMath.Functions.Linear({
                intercept: demand.modelProperty('demandFunction.yIntercept'),
                slope: KG.multiplyDefs(demand.modelProperty('demandFunction.slope'), 2)
            });
            demand.marginalRevenueCurve = new KG.Line({
                name: 'marginalRevenue',
                className: 'marginalRevenue',
                linear: demand.modelProperty('marginalRevenueFunction'),
                label: {
                    text: 'MR'
                }
            });
            demand.totalRevenueFunction = demand.marginalRevenueFunction.integral(0, 0, demand.modelProperty('totalRevenueFunction'));
            demand.totalRevenueCurve = new KG.FunctionPlot({
                name: 'totalRevenue',
                className: 'totalRevenue',
                fn: demand.modelProperty('totalRevenueFunction'),
                label: {
                    text: 'TR'
                }
            });
        }
        LinearDemand.prototype._update = function (scope) {
            var d = this;
            d.demandFunction.update(scope);
            d.marginalRevenueFunction.update(scope);
            d.totalRevenueFunction.update(scope);
            if (d.price) {
                d.quantity = d.quantityAtPrice(d.price);
            }
            else if (d.quantity) {
                d.price = d.priceAtQuantity(d.quantity);
            }
            d.priceIntercept = d.demandFunction.yValue(0);
            d.quantityIntercept = d.demandFunction.xValue(0);
            return d;
        };
        return LinearDemand;
    })(EconGraphs.Demand);
    EconGraphs.LinearDemand = LinearDemand;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var ConstantElasticityDemand = (function (_super) {
        __extends(ConstantElasticityDemand, _super);
        function ConstantElasticityDemand(definition, modelPath) {
            _super.call(this, definition, modelPath);
            this.slopeAtPrice = function (price) {
                var d = this, a = d.demandFunction.level, b = d.demandFunction.powers[1];
                return (-1) * a * b * Math.pow(price, -(1 + b));
            };
            this.slopeAtPriceWords = function (price) {
                return "\\frac { dQ^D }{ dP } = " + this.slopeAtPrice(price).toFixed(2);
            };
            this.curve = new KG.FunctionPlot({
                name: 'demand',
                className: 'demand',
                arrows: 'NONE',
                fn: 'model.demandFunction',
                label: {
                    text: 'D'
                }
            });
            this.priceLine = new KG.HorizontalLine({
                name: 'priceLine',
                color: 'grey',
                arrows: 'NONE',
                type: 'HorizontalLine',
                yDrag: 'price',
                y: 'params.price'
            });
            this.quantityDemandedAtPrice = new KG.Point({
                name: 'quantityDemandedAtPrice',
                coordinates: { x: 'model.quantityAtPrice(params.price)', y: 'params.price' },
                size: 500,
                color: 'black',
                yDrag: true,
                label: {
                    text: 'A'
                },
                droplines: {
                    vertical: 'Q^D(P)',
                    horizontal: 'P'
                }
            });
            this.slopeLine = new KG.Line({
                name: 'slopeLine',
                className: 'demand dotted',
                lineDef: {
                    point: { x: 'model.quantityAtPrice(params.price)', y: 'params.price' },
                    slope: '1/model.slopeAtPrice(params.price)'
                },
                label: {
                    text: 'model.slopeAtPriceWords(params.price)'
                }
            });
            this.elasticity.elasticity = definition.def.powers[1];
        }
        ConstantElasticityDemand.prototype._update = function (scope) {
            var d = this;
            d.demandFunction.update(scope);
            d.slopeLine.linear.update(scope);
            d.elasticity.update(scope);
            return d;
        };
        return ConstantElasticityDemand;
    })(EconGraphs.Demand);
    EconGraphs.ConstantElasticityDemand = ConstantElasticityDemand;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var BudgetConstraint = (function (_super) {
        __extends(BudgetConstraint, _super);
        function BudgetConstraint(definition, modelPath) {
            _super.call(this, definition, modelPath);
            var b = this;
            b.maxX = b.modelProperty('budgetLine.xIntercept.toFixed(2)');
            b.maxY = b.modelProperty('budgetLine.yIntercept.toFixed(2)');
        }
        BudgetConstraint.prototype._update = function (scope) {
            var b = this;
            b.budgetSegments.forEach(function (bs) {
                bs.update(scope);
            });
            return b;
        };
        BudgetConstraint.prototype.isAffordable = function (bundle) {
            var b = this;
            for (var i = 0; i < b.budgetSegments.length; i++) {
                var bs = b.budgetSegments[i];
                if (bs.isAffordable(bundle)) {
                    return true;
                }
            }
            return false;
        };
        BudgetConstraint.prototype.xValue = function (y) {
            var x = 0;
            this.budgetSegments.forEach(function (segment) {
                if (segment.yDomain.contains(y)) {
                    x = segment.linear.xValue(y);
                }
            });
            return x;
        };
        BudgetConstraint.prototype.yValue = function (x) {
            var y = 0;
            this.budgetSegments.forEach(function (segment) {
                if (segment.xDomain.contains(x)) {
                    y = segment.linear.yValue(x);
                }
            });
            return y;
        };
        BudgetConstraint.prototype.formula = function (values) {
            return ''; // overridden by subclass
        };
        return BudgetConstraint;
    })(KG.Model);
    EconGraphs.BudgetConstraint = BudgetConstraint;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var BudgetSegment = (function (_super) {
        __extends(BudgetSegment, _super);
        function BudgetSegment(definition, modelPath) {
            if (definition.hasOwnProperty('endowment')) {
                if (definition.endowment.hasOwnProperty('x') && definition.endowment.hasOwnProperty('y')) {
                    var endowmentValueX = KG.multiplyDefs(definition.endowment.x, definition.px), endowmentValueY = KG.multiplyDefs(definition.endowment.y, definition.py);
                    definition.income = KG.addDefs(endowmentValueX, endowmentValueY);
                }
                else {
                    console.log('Endowment must have x and y properties:');
                    console.log(definition.endowment);
                }
            }
            definition.priceRatio = KG.divideDefs(definition.px, definition.py);
            _super.call(this, definition, modelPath);
            var b = this;
            var xMin = definition.xMin || 0, xMax = definition.xMax || KG.divideDefs(definition.income, definition.px), yMin = definition.yMin || 0, yMax = definition.yMax || KG.divideDefs(definition.income, definition.py);
            b.xDomain = new KG.Domain(xMin, xMax);
            b.yDomain = new KG.Domain(yMin, yMax);
            if (definition.hasOwnProperty('endowment')) {
                b.linear = new KGMath.Functions.Linear({
                    point: definition.endowment,
                    slope: KG.multiplyDefs(-1, definition.priceRatio),
                    xDomain: b.xDomain,
                    yDomain: b.yDomain
                });
            }
            else {
                b.linear = new KGMath.Functions.Linear({
                    coefficients: {
                        a: definition.px,
                        b: definition.py,
                        c: KG.multiplyDefs(-1, definition.income)
                    },
                    xDomain: b.xDomain,
                    yDomain: b.yDomain
                });
            }
        }
        BudgetSegment.prototype._update = function (scope) {
            var b = this;
            b.linear.update(scope);
            return b;
        };
        BudgetSegment.prototype.isAffordable = function (bundle) {
            var b = this;
            // return false if not in the domain for which this budget segment is relevant
            if (!b.xDomain.contains(bundle.x) || !b.xDomain.contains(bundle.y)) {
                return false;
            }
            // the bundle's cost is the quantities of x and y times their prices
            var bundleCost = b.px * bundle.x + b.py * bundle.y;
            // return true if the bundle's cost is less than or equal to constraint's income
            return (bundleCost <= b.income);
        };
        BudgetSegment.prototype.setPrice = function (price, good, max) {
            var b = this;
            max = max || b.income / price;
            b['p' + good] = price;
            b.linear[good + 'Domain'].max = max;
            if (b.linear.definition.hasOwnProperty('endowment')) {
                b.linear.slope = -b.px / b.py;
            }
            else if (good == 'y') {
                b.linear.coefficients.b = price;
            }
            else {
                b.linear.coefficients.a = price;
            }
            return b;
            //console.log('set price of ',good,' to ', price)
        };
        BudgetSegment.prototype.setIncome = function (income) {
            var b = this;
            b.income = income;
            b.linear.xDomain.max = b.income / b.px;
            b.linear.yDomain.max = b.income / b.py;
            b.linear.coefficients.c = -income;
            return b;
            //console.log('set income to ',income);
        };
        return BudgetSegment;
    })(KG.Model);
    EconGraphs.BudgetSegment = BudgetSegment;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var SimpleBudgetConstraint = (function (_super) {
        __extends(SimpleBudgetConstraint, _super);
        function SimpleBudgetConstraint(definition, modelPath) {
            _super.call(this, definition, modelPath);
            var b = this;
            var params = {};
            if (definition.hasOwnProperty('budgetConstraintLabel')) {
                params.label = definition.budgetConstraintLabel;
            }
            if (definition.hasOwnProperty('budgetSetLabel')) {
                params.areaUnderLabel = definition.budgetSetLabel;
            }
            b.budgetSegments = [
                new EconGraphs.BudgetSegment({
                    income: definition.income,
                    px: definition.px,
                    py: definition.py
                }, b.modelProperty('budgetSegments[0]'))
            ];
            b.budgetLine = new KG.Line({
                name: 'BL',
                className: 'budget',
                linear: b.modelProperty('budgetSegments[0].linear'),
                xInterceptLabel: definition.xInterceptLabel,
                yInterceptLabel: definition.yInterceptLabel,
                params: params
            }, b.modelProperty('budgetLine'));
        }
        SimpleBudgetConstraint.prototype.setPrice = function (price, good) {
            var b = this;
            good = good || 'x';
            b.budgetSegments[0].setPrice(price, good);
        };
        SimpleBudgetConstraint.prototype.setIncome = function (income) {
            var b = this;
            b.budgetSegments[0].setIncome(income);
        };
        SimpleBudgetConstraint.prototype.formula = function (values) {
            var b = this;
            if (values) {
                return b.px.toFixed(2) + "x + " + b.py.toFixed(2) + "y = " + b.income;
            }
            else {
                return "P_xx + P_yy = I";
            }
        };
        SimpleBudgetConstraint.title = 'Simple Budget Constraint';
        return SimpleBudgetConstraint;
    })(EconGraphs.BudgetConstraint);
    EconGraphs.SimpleBudgetConstraint = SimpleBudgetConstraint;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var EndowmentBudgetConstraint = (function (_super) {
        __extends(EndowmentBudgetConstraint, _super);
        function EndowmentBudgetConstraint(definition, modelPath) {
            if (definition.hasOwnProperty('px')) {
                definition.pxBuy = definition.px;
                definition.pxSell = definition.px;
            }
            if (definition.hasOwnProperty('py')) {
                definition.pyBuy = definition.py;
                definition.pySell = definition.py;
            }
            _super.call(this, definition, modelPath);
            var b = this;
            var pointParams = {};
            if (definition.hasOwnProperty('xLabel')) {
                pointParams.xAxisLabel = definition.xLabel;
            }
            if (definition.hasOwnProperty('yLabel')) {
                pointParams.yAxisLabel = definition.yLabel;
            }
            b.endowmentPoint = new KG.Point({
                name: 'endowmentPoint',
                coordinates: definition.endowment,
                xDrag: definition.endowment.x,
                yDrag: definition.endowment.y,
                className: 'budget',
                params: pointParams
            });
            var lineParams = {};
            if (definition.hasOwnProperty('budgetConstraintLabel')) {
                lineParams.label = definition.budgetConstraintLabel;
            }
            if (definition.hasOwnProperty('budgetSetLabel')) {
                lineParams.areaUnderLabel = definition.budgetSetLabel;
            }
            if (definition.hasOwnProperty('px') && definition.hasOwnProperty('py')) {
                b.budgetSegments = [
                    new EconGraphs.BudgetSegment({
                        endowment: definition.endowment,
                        px: definition.px,
                        py: definition.py
                    }, b.modelProperty('budgetSegments[0]'))
                ];
                b.budgetLine = new KG.Line({
                    name: 'BL',
                    className: 'budget',
                    linear: b.modelProperty('budgetSegments[0].linear'),
                    xInterceptLabel: definition.xInterceptLabel,
                    yInterceptLabel: definition.yInterceptLabel,
                    params: lineParams
                }, b.modelProperty('budgetLine'));
            }
            else {
                b.budgetSegments = [
                    new EconGraphs.BudgetSegment({
                        endowment: definition.endowment,
                        px: definition.pxSell,
                        py: definition.pyBuy,
                        xMin: 0,
                        xMax: definition.endowment.x,
                        yMin: definition.endowment.y
                    }, b.modelProperty('budgetSegments[0]')),
                    new EconGraphs.BudgetSegment({
                        endowment: definition.endowment,
                        px: definition.pxBuy,
                        py: definition.pySell,
                        yMin: 0,
                        yMax: definition.endowment.y,
                        xMin: definition.endowment.x
                    }, b.modelProperty('budgetSegments[1]'))
                ];
                b.budgetLine = new KG.PiecewiseLinear({
                    name: 'BL',
                    className: 'budget',
                    sections: b.modelProperty('budgetSegments'),
                    xInterceptLabel: definition.xInterceptLabel,
                    yInterceptLabel: definition.yInterceptLabel,
                    params: lineParams
                }, b.modelProperty('budgetLine'));
            }
        }
        EndowmentBudgetConstraint.prototype.formula = function (values) {
            var b = this;
            if (b.hasOwnProperty('px') && b.hasOwnProperty('py')) {
                if (values) {
                    return b.px.toFixed(2) + "x + " + b.py.toFixed(2) + "y = " + b.px.toFixed(2) + " \\times " + b.endowment.x + " + " + b.py.toFixed(2) + " \\times " + b.endowment.y;
                }
                else {
                    return "P_xx + P_yy = P_xx_E + P_yy_E";
                }
            }
            else {
                return '';
            }
        };
        return EndowmentBudgetConstraint;
    })(EconGraphs.BudgetConstraint);
    EconGraphs.EndowmentBudgetConstraint = EndowmentBudgetConstraint;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var UtilityConstraint = (function (_super) {
        __extends(UtilityConstraint, _super);
        function UtilityConstraint(definition, modelPath) {
            _super.call(this, definition, modelPath);
        }
        return UtilityConstraint;
    })(KG.Model);
    EconGraphs.UtilityConstraint = UtilityConstraint;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var Utility = (function (_super) {
        __extends(Utility, _super);
        function Utility(definition, modelPath) {
            definition = _.defaults(definition, {
                className: 'utility'
            });
            _super.call(this, definition, modelPath);
            this.utilityFunction = new KGMath.Functions[definition.type](definition.def);
        }
        Utility.prototype._update = function (scope) {
            var u = this;
            u.utilityFunction.update(scope);
            return u;
        };
        return Utility;
    })(KG.Model);
    EconGraphs.Utility = Utility;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var OneGoodUtility = (function (_super) {
        __extends(OneGoodUtility, _super);
        function OneGoodUtility(definition, modelPath) {
            definition = _.defaults(definition, {
                curveLabel: 'u(c)',
                marginalCurveLabel: 'u\'(c)'
            });
            _super.call(this, definition, modelPath);
            this.utilityFunctionView = new KG.FunctionPlot({
                name: 'utilityFunction',
                className: 'utility',
                fn: this.modelProperty('utilityFunction'),
                arrows: 'NONE',
                label: {
                    text: this.curveLabel
                },
                numSamplePoints: 501
            });
            if (this.utilityFunction.derivative()) {
                this.marginalUtilityFunction = this.utilityFunction.derivative();
                this.marginalUtilityFunctionView = new KG.FunctionPlot({
                    name: 'marginalUtilityFunction',
                    className: 'demand',
                    fn: this.modelProperty('marginalUtilityFunction'),
                    arrows: 'NONE',
                    label: {
                        text: this.marginalCurveLabel
                    },
                    numSamplePoints: 501
                });
            }
        }
        OneGoodUtility.prototype._update = function (scope) {
            var u = this;
            u.utilityFunction.update(scope);
            if (this.utilityFunction.derivative()) {
                this.marginalUtilityFunction.update(scope);
            }
            return u;
        };
        OneGoodUtility.prototype.utilityAtQuantity = function (c) {
            return this.utilityFunction.yValue(c);
        };
        OneGoodUtility.prototype.marginalUtilityAtQuantity = function (c) {
            return this.marginalUtilityFunction.yValue(c);
        };
        OneGoodUtility.prototype.marginalUtilityAtQuantitySlope = function (c, params) {
            return new KG.Line({
                name: 'marginalUtilityAtQuantitySlope',
                className: 'demand dotted',
                lineDef: {
                    point: { x: c, y: this.utilityAtQuantity(c) },
                    slope: this.marginalUtilityAtQuantity(c)
                },
                params: params
            });
        };
        OneGoodUtility.prototype.utilityAtQuantityPoint = function (q, params) {
            return new KG.Point({
                coordinates: { x: q, y: this.utilityAtQuantity(q) },
                name: 'utilityAtQ',
                className: 'utility',
                params: params
            });
        };
        OneGoodUtility.prototype.marginalUtilityAtQuantityPoint = function (q, params) {
            return new KG.Point({
                name: 'marginalUtilityAtQ',
                coordinates: { x: q, y: this.marginalUtilityFunction.yValue(q) },
                className: 'demand',
                params: params
            });
        };
        OneGoodUtility.prototype.consumptionYieldingUtility = function (u) {
            return this.utilityFunction.xValue(u);
        };
        return OneGoodUtility;
    })(EconGraphs.Utility);
    EconGraphs.OneGoodUtility = OneGoodUtility;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var ConstantRRA = (function (_super) {
        __extends(ConstantRRA, _super);
        function ConstantRRA(definition, modelPath) {
            definition.type = 'CRRA';
            definition.def = {
                rho: definition.rra
            };
            _super.call(this, definition, modelPath);
        }
        ConstantRRA.prototype.utilityFormula = function (c) {
            var rra = this.rra;
            if (c) {
                if (rra == 0) {
                    return c.toFixed(2) + '-1';
                }
                else if (rra.toFixed(2) == 1) {
                    return '\\log ' + c.toFixed(2);
                }
                else {
                    return "\\frac{" + c.toFixed(2) + "^{" + (1 - rra).toFixed(2) + "} - 1}{ " + (1 - rra).toFixed(2) + " } ";
                }
            }
            else {
                if (rra == 0) {
                    return 'c - 1';
                }
                else if (rra.toFixed(2) == 1) {
                    return '\\log c';
                }
                else {
                    return "\\frac{c^{" + (1 - rra).toFixed(2) + "} - 1}{ " + (1 - rra).toFixed(2) + " } ";
                }
            }
        };
        return ConstantRRA;
    })(EconGraphs.OneGoodUtility);
    EconGraphs.ConstantRRA = ConstantRRA;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var RiskAversion = (function (_super) {
        __extends(RiskAversion, _super);
        function RiskAversion(definition, modelPath) {
            definition.pLow = definition.pLow || 0.5;
            definition.show = _.defaults(definition.show || {}, {
                ce: false,
                rp: false
            });
            _super.call(this, definition, modelPath);
            this.utility = new EconGraphs[definition.utilityType](definition.utilityDef, this.modelPath + '.utility');
            this.expectedUtilityPoint = new KG.Point({
                name: 'expectedUtilityPoint',
                className: 'riskPremium',
                coordinates: {
                    x: this.modelProperty('expectedC'),
                    y: this.modelProperty('expectedU')
                },
                droplines: {
                    horizontal: "\\mathbb{E}[u(c)]"
                }
            });
            this.expectedConsumptionPoint = new KG.Point({
                name: 'expectedConsumptionPoint',
                className: 'expectedUtility',
                coordinates: {
                    x: this.modelProperty('expectedC'),
                    y: this.modelProperty('utilityOfExpectedC')
                },
                droplines: {
                    vertical: "\\mathbb{E}[c]",
                    horizontal: "u(\\mathbb{E}[c])"
                }
            });
            this.certaintyEquivalentPoint = new KG.Point({
                name: 'certaintyEquivalentPoint',
                className: 'riskPremium',
                show: this.show.ce,
                coordinates: {
                    x: this.modelProperty('certaintyEquivalent'),
                    y: this.modelProperty('expectedU')
                },
                droplines: {
                    vertical: "CE"
                }
            });
            this.expectationSegment = new KG.Segment({
                name: 'expectationSegment',
                className: 'growth dotted',
                a: {
                    x: this.modelProperty('ca'),
                    y: this.modelProperty('ua')
                },
                b: {
                    x: this.modelProperty('cb'),
                    y: this.modelProperty('ub')
                }
            });
            this.riskPremiumSegment = new KG.Segment({
                name: 'xDiffSegment',
                className: 'riskPremium',
                show: this.show.rp,
                a: {
                    x: this.modelProperty('expectedC'),
                    y: this.modelProperty('expectedU')
                },
                b: {
                    x: this.modelProperty('certaintyEquivalent'),
                    y: this.modelProperty('expectedU')
                },
                label: {
                    text: 'RP',
                    valign: 'top'
                }
            });
        }
        RiskAversion.prototype._update = function (scope) {
            var ra = this;
            ra.utility = ra.utility.update(scope);
            ra.ua = ra.utility.utilityFunction.yValue(ra.ca);
            ra.ub = ra.utility.utilityFunction.yValue(ra.cb);
            ra.expectedC = ra.pLow * ra.ca + (1 - ra.pLow) * ra.cb;
            ra.expectedU = ra.pLow * ra.ua + (1 - ra.pLow) * ra.ub;
            ra.utilityOfExpectedC = ra.utility.utilityFunction.yValue(ra.expectedC);
            ra.certaintyEquivalent = ra.utility.utilityFunction.xValue(ra.expectedU);
            return ra;
        };
        return RiskAversion;
    })(KG.Model);
    EconGraphs.RiskAversion = RiskAversion;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var UtilityRedistribution = (function (_super) {
        __extends(UtilityRedistribution, _super);
        function UtilityRedistribution(definition, modelPath) {
            _super.call(this, definition, modelPath);
            this.utility = new EconGraphs[definition.utilityType](definition.utilityDef, this.modelPath + '.utility');
            this.lowUtilityChangeArrow = new KG.Arrow({
                name: 'lowChangeSegment',
                className: 'diff2',
                begin: {
                    x: 5,
                    y: this.modelProperty('uLow')
                },
                end: {
                    x: 5,
                    y: this.modelProperty('uLowNew')
                }
            });
            this.highUtilityChangeArrow = new KG.Arrow({
                name: 'highChangeSegment',
                className: 'diff1',
                begin: {
                    x: 10,
                    y: this.modelProperty('uHigh')
                },
                end: {
                    x: 10,
                    y: this.modelProperty('uHighNew')
                }
            });
            this.lowConsumptionChangeArrow = new KG.Arrow({
                name: 'lowConsumptionChangeSegment',
                className: 'diff2',
                show: '(' + this.modelProperty('transfer') + ' > 0)',
                begin: {
                    x: this.modelProperty('cLow'),
                    y: this.modelProperty('utility.utilityAtQuantity(100)') + '*0.05'
                },
                end: {
                    x: this.modelProperty('cLowNew'),
                    y: this.modelProperty('utility.utilityAtQuantity(100)') + '*0.05'
                },
                label: {
                    text: 'T',
                    valign: 'top'
                }
            });
            this.highConsumptionChangeArrow = new KG.Arrow({
                name: 'highConsumptionChangeSegment',
                className: 'diff1',
                show: '(' + this.modelProperty('transfer') + ' > 0)',
                begin: {
                    x: this.modelProperty('cHigh'),
                    y: this.modelProperty('utility.utilityAtQuantity(100)') + '*0.1'
                },
                end: {
                    x: this.modelProperty('cHighNew'),
                    y: this.modelProperty('utility.utilityAtQuantity(100)') + '*0.1'
                },
                label: {
                    text: 'T',
                    valign: 'top'
                }
            });
        }
        UtilityRedistribution.prototype._update = function (scope) {
            var r = this;
            r.utility = r.utility.update(scope);
            r.uLow = r.utility.utilityFunction.yValue(r.cLow);
            r.uHigh = r.utility.utilityFunction.yValue(r.cHigh);
            r.cLowNew = r.cLow + r.transfer;
            r.cHighNew = r.cHigh - r.transfer;
            r.uLowNew = r.utility.utilityFunction.yValue(r.cLowNew);
            r.uHighNew = r.utility.utilityFunction.yValue(r.cHighNew);
            return r;
        };
        return UtilityRedistribution;
    })(KG.Model);
    EconGraphs.UtilityRedistribution = UtilityRedistribution;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var TwoGoodUtility = (function (_super) {
        __extends(TwoGoodUtility, _super);
        function TwoGoodUtility(definition, modelPath) {
            definition = _.defaults(definition, {
                indifferenceCurveLabel: 'U'
            });
            _super.call(this, definition, modelPath);
            var u = this;
            u.muxFunction = u.utilityFunction.derivative(1);
            u.muyFunction = u.utilityFunction.derivative(2);
        }
        TwoGoodUtility.prototype._update = function (scope) {
            var u = this;
            u.utilityFunction.update(scope);
            u.muxFunction.update(scope);
            u.muyFunction.update(scope);
            return u;
        };
        /* Pure preferences */
        // Given two bundles, evaluates whether agent prefers first or second, or is indifferent
        TwoGoodUtility.prototype.bundlePreferred = function (bundles, tolerance) {
            var u = this;
            tolerance = tolerance || 0.01; // percent difference within which one is thought to be indifferent
            var u1 = u.utility(bundles[0]), u2 = u.utility(bundles[1]), percentUilityDifference = (u2 - u1) / (0.5 * (u1 + u2));
            if (percentUilityDifference > tolerance) {
                return 2; //second bundle preferred
            }
            if (percentUilityDifference < -tolerance) {
                return 1; //first bundle preferred
            }
            return 0; //indifferent between two bundles
        };
        /* Utility measures */
        TwoGoodUtility.prototype.utility = function (bundle) {
            return this.utilityFunction.value(KG.getBases(bundle));
        };
        TwoGoodUtility.prototype.mux = function (bundle) {
            return this.muxFunction.value(KG.getBases(bundle));
        };
        TwoGoodUtility.prototype.muy = function (bundle) {
            return this.muyFunction.value(KG.getBases(bundle));
        };
        TwoGoodUtility.prototype.mrs = function (bundle) {
            return this.mux(bundle) / this.muy(bundle);
        };
        TwoGoodUtility.prototype.mrsLine = function (bundle, params) {
            var u = this;
            return new KG.Line({
                name: 'mrsLine',
                className: 'utility dotted',
                lineDef: {
                    point: bundle,
                    slope: -1 * u.mrs(bundle)
                },
                params: params
            });
        };
        TwoGoodUtility.prototype.bundlePoint = function (bundle, params) {
            return new KG.Point({
                coordinates: { x: bundle.x, y: bundle.y },
                name: 'bundlePoint',
                className: 'utility',
                params: params
            });
        };
        /* Indifference curves */
        TwoGoodUtility.prototype.indifferenceCurveAtUtility = function (utility, params, map) {
            var u = this, originalLevel = u.utilityFunction.level;
            var clone = _.clone(u.utilityFunction);
            var indifferenceCurve = new KG.FunctionPlot({
                name: 'indifferenceCurve',
                fn: clone.setLevel(utility),
                className: map ? 'dataPathFamily' : 'utility',
                params: params
            });
            u.utilityFunction.setLevel(originalLevel);
            return indifferenceCurve;
        };
        TwoGoodUtility.prototype.indifferenceCurveThroughBundle = function (bundle, params) {
            var u = this, utility = u.utility(bundle);
            return u.indifferenceCurveAtUtility(utility, params);
        };
        TwoGoodUtility.prototype.indifferenceCurveFamily = function (levels, params) {
            var u = this;
            var indifferenceCurves = [];
            params = _.defaults(params, {
                name: 'map'
            });
            levels.forEach(function (level) {
                params.objectName = "U" + level;
                indifferenceCurves.push(u.modelProperty("indifferenceCurveAtUtility(" + level + "," + JSON.stringify(params) + ",true)"));
            });
            return new KG.ViewObjectGroup({ name: 'indifferenceCurve_' + params.name, viewObjects: indifferenceCurves });
        };
        /* Utility maximization subject to a budget constraint */
        TwoGoodUtility.prototype._unconstrainedOptimalX = function (budgetSegment) {
            return 0; // based on specific utility function; overridden by subclass
        };
        TwoGoodUtility.prototype.optimalBundle = function (budget) {
            var u = this;
            var candidateBundles = budget.budgetSegments.map(function (segment) {
                return u.optimalBundleAlongSegment(segment);
            });
            var maxUtilityBundle = candidateBundles[0];
            candidateBundles.forEach(function (bundle) {
                if (u.utility(bundle) > u.utility(maxUtilityBundle)) {
                    maxUtilityBundle = bundle;
                }
            });
            return maxUtilityBundle;
        };
        TwoGoodUtility.prototype.optimalBundleAlongSegment = function (budgetSegment) {
            var u = this;
            var constrainedX, unconstrainedX;
            unconstrainedX = u._unconstrainedOptimalX(budgetSegment);
            constrainedX = budgetSegment.xDomain.closestValueTo(unconstrainedX);
            return { x: constrainedX, y: budgetSegment.linear.yValue(constrainedX) };
        };
        TwoGoodUtility.prototype.optimalBundlePoint = function (budget, params) {
            var optimalBundle = this.optimalBundle(budget);
            params.name = params.name || 'optimal';
            return this.bundlePoint(optimalBundle, params);
        };
        TwoGoodUtility.prototype.optimalIndifferenceCurve = function (budget, params) {
            var optimalBundle = this.optimalBundle(budget);
            return this.indifferenceCurveThroughBundle(optimalBundle, params);
        };
        TwoGoodUtility.prototype.indirectUtility = function (budget) {
            var u = this;
            return u.utility(u.optimalBundle(budget));
        };
        /* Cost minimization */
        TwoGoodUtility.prototype.lowestCostBundle = function (utility) {
            return { x: null, y: null }; // based on specific utility function; overridden by subclass
        };
        TwoGoodUtility.prototype.lowestCostBundlePoint = function (utility, params) {
            var lowestCostBundle = this.lowestCostBundle(utility);
            return this.bundlePoint(lowestCostBundle, params);
        };
        TwoGoodUtility.prototype.expenditure = function (utility) {
            var lowestCostBundle = this.lowestCostBundle(utility);
            return utility.px * lowestCostBundle.x + utility.py * lowestCostBundle.y;
        };
        TwoGoodUtility.prototype.formula = function (values) {
            return ''; // overridden by subclass
        };
        return TwoGoodUtility;
    })(EconGraphs.Utility);
    EconGraphs.TwoGoodUtility = TwoGoodUtility;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var CobbDouglasUtility = (function (_super) {
        __extends(CobbDouglasUtility, _super);
        function CobbDouglasUtility(definition, modelPath) {
            if (definition.hasOwnProperty('yPower')) {
                var sumOfPowers = KG.addDefs(definition.xPower, definition.yPower);
                definition.xShare = KG.divideDefs(definition.xPower, sumOfPowers);
                definition.yShare = KG.divideDefs(definition.yPower, sumOfPowers);
            }
            else {
                definition.yPower = KG.subtractDefs(1, definition.xPower);
                definition.xShare = definition.xPower;
                definition.yShare = definition.yPower;
            }
            definition.type = 'CobbDouglas';
            definition.def = {
                coefficient: definition.coefficient || 1,
                xPower: definition.xPower,
                yPower: definition.yPower
            };
            _super.call(this, definition, modelPath);
            this.title = CobbDouglasUtility.title;
        }
        CobbDouglasUtility.prototype._unconstrainedOptimalX = function (budgetSegment) {
            return this.xShare * budgetSegment.income / budgetSegment.px;
        };
        CobbDouglasUtility.prototype.lowestCostBundle = function (utilityConstraint) {
            var u = this;
            var theta = (u.xShare / u.yShare) * utilityConstraint.py / utilityConstraint.px;
            return {
                x: Math.pow(theta, u.yShare) * utilityConstraint.u,
                y: Math.pow(1 / theta, u.xShare) * utilityConstraint.u
            };
        };
        CobbDouglasUtility.prototype.formula = function (values) {
            if (values) {
                return "x^{" + this.xPower.toFixed(2) + "}y^{" + this.yPower.toFixed(2) + "}";
            }
            else {
                return "x^\\alpha y^{1 - \\alpha}";
            }
        };
        CobbDouglasUtility.title = 'Cobb-Douglas';
        return CobbDouglasUtility;
    })(EconGraphs.TwoGoodUtility);
    EconGraphs.CobbDouglasUtility = CobbDouglasUtility;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var ComplementsUtility = (function (_super) {
        __extends(ComplementsUtility, _super);
        function ComplementsUtility(definition, modelPath) {
            definition = _.defaults(definition, {
                coefficient: 1,
                xCoefficient: 1,
                yCoefficient: 1
            });
            if (definition.hasOwnProperty('bundle')) {
                definition.xCoefficient = KG.divideDefs(1, definition.bundle.x);
                definition.yCoefficient = KG.divideDefs(1, definition.bundle.y);
            }
            definition.type = 'MinAxBy';
            definition.def = {
                xCoefficient: definition.xCoefficient,
                yCoefficient: definition.yCoefficient
            };
            _super.call(this, definition, modelPath);
            this.title = ComplementsUtility.title;
        }
        ComplementsUtility.prototype._unconstrainedOptimalX = function (budgetSegment) {
            var u = this;
            if (u.yCoefficient == Infinity) {
                return budgetSegment.xDomain.max;
            }
            var num = budgetSegment.income * u.yCoefficient, den = (budgetSegment.px * u.yCoefficient) + (budgetSegment.py * u.xCoefficient);
            return num / den;
        };
        ComplementsUtility.prototype.lowestCostBundle = function (utilityConstraint) {
            var u = this;
            return {
                x: utilityConstraint.u / u.xCoefficient,
                y: utilityConstraint.u / u.yCoefficient
            };
        };
        ComplementsUtility.prototype.formula = function (values) {
            var u = this;
            if (values) {
                return "\\min \\left\\{ \\frac\{x}\{ " + (1 / u.xCoefficient).toFixed(2) + " } , \\frac\{y}\{" + (1 / u.yCoefficient).toFixed(2) + "} \\right\\}";
            }
            else {
                return "\\min \\left\\{ \\frac\{x}\{\\alpha} , \\frac\{y}\{1 - \\alpha} \\right\\}";
            }
        };
        ComplementsUtility.title = 'Perfect Complements';
        return ComplementsUtility;
    })(EconGraphs.TwoGoodUtility);
    EconGraphs.ComplementsUtility = ComplementsUtility;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var SubstitutesUtility = (function (_super) {
        __extends(SubstitutesUtility, _super);
        function SubstitutesUtility(definition, modelPath) {
            definition.xCoefficient = definition.xCoefficient || 0.5;
            definition.yCoefficient = definition.yCoefficient || KG.subtractDefs(1, definition.xCoefficient);
            definition.criticalPriceRatio = KG.divideDefs(definition.xCoefficient, definition.yCoefficient);
            definition.type = 'Linear';
            definition.def = {
                coefficients: {
                    a: definition.xCoefficient,
                    b: definition.yCoefficient,
                    c: 0
                }
            };
            _super.call(this, definition, modelPath);
            this.title = SubstitutesUtility.title;
        }
        SubstitutesUtility.prototype._unconstrainedOptimalX = function (budgetSegment, maxIfIndifferent) {
            var u = this;
            maxIfIndifferent = !!maxIfIndifferent;
            if (u.xCoefficient / u.yCoefficient > budgetSegment.px / budgetSegment.py) {
                return budgetSegment.xDomain.max;
            }
            else if (u.xCoefficient / u.yCoefficient < budgetSegment.px / budgetSegment.py) {
                return budgetSegment.xDomain.min;
            }
            else {
                // need a way to handle indifference between all segments of the budget segment
                // for now, just return midpoint
                return maxIfIndifferent ? budgetSegment.xDomain.max : budgetSegment.xDomain.min;
            }
        };
        SubstitutesUtility.prototype.lowestCostBundle = function (utilityConstraint) {
            var u = this;
            //utility constraint is of the form ax + by = u
            // buying all X means buying u/a units of x
            var allX = utilityConstraint.u / u.xCoefficient;
            // buying all Y means buying u/b units of y
            var allY = utilityConstraint.u / u.yCoefficient;
            if (utilityConstraint.px * allX < utilityConstraint.py * allY) {
                return {
                    x: allX,
                    y: 0
                };
            }
            else if (utilityConstraint.px * allX > utilityConstraint.py * allY) {
                return {
                    x: allX,
                    y: 0
                };
            }
            else {
                // need a way to handle indifference between all segments of the budget segment
                // for now, just return midpoint
                return {
                    x: 0.5 * allX,
                    y: 0.5 * allY
                };
            }
        };
        SubstitutesUtility.prototype.formula = function (values) {
            var u = this;
            if (values) {
                return u.xCoefficient.toFixed(2) + "x + " + u.yCoefficient.toFixed(2) + "y";
            }
            else {
                return "\\alpha x + (1 - \\alpha)y";
            }
        };
        SubstitutesUtility.title = 'Perfect Substitutes';
        return SubstitutesUtility;
    })(EconGraphs.TwoGoodUtility);
    EconGraphs.SubstitutesUtility = SubstitutesUtility;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var CESUtility = (function (_super) {
        __extends(CESUtility, _super);
        function CESUtility(definition, modelPath) {
            // Can defined with either r or s or (more commonly) 'sub', which ranges from -1 to 1
            if (definition.hasOwnProperty('r')) {
                definition.s = KG.divideDefs(1, KG.subtractDefs(1, definition.r)); // s = 1/(1-r)
            }
            else if (definition.hasOwnProperty('s')) {
                definition.r = KG.divideDefs(KG.subtractDefs(definition.s, 1), definition.s); // r = (s-1)/s
            }
            else {
                definition.r = definition.sub + ' > 0 ? ' + definition.sub + ' : ' + KG.divideDefs(definition.sub, KG.addDefs(1.01, definition.sub));
                definition.s = KG.divideDefs(1, KG.subtractDefs(1, definition.r)); // s = 1/(1-r)
                console.log('oops, must instantiate a CES utility function with either r or s');
            }
            definition.type = 'CES';
            definition.def = {
                coefficient: definition.coefficient || 1,
                r: definition.r,
                alpha: definition.alpha
            };
            _super.call(this, definition, modelPath);
            this.title = CESUtility.title;
        }
        CESUtility.prototype._unconstrainedOptimalX = function (budgetSegment, maxIfIndifferent) {
            var u = this;
            maxIfIndifferent = !!maxIfIndifferent;
            if (u.r == 1) {
                if (u.alpha / (1 - u.alpha) > budgetSegment.px / budgetSegment.py) {
                    return budgetSegment.xDomain.max;
                }
                else if (u.alpha / (1 - u.alpha) < budgetSegment.px / budgetSegment.py) {
                    return budgetSegment.xDomain.min;
                }
                else {
                    // need a way to handle indifference between all segments of the budget segment
                    // for now, just return midpoint
                    return maxIfIndifferent ? budgetSegment.xDomain.max : budgetSegment.xDomain.min;
                }
            }
            else if (u.r == 0) {
                return u.alpha * budgetSegment.income / budgetSegment.px;
            }
            else {
                var n = budgetSegment.income * Math.pow(budgetSegment.px / u.alpha, -u.s), dx = Math.pow(u.alpha, u.s) * Math.pow(budgetSegment.px, 1 - u.s), dy = Math.pow(1 - u.alpha, u.s) * Math.pow(budgetSegment.py, 1 - u.s);
                return n / (dx + dy);
            }
        };
        /*lowestCostBundle(utilityConstraint:UtilityConstraint) {
            var u = this;

            var denominator = Math.pow(u.alpha, s) * Math.pow(px, 1 - s) + Math.pow(1 - u.alpha, u.s) * Math.pow(py, 1 - u.s),
                x_coefficient = Math.pow(px / u.alpha, -s) / denominator,
                y_coefficient = Math.pow(py / (1 - u.alpha), -s) / denominator,
                scale_factor = u.alpha*Math.pow(x_coefficient, u.r) + (1- u.alpha)*Math.pow(y_coefficient, u.r),

                c = Math.pow(utility/scale_factor, 1/ u.r);

            return c;

            return {
                x: Math.pow(theta,u.yShare)*utilityConstraint.u,
                y: Math.pow(1/theta,u.xShare)*utilityConstraint.u
            };
        }*/
        CESUtility.prototype.formula = function (values) {
            var u = this;
            if (values) {
                if (u.r == 0) {
                    return "x^{" + u.alpha.toFixed(2) + "}y^{" + (1 - u.alpha).toFixed(2) + "}";
                }
                return "\\left[" + u.alpha.toFixed(2) + "x^{" + u.r.toFixed(2) + "} + " + (1 - u.alpha).toFixed(2) + "y^{" + u.r.toFixed(2) + "}\\right]^{" + (1 / this.r).toFixed(2) + "}";
            }
            else {
                return "\\left[ \\alpha x^r + (1-\\alpha)x^r\\right]^{1/r}";
            }
        };
        CESUtility.title = 'CES';
        return CESUtility;
    })(EconGraphs.TwoGoodUtility);
    EconGraphs.CESUtility = CESUtility;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var QuasilinearUtility = (function (_super) {
        __extends(QuasilinearUtility, _super);
        function QuasilinearUtility(definition, modelPath) {
            definition.coefficient = definition.coefficient || 1;
            definition.type = 'Quasilinear';
            definition.def = {
                coefficients: [definition.coefficient, 1],
                powers: [definition.alpha, 1]
            };
            _super.call(this, definition, modelPath);
            this.title = QuasilinearUtility.title;
        }
        QuasilinearUtility.prototype._unconstrainedOptimalX = function (budgetSegment) {
            var u = this;
            //ax^(a-1) = px/py
            //x = (px/apy)^(1/(a-1))
            // MRS = ax^(a-1)
            if (u.alpha == 1) {
                if (budgetSegment.px > budgetSegment.py) {
                    return 0;
                }
                else if (budgetSegment.px < budgetSegment.py) {
                    return budgetSegment.income / budgetSegment.px;
                }
                else {
                    return 0.5 * budgetSegment.income / budgetSegment.px;
                }
            }
            return Math.pow(budgetSegment.px / (u.alpha * budgetSegment.py), 1 / (u.alpha - 1));
        };
        /*lowestCostBundle(utilityConstraint:UtilityConstraint) {
            var u = this;

            var denominator = Math.pow(u.alpha, s) * Math.pow(px, 1 - s) + Math.pow(1 - u.alpha, u.s) * Math.pow(py, 1 - u.s),
                x_coefficient = Math.pow(px / u.alpha, -s) / denominator,
                y_coefficient = Math.pow(py / (1 - u.alpha), -s) / denominator,
                scale_factor = u.alpha*Math.pow(x_coefficient, u.r) + (1- u.alpha)*Math.pow(y_coefficient, u.r),

                c = Math.pow(utility/scale_factor, 1/ u.r);

            return c;

            return {
                x: Math.pow(theta,u.yShare)*utilityConstraint.u,
                y: Math.pow(1/theta,u.xShare)*utilityConstraint.u
            };
        }*/
        QuasilinearUtility.prototype.formula = function (values) {
            var u = this;
            if (values) {
                return "x^{" + u.alpha.toFixed(2) + "} + y";
            }
            else {
                return "x^\\alpha + y";
            }
        };
        QuasilinearUtility.title = 'Quasilinear';
        return QuasilinearUtility;
    })(EconGraphs.TwoGoodUtility);
    EconGraphs.QuasilinearUtility = QuasilinearUtility;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var UtilityDemand = (function (_super) {
        __extends(UtilityDemand, _super);
        function UtilityDemand(definition, modelPath) {
            _super.call(this, definition, modelPath);
        }
        UtilityDemand.prototype.price = function (good) {
            return 0; // overridden by subclass
        };
        UtilityDemand.prototype.quantityAtPrice = function (price, good) {
            return 0; // overridden by subclass
        };
        UtilityDemand.prototype.otherQuantityAtPrice = function (price, good) {
            return 0; // overridden by subclass
        };
        UtilityDemand.prototype.quantityAtPricePoint = function (price, priceParams, pointParams) {
            var d = this;
            priceParams = _.defaults(priceParams, {
                good: 'x'
            });
            var quantityProperty = 'quantityAtPrice(' + price + ',"' + priceParams.good + '")';
            return new KG.Point({
                name: 'q' + priceParams.good + 'd',
                className: 'demand',
                coordinates: {
                    x: d.modelProperty(quantityProperty),
                    y: price
                },
                params: pointParams
            });
        };
        UtilityDemand.prototype.quantitiesAtPriceSegment = function (price, segmentParams) {
            var d = this;
            segmentParams = _.defaults(segmentParams, {
                good: 'x'
            });
            var quantityProperty = 'quantityAtPrice(' + price + ',' + segmentParams.good + ')';
            var otherQuantityProperty = 'otherQuantityAtPrice(' + price + ',' + segmentParams.good + ')';
            return new KG.Segment({
                name: 'q' + segmentParams.good + 'dSegment',
                className: 'demand',
                a: {
                    x: d.modelProperty(quantityProperty),
                    y: price
                },
                b: {
                    x: d.modelProperty(otherQuantityProperty),
                    y: price
                },
                params: segmentParams
            });
        };
        UtilityDemand.prototype.demandCurve = function (demandParams, curveParams) {
            demandParams = _.defaults(demandParams, {
                good: 'x',
                min: 1,
                max: 50,
                numSamplePoints: 101
            });
            var d = this, curveData = [], relevantDemandParams = _.clone(demandParams);
            if (d.utility instanceof EconGraphs.SubstitutesUtility) {
                curveData.push({ x: 0, y: demandParams.max });
                // get other price from specific demand function
                // set new maximum to critical price ratio
                relevantDemandParams.max = (demandParams.good == 'x') ? d.utility.criticalPriceRatio * d.price('y') : d.price('x') / d.utility.criticalPriceRatio;
                curveData.push({ x: 0, y: relevantDemandParams.max });
            }
            var samplePoints = KG.samplePointsForDomain(relevantDemandParams).reverse();
            samplePoints.forEach(function (price) {
                curveData.push({ x: d.quantityAtPrice(price, demandParams.good), y: price });
            });
            curveData = curveData.sort(KG.sortObjects('x'));
            return new KG.Curve({
                name: 'demand' + demandParams.good,
                data: curveData,
                params: curveParams,
                className: 'demand'
            });
        };
        return UtilityDemand;
    })(KG.Model);
    EconGraphs.UtilityDemand = UtilityDemand;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var MarshallianDemand = (function (_super) {
        __extends(MarshallianDemand, _super);
        function MarshallianDemand(definition, modelPath) {
            definition = _.defaults(definition, {
                bundle: { x: definition.x, y: definition.y },
                snapToOptimalBundle: true
            });
            _super.call(this, definition, modelPath);
        }
        MarshallianDemand.prototype._update = function (scope) {
            var d = this;
            d.utility = d.utility.update(scope);
            d.budget = d.budget.update(scope);
            d.budget.budgetSegments.forEach(function (bs) {
                bs.update(scope);
            });
            if (d.snapToOptimalBundle) {
                d.bundle = d.utility.optimalBundle(d.budget);
            }
            else {
                d.bundle = {
                    x: d.x,
                    y: d.budget.yValue(d.x)
                };
            }
            return d;
        };
        MarshallianDemand.prototype.price = function (good) {
            good = good || 'x';
            return this.budget['p' + good];
        };
        MarshallianDemand.prototype.quantityAtPrice = function (price, good) {
            var d = this;
            good = good || 'x';
            // store original price in budget constraint
            var originalPrice = d.budget['p' + good];
            // evaluate quantity demanded of this good at the given price
            d.budget.setPrice(price, good);
            var quantity = d.utility.optimalBundle(d.budget)[good];
            // reset budget constraint to original price
            d.budget.setPrice(originalPrice, good);
            return quantity;
        };
        MarshallianDemand.prototype.quantityAtIncome = function (income, good) {
            var d = this;
            good = good || 'x';
            // store original price in budget constraint
            var originalIncome = d.budget.income;
            // evaluate quantity demanded of this good at the given price
            d.budget.setIncome(income);
            var quantity = d.utility.optimalBundle(d.budget)[good];
            // reset budget constraint to original price
            d.budget.setIncome(originalIncome);
            return quantity;
        };
        MarshallianDemand.prototype.priceConsumptionCurve = function (pccParams, curveParams) {
            pccParams = _.defaults(pccParams, {
                good: 'x',
                min: 1,
                max: 100,
                numSamplePoints: 100
            });
            var d = this, budget = d.budget, samplePoints = KG.samplePointsForDomain(pccParams), curveData = [];
            var initialPrice = budget['p' + pccParams.good];
            samplePoints.forEach(function (price) {
                budget['p' + pccParams.good] = price;
                curveData.push(d.utility.optimalBundle(budget));
            });
            // reset budget price
            budget['p' + pccParams.good] = initialPrice;
            return new KG.Curve({
                name: 'PCC' + pccParams.good,
                data: curveData,
                params: curveParams,
                className: 'pcc'
            });
        };
        MarshallianDemand.prototype.incomeConsumptionCurve = function (iccParams, curveParams) {
            iccParams = _.defaults(iccParams, {
                min: 1,
                max: 200,
                numSamplePoints: 200
            });
            var d = this, budget = d.budget, samplePoints = KG.samplePointsForDomain(iccParams), curveData = [];
            var initialIncome = budget.income;
            samplePoints.forEach(function (income) {
                budget.income = income;
                curveData.push(d.utility.optimalBundle(budget));
            });
            // reset budget price
            budget.income = initialIncome;
            return new KG.Curve({
                name: 'ICC',
                data: curveData,
                params: curveParams,
                className: 'icc'
            });
        };
        MarshallianDemand.prototype.quantityAtIncomePoint = function (price, incomeParams, pointParams) {
            var d = this;
            incomeParams = _.defaults(incomeParams, {
                good: 'x'
            });
            var quantityProperty = 'quantityAtIncome(' + price + ',"' + incomeParams.good + '")';
            return new KG.Point({
                name: 'q' + incomeParams.good + 'd',
                className: 'engel',
                coordinates: {
                    x: d.modelProperty(quantityProperty),
                    y: price
                },
                params: pointParams
            });
        };
        MarshallianDemand.prototype.engelCurve = function (engelParams, curveParams) {
            engelParams = _.defaults(engelParams, {
                good: 'x',
                min: 1,
                max: 200,
                numSamplePoints: 201
            });
            var d = this, samplePoints = KG.samplePointsForDomain(engelParams), curveData = [];
            samplePoints.forEach(function (price) {
                curveData.push({ x: d.quantityAtIncome(price, engelParams.good), y: price });
            });
            return new KG.Curve({
                name: 'Engel' + engelParams.good,
                data: curveData,
                params: curveParams,
                className: 'engel'
            });
        };
        return MarshallianDemand;
    })(EconGraphs.UtilityDemand);
    EconGraphs.MarshallianDemand = MarshallianDemand;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var HicksianDemand = (function (_super) {
        __extends(HicksianDemand, _super);
        function HicksianDemand(definition, modelPath) {
            _super.call(this, definition, modelPath);
        }
        HicksianDemand.prototype.price = function (good) {
            return this['p' + good];
        };
        HicksianDemand.prototype.quantityAtPrice = function (price, good) {
            var d = this;
            good = good || 'x';
            // store original price in budget constraint
            var originalPrice = d['p' + good];
            // evaluate quantity demanded of this good at the given price
            d['p' + good] = price;
            var quantity = d.utility.lowestCostBundle(d.u, d.px, d.py)[good];
            // reset budget constraint to original price
            d['p' + good] = originalPrice;
            return quantity;
        };
        return HicksianDemand;
    })(EconGraphs.UtilityDemand);
    EconGraphs.HicksianDemand = HicksianDemand;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var ProductionCost = (function (_super) {
        __extends(ProductionCost, _super);
        function ProductionCost(definition, modelPath) {
            definition.labels = _.defaults(definition.labels || {}, {
                tc: 'TC',
                vc: 'VC',
                fc: 'FC',
                mc: 'MC',
                atc: 'ATC',
                avc: 'AVC',
                mcSlope: 'slope = MC',
                atcSlope: 'slope = ATC',
                avcSlope: 'slope = AVC'
            });
            definition.show = _.defaults(definition.show || {}, {
                tc: true,
                vc: false,
                fc: false,
                mc: true,
                atc: true,
                avc: false,
                mcSlope: false,
                atcSlope: false,
                avcSlope: false
            });
            definition = _.defaults(definition, {
                quantityDraggable: true
            });
            _super.call(this, definition, modelPath);
            var productionCost = this;
            if (definition.hasOwnProperty('costFunctionDef')) {
                productionCost.costFunction = new KGMath.Functions[definition.costFunctionType](definition.costFunctionDef);
                productionCost.marginalCostFunction = productionCost.costFunction.derivative();
            }
            else if (definition.hasOwnProperty('marginalCostFunctionDef')) {
                productionCost.marginalCostFunction = new KGMath.Functions[definition.marginalCostFunctionType](definition.marginalCostFunctionDef, productionCost.modelProperty('marginalCostFunction'));
                productionCost.costFunction = productionCost.marginalCostFunction.integral(0, definition.fixedCost, productionCost.modelProperty('costFunction'));
            }
            else {
                console.log('must initiate production cost object with either total cost or marginal cost function!');
            }
            productionCost.averageCostFunction = productionCost.costFunction.average();
            productionCost.variableCostFunction = productionCost.costFunction.add(KG.subtractDefs(0, this.modelProperty('fixedCost')));
            productionCost.averageVariableCostFunction = productionCost.variableCostFunction.average();
            if (productionCost.costFunction instanceof KGMath.Functions.Linear) {
                productionCost.totalCostCurve = new KG.Line({
                    name: 'totalCostLine',
                    className: 'totalCost',
                    lineDef: {
                        slope: productionCost.modelProperty('marginalCostFunction.y'),
                        intercept: productionCost.modelProperty('fixedCost')
                    },
                    label: {
                        text: 'TC'
                    }
                });
                productionCost.marginalCostCurve = new KG.HorizontalLine({
                    name: 'marginalCostCurve',
                    className: 'marginalCost',
                    y: productionCost.modelProperty('marginalCostFunction.y'),
                    label: {
                        text: 'MC'
                    }
                });
            }
            else {
                productionCost.totalCostCurve = new KG.FunctionPlot({
                    name: 'totalCostCurve',
                    fn: this.modelProperty('costFunction'),
                    className: 'totalCost',
                    numSamplePoints: 201,
                    label: {
                        text: 'TC'
                    }
                });
                productionCost.marginalCostCurve = new KG.FunctionPlot({
                    name: 'marginalCostCurve',
                    className: 'marginalCost',
                    fn: productionCost.modelProperty('marginalCostFunction'),
                    arrows: 'NONE',
                    label: {
                        text: 'MC'
                    },
                    numSamplePoints: 501
                });
            }
            productionCost.variableCostCurve = new KG.FunctionPlot({
                name: 'variableCostCurve',
                className: 'variableCost',
                fn: productionCost.modelProperty('variableCostFunction'),
                arrows: 'NONE',
                label: {
                    text: productionCost.modelProperty('labels.vc')
                },
                numSamplePoints: 501,
                show: productionCost.show.vc
            });
            productionCost.averageCostCurve = new KG.FunctionPlot({
                name: 'averageCostCurve',
                className: 'averageCost',
                fn: productionCost.modelProperty('averageCostFunction'),
                arrows: 'NONE',
                label: {
                    text: productionCost.modelProperty('labels.atc')
                },
                numSamplePoints: 501,
                show: productionCost.show.atc
            });
            productionCost.averageVariableCostCurve = new KG.FunctionPlot({
                name: 'averageVariableCostCurve',
                className: 'averageVariableCost',
                fn: productionCost.modelProperty('averageVariableCostFunction'),
                arrows: 'NONE',
                label: {
                    text: productionCost.modelProperty('labels.avc')
                },
                numSamplePoints: 501,
                show: productionCost.show.avc
            });
            productionCost.fixedCostPoint = new KG.Point({
                name: 'fixedCostPoint',
                className: 'totalCost',
                coordinates: { x: 0, y: productionCost.modelProperty('fixedCost') },
                droplines: {
                    horizontal: definition.labels.fc
                },
                yDrag: definition.fixedCostDragParam
            });
            productionCost.fixedCostLine = new KG.HorizontalLine({
                name: 'fixedCostLine',
                className: 'fixedCost',
                y: productionCost.modelProperty('fixedCost'),
                label: {
                    text: definition.labels.fc
                }
            });
        }
        ProductionCost.prototype._update = function (scope) {
            var p = this;
            p.costFunction.update(scope);
            p.fixedCost = p.tc(0);
            p.marginalCostFunction.update(scope);
            p.fixedCostPoint.update(scope);
            return p;
        };
        ProductionCost.prototype.tc = function (q) {
            return this.costFunction.yValue(q);
        };
        ProductionCost.prototype.vc = function (q) {
            return this.variableCostFunction.yValue(q);
        };
        ProductionCost.prototype.atc = function (q) {
            return this.averageCostFunction.yValue(q);
        };
        ProductionCost.prototype.avc = function (q) {
            return this.averageVariableCostFunction.yValue(q);
        };
        ProductionCost.prototype.mc = function (q) {
            return this.marginalCostFunction.yValue(q);
        };
        ProductionCost.prototype.marginalCostAtQuantitySlope = function (q, label, dragParam) {
            var labelSubscript = label ? '_{' + label + '}' : '', xDrag = this.quantityDraggable ? dragParam : false;
            return new KG.Line({
                name: 'MCslopeLine' + label,
                className: 'marginalCost dotted',
                show: this.show.mcslope,
                lineDef: {
                    point: { x: q, y: this.tc(q) },
                    slope: this.mc(q)
                },
                xDrag: xDrag,
                label: {
                    text: '\\text{slope} = MC'
                }
            });
        };
        ProductionCost.prototype.marginalCostAtVariableCostQuantitySlope = function (q, label, dragParam) {
            var labelSubscript = label ? '_{' + label + '}' : '', xDrag = this.quantityDraggable ? dragParam : false;
            return new KG.Line({
                name: 'MCslopeLineVC' + label,
                className: 'marginalCost dotted',
                show: (this.show.mcslope && this.show.vc),
                lineDef: {
                    point: { x: q, y: this.modelProperty('vc(' + q + ')') },
                    slope: this.mc(q)
                },
                xDrag: xDrag,
                label: {
                    text: '\\text{slope} = MC'
                }
            });
        };
        ProductionCost.prototype.averageCostAtQuantitySlope = function (q, label, dragParam) {
            var labelSubscript = label ? '_{' + label + '}' : '', xDrag = this.quantityDraggable ? dragParam : false;
            ;
            return new KG.Line({
                name: 'ATCslopeLine' + label,
                className: 'averageCost dotted',
                show: this.show.atcslope,
                lineDef: {
                    point: { x: 0, y: 0 },
                    slope: this.modelProperty('atc(' + q + ')')
                },
                xDrag: xDrag,
                label: {
                    text: '\\text{slope} = ATC'
                }
            });
        };
        ProductionCost.prototype.averageVariableCostAtQuantitySlope = function (q, label, dragParam) {
            var labelSubscript = label ? '_{' + label + '}' : '', xDrag = this.quantityDraggable ? dragParam : false;
            ;
            return new KG.Line({
                name: 'AVCslopeLine' + label,
                className: 'averageVariableCost dotted',
                show: this.show.avcslope,
                lineDef: {
                    point: { x: 0, y: 0 },
                    slope: this.modelProperty('avc(' + q + ')')
                },
                xDrag: xDrag,
                label: {
                    text: '\\text{slope} = AVC'
                }
            });
        };
        ProductionCost.prototype.totalCostAtQuantityPoint = function (q, label, dragParam) {
            var labelSubscript = label ? '_{' + label + '}' : '', xDrag = this.quantityDraggable ? dragParam : false;
            ;
            return new KG.Point({
                name: 'totalCostAtQ' + label,
                coordinates: { x: q, y: this.modelProperty('tc(' + q + ')') },
                className: 'totalCost',
                xDrag: xDrag,
                label: {
                    text: label
                },
                droplines: {
                    vertical: 'q' + labelSubscript,
                    horizontal: 'TC(q' + labelSubscript + ')'
                }
            });
        };
        ProductionCost.prototype.variableCostAtQuantityPoint = function (q, label, dragParam) {
            var labelSubscript = label ? '_{' + label + '}' : '', xDrag = this.quantityDraggable ? dragParam : false;
            ;
            return new KG.Point({
                name: 'variableCostAtQ' + label,
                coordinates: { x: q, y: this.modelProperty('vc(' + q + ')') },
                className: 'variableCost',
                show: this.show.vc,
                xDrag: xDrag,
                label: {
                    text: label
                },
                droplines: {
                    horizontal: 'VC(q' + labelSubscript + ')'
                }
            });
        };
        ProductionCost.prototype.marginalCostAtQuantityPoint = function (q, label, dragParam) {
            var axisLabel = this.mc(q).toFixed(1);
            if (label && label.length > 0) {
                axisLabel = label;
            }
            var axisLabel = axisLabel || this.mc(q).toFixed(1), mcq = this.modelProperty('mc(' + q + ')'), xDrag = this.quantityDraggable ? dragParam : false;
            ;
            return new KG.Point({
                name: 'marginalCostAtQ' + label,
                coordinates: { x: q, y: mcq },
                className: 'marginalCost',
                xDrag: xDrag,
                droplines: {
                    horizontal: axisLabel
                }
            });
        };
        ProductionCost.prototype.averageCostAtQuantityPoint = function (q, label, dragParam) {
            var axisLabel = this.atc(q).toFixed(1);
            if (label && label.length > 0) {
                axisLabel = label;
            }
            var atcq = this.modelProperty('atc(' + q + ')'), xDrag = this.quantityDraggable ? dragParam : false;
            ;
            return new KG.Point({
                name: 'averageCostAtQ' + label,
                coordinates: { x: q, y: atcq },
                className: 'averageCost',
                xDrag: xDrag,
                droplines: {
                    horizontal: axisLabel
                },
                show: this.show.atc
            });
        };
        ProductionCost.prototype.averageVariableCostAtQuantityPoint = function (q, label, dragParam) {
            var axisLabel = this.avc(q).toFixed(1);
            if (label && label.length > 0) {
                axisLabel = label;
            }
            var avcq = this.modelProperty('avc(' + q + ')'), xDrag = this.quantityDraggable ? dragParam : false;
            ;
            return new KG.Point({
                name: 'averageVariableCostAtQ' + label,
                coordinates: { x: q, y: avcq },
                className: 'averageVariableCost',
                xDrag: xDrag,
                droplines: {
                    horizontal: axisLabel
                },
                show: this.show.avc
            });
        };
        return ProductionCost;
    })(KG.Model);
    EconGraphs.ProductionCost = ProductionCost;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var LinearMarginalCost = (function (_super) {
        __extends(LinearMarginalCost, _super);
        function LinearMarginalCost(definition, modelPath) {
            definition.marginalCostFunctionType = 'Linear';
            definition.marginalCostFunctionDef = {
                point1: { x: 0, y: definition.marginalCostIntercept },
                point2: definition.marginalCostControlPointCoordinates
            };
            _super.call(this, definition, modelPath);
            var productionCost = this;
            productionCost.marginalCostInterceptPoint = new KG.Point({
                name: 'marginalCostInterceptPoint',
                className: 'marginalCost',
                coordinates: { x: 0, y: definition.marginalCostIntercept },
                yDrag: definition.marginalCostIntercept
            });
            productionCost.marginalCostControlPoint = new KG.Point({
                name: 'marginalCostControlPoint',
                className: 'marginalCost',
                coordinates: definition.marginalCostControlPointCoordinates,
                yDrag: definition.marginalCostControlPointCoordinates.y
            });
        }
        return LinearMarginalCost;
    })(EconGraphs.ProductionCost);
    EconGraphs.LinearMarginalCost = LinearMarginalCost;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var ConstantMarginalCost = (function (_super) {
        __extends(ConstantMarginalCost, _super);
        function ConstantMarginalCost(definition, modelPath) {
            definition.marginalCostFunctionType = 'HorizontalLine';
            definition.marginalCostFunctionDef = {
                y: definition.c
            };
            _super.call(this, definition, modelPath);
        }
        return ConstantMarginalCost;
    })(EconGraphs.ProductionCost);
    EconGraphs.ConstantMarginalCost = ConstantMarginalCost;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var QuadraticMarginalCost = (function (_super) {
        __extends(QuadraticMarginalCost, _super);
        function QuadraticMarginalCost(definition, modelPath) {
            definition.marginalCostFunctionType = 'Quadratic';
            definition.marginalCostFunctionDef = {
                vertex: definition.marginalCostVertexCoordinates,
                point: definition.marginalCostControlPointCoordinates
            };
            _super.call(this, definition, modelPath);
            var productionCost = this;
            productionCost.marginalCostVertex = new KG.Point({
                name: 'marginalCostVertexPoint',
                className: 'marginalCost',
                coordinates: definition.marginalCostVertexCoordinates,
                xDrag: definition.marginalCostVertexCoordinates.x,
                yDrag: definition.marginalCostVertexCoordinates.y
            });
            productionCost.marginalCostControlPoint = new KG.Point({
                name: 'marginalCostControlPoint',
                className: 'marginalCost',
                coordinates: definition.marginalCostControlPointCoordinates,
                xDrag: definition.marginalCostControlPointCoordinates.x,
                yDrag: definition.marginalCostControlPointCoordinates.y
            });
        }
        return QuadraticMarginalCost;
    })(EconGraphs.ProductionCost);
    EconGraphs.QuadraticMarginalCost = QuadraticMarginalCost;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var Monopoly = (function (_super) {
        __extends(Monopoly, _super);
        function Monopoly(definition, modelPath) {
            definition = _.defaults(definition, {
                showProfit: true,
                snapToOptimalQuantity: true
            });
            _super.call(this, definition, modelPath);
            var m = this;
            var p = m.modelProperty('price'), q = m.modelProperty('quantity'), mcq = m.modelProperty('costFunction.mc(' + q + ')'), mc0 = m.modelProperty('costFunction.mc(0)'), acq = m.modelProperty('costFunction.atc(' + q + ')'), profitLabel = m.modelProperty('profitLabel');
            definition.demand.demandDef.curveLabel = definition.demand.demandDef.curveLabel || 'D = AR';
            m.demandFunction = new EconGraphs[definition.demand.demandType](definition.demand.demandDef, this.modelPath + '.demandFunction');
            m.costFunction = new EconGraphs[definition.cost.costType](definition.cost.costDef, this.modelPath + '.costFunction');
            m.producerSurplus = new KG.Area({
                data: [
                    { x: 0, y: p },
                    { x: q, y: p },
                    { x: q, y: mcq },
                    { x: 0, y: mc0 }
                ]
            });
            m.profitArea = new KG.Area({
                name: 'profitArea',
                className: 'growth',
                show: m.modelProperty('showACandProfit'),
                data: [
                    { x: 0, y: p },
                    { x: q, y: p },
                    { x: q, y: acq },
                    { x: 0, y: acq }
                ],
                label: {
                    text: profitLabel
                }
            });
        }
        Monopoly.prototype._update = function (scope) {
            var m = this;
            m.demandFunction.update(scope);
            m.costFunction.update(scope);
            m.showACandProfit = (m.showProfit && m.costFunction.showAC);
            if (m.snapToOptimalQuantity && m.demandFunction instanceof EconGraphs.LinearDemand && (m.costFunction instanceof EconGraphs.LinearMarginalCost || m.costFunction instanceof EconGraphs.ConstantMarginalCost)) {
                m.quantity = Math.max(0, m.demandFunction.marginalRevenueFunction.linearIntersection(m.costFunction.marginalCostFunction).x);
            }
            if (m.choosePrice) {
                m.quantity = m.demandFunction.quantityAtPrice(m.price);
                m.demandFunction.quantity = m.quantity;
            }
            else {
                m.price = m.demandFunction.priceAtQuantity(m.quantity);
                m.demandFunction.price = m.price;
            }
            m.profit = m.demandFunction.tr(m.quantity) - m.costFunction.tc(m.quantity);
            m.profitLabel = (m.profit > 0) ? '\\text{Profit}' : (m.profit < 0) ? '\\text{Loss}' : '';
            return m;
        };
        return Monopoly;
    })(KG.Model);
    EconGraphs.Monopoly = Monopoly;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../../eg.ts"/>
var EconGraphs;
(function (EconGraphs) {
    var CournotDuopoly = (function (_super) {
        __extends(CournotDuopoly, _super);
        function CournotDuopoly(definition, modelPath) {
            _super.call(this, definition, modelPath);
            var cournot = this;
            cournot.marketDemand = new EconGraphs.LinearDemand({
                type: 'Linear',
                quantity: KG.addDefs(definition.q1, definition.q2),
                def: {
                    point1: {
                        x: 0,
                        y: cournot.modelProperty('marketDemandPriceIntercept')
                    },
                    point2: {
                        x: cournot.modelProperty('marketDemandQuantityIntercept'),
                        y: 0
                    }
                },
                curveLabel: 'P(q_1 + q_2)',
                quantityLabel: 'q_1 + q_2',
                priceInterceptDrag: 'params.marketDemandPriceIntercept',
                quantityInterceptDrag: 'params.marketDemandQuantityIntercept'
            }, this.modelProperty('marketDemand'));
            cournot.firm1 = new EconGraphs.Monopoly({
                quantity: definition.q1,
                snapToOptimalQuantity: definition.snapToOptimal1,
                showProfit: 'params.showProfit',
                cost: {
                    costType: 'ConstantMarginalCost',
                    costDef: {
                        quantityDraggable: true,
                        fixedCost: 0,
                        c: definition.c1
                    }
                },
                demand: {
                    demandType: 'LinearDemand',
                    demandDef: {
                        elasticityMethod: 'point',
                        quantity: definition.q1,
                        quantityDrag: definition.q1,
                        type: 'Linear',
                        quantityLabel: '1',
                        def: {
                            slope: cournot.modelProperty('marketDemand.demandFunction.slope'),
                            intercept: cournot.modelProperty('residualDemand1Intercept')
                        }
                    }
                }
            }, cournot.modelProperty('firm1'));
            cournot.firm2 = new EconGraphs.Monopoly({
                quantity: definition.q2,
                snapToOptimalQuantity: definition.snapToOptimal2,
                showProfit: 'params.showProfit',
                cost: {
                    costType: 'ConstantMarginalCost',
                    costDef: {
                        quantityDraggable: true,
                        fixedCost: 0,
                        c: definition.c2
                    }
                },
                demand: {
                    demandType: 'LinearDemand',
                    demandDef: {
                        elasticityMethod: 'point',
                        quantity: cournot.modelProperty('firm2.quantity'),
                        quantityDrag: definition.q2,
                        type: 'Linear',
                        def: {
                            slope: cournot.modelProperty('marketDemand.demandFunction.slope'),
                            intercept: cournot.modelProperty('residualDemand2Intercept')
                        }
                    }
                }
            }, cournot.modelProperty('firm2'));
        }
        CournotDuopoly.prototype.residualDemandIntercept = function (otherQuantity) {
            return this.marketDemand.priceAtQuantity(otherQuantity);
        };
        CournotDuopoly.prototype._update = function (scope) {
            var cournot = this;
            cournot.marketDemand.update(scope);
            cournot.residualDemand1Intercept = cournot.residualDemandIntercept(cournot.firm2.quantity);
            cournot.residualDemand2Intercept = cournot.residualDemandIntercept(cournot.firm1.quantity);
            cournot.firm1.update(scope);
            cournot.firm2.update(scope);
            cournot.firm1.update(scope);
            cournot.firm2.update(scope);
            cournot.marketDemand.update(scope);
            cournot.marketDemand.quantity = cournot.firm1.quantity + cournot.firm2.quantity;
            cournot.marketDemand.price = cournot.marketDemand.priceAtQuantity(cournot.marketDemand.quantity);
            return cournot;
        };
        return CournotDuopoly;
    })(KG.Model);
    EconGraphs.CournotDuopoly = CournotDuopoly;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../../eg.ts"/>
'use strict';
var EconGraphs;
(function (EconGraphs) {
    var RamseyCassKoopmans = (function (_super) {
        __extends(RamseyCassKoopmans, _super);
        function RamseyCassKoopmans(definition, modelPath) {
            _super.call(this, definition, modelPath);
            this.steadyCapital = new KGMath.Functions.Polynomial({ termDefs: [
                {
                    coefficient: 1,
                    powers: ['params.alpha']
                },
                {
                    coefficient: '-(params.delta + params.n + params.g)',
                    powers: [1]
                }
            ] });
            this.steadyCapitalView = new KG.FunctionPlot({
                name: 'steadyCapital',
                fn: this.modelProperty('steadyCapital'),
                className: 'capital',
                numSamplePoints: 201,
                label: {
                    text: '\\dot k = 0'
                }
            });
            this.steadyConsumptionView = new KG.VerticalLine({
                name: 'steadyConsumption',
                className: 'consumption',
                x: this.modelProperty('steadyStateK'),
                label: {
                    text: '\\dot c = 0'
                }
            });
            this.steadyStateView = new KG.Point({
                name: 'steadyStatePoint',
                coordinates: {
                    x: this.modelProperty('steadyStateK'),
                    y: this.modelProperty('steadyStateC')
                },
                symbol: 'cross',
                size: 100,
                label: {
                    text: 'S',
                    align: 'right',
                    valign: 'bottom',
                    color: 'grey'
                }
            });
            this.initialPoint = new KG.Point({
                name: 'initialPoint',
                coordinates: {
                    x: 'params.initialK',
                    y: 'params.initialC'
                },
                className: 'growth',
                size: 500,
                label: {
                    text: 'O'
                },
                xDrag: true,
                yDrag: true
            });
            this.growthPathView = new KG.LinePlot({
                name: 'growthPath',
                data: this.modelProperty('growthPath'),
                className: 'growth',
                arrows: 'END'
            });
            this.balancedGrowthPathView = new KG.LinePlot({
                name: 'balancedGrowthPath',
                data: this.modelProperty('balancedGrowthPath'),
                className: 'growth dashed',
                interpolation: 'basis'
            });
        }
        RamseyCassKoopmans.prototype._update = function (scope) {
            var model = this;
            model.steadyCapital.update(scope);
            model.steadyStateK = Math.pow((model.delta + model.rho + model.theta * model.g) / model.alpha, (1 / (model.alpha - 1)));
            model.steadyStateC = model.steadyCapital.yValue(model.steadyStateK);
            model.growthPath = model.dynamicPath(model.initialK, model.initialC);
            model.balancedGrowthPath = model.generateBalancedGrowthPathData();
            model.positiveConsumption = (model.steadyStateC >= 0);
            model.steadyStateOnGraph = (model.steadyStateK <= model.kMax) && (model.steadyStateC <= model.cMax);
            return model;
        };
        RamseyCassKoopmans.prototype.y = function (k) {
            var model = this;
            return Math.pow(k, model.alpha); // y = f(k) = k^alpha
        };
        RamseyCassKoopmans.prototype.r = function (k) {
            var model = this;
            return model.alpha * Math.pow(k, model.alpha - 1) - model.delta; // interest rate = f'(k) - delta
        };
        RamseyCassKoopmans.prototype.kdot = function (k, c) {
            var model = this;
            return model.y(k) - c - (model.n + model.g + model.delta) * k;
        };
        RamseyCassKoopmans.prototype.cdot = function (k, c) {
            var model = this;
            return (model.r(k) - model.rho - model.theta * model.g) * c / model.theta;
        };
        RamseyCassKoopmans.prototype.normalizedNextPoint = function (k, c, distance) {
            var model = this;
            var kdot = model.kdot(k, c), cdot = model.cdot(k, c);
            // normalize to smooth curve
            var vectorLength = Math.sqrt(kdot * kdot + cdot * cdot), deltaK = distance * kdot / vectorLength, deltaC = distance * cdot / vectorLength;
            return { k: k + deltaK, c: c + deltaC };
        };
        RamseyCassKoopmans.prototype.generateBalancedGrowthPathData = function () {
            var model = this;
            function tendsToZeroCapital(testK, testC) {
                var iterations = 0;
                while (model.cdot(testK, testC) * model.kdot(testK, testC) > 0 && iterations < 10000) {
                    var next = model.normalizedNextPoint(testK, testC, model.cMax * model.kMax / 100);
                    testK = next.k;
                    testC = next.c;
                    iterations++;
                }
                // once it's no longer heading NW or SE, return true if it's heading N or false if it's heading S
                return (model.cdot(testK, testC) > 0 || model.kdot(testK, testC) < 0);
            }
            var points = [{ x: 0, y: 0 }];
            var k = 0, c = 0;
            var edgeNotReached = true, kIncrement = model.kMax * 0.002, cIncrement = model.cMax * 0.002;
            while (edgeNotReached) {
                k = k + kIncrement;
                while (!tendsToZeroCapital(k, c) && c < model.cMax) {
                    c += cIncrement;
                }
                if (c < model.cMax) {
                    points.push({ x: k, y: c });
                }
                else {
                    c = model.cMax;
                    k = k - kIncrement;
                    while (tendsToZeroCapital(k, c) && k < model.kMax) {
                        k += kIncrement * 0.1;
                    }
                    points.push({ x: k, y: c });
                    edgeNotReached = false;
                }
                if (k >= model.kMax) {
                    edgeNotReached = false;
                }
            }
            return points;
        };
        RamseyCassKoopmans.prototype.dynamicPath = function (k, c) {
            var model = this;
            var points = [{ x: k, y: c }];
            var steadyStateAchieved = false, zeroConsumption = false, zeroCapital = false;
            var iterations = 0;
            while (!steadyStateAchieved && !zeroConsumption && !zeroCapital && iterations < 10000) {
                iterations++;
                var next = model.normalizedNextPoint(k, c, 0.005);
                if (next.k < 0) {
                    zeroCapital = true;
                }
                else if (next.c < 0) {
                    zeroConsumption = true;
                }
                else if (KG.isAlmostTo(next.k, model.steadyStateK, 0.05) && KG.isAlmostTo(next.c, model.steadyStateC, 0.05)) {
                    points.push({ x: model.steadyStateK, y: model.steadyStateC });
                    steadyStateAchieved = true;
                }
                else {
                    k = next.k;
                    c = next.c;
                    points.push({ x: k, y: c });
                }
            }
            return points;
        };
        return RamseyCassKoopmans;
    })(KG.Model);
    EconGraphs.RamseyCassKoopmans = RamseyCassKoopmans;
})(EconGraphs || (EconGraphs = {}));
/// <reference path="../kg.ts"/>
/* Basic concepts */
/// <reference path="basic_concepts/elasticity/elasticity.ts"/>
/// <reference path="basic_concepts/elasticity/midpoint.ts"/>
/// <reference path="basic_concepts/elasticity/point.ts"/>
/// <reference path="basic_concepts/elasticity/constant.ts"/>
/* MICRO */
/* Supply and Demand */
/// <reference path="micro/supply_and_demand/market_demand/demand.ts"/>
/// <reference path="micro/supply_and_demand/market_demand/linearDemand.ts"/>
/// <reference path="micro/supply_and_demand/market_demand/constantElasticityDemand.ts"/>
/* Consumer Theory */
/// <reference path="micro/consumer_theory/constraints/budgetConstraint.ts"/>
/// <reference path="micro/consumer_theory/constraints/budgetSegment.ts"/>
/// <reference path="micro/consumer_theory/constraints/simpleBudgetConstraint.ts"/>
/// <reference path="micro/consumer_theory/constraints/endowmentBudgetConstraint.ts"/>
/// <reference path="micro/consumer_theory/constraints/utilityConstraint.ts"/>
/// <reference path="micro/consumer_theory/utility/utility.ts"/>
/// <reference path="micro/consumer_theory/utility/oneGoodUtility.ts"/>
/// <reference path="micro/consumer_theory/utility/crra.ts"/>
/// <reference path="micro/consumer_theory/utility/riskAversion.ts"/>
/// <reference path="micro/consumer_theory/utility/utilityRedistribution.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/twoGoodUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/cobbDouglasUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/complementsUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/substitutesUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/cesUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/quasilinearUtility.ts"/>
/// <reference path="micro/consumer_theory/demand/utilityDemand.ts"/>
/// <reference path="micro/consumer_theory/demand/marshallianDemand.ts"/>
/// <reference path="micro/consumer_theory/demand/hicksianDemand.ts"/>
/* Producer Theory */
/// <reference path="micro/producer_theory/costs/productionCost.ts"/>
/// <reference path="micro/producer_theory/costs/linearMarginalCost.ts"/>
/// <reference path="micro/producer_theory/costs/constantMarginalCost.ts"/>
/// <reference path="micro/producer_theory/costs/quadraticMarginalCost.ts"/>
/* Market Structures */
/// <reference path="micro/market_structures/monopoly/monopoly.ts"/>
/// <reference path="micro/market_structures/oligopoly/cournotDuopoly.ts"/>
/* Macro */
/// <reference path="macro/growth/ramseyCassKoopmans.ts"/> 
/**
 * Created by cmakler on 9/10/15.
 */
var PhysicsGraphs;
(function (PhysicsGraphs) {
    var Acceleration = (function (_super) {
        __extends(Acceleration, _super);
        function Acceleration(definition, modelPath) {
            _super.call(this, definition, modelPath);
            var model = this;
            /*
            model.accelerationFunction = new KGMath.Functions.HorizontalLine({y: definition.acceleration});
            model.velocityFunction = model.accelerationFunction.integral(0,definition.initialVelocity);
            model.positionFunction = model.velocityFunction.integral(0,definition.initialPosition,'positionFunction');
            */
            model.positionFunction = new KGMath.Functions.Quadratic({
                coefficients: {
                    a: definition.acceleration,
                    b: definition.initialVelocity,
                    c: definition.initialPosition
                }
            }, model.modelProperty('positionFunction'));
            model.velocityFunction = model.positionFunction.derivative();
            model.accelerationFunction = model.velocityFunction.derivative();
            model.accelerationView = new KG.HorizontalLine({
                name: 'accelerationView',
                className: 'growth',
                y: definition.acceleration
            });
            model.velocityView = new KG.Line({
                name: 'velocityView',
                className: 'totalCost',
                lineDef: model.velocityFunction.definition
            });
            model.positionView = new KG.FunctionPlot({
                name: 'positionView',
                className: 'growth',
                fn: model.modelProperty('positionFunction')
            });
            model.initialPositionPoint = new KG.Point({
                name: 'initialPositionPoint',
                className: 'growth',
                coordinates: {
                    x: 0,
                    y: definition.initialPosition
                },
                yDrag: definition.initialPosition,
                label: {
                    text: 'x_0'
                }
            });
            model.initialVelocityPoint = new KG.Point({
                name: 'initialVelocityPoint',
                className: 'totalCost',
                coordinates: {
                    x: 0,
                    y: definition.initialVelocity
                },
                yDrag: definition.initialVelocity,
                label: {
                    text: 'v_0'
                }
            });
            model.positionVertexPoint = new KG.Point({
                name: 'positionVertexPoint',
                className: 'growth',
                coordinates: {
                    x: model.positionFunction.definition.vertex.x,
                    y: model.positionFunction.definition.vertex.y
                },
                droplines: {
                    vertical: "x"
                }
            });
            model.zeroVelocityLine = new KG.HorizontalLine({ y: 0, name: 'zeroVelocity', className: 'dotted totalCost' });
        }
        return Acceleration;
    })(KG.Model);
    PhysicsGraphs.Acceleration = Acceleration;
})(PhysicsGraphs || (PhysicsGraphs = {}));
/// <reference path="../kg.ts"/>
/// <reference path="movement/acceleration.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="../bower_components/dt-d3/d3.d.ts"/>
/// <reference path="constants.ts" />
/// <reference path="helpers/helpers.ts" />
/// <reference path="helpers/definitions.ts" />
/// <reference path="model.ts" />
/// <reference path="helpers/domain.ts" />
/// <reference path="restriction.ts" />
/// <reference path="helpers/selector.ts" />
/// <reference path="math/math.ts" />
/// <reference path="viewObjects/viewObject.ts"/>
/// <reference path="viewObjects/viewObjectGroup.ts"/>
/// <reference path="viewObjects/point.ts"/>
/// <reference path="viewObjects/dropline.ts"/>
/// <reference path="viewObjects/curve.ts"/>
/// <reference path="viewObjects/segment.ts"/>
/// <reference path="viewObjects/arrow.ts"/>
/// <reference path="viewObjects/line.ts"/>
/// <reference path="viewObjects/piecewiseLinear.ts"/>
/// <reference path="viewObjects/graphDiv.ts"/>
/// <reference path="viewObjects/linePlot.ts"/>
/// <reference path="viewObjects/pathFamily.ts"/>
/// <reference path="viewObjects/functionPlot.ts"/>
/// <reference path="viewObjects/functionMap.ts"/>
/// <reference path="viewObjects/area.ts"/>
/// <reference path="view.ts" />
/// <reference path="views/axis.ts" />
/// <reference path="views/graph.ts" />
/// <reference path="views/twoVerticalGraphs.ts" />
/// <reference path="views/slider.ts" />
/// <reference path="controller.ts" />
/// <reference path="sample/sample.ts" />
/// <reference path="finance/fg.ts" />
/// <reference path="econ/eg.ts" />
/// <reference path="physics/pg.ts"/>
'use strict';
angular.module('KineticGraphs', []).controller('KineticGraphCtrl', ['$scope', '$interpolate', '$window', KG.Controller]).filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '\\%';
    };
}]).filter('extendedReal', ['$filter', function ($filter) {
    return function (input, decimals) {
        if (input == Infinity) {
            return '\\infty';
        }
        else if (input == -Infinity) {
            return '-\\infty';
        }
        else
            return $filter('number')(input, decimals);
    };
}]).directive('toggle', function () {
    function link(scope, el, attrs) {
        scope.toggle = function () {
            scope.params[attrs.param] = !scope.params[attrs.param];
        };
    }
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        transclude: true,
        template: "<button ng-click='toggle()' style='width: 100%'><span ng-transclude/></button>"
    };
});
//# sourceMappingURL=kinetic-graphs.js.map