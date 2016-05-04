/// <reference path="../../eg.ts"/>

module EconGraphs {

    export interface PriceQuantityRelationshipDefinition extends KG.ModelDefinition
    {
        type: string;
        def: any;
        elasticityMethod?: string;
        price?: any;
        quantity?: any;
    }

    export interface IPriceQuantityRelationship extends KG.IModel
    {
        priceQuantityRelationshipFunction: KGMath.Functions.Base;
        quantityAtPrice: (price: number) => number;
        priceAtQuantity: (quantity: number) => number;
        priceElasticity: (price: number) => Elasticity;
        slopeAtPrice: (price: number) => number;
        inverseSlopeAtPrice: (price:number) => number;
        price: number;
        quantity: number;
    }

    export class PriceQuantityRelationship extends KG.Model implements IPriceQuantityRelationship
    {

        public priceQuantityRelationshipFunction;
        public elasticity: Elasticity;
        public price;
        public quantity;

        constructor(definition:PriceQuantityRelationshipDefinition, modelPath?:string) {

            super(definition, modelPath);

            var priceQuantityRelationship = this;

            priceQuantityRelationship.priceQuantityRelationshipFunction = new KGMath.Functions[definition.type](definition.def);
            priceQuantityRelationship.elasticity = (definition.elasticityMethod == 'point') ? new PointElasticity({}) : (definition.elasticityMethod = 'constant') ? new ConstantElasticity({}) : new MidpointElasticity({});

        }

        _update(scope) {
            var priceQuantityRelationship = this;
            priceQuantityRelationship.priceQuantityRelationshipFunction.update(scope);
            if(priceQuantityRelationship.price) {
                priceQuantityRelationship.quantity = priceQuantityRelationship.quantityAtPrice(priceQuantityRelationship.price)
            } else if(priceQuantityRelationship.quantity) {
                priceQuantityRelationship.price = priceQuantityRelationship.priceAtQuantity(priceQuantityRelationship.quantity)
            }
            return priceQuantityRelationship;
        }

        quantityAtPrice(price:number) {
            price = (price > 0) ? price : 0;
            var q = this.priceQuantityRelationshipFunction.xValue(price);
            console.log('quantity at price ',price,' is ',q)
            return Math.max(0,q);
        }

        priceAtQuantity(quantity:number) {
            quantity = (quantity > 0) ? quantity : 0;
            var p = this.priceQuantityRelationshipFunction.yValue(quantity);
            return Math.max(0,p);
        }

        priceElasticity(price:number) {
            var priceQuantityRelationship = this;
            if(priceQuantityRelationship.elasticity instanceof MidpointElasticity) {
                priceQuantityRelationship.elasticity = priceQuantityRelationship.elasticity.calculateElasticity({
                    point1: {
                        x: priceQuantityRelationship.quantityAtPrice(price*0.99),
                        y: price*0.99
                    },
                    point2: {
                        x: priceQuantityRelationship.quantityAtPrice(price*1.01),
                        y: price*1.01
                    }});
            } else if(priceQuantityRelationship.elasticity instanceof PointElasticity) {
                var point = {
                    x: priceQuantityRelationship.quantityAtPrice(price),
                    y: price
                },
                    slope = priceQuantityRelationship.slopeAtPrice(price);
                priceQuantityRelationship.elasticity = priceQuantityRelationship.elasticity.calculateElasticity({point:point, slope:slope});
            }
            return priceQuantityRelationship.elasticity;
        }

        slopeAtPrice(price) {
            var priceQuantityRelationship = this;
            return priceQuantityRelationship.priceQuantityRelationshipFunction.slopeBetweenPoints(
                {
                    x: priceQuantityRelationship.quantityAtPrice(price*0.99),
                    y: price*0.99
                }, {
                    x: priceQuantityRelationship.quantityAtPrice(price*1.01),
                    y: price*1.01
                },
                true
            );
        }

        inverseSlopeAtPrice(price){
            return 1/this.slopeAtPrice(price);
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

        totalExpenditureAtQuantity(quantity) {
            return this.totalRevenueAtQuantity(quantity);
        }



    }

}