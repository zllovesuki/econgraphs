/// <reference path="../../eg.ts"/>

module EconGraphs {

    export interface ConstantElasticityPriceResponseDefinition extends PriceResponseDefinition
    {
        elasticity: any;
        coefficient?: any;
        referenceQ?: any;
        referenceP?: any;
    }

    export class ConstantElasticityPriceResponse extends PriceResponse
    {

        constructor(definition:ConstantElasticityPriceResponseDefinition, modelPath?:string) {

            if(definition.hasOwnProperty('referenceQ') && definition.hasOwnProperty('referenceP')) {
                definition.coefficient = KG.divideDefs(definition.referenceQ,KG.raiseDefToDef(definition.referenceP,definition.elasticity));
            }

            definition.type = 'Monomial';
            definition.def = {
                coefficient: definition.coefficient,
                powers: [definition.elasticity]
            };

            super(definition, modelPath);

        }

    }

}