/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface UtilityDemandCurveParams extends KG.DomainSamplePointsDef {
        good: string;
    }

    export interface UtilityDemandDefinition extends KG.ModelDefinition
    {
        utility: {type: string; definition: TwoGoodUtilityDefinition};
    }

    export interface IUtilityDemand extends KG.IModel
    {
        utility: TwoGoodUtility;
        utilitySelector: KG.Selector;

        quantityAtPrice: (price:number, good?: string) => number;
        demandCurveData: (demandParams: UtilityDemandCurveParams) => KG.ICoordinates[];

        price: (good?: string) => number; // current price of good x or good y
    }

    export class UtilityDemand extends KG.Model implements IUtilityDemand
    {
        public utility;
        public utilitySelector;
        public optimalBundle;

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

        quantityAtPricePoint(price, priceParams, pointParams) {
            var d = this;

            priceParams = _.defaults(priceParams,{
                good: 'x'
            });

            var quantityProperty = 'quantityAtPrice(' + price + ',"' + priceParams.good + '")';

            return new KG.Point({
                name: 'q'+priceParams.good + 'd',
                className: 'demand',
                coordinates: {
                    x: d.modelProperty(quantityProperty),
                    y: price
                },
                params: pointParams
            })
        }

        quantitiesAtPriceSegment(price, segmentParams) {
            var d = this;

            segmentParams = _.defaults(segmentParams,{
                good: 'x'
            });

            var quantityProperty = 'quantityAtPrice(' + price + ',' + segmentParams.good + ')';
            var otherQuantityProperty = 'otherQuantityAtPrice(' + price + ',' + segmentParams.good + ')';

            return new KG.Segment({
                name: 'q'+segmentParams.good + 'dSegment',
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
            })

        }

        demandCurveData(demandParams) {

            demandParams = _.defaults(demandParams, {
                good: 'x',
                min: 1,
                max: 50,
                numSamplePoints: 101
            });

            var d = this,
                curveData = [],
                relevantDemandParams = _.clone(demandParams);

            if(d.utility instanceof SubstitutesUtility) {
                curveData.push({x: 0, y: demandParams.max});
                // get other price from specific demand function

                // set new maximum to critical price ratio
                relevantDemandParams.max = (demandParams.good == 'x') ? d.utility.criticalPriceRatio * d.price('y') : d.price('x')/d.utility.criticalPriceRatio;
                curveData.push({x: 0, y: relevantDemandParams.max});
            }

            var samplePoints = KG.samplePointsForDomain(relevantDemandParams).reverse();


            samplePoints.forEach(function(price) {
                curveData.push({x: d.quantityAtPrice(price, demandParams.good), y: price});
            });

            return curveData.sort(KG.sortObjects('x'));

        }

    }

}