/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface UtilityDemandCurveParams extends KG.DomainSamplePointsDef {
        good: string;
    }

    export interface UtilityDemandDefinition extends KG.ModelDefinition
    {
        x?: any;
        y?: any;
        utility: {type: string; definition: TwoGoodUtilityDefinition};
        snapToOptimalBundle?: any;
    }

    export interface IUtilityDemand extends KG.IModel
    {
        utility: TwoGoodUtility;
        utilitySelector: KG.Selector;

        x: number;
        y: number;
        bundle: TwoGoodBundle;

        quantityAtPrice: (price:number, good?: string) => number;
        demandCurveData: (demandParams: UtilityDemandCurveParams) => KG.ICoordinates[];

        price: (good?: string) => number; // current price of good x or good y
        snapToOptimalBundle: boolean;
    }

    export class UtilityDemand extends KG.Model implements IUtilityDemand
    {
        public utility;
        public utilitySelector;
        public x;
        public y;
        public bundle;
        public optimalBundle;
        public snapToOptimalBundle;

        constructor(definition:UtilityDemandDefinition,modelPath?:string) {

            super(definition,modelPath);
        }

        price(good?) {
            return 0; // overridden by subclass
        }

        quantityAtPrice(price:number, good?:string) {
            return 0; // overridden by subclass
        }

        otherQuantityAtPrice(price:number, good?:string) {
            return 0; // overridden by subclass
        }

        demandCurveData(demandParams) {

            demandParams = _.defaults(demandParams || {}, {
                good: 'x',
                min: 1,
                max: 50,
                numSamplePoints: 101
            });

            var d = this,
                curveData = [],
                relevantDemandParams = _.clone(demandParams);

            if(d.utility instanceof SubstitutesUtility || (d.utility instanceof CESUtility && d.utility.r == 1)) {
                // set new maximum to critical price ratio, if that's on the graph
                relevantDemandParams.max = (demandParams.good == 'x') ? d.utility.criticalPriceRatio * d.price('y') : d.price('x')/d.utility.criticalPriceRatio;

                if(relevantDemandParams.max < demandParams.max) {
                    curveData.push({x: 0, y: demandParams.max});
                    curveData.push({x: 0, y: relevantDemandParams.max});
                    if(d.hasOwnProperty('budget')) {
                        curveData.push({x: d['budget']['income']/relevantDemandParams.max,y: relevantDemandParams.max});
                    }
                }
                else {
                    relevantDemandParams.max = demandParams.max;
                }

            }

            var samplePoints = KG.samplePointsForDomain(relevantDemandParams).reverse();


            samplePoints.forEach(function(price) {
                curveData.push({x: d.quantityAtPrice(price, demandParams.good), y: price});
            });

            return curveData.sort(KG.sortObjects('x'));

        }

    }

}