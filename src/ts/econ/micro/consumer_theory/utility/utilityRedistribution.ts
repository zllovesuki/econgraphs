/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface UtilityRedistributionDefinition extends KG.ModelDefinition
    {
        cLow: any;
        cHigh: any;
        transfer: any;
        utilityType: string;
        utilityDef: OneGoodUtilityDefinition;
    }

    export interface IUtilityRedistribution extends KG.IModel
    {

        utility: OneGoodUtility;

        cLow: number;
        uLow: number;
        cHigh: number;
        uHigh: number;
        transfer: number;

        cLowNew: number;
        uLowNew: number;
        cHighNew: number;
        uHighNew: number;

        lowUtilityChangeArrow: KG.Arrow;
        highUtilityChangeArrow: KG.Arrow;
        lowConsumptionChangeArrow: KG.Arrow;
        highConsumptionChangeArrow: KG.Arrow;
    }

    export class UtilityRedistribution extends KG.Model implements IUtilityRedistribution
    {

        public utility;

        public cLow;
        public uLow;
        public cHigh;
        public uHigh;

        public transfer;

        public cLowNew;
        public uLowNew;
        public cHighNew;
        public uHighNew;

        public lowUtilityChangeArrow;
        public highUtilityChangeArrow;
        public lowConsumptionChangeArrow;
        public highConsumptionChangeArrow;


        constructor(definition:UtilityRedistributionDefinition, modelPath?:string) {

            super(definition, modelPath);

            this.utility = new EconGraphs[definition.utilityType](definition.utilityDef, this.modelPath + '.utility');



        }

        _update(scope) {
            var r = this;
            r.utility = r.utility.update(scope);
            r.uLow = r.utility.utilityFunction.yValue(r.cLow);
            r.uHigh = r.utility.utilityFunction.yValue(r.cHigh);
            r.cLowNew = r.cLow + r.transfer;
            r.cHighNew = r.cHigh - r.transfer;
            r.uLowNew = r.utility.utilityFunction.yValue(r.cLowNew);
            r.uHighNew = r.utility.utilityFunction.yValue(r.cHighNew);
            return r;
        }

    }

}