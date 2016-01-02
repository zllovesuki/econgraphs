/// <reference path="../../eg.ts"/>

module EconGraphs {

    export interface ConstantElasticityPriceQuantityRelationshipDefinition extends PriceQuantityRelationshipDefinition
    {
        elasticity: any;
        coefficient?: any;
        referenceQuantity?: any;
        referencePrice?: any;
    }

    export interface IConstantElasticityPriceQuantityRelationship extends IPriceQuantityRelationship
    {
        elasticity: number;
        coefficient: number;
    }

    export class ConstantElasticityPriceQuantityRelationship extends PriceQuantityRelationship implements IConstantElasticityPriceQuantityRelationship
    {

        public elasticity;
        public coefficient;

        constructor(definition:ConstantElasticityPriceQuantityRelationshipDefinition, modelPath?:string) {

            if(definition.hasOwnProperty('referenceQuantity') && definition.hasOwnProperty('referencePrice')) {
                definition.coefficient = KG.divideDefs(definition.referenceQuantity,KG.raiseDefToDef(definition.referencePrice,definition.elasticity));
            }

            definition.type = 'Monomial';
            definition.def = {
                level: definition.coefficient,
                coefficient: 1,
                powers: [1,KG.multiplyDefs(-1,definition.elasticity)]
            };

            super(definition, modelPath);

        }

        _update(scope) {
            console.log(this);
            return this;
        }

        // elasticity = inverseSlope * P/Q => inverseSlope = elasticity*Q/P
        inverseSlopeAtPrice(price) {
            var pqRelationship = this,
                quantity = pqRelationship.quantityAtPrice(price);
            return pqRelationship.elasticity*quantity/price;
        }

        slopeAtPrice(price) {
            return 1/this.inverseSlopeAtPrice(price);
        }

    }

}