/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    
    export interface InputBundle extends KG.ICoordinates {

    }

    export interface InputPrices {
        w: number;
        r: number;
    }

    export interface ConditionalInputDemandParams extends InputPrices {
        q: number;
    }

    export interface ShortRunInputDemandParams extends ConditionalInputDemandParams {
        K: number;
    }
    
    export interface ProductionTechnologyDefinition extends KG.ModelDefinition {
        productionFunction: {type: string, definition: any};
        w?: any;
        r?: any;
        q?: any;
        K?: any;
    }

    export interface IProductionTechnology extends KG.IModel {

        title: string;
        formula: (values:boolean) => string;

        w: number;
        r: number;
        q: number;
        K: number;

        productionFunction: KGMath.Functions.Base;
        mplFunction: KGMath.Functions.Base;
        mpkFunction: KGMath.Functions.Base;

        output:(bundle?:InputBundle) => number;
        mpl:(bundle?:InputBundle) => number;
        mpk:(bundle?:InputBundle) => number;
        mrts:(bundle?:InputBundle) => number;

        isoquantAtQuantityFn: (quantity:number) => KGMath.Functions.Base;
        isoquantThroughBundleFn: (bundle:InputBundle) => KGMath.Functions.Base;

        bundleCost: (input:InputBundle, inputPrices:InputPrices) => number;
        
        lowestCostInputBundle: (conditionalInputDemandParams: ConditionalInputDemandParams) => InputBundle;
        conditionalLaborDemand: (conditionalInputDemandParams: ConditionalInputDemandParams) => number;
        conditionalCapitalDemand: (conditionalInputDemandParams: ConditionalInputDemandParams) => number;
        longRunTotalCost: (conditionalInputDemandParams: ConditionalInputDemandParams) => number;
        longRunTotalCostFn: (inputPrices: InputPrices) => KGMath.Functions.Base;

        shortRunLaborRequirement: (shortRunLaborRequirementParams: {q:number, K:number}) => number;
        shortRunTotalCost: (shortRunInputDemandParams:ShortRunInputDemandParams) => number;
        shortRunTotalCostFn: (shortRunTotalCostParams: {w:number, r:number, K:number}) => KGMath.Functions.Base;



    }

    export class ProductionTechnology extends KG.Model implements IProductionTechnology {

        public title;
        public productionFunction;
        public mplFunction;
        public mpkFunction;

        public w;
        public r;
        public q;
        public K;

        constructor(definition:ProductionTechnologyDefinition, modelPath?:string) {

            definition = _.defaults(definition, {
                isoquantLabel: 'U'
            });
            super(definition, modelPath);

            var f = this;;
            f.mplFunction = f.productionFunction.derivative(1);
            f.mpkFunction = f.productionFunction.derivative(2);

        }

        _update(scope) {
            var f = this;
            f.productionFunction.update(scope);
            f.mplFunction.update(scope);
            f.mpkFunction.update(scope);
            return f;
        }

        /* Technology measures */

        output(inputs:InputBundle) {
            return this.productionFunction.value(KG.getBases(inputs));
        }

        mpl(inputs:InputBundle) {
            return this.mplFunction.value(KG.getBases(inputs));
        }

        mpk(inputs:InputBundle) {
            return this.mpkFunction.value(KG.getBases(inputs));
        }

        mrts(inputs:InputBundle) {
            return this.mpl(inputs) / this.mpk(inputs);
        }

        
        /* Isoquant curves */

        isoquantAtQuantityFn(q:number) {
            var f = this;
            var clone = _.clone(f.productionFunction);
            clone.setLevel(q);
            return clone;
        }

        isoquantThroughBundleFn(inputs:InputBundle) {
            var f = this,
                q = f.output(inputs);
            return f.isoquantAtQuantityFn(q);
        }

        /* Bundle costs */

        bundleCost(inputs:InputBundle, inputPrices:InputPrices) {
            var f = this;
            inputPrices = _.defaults(inputPrices || {},{w: f.w, r: f.r});
            return inputPrices.w*inputs.x + inputPrices.r*inputs.y;
        }


        /* Long-run costs */

        lowestCostInputBundle(conditionalInputDemandParams) {
            return {x: null, y: null}; // based on specific utility function; overridden by subclass
        }
        
        conditionalLaborDemand(conditionalInputDemandParams) {
            return this.lowestCostInputBundle(conditionalInputDemandParams).x;
        }
        
        conditionalCapitalDemand(conditionalInputDemandParams) {
            return this.lowestCostInputBundle(conditionalInputDemandParams).y;
        }

        longRunTotalCost(conditionalInputDemandParams) {
            var f = this,
                inputs = f.lowestCostInputBundle(conditionalInputDemandParams),
                inputPrices = conditionalInputDemandParams;
            return f.bundleCost(inputs,inputPrices);
        }

        longRunTotalCostFn(params) {

            var f = this,
                LRTC = new KGMath.Functions.Base({});

            params = _.defaults(params || {}, {w: f.w, r: f.r});

            LRTC.yValue = function(q) {
                params.q = q;
                return f.longRunTotalCost(params);
            };

            return LRTC;
        }

        longRunOptimalKLRatio(inputPrices) {

            inputPrices = inputPrices || {};

            var f = this;

            inputPrices = _.defaults(inputPrices, {w: f.w, r: f.r});

            return inputPrices.w/inputPrices.r; //overridden by subclass
        }

        
        
        /* Short-run costs */
        
        shortRunLaborRequirement(params) {

            var f = this

            params = _.defaults(params || {}, {q: f.q, K: f.K});

            return f.productionFunction.setLevel(params.q).xValue(params.K);
        }
        
        shortRunTotalCost(params) {
            var f = this;


            params = _.defaults(params || {}, {w: f.w, r: f.r, q: f.q, K: f.K});

            var inputs = {x: f.shortRunLaborRequirement(params), y: params.K};

            return f.bundleCost(inputs,params);
        }

        shortRunTotalCostFn(params) {
            var f = this,
                SRTC = new KGMath.Functions.Base({});

            params = _.defaults(params || {}, {w: f.w, r: f.r, K: f.K});

            SRTC.yValue = function(q) {
                params.q = q;
                return f.shortRunTotalCost(params);
            };

            return SRTC;
        }


        /* Decorations */
        
        formula(values) {
            return ''; // overridden by subclass
        }



    }

    export class SelectableProductionFunction extends KG.Model {

        public productionTechnology: ProductionTechnology;

        constructor(definition,modelPath?) {
            super(definition,modelPath);
        }
    }
}

