/// <reference path="../fg.ts"/>
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FinanceGraphs;
(function (FinanceGraphs) {
    number[][];
    covarianceMatrix: number[][];
    positiveDefinite: boolean;
    optimalPortfolio;
    optimalPortfolioMean;
    optimalPortfolioStDef;
    optimalPortfolioWightArray;
    riskFreeReturn;
    riskReturnSlope: ;
})(FinanceGraphs || (FinanceGraphs = {}));
var Portfolio = (function (_super) {
    __extends(Portfolio, _super);
    function Portfolio(definition, modelPath) {
        _super.call(this, definition, modelPath);
        var p = this;
        p.assets = [p.asset1, p.asset2, p.asset3];
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
            eigenvalues.forEach(function (e) { if (e < 0) {
                p.positiveDefinite = false;
            } });
            return p.positiveDefinite;
        }
        if (checkPositiveDefinite()) {
            p.twoAssetData = p.data2();
            p.threeAssetData = p.data3();
        }
        return p;
    };
    Portfolio.prototype.meanArray = function () {
        return this.assets.map(function (asset) { return asset.mean; });
    };
    Portfolio.prototype.stDevArray = function () {
        return this.assets.map(function (asset) { return asset.stDev; });
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
        weightArray.forEach(function (w) { otherAssets += w; });
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
exports.Portfolio = Portfolio;
//# sourceMappingURL=portfolio.js.map