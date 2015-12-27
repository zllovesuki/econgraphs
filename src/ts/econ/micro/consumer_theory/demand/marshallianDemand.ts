/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface MarshallianDemandDefinition extends UtilityDemandDefinition{
        x?: any;
        y?: any;
        budget: {type: string; definition: BudgetConstraintDefinition}
        snapToOptimalBundle?: any;
    }

    export interface IMarshallianDemand extends IUtilityDemand {

        x: number;
        y: number;
        bundle: TwoGoodBundle;
        budget: BudgetConstraint | KG.Selector;
        snapToOptimalBundle?: boolean;

        priceConsumptionCurveData: (pccParams?: UtilityDemandCurveParams) => KG.ICoordinates[];
        incomeConsumptionCurveData: (iccParams?: UtilityDemandCurveParams) => KG.ICoordinates[];
        engelCurveData: (engelParams?: UtilityDemandCurveParams) => KG.ICoordinates[];

    }

    export class MarshallianDemand extends UtilityDemand implements IMarshallianDemand {

        public x;
        public y;
        public bundle;
        public budget;
        public snapToOptimalBundle;

        constructor(definition:MarshallianDemandDefinition, modelPath?:string) {

            definition = _.defaults(definition, {
                bundle: {x: definition.x, y: definition.y},
                snapToOptimalBundle: true
            });

            super(definition, modelPath);
        }

        _update(scope) {
            var d = this;
            d.utility = d.utility.update(scope);
            d.budget = d.budget.update(scope);
            d.budget.budgetSegments.forEach(function(bs) {bs.update(scope)});
            if(d.snapToOptimalBundle) {
                d.bundle = d.utility.optimalBundle(d.budget)
            } else {
                d.bundle = {
                    x: d.x,
                    y: d.budget.yValue(d.x)
                }
            }
            return d;
        }

        price(good) {
            good = good || 'x';
            return this.budget['p'+good];
        }

        quantityAtPrice(price,good) {
            var d = this;
            good = good || 'x';

            // store original price in budget constraint
            var originalPrice = d.budget['p' + good];

            // evaluate quantity demanded of this good at the given price
            d.budget.setPrice(price,good);
            var quantity = d.utility.optimalBundle(d.budget)[good];

            // reset budget constraint to original price
            d.budget.setPrice(originalPrice,good);

            return quantity;

        }

        quantityAtIncome(income,good) {
            var d = this;
            good = good || 'x';

            // store original price in budget constraint
            var originalIncome = d.budget.income;

            // evaluate quantity demanded of this good at the given price
            d.budget.setIncome(income);
            var quantity = d.utility.optimalBundle(d.budget)[good];

            // reset budget constraint to original price
            d.budget.setIncome(originalIncome);

            return quantity;

        }

        priceConsumptionCurveData(pccParams?) {

            pccParams = _.defaults(pccParams || {}, {
                good: 'x',
                min: 0,
                max: 10,
                numSamplePoints: 101
            });

            var d = this,
                samplePoints = KG.samplePointsForDomain(pccParams),
                curveData = [];

            var initialPrice = d.budget['p' + pccParams.good];
            console.log('setting initial price to ',initialPrice);

            samplePoints.forEach(function(price) {
                d.budget.setPrice(price,pccParams.good)
                var optimalBundle = d.utility.optimalBundle(d.budget)
                if(!isNaN(optimalBundle.x) && !isNaN(optimalBundle.y)) {curveData.push(optimalBundle)};
            });

            // reset budget price
            d.budget.setPrice(initialPrice,pccParams.good);

            return curveData;

        }

        incomeConsumptionCurveData(iccParams?) {

            iccParams = _.defaults(iccParams || {}, {
                min: 1,
                max: 200,
                numSamplePoints: 200
            });

            var d = this,
                samplePoints = KG.samplePointsForDomain(iccParams),
                curveData = [],
                optimalBundle;

            var initialIncome = d.budget.income;

            samplePoints.forEach(function(income) {
                d.budget.setIncome(income);
                optimalBundle = d.utility.optimalBundle(d.budget);
                if(!isNaN(optimalBundle.x) && !isNaN(optimalBundle.y)) {curveData.push(optimalBundle)};
            });

            // reset budget price
            d.budget.setIncome(initialIncome);

            return curveData;
        }

        engelCurveData(engelParams?) {

            engelParams = _.defaults(engelParams || {}, {
                good: 'x',
                min: 1,
                max: 200,
                numSamplePoints: 200
            });

            var d = this,
                samplePoints = KG.samplePointsForDomain(engelParams),
                curveData = [];

            samplePoints.forEach(function(price) {
                curveData.push({x: d.quantityAtIncome(price, engelParams.good), y: price});
            });

            return curveData;

        }


    }
}