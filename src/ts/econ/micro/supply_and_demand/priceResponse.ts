/// <reference path="../../eg.ts"/>

module EconGraphs {

    export interface PriceResponseDefinition extends KG.ModelDefinition
    {
        type: string;
        def: any;
        elasticityMethod?: string;
        price?: any;
        quantity?: any;
    }

    export interface IPriceResponse extends KG.IModel
    {
        priceResponseFunction: KGMath.Functions.Base;
        quantityAtPrice: (price: number) => number;
        priceAtQuantity: (quantity: number) => number;
        priceElasticity: (price: number) => Elasticity;
        price: number;
        quantity: number;
    }

    export class PriceResponse extends KG.Model implements IPriceResponse
    {

        public priceResponseFunction;
        public elasticity: Elasticity;
        public price;
        public quantity;

        constructor(definition:PriceResponseDefinition, modelPath?:string) {

            super(definition, modelPath);

            var priceResponse = this;

            priceResponse.priceResponseFunction = new KGMath.Functions[definition.type](definition.def);
            priceResponse.elasticity = (definition.elasticityMethod == 'point') ? new PointElasticity({}) : (definition.elasticityMethod = 'constant') ? new ConstantElasticity({}) : new MidpointElasticity({});

        }

        _update(scope) {
            var priceResponse = this;
            priceResponse.priceResponseFunction.update(scope);
            if(priceResponse.price) {
                priceResponse.quantity = priceResponse.quantityAtPrice(priceResponse.price)
            } else if(priceResponse.quantity) {
                priceResponse.price = priceResponse.priceAtQuantity(priceResponse.quantity)
            }
            return priceResponse;
        }

        quantityAtPrice(price:number) {
            price = (price > 0) ? price : 0;
            var q = this.priceResponseFunction.xValue(price);
            return Math.max(0,q);
        }

        priceAtQuantity(quantity:number) {
            quantity = (quantity > 0) ? quantity : 0;
            var p = this.priceResponseFunction.yValue(quantity);
            return Math.max(0,p);
        }

        priceElasticity(price:number) {
            var priceResponse = this;
            if(priceResponse.elasticity instanceof MidpointElasticity) {
                priceResponse.elasticity = priceResponse.elasticity.calculateElasticity({
                    point1: {
                        x: priceResponse.quantityAtPrice(price*0.99),
                        y: price*0.99
                    },
                    point2: {
                        x: priceResponse.quantityAtPrice(price*1.01),
                        y: price*1.01
                    }});
            } else if(priceResponse.elasticity instanceof PointElasticity) {
                var point = {
                    x: priceResponse.quantityAtPrice(price),
                    y: price
                },
                    slope = priceResponse.priceResponseFunction.hasOwnProperty('slope') ? priceResponse.priceResponseFunction.slope : priceResponse.priceResponseFunction.slopeBetweenPoints(
                        {
                            x: priceResponse.quantityAtPrice(price*0.99),
                            y: price*0.99
                        }, {
                            x: priceResponse.quantityAtPrice(price*1.01),
                            y: price*1.01
                        },
                        true
                    );
                priceResponse.elasticity = priceResponse.elasticity.calculateElasticity({point:point, slope:slope});
            }
            return priceResponse.elasticity;
        }

        // elasticity = slope * P/Q => slope = elasticity*Q/P
        slopeAtPrice(price) {
            var priceResponse = this,
                quantity = priceResponse.quantityAtPrice(price),
                elasticity = priceResponse.priceElasticity(price).elasticity;
            return elasticity*quantity/price;
        }

        // total revenue and total expenditure are the same thing;, and can be called from either perspective
        totalRevenueAtPrice(price) {
            return price*this.quantityAtPrice(price);
        }

        totalExpenditureAtPrice(price) {
            return this.totalRevenueAtPrice(price);
        }

        totalRevenueAtQuantity(quantity) {
            return quantity*this.priceAtQuantity(quantity);
        }

        totalExpenditureAtPrice(quantity) {
            return this.totalRevenueAtQuantity(quantity);
        }

    }

}