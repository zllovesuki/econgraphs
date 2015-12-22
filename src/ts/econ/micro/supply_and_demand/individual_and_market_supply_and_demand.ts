/// <reference path="../../eg.ts"/>

module EconGraphs {

    export interface IndividualAndMarketSandDDefinition extends KG.ModelDefinition
    {
        price?: any;

        wage: any;
        alpha: any;
        income: any;
        nc: any;
        nf: any;

        snapToEquilibrium: boolean;
        inEquilibrium: boolean;
    }

    export interface IIndividualAndMarketSandD extends KG.IModel
    {

        wage: number;
        alpha: number;
        income: number;
        nc: number;
        nf: number;

        price: number;
        individualQuantityDemanded: number;
        individualQuantitySupplied: number;
        marketQuantityDemanded: number;
        marketQuantitySupplied: number;

        individualDemandFunction: KGMath.Functions.Monomial;
        marketDemandFunction: KGMath.Functions.Monomial;
        individualSupplyFunction: KGMath.Functions.Monomial;
        marketSupplyFunction: KGMath.Functions.Monomial;

        equilibriumPrice: number;
        equilibriumQuantity: number;

        snapToEquilibrium: boolean;
    }

    export class IndividualAndMarketSandD extends KG.Model implements IIndividualAndMarketSandD
    {

        public alpha;
        public income;
        public wage;
        public nc;
        public nf;

        public price;
        public individualQuantityDemanded;
        public individualQuantitySupplied;
        public marketQuantityDemanded;
        public marketQuantitySupplied;
        public individualDemandFunction;
        public marketDemandFunction;
        public individualSupplyFunction;
        public marketSupplyFunction;
        public equilibriumPrice;
        public equilibriumQuantity;
        public snapToEquilibrium;
        public inEquilibrium;
        public surplusShortageWord;
        public snapTolerance;


        constructor(definition:IndividualAndMarketSandDDefinition, modelPath?:string) {

            definition = _.defaults(definition, {
                alpha: 0.25,
                income: 64,
                nc: 100,
                nf: 36,
                wage: 9,
                price: 15,
                snapTolerance: 0.05
            });

            super(definition, modelPath);

            var d = this;

            d.individualDemandFunction = new KGMath.Functions.Monomial({
                coefficient: KG.multiplyDefs(definition.alpha, definition.income),
                powers: [-1]
            });

            d.individualSupplyFunction = new KGMath.Functions.Monomial({
                coefficient: KG.divideDefs(1,definition.wage),
                powers: [1]
            });

            d.marketDemandFunction = d.individualDemandFunction.multiply(definition.nc);
            d.marketSupplyFunction = d.individualSupplyFunction.multiply(definition.nf);

        }

        _update(scope) {
            var d = this;
            d.equilibriumPrice = Math.sqrt(d.alpha*d.income*d.wage*d.nc/d.nf);
            d.equilibriumQuantity = Math.sqrt(d.alpha*d.income*d.nc*d.nf/d.wage);
            if(d.snapToEquilibrium || KG.isAlmostTo(d.price, d.equilibriumPrice, d.snapTolerance)) {
                d.price = d.equilibriumPrice;
                d.inEquilibrium = true;
            } else {
                d.inEquilibrium = false;
            }
            d.individualQuantityDemanded = d.individualDemandFunction.update(scope).value(d.price);
            d.individualQuantitySupplied = d.individualSupplyFunction.update(scope).value(d.price);
            d.marketQuantityDemanded = d.marketDemandFunction.update(scope).value(d.price);
            d.marketQuantitySupplied = d.marketSupplyFunction.update(scope).value(d.price);
            d.surplusShortageWord = d.inEquilibrium ? '' : (d.marketQuantitySupplied > d.marketQuantityDemanded) ? "\\text{surplus}" : "\\text{shortage}";
            return d;
        }

    }

}