/// <reference path="../../eg.ts"/>

module EconGraphs {

    export interface LinearPriceQuantityRelationshipDefinition extends PriceQuantityRelationshipDefinition
    {
        quantityIntercept?: any;
        priceIntercept?: any;
        slope?: any; //note the slope is dP/dQ
        referenceQuantity?: any;
        referencePrice?: any;
        referenceQuantity2?: any;
        referencePrice2?: any;
    }

    export interface ILinearPriceQuantityRelationship extends IPriceQuantityRelationship
    {
        priceQuantityRelationshipFunction: KGMath.Functions.Linear;
        marginalDollarAmount: KGMath.Functions.Linear;
        totalDollarAmount: KGMath.Functions.Quadratic;
        quantityIntercept: number;
        priceIntercept: number;
        slope: number;
        inverseSlope: number;
        perfectlyElastic: boolean;
        perfectlyInelastic: boolean;
    }

    export class LinearPriceQuantityRelationship extends PriceQuantityRelationship implements ILinearPriceQuantityRelationship
    {

        public quantityIntercept;
        public priceIntercept;
        public slope;
        public inverseSlope;
        public totalDollarAmount;
        public marginalDollarAmount;
        public perfectlyElastic;
        public perfectlyInelastic;

        constructor(definition:LinearPriceQuantityRelationshipDefinition, modelPath?:string) {

            definition.type = 'Linear';

            /* The purpose of this initial section is to define the linear function, which can be done a number of ways, and to ensure definitions exist for price intercept, quantity intercept, and slope. */

            // If the function is defined using a quantity intercept and slope, initiate using those and calculate price intercept (which may not exist for perfectly inelastic demand/supply)
            if(definition.hasOwnProperty('quantityIntercept') && definition.hasOwnProperty('slope')) {
                definition.def = {
                    point: {
                        x: definition.quantityIntercept,
                        y: 0
                    },
                    slope: definition.slope
                };
                definition.priceIntercept = KG.multiplyDefs(-1,KG.multiplyDefs(definition.quantityIntercept,definition.slope));

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
                definition.slope = KG.multiplyDefs(-1,KG.divideDefs(definition.priceIntercept,definition.quantityIntercept))
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

                definition.slope = KG.divideDefs(KG.subtractDefs(definition.referencePrice,definition.priceIntercept),definition.referenceQuantity);
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
                definition.slope = KG.divideDefs(definition.referencePrice,KG.subtractDefs(definition.referenceQuantity,definition.quantityIntercept));
            }

            // If the function is defined using two arbitrary points initiate using those two points and calculate the slope
            else if(definition.hasOwnProperty('referenceQuantity') && definition.hasOwnProperty('referencePrice') && definition.hasOwnProperty('referenceQuantity2') && definition.hasOwnProperty('referencePrice2')) {
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
                definition.slope = KG.divideDefs(KG.subtractDefs(definition.referencePrice,definition.referencePrice2),KG.subtractDefs(definition.referenceQuantity,definition.referenceQuantity2));
                definition.quantityIntercept = KG.multiplyDefs(-1,KG.multiplyDefs(definition.priceIntercept,definition.slope));
            }

            // If none of the above cases, log an error to console
            else {
                console.log('invalid parameters!')
            }

            super(definition, modelPath);

            var priceQuantityRelationship = this;

            priceQuantityRelationship.marginalDollarAmount = new KGMath.Functions.Linear({
                intercept: definition.priceIntercept,
                slope: KG.multiplyDefs(2,definition.slope)
            });

            priceQuantityRelationship.totalDollarAmount = new KGMath.Functions.Quadratic({
                coefficients: {
                    a: definition.slope,
                    b: definition.priceIntercept,
                    c: 0
                }
            })

        }

        _update(scope) {
            var linearPriceQuantityRelationship = this;

            linearPriceQuantityRelationship.inverseSlope = 1/linearPriceQuantityRelationship.slope;

            linearPriceQuantityRelationship.perfectlyElastic = (linearPriceQuantityRelationship.slope == 0);
            linearPriceQuantityRelationship.perfectlyInelastic = (linearPriceQuantityRelationship.slope == Infinity || linearPriceQuantityRelationship.slope == -Infinity);

            if(!linearPriceQuantityRelationship.perfectlyInelastic) {
                linearPriceQuantityRelationship.marginalDollarAmount.update(scope);
                linearPriceQuantityRelationship.totalDollarAmount.update(scope);
            } else {
                linearPriceQuantityRelationship.perfectlyInelastic = true;
            }

            super._update(scope);
            return linearPriceQuantityRelationship;
        }

        // Since this is just a constant, we can save some time :)
        slopeAtPrice(price) {
            return this.slope;
        }

        inverseSlopeAtPrice(price) {
            return this.inverseSlope;
        }
    }

    export class LinearDemand extends LinearPriceQuantityRelationship
    {

        public marginalRevenue:KGMath.Functions.Linear;
        public totalRevenue:KGMath.Functions.Quadratic;

        constructor(definition:LinearPriceQuantityRelationshipDefinition, modelPath?:string) {
            super(definition,modelPath);
            this.marginalRevenue = this.marginalDollarAmount;
            this.totalRevenue = this.totalDollarAmount;
        }

        _update(scope) {
            super.update(scope);
            console.log('marginal dollar amount: ',this.marginalDollarAmount);
            console.log('marginal revenue: ',this.marginalRevenue);
            this.marginalRevenue = this.marginalDollarAmount;
            this.totalRevenue = this.totalDollarAmount;
            return this;
        }
    }

}