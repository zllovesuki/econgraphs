/// <reference path="../../eg.ts"/>

module EconGraphs {

    export interface ConstantPriceQuantityRelationshipDefinition extends PriceQuantityRelationshipDefinition
    {
        price: any;
    }

    export interface IConstantPriceQuantityRelationship extends IPriceQuantityRelationship
    {
        priceQuantityRelationshipFunction: KGMath.Functions.HorizontalLine;
        totalDollarAmount: KGMath.Functions.Linear;
        marginalDollarAmount: KGMath.Functions.HorizontalLine;
    }

    export class ConstantPriceQuantityRelationship extends PriceQuantityRelationship implements IConstantPriceQuantityRelationship
    {

        public totalDollarAmount;
        public marginalDollarAmount;

        constructor(definition:PriceQuantityRelationshipDefinition, modelPath?:string) {

            definition.type = 'HorizontalLine';
            definition.def = {y: definition.price};

            super(definition, modelPath);

            var priceQuantityRelationship = this;

            priceQuantityRelationship.priceQuantityRelationshipFunction = new KGMath.Functions.HorizontalLine({y:definition.price});
            priceQuantityRelationship.elasticity = new ConstantElasticity({elasticity: Infinity});
            priceQuantityRelationship.totalDollarAmount = new KGMath.Functions.Linear({point: {x: 0,y:0},slope: definition.price});
            priceQuantityRelationship.marginalDollarAmount = new KGMath.Functions.HorizontalLine({y:definition.price});

        }

        quantityAtPrice(p:number) {
            return undefined;
        }

        priceAtQuantity(quantity:number) {
            return this.price;
        }

        slopeAtPrice(price) {
            return Infinity;
        }

        inverseSlopeAtPrice(price){
            return 0;
        }

    }

    export interface PerfectlyElasticDemandDefinition extends ConstantPriceQuantityRelationshipDefinition
    {

    }

    export class PerfectlyElasticDemand extends ConstantPriceQuantityRelationship
    {

        public marginalRevenue:KGMath.Functions.HorizontalLine;
        public totalRevenue:KGMath.Functions.Linear;

        constructor(definition:PerfectlyElasticDemandDefinition, modelPath?:string) {
            super(definition,modelPath);
            this.marginalRevenue = this.marginalDollarAmount;
            this.totalRevenue = this.totalDollarAmount;
        }

        quantityAtPrice(p: number) {
            if(p < this.price) {
                return Infinity;
            }
            if(p > this.price) {
                return 0;
            }
            return this.quantity;
        }
    }

}