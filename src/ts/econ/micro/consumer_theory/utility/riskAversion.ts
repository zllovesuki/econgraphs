/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface RiskAversionDefinition extends KG.ModelDefinition
    {
        ca: any;
        cb: any;
        pLow: any;
        utilityType: string;
        utilityDef: OneGoodUtilityDefinition;
        show?: {
            ce: any;
            rp: any;
        }
    }

    export interface IRiskAversion extends KG.IModel
    {
        ca: number;
        ua: number;
        cb: number;
        ub: number;
        pLow: number;
        utility: OneGoodUtility;
        expectedC: number;
        expectedU: number;
        certaintyEquivalent: number;
        riskPremium: number;
        riskPremiumSegment: KG.Segment;
        show: {
            ce: boolean;
            rp: boolean;
        }
    }

    export class RiskAversion extends KG.Model implements IRiskAversion
    {

        public ca;
        public ua;
        public cb;
        public ub;
        public pLow;
        public utility;
        public expectedC;
        public expectedU;
        public utilityOfExpectedC;
        public certaintyEquivalent;
        public riskPremium;
        public show;


        public riskPremiumSegment;
        public expectationSegment;

        public expectedUtilityPoint;
        public expectedConsumptionPoint;
        public certaintyEquivalentPoint;

        constructor(definition:RiskAversionDefinition, modelPath?:string) {

            definition.pLow = definition.pLow || 0.5;

            definition.show = _.defaults(definition.show || {},{
                ce: false,
                rp: false
            });

            super(definition, modelPath);

            this.utility = new EconGraphs[definition.utilityType](definition.utilityDef, this.modelPath + '.utility');



        }

        _update(scope) {
            var ra = this;
            ra.utility = ra.utility.update(scope);
            ra.ua = ra.utility.utilityFunction.yValue(ra.ca);
            ra.ub = ra.utility.utilityFunction.yValue(ra.cb);
            ra.expectedC = ra.pLow * ra.ca + (1 - ra.pLow) * ra.cb;
            ra.expectedU = ra.pLow * ra.ua + (1 - ra.pLow) * ra.ub;
            ra.utilityOfExpectedC = ra.utility.utilityFunction.yValue(ra.expectedC);
            ra.certaintyEquivalent = ra.utility.utilityFunction.xValue(ra.expectedU);
            return ra;
        }

    }

}