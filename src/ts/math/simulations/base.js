var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var KGMath;
(function (KGMath) {
    var Simulations;
    (function (Simulations) {
        number[];
        draws: number[];
        sumDraws: number[];
    })(Simulations = KGMath.Simulations || (KGMath.Simulations = {}));
})(KGMath || (KGMath = {}));
var Base = (function (_super) {
    __extends(Base, _super);
    function Base(definition, modelPath) {
        definition = _.defaults(definition, {
            numDraws: 1,
            distribution: { type: 'KGMath.Distributions.Normal', definition: {} }
        });
        _super.call(this, definition, modelPath);
        this.newDraw(definition.numDraws);
    }
    // Returns the slope between (a,f(a)) and (b,f(b)).
    // If inverse = true, returns the slope between (f(a),a) and (f(b),b).
    // Assumes that a and b are both scalars (for now).
    Base.prototype.newDraw = function (numDraws) {
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
    Base.prototype.points = function (view, yIsIndependent, numSamplePoints, xDomain, yDomain) {
        var fn = this, points = [];
        numSamplePoints = numSamplePoints || 51;
        var xSamplePoints = view.xAxis.domain.intersection(xDomain).samplePoints(numSamplePoints), ySamplePoints = view.yAxis.domain.intersection(yDomain).samplePoints(numSamplePoints);
        if (fn.univariate && yIsIndependent) {
            for (var i = 0; i < numSamplePoints; i++) {
                var y = ySamplePoints[i];
                var xOfY = fn.value(y);
                if (xOfY && !isNaN(xOfY) && xOfY != Infinity) {
                    points.push({ x: xOfY, y: y });
                }
            }
            return points;
        }
        else {
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
        }
    };
    return Base;
})(KG.Model);
exports.Base = Base;
//# sourceMappingURL=base.js.map