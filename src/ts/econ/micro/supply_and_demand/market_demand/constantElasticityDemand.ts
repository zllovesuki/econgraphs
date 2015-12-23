/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface ConstantElasticityDemandDefinition extends DemandDefinition
    {
        def: KGMath.Functions.MonomialDefinition;
    }

    export interface IConstantElasticityDemand extends IDemand
    {
        slopeAtPrice: (price: number) => number;
        slopeAtPriceWords: (price:number) => string;
    }

    export class ConstantElasticityDemand extends Demand implements IConstantElasticityDemand
    {

        constructor(definition:ConstantElasticityDemandDefinition, modelPath?: string) {
            super(definition,modelPath);
            this.elasticity.elasticity = definition.def.powers[1];
        }

        slopeAtPrice(price) {
            var d = this,
                a = d.demandFunction.level,
                b = d.demandFunction.powers[1];
            return (-1)*a*b*Math.pow(price,-(1+b))
        }

        slopeAtPriceWords(price) {
            return "\\frac { dQ^D }{ dP } = " + this.slopeAtPrice(price).toFixed(2);
        }

    }

}