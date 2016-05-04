/*
 A linear function is a special polynomial defined either with two points or a point and a slope.
 This function takes either of those and returns a polynomial of the form ax + by + c.
 The params object is of the form: { definitionType: '', param1: foo, param2: bar }
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                this.quadraticIntersection = function (otherQuadratic, delta) {
                    var thisLine = this;
                    delta = delta || 0;
                    var a = thisLine.coefficients.a, b = thisLine.coefficients.b, c = thisLine.coefficients.c, oa = otherQuadratic.coefficients.a, ob = otherQuadratic.coefficients.b, oc = otherQuadratic.coefficients.c;
                    var diffQuadratic = new Quadratic({
                        coefficients: {
                            a: oa,
                            b: ob + a / b,
                            c: oc + c / b
                        } });
                };
                var l = this;
                if (!definition.hasOwnProperty('coefficients')) {
                    definition.coefficients = { a: 0, b: -1, c: 0 };
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
            }
            Linear.prototype._update = function (scope) {
                var l = this;
                if (l.xDomain) {
                    l.xDomain.update(scope);
                }
                if (l.yDomain) {
                    l.yDomain.update(scope);
                }
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
                        slope: m.definition.y,
                        intercept: c
                    }, name);
                }
                else {
                    return new Quadratic({
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
                return new Polynomial({
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
                l = l.updateLine();
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
        })(Base);
        Functions.Linear = Linear;
    })(Functions = KGMath.Functions || (KGMath.Functions = {}));
})(KGMath || (KGMath = {}));
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
exports.HorizontalLine = HorizontalLine;
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
exports.VerticalLine = VerticalLine;
//# sourceMappingURL=linear.js.map