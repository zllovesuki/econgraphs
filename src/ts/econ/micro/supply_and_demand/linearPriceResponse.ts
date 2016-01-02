/// <reference path="../../eg.ts"/>

module EconGraphs {

    export interface LinearPriceResponseDefinition extends PriceResponseDefinition
    {
        quantityIntercept?: any;
        priceIntercept?: any;
        slope?: any; //note the slope is dQ/dP, even though the linear function is defined as if Q were on the X axis.
        referenceQuantity?: any;
        referencePrice?: any;
        referenceQuantity2?: any;
        referencePrice2?: any;
    }

    export interface ILinearPriceResponse extends IPriceResponse
    {
        priceResponseFunction: KGMath.Functions.Linear;
        marginalDollarAmount: KGMath.Functions.Linear;
        totalDollarAmount: KGMath.Functions.Quadratic;
        quantityIntercept: number;
        priceIntercept: number;
        slope: number;
        perfectlyElastic: boolean;
        perfectlyInelastic: boolean;
    }

    export class LinearPriceResponse extends PriceResponse implements ILinearPriceResponse
    {

        public quantityIntercept;
        public priceIntercept;
        public slope;
        public totalDollarAmount;
        public marginalDollarAmount;
        public perfectlyElastic;
        public perfectlyInelastic;

        constructor(definition:LinearPriceResponseDefinition, modelPath?:string) {

            definition.type = 'Linear';

            /* The purpose of this initial section is to define the linear function, which can be done a number of ways, and to ensure definitions exist for price intercept, quantity intercept, and slope. */

            // If the function is defined using a quantity intercept and slope, initiate using those and calculate price intercept (which may not exist for perfectly inelastic demand/supply)
            if(definition.hasOwnProperty('quantityIntercept') && definition.hasOwnProperty('slope')) {
                definition.def = {
                    point: {
                        x: definition.quantityIntercept,
                        y: 0
                    },
                    slope: KG.divideDefs(1,definition.slope)
                };
                if(definition.slope !== 0) {
                    definition.priceIntercept = KG.multiplyDefs(-1,KG.multiplyDefs(definition.quantityIntercept,definition.slope));
                }

            }

            // If the function is defined using a quantity intercept and price intercept, initiate using two those points and calculate the slope
            else if(definition.hasOwnProperty('quantityIntercept') && definition.hasOwnProperty('priceIntercept')) {
                definition.def = {
                    point1: {
                        x: definition.quantityIntercept,
                        y: 0
                    },
                    point2: {
                        x: 0,
                        y: definition.priceIntercept
                    }
                };
                definition.slope = KG.multiplyDefs(-1,KG.divideDefs(definition.quantityIntercept,definition.priceIntercept))
            }

            // If the function is defined using an arbitrary point and price intercept, initiate using those two points and calculate the slope
            else if(definition.hasOwnProperty('referenceQuantity') && definition.hasOwnProperty('referencePrice') && definition.hasOwnProperty('priceIntercept')) {
                definition.def = {
                    point1: {
                        x: definition.referenceQuantity,
                        y: definition.referencePrice
                    },
                    point2: {
                        x: 0,
                        y: definition.priceIntercept
                    }
                };

                definition.slope = KG.divideDefs(definition.referenceQuantity,KG.subtractDefs(definition.referencePrice,definition.priceIntercept));
            }

            // If the function is defined using an arbitrary point and quantity intercept, initiate using those two points and calculate the slope
            else if(definition.hasOwnProperty('referenceQuantity') && definition.hasOwnProperty('referencePrice') && definition.hasOwnProperty('priceIntercept')) {
                definition.def = {
                    point1: {
                        x: definition.referenceQuantity,
                        y: definition.referencePrice
                    },
                    point2: {
                        x: definition.quantityIntercept,
                        y: 0
                    }
                };
                definition.slope = KG.divideDefs(KG.subtractDefs(definition.referenceQuantity,definition.quantityIntercept),definition.referencePrice);
            }

            // If the function is defined using two arbitrary points initiate using those two points and calculate the slope
            else if(definition.hasOwnProperty('referenceQuantity') && definition.hasOwnProperty('referencePrice') && definition.hasOwnProperty('priceIntercept')) {
                definition.def = {
                    point1: {
                        x: definition.referenceQuantity,
                        y: definition.referencePrice
                    },
                    point2: {
                        x: definition.referenceQuantity2,
                        y: definition.referencePrice2
                    }
                };
                definition.slope = KG.divideDefs(KG.subtractDefs(definition.referenceQuantity,definition.referenceQuantity2),KG.subtractDefs(definition.referencePrice,definition.referencePrice2));
                definition.quantityIntercept = KG.multiplyDefs(-1,KG.multiplyDefs(definition.priceIntercept,definition.slope));
            }

            // If none of the above cases, log an error to console
            else {
                console.log('invalid parameters!')
            }

            super(definition, modelPath);

            var priceResponse = this;

            priceResponse.marginalDollarAmount = new KGMath.Functions.Linear({
                    intercept: definition.priceIntercept,
                    slope: KG.multiplyDefs(2,definition.slope)
                });

                priceResponse.totalDollarAmount = new KGMath.Functions.Quadratic({
                    coefficients: {
                        a: definition.slope,
                        b: definition.priceIntercept,
                        c: 0
                    }
                })

        }

        _update(scope) {
            var linearPriceResponse = this;

            linearPriceResponse.perfectlyInelastic = (linearPriceResponse.slope == 0);
            linearPriceResponse.perfectlyElastic = (linearPriceResponse.slope == Infinity || linearPriceResponse.slope == -Infinity);

            if(!linearPriceResponse.perfectlyInelastic) {
                linearPriceResponse.marginalDollarAmount.update(scope);
                linearPriceResponse.totalDollarAmount.update(scope);
            } else {
                linearPriceResponse.perfectlyInelastic = true;
            }

            super._update(scope);
            return linearPriceResponse;
        }

        // Since this is just a constant, we can save some time :)
        slopeAtPrice(price) {
            return this.slope;
        }
    }

}