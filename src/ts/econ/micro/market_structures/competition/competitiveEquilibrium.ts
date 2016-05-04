/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface CompetitiveEquilibriumDefinition extends KG.ModelDefinition {
        supply: ProfitMaxDefinition;
        demand: MarshallianDemandDefinition;
        price?: any;
        snapToEquilibrium?: any;
        numFirms?: any;
        numConsumers?: any;
    }

    export interface ICompetitiveEquilibrium extends KG.IModel {

        supply: ProfitMax;
        demand: MarshallianDemand;

        price: number

        numFirms: number;
        numConsumers: number;
        marketSupply: KGMath.Functions.Base;
        marketDemand: KGMath.Functions.Base;
    }

    export class CompetitiveEquilibrium extends KG.Model implements ICompetitiveEquilibrium {

        public supply;
        public demand;
        public price;
        public numFirms;
        public numConsumers;
        public marketSupply;
        public marketDemand;

        constructor(definition:CompetitiveEquilibriumDefinition, modelPath?:string) {

            definition = _.defaults(definition, {
                numConsumers: 100,
                numFirms: 10
            });

            super(definition, modelPath);

            this.supply = new ProfitMax(definition.supply);
            this.demand = new MarshallianDemand(definition.demand);
            this.marketSupply = new KGMath.Functions.Base({});
            this.marketDemand = new KGMath.Functions.Base({});

        }

        _update(scope) {
            var ce = this;
            ce.supply.update(scope);
            ce.demand.update(scope);
            ce.marketSupply.xValue = function(price) {return ce.supply.quantityAtPrice(price)*ce.numFirms};
            ce.marketDemand.xValue = function(price) {return ce.demand.quantityAtPrice(price)*ce.numConsumers};
            return ce;
        }

    }
}

