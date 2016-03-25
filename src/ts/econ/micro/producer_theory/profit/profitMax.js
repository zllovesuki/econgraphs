/// <reference path="../../../eg.ts"/>
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EconGraphs;
(function (EconGraphs) {
    KGMath.Functions.Base;
    perfectCompetition: boolean;
})(EconGraphs || (EconGraphs = {}));
var ProfitMax = (function (_super) {
    __extends(ProfitMax, _super);
    function ProfitMax(definition, modelPath) {
        definition.perfectCompetition = !!definition.perfectCompetition;
        _super.call(this, definition, modelPath);
    }
    ProfitMax.prototype._update = function (scope) {
        var pm = this;
        var marginalCost = pm.costFunction.marginalCostFunction.update(scope);
        if (pm.perfectCompetition) {
            pm.optimalQuantity = marginalCost.xValue(pm.price);
        }
        else {
            var marginalRevenue = pm.demandFunction.marginalRevenue.update(scope);
            if (marginalCost instanceof KGMath.Functions.Linear) {
                pm.optimalQuantity = marginalRevenue.linearIntersection(marginalCost).x;
            }
            else if (marginalCost instanceof KGMath.Functions.Quadratic) {
                pm.optimalQuantity = marginalRevenue.quadraticIntersection(marginalCost).x;
            }
        }
        if (pm.snapToOptimal) {
            pm.quantity = pm.optimalQuantity;
        }
        pm.costFunction.quantity = pm.quantity;
        pm.demandFunction.quantity = pm.quantity;
        pm.price = pm.demandFunction.priceAtQuantity(pm.quantity);
        return pm;
    };
    ProfitMax.prototype.profit = function (quantity) {
        quantity = quantity || this.quantity;
        return this.demandFunction.totalRevenueAtQuantity(quantity) - this.costFunction.tc(quantity);
    };
    ProfitMax.prototype.profitIsPositive = function (quantity) {
        return (this.profit(quantity) >= 0);
    };
    ProfitMax.prototype.profitWord = function (quantity) {
        return this.profitIsPositive(quantity) ? 'profit' : 'loss';
    };
    ProfitMax.prototype.profitAreaCoordinates = function (quantity) {
        var pm = this;
        quantity = quantity || pm.quantity;
        var atc = pm.costFunction.atc(quantity), price = pm.price;
        return [
            { x: 0, y: atc },
            { x: 0, y: price },
            { x: quantity, y: price },
            { x: quantity, y: atc }
        ];
    };
    return ProfitMax;
})(KG.Model);
exports.ProfitMax = ProfitMax;
//# sourceMappingURL=profitMax.js.map