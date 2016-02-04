/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface HicksianDemandDefinition extends UtilityDemandDefinition{
        utilityConstraintDef?: UtilityConstraintDefinition;
        utilityConstraint?: any;
    }

    export interface IHicksianDemand extends IUtilityDemand {
        utilityConstraint: UtilityConstraint;
    }

    export class HicksianDemand extends UtilityDemand implements IHicksianDemand {

        public utilityConstraint;

        constructor(definition:HicksianDemandDefinition, modelPath?:string) {

            if(definition.hasOwnProperty('utilityConstraintDef')) {
                definition.utilityConstraint = {
                    type: 'EconGraphs.UtilityConstraint',
                    definition: definition.utilityConstraintDef
                };
            }

            super(definition, modelPath);
        }

        _update(scope) {
            var d = this;
            d.utility = d.utility.update(scope);
            d.utilityConstraint = d.utilityConstraint.update(scope);
            if(d.snapToOptimalBundle) {
                d.bundle = d.utility.lowestCostBundle(d.utilityConstraint);
            } else {
                d.bundle = {
                    x: d.x,
                    y: d.utility.indifferenceCurveAtUtilityFn(d.utilityConstraint.u).yValue(d.x)
                }
            }
            //console.log('updated Hicksian bundle to (',d.bundle.x,',',d.bundle.y,')');
            return d;
        }


        quantityAtPrice(price,good) {
            var d = this;
            good = good || 'x';

            // store original price in budget constraint
            var originalPrice = d.utilityConstraint['p' + good];

            // evaluate quantity demanded of this good at the given price
            d.utilityConstraint['p' + good] = price;
            var quantity = d.utility.lowestCostBundle(d.utilityConstraint)[good];

            // reset budget constraint to original price
            d.utilityConstraint['p' + good] = originalPrice;

            return quantity;

        }


    }
}