/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface CournotDuopolyDefinition extends KG.ModelDefinition
    {
        marketDemandPriceIntercept: any;
        marketDemandQuantityIntercept: any;
        q1?: any;
        q2?: any;
        c1: any;
        c2: any;
        showProfit: boolean;
    }

    export interface ICournotDuopoly extends KG.IModel
    {

        residualDemand1Intercept: number;
        residualDemand2Intercept: number;
        firm1: Monopoly;
        firm2: Monopoly;
        marketDemand: LinearDemand;
        price: number;
    }

    export class CournotDuopoly extends KG.Model implements ICournotDuopoly
    {

        public marketDemand;
        public firm1;
        public firm2;
        public residualDemand1Intercept;
        public residualDemand2Intercept;

        public priceLine;
        public quantityDemandedAtPrice;
        public consumerSurplus;

        public snapToOptimal1;
        public snapToOptimal2;

        public price;

        constructor(definition:CournotDuopolyDefinition, modelPath?: string) {
            super(definition, modelPath);
            var cournot = this;
            cournot.marketDemand = new LinearDemand({
                type: 'Linear',
                quantity: KG.addDefs(definition.q1, definition.q2),
                def: {
                    point1: {
                        x: 0,
                        y: definition.marketDemandPriceIntercept
                    },
                    point2: {
                        x: definition.marketDemandQuantityIntercept,
                        y: 0
                    }
                }
            },this.modelProperty('marketDemand'));

            cournot.firm1 = new Monopoly({
                quantity: definition.q1,
                cost: {
                    costType: 'ConstantMarginalCost',
                    costDef: {
                        quantityDraggable: true,
                        fixedCost: 0,
                        c: definition.c1
                    }
                },
                demand: {
                    demandType: 'LinearDemand',
                    demandDef: {
                        elasticityMethod: 'point',
                        quantity: definition.q1,
                        type: 'Linear',
                        def: {
                            slope: cournot.modelProperty('marketDemand.demandFunction.slope'),
                            intercept: cournot.modelProperty('residualDemand1Intercept')
                        }
                    }
                }
            },cournot.modelProperty('firm1'));

            cournot.firm2 = new Monopoly({
                quantity: definition.q2,
                cost: {
                    costType: 'ConstantMarginalCost',
                    costDef: {
                        quantityDraggable: true,
                        fixedCost: 0,
                        c: definition.c2
                    }
                },
                demand: {
                    demandType: 'LinearDemand',
                    demandDef: {
                        elasticityMethod: 'point',
                        quantity: cournot.modelProperty('firm2.quantity'),
                        type: 'Linear',
                        def: {
                            slope: cournot.modelProperty('marketDemand.demandFunction.slope'),
                            intercept: cournot.modelProperty('residualDemand2Intercept')
                        }
                    }
                }
            },cournot.modelProperty('firm2'));


        }

        private residualDemandIntercept(otherQuantity:number) {
            return this.marketDemand.priceAtQuantity(otherQuantity);
        }

        _update(scope) {
            var cournot = this;
            cournot.marketDemand.update(scope);
            cournot.residualDemand1Intercept = cournot.residualDemandIntercept(cournot.firm2.quantity);
            cournot.residualDemand2Intercept = cournot.residualDemandIntercept(cournot.firm1.quantity);
            cournot.firm1.update(scope);
            cournot.firm2.update(scope);
            cournot.firm1.update(scope);
            cournot.firm2.update(scope);
            cournot.marketDemand.update(scope);
            cournot.marketDemand.quantity = cournot.firm1.quantity + cournot.firm2.quantity;
            cournot.marketDemand.price = cournot.marketDemand.priceAtQuantity(cournot.marketDemand.quantity);
            return cournot;
        }

    }

}