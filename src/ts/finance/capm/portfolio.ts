/// <reference path="../fg.ts"/>

'use strict';

// numeric lacks a definitions file for now; need to add this to make Typescript happy
declare var numeric: any;

module FinanceGraphs
{
    export interface PortfolioDefinition extends KG.ModelDefinition
    {
        asset1: any;
        asset2: any;
        asset3: any;
        riskFree: any;
        rho12: any;
        rho23: any;
        rho13: any;
        maxLeverage: any;
    }

    export interface IPortfolio extends KG.IModel
    {
        asset1: Asset;
        asset2: Asset;
        asset3: Asset;
        riskFree: any;
        rho12: number;
        rho23: number;
        rho13: number;
        maxLeverage: number;
        twoAssetData: KG.ICoordinates[][];
        threeAssetData: KG.ICoordinates[][];
        correlationMatrix: number[][];
        covarianceMatrix: number[][];
        positiveDefinite: boolean;
        optimalPortfolioMean: number;
        optimalPortfolioStDev: number;
        optimalPortfolioWeightArray;
        riskFreeReturn: number;
        riskReturnSlope: number;
    }

    export class Portfolio extends KG.Model implements IPortfolio {

        public asset1;
        public asset2;
        public asset3;
        public rho12;
        public rho23;
        public rho13;
        public riskFree;
        private assets;
        public maxLeverage;
        public correlationMatrix;
        public covarianceMatrix;
        public twoAssetData;
        public threeAssetData;
        public riskFreeAsset;
        public optimalPortfolioMean;
        public optimalPortfolioStDev;
        public optimalPortfolioWeightArray;
        public riskFreeReturn;
        public riskReturnSlope;
        public positiveDefinite;

        constructor(definition:PortfolioDefinition, modelPath?: string) {
            super(definition, modelPath);
            var p = this;
            p.assets = [p.asset1, p.asset2, p.asset3];
            p.optimalPortfolioMean = 0;
            p.optimalPortfolioStDev = 0.5;
            p.riskReturnSlope = 0;
        }

        _update(scope) {
            var p = this;

            function correlation(i,j) {
                if(i==j) {
                    return 1;
                } else if(i>j){
                    return correlation(j,i)
                } else {
                    return p['rho' + (i + 1) + (j + 1)]
                }
            }

            function calculateCorrelationMatrix() {
                var matrix = [];
                for(var i=0;i<p.assets.length;i++) {
                    var matrixRow = [];
                    for(var j=0;j<p.assets.length;j++) {
                        matrixRow.push(correlation(i,j));
                    }
                    matrix.push(matrixRow);
                }
                p.correlationMatrix = matrix;
                return matrix;
            }

            function calculateCovarianceMatrix() {
                var matrix = calculateCorrelationMatrix().map(function(correlationMatrixRow, i) {
                    return correlationMatrixRow.map(function(correlationMatrixCell,j){
                        return correlationMatrixCell*p.stDevArray()[i]*p.stDevArray()[j];
                    })
                });
                p.covarianceMatrix = matrix;
                return matrix;
            }

            function checkPositiveDefinite() {
                p.positiveDefinite = true;
                var eigenvalues = numeric.eig(calculateCovarianceMatrix()).lambda.x;
                eigenvalues.forEach(function(e){if(e<0) { p.positiveDefinite = false;}})
                return p.positiveDefinite;
            }

            if(checkPositiveDefinite()){
                p.twoAssetData = p.data2();
                p.threeAssetData = p.data3();
            }

            return p;
        }

        meanArray() {
            return this.assets.map(function(asset) {return asset.mean});
        }

        stDevArray() {
            return this.assets.map(function(asset) {return asset.stDev});
        }

        mean(weightArray) {
            return numeric.dot(this.meanArray(), weightArray);
        }

        stDev(weightArray) {
            var variance = numeric.dot(weightArray,numeric.dot(this.covarianceMatrix,weightArray));
            if(variance >= 0) {
                return Math.sqrt(variance);
            } else {
                console.log('oops! getting a negative variance with weights ',weightArray[0],',',weightArray[1],',',weightArray[2],'!');
                return 0;
            }
        }

        // Generate dataset of portfolio means and variances for various weights of two assets
        data2() {
            var portfolio = this, maxLeverage = portfolio.maxLeverage, d = [];
            d.push(portfolio.twoAssetPortfolio(1,2,[0,0,0]));
            d.push(portfolio.twoAssetPortfolio(0,2,[0,0,0]));
            d.push(portfolio.twoAssetPortfolio(0,1,[0,0,0]));
            return d;
        }


        // Generate dataset of portfolio means and variances for various weights of all three assets
        data3() {
            var portfolio = this, maxLeverage = portfolio.maxLeverage, d = [], w;
            portfolio.riskReturnSlope = 0;
            var min = -maxLeverage*0.01, max = 1 + maxLeverage*0.01, dataPoints = 10 + maxLeverage*0.2;
            for(var i=0; i<dataPoints + 2; i++) //w1 is weight of asset 1;
            {
                w = min + i*(max - min)/dataPoints;
                d.push(portfolio.twoAssetPortfolio(1,2,[w,0,0]));
                d.push(portfolio.twoAssetPortfolio(0,2,[0,w,0]));
                d.push(portfolio.twoAssetPortfolio(0,1,[0,0,w]));
            }
            return d;
        }

        // Generate lines representing combinations of two assets
        twoAssetPortfolio(asset1,asset2,weightArray) {
            var portfolio = this, maxLeverage = portfolio.maxLeverage, d=[], otherAssets = 0;
            weightArray.forEach(function(w) {otherAssets += w});
            var min = -maxLeverage*0.01, max = 1 + maxLeverage*0.01, dataPoints = 2*(10 + maxLeverage*0.2);
            var colorScale = d3.scale.linear().domain([0,1]).range(["red","blue"])
            for(var i=0; i<dataPoints + 1; i++) //w1 is weight of asset 1;
            {
                weightArray[asset1] = min + i*(max - min)/dataPoints;
                weightArray[asset2] = 1 - weightArray[asset1] - otherAssets;
                if(weightArray[asset2] >= min) {
                    var s = portfolio.stDev(weightArray),
                        m = portfolio.mean(weightArray);
                    d.push({
                        x: s,
                        y: m,
                        color: colorScale(weightArray[asset1]),
                        weights: weightArray
                    });
                    if(s > 0){
                        var slope = (m - portfolio.riskFreeReturn)/s;
                        if(slope > portfolio.riskReturnSlope) {
                            portfolio.optimalPortfolioMean = m;
                            portfolio.optimalPortfolioStDev = s;
                            portfolio.riskReturnSlope = slope;
                            portfolio.optimalPortfolioWeightArray = _.clone(weightArray);
                        }
                    }
                }
            }
            return d;
        }

    }
}