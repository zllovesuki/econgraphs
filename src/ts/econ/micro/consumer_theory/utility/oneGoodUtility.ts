/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface OneGoodUtilityDefinition extends UtilityDefinition
    {

    }

    export interface IOneGoodUtility extends IUtility
    {
        marginalUtilityFunction: KGMath.Functions.Base;

        utilityAtQuantity: (quantity:number) => number;
        marginalUtilityAtQuantity: (quantity:number) => number;
        consumptionYieldingUtility: (utility:number) => number;

    }

    export class OneGoodUtility extends Utility implements IOneGoodUtility
    {

        public marginalUtilityFunction;

        constructor(definition:OneGoodUtilityDefinition, modelPath?:string) {

            definition = _.defaults(definition,{
                curveLabel: 'u(c)',
                marginalCurveLabel: 'u\'(c)'
            });
            super(definition, modelPath);

            if(this.utilityFunction.derivative()) {
                this.marginalUtilityFunction = this.utilityFunction.derivative();
            }

        }

        _update(scope) {
            var u = this;
            u.utilityFunction.update(scope);
            if(this.utilityFunction.derivative()) {
                this.marginalUtilityFunction.update(scope);
            }
            return u;
        }

        utilityAtQuantity(c) {
            return this.utilityFunction.yValue(c)
        }

        marginalUtilityAtQuantity(c) {
            return this.marginalUtilityFunction.yValue(c)
        }

        consumptionYieldingUtility(u) {
            return this.utilityFunction.xValue(u);
        }

    }

}