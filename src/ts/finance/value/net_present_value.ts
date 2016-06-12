/// <reference path="../fg.ts"/>

'use strict';

// numeric lacks a definitions file for now; need to add this to make Typescript happy
declare var numeric: any;

module FinanceGraphs
{
    export interface NetPresentValueDefinition extends KG.ModelDefinition
    {
        freeCashFlows: any;
        r: any;
    }

    export interface INetPresentValue extends KG.IModel
    {
        freeCashFlows: number[];
        r: number;
        presentValue: (r?:number, year?:number) => number;
        presentValueFunction: KGMath.Functions.Base;
    }

    export class NetPresentValue extends KG.Model implements INetPresentValue {

        public freeCashFlows;
        public r;
        public presentValueFunction;

        constructor(definition:NetPresentValueDefinition, modelPath?: string) {
            super(definition, modelPath);

            var npv = this;

            npv.presentValueFunction = new KGMath.Functions.Base({});
            npv.presentValueFunction.yValue = function(x) {return npv.presentValue(x)};
        }

        presentFlowValue(year,r?,baseYear?) {
            var npv = this;
            if(r == undefined) {
                r = npv.r;
            }
            baseYear = baseYear || 0;
            return npv.freeCashFlows[year]*Math.pow(1 + 0.01*r,baseYear-year);
        }

        presentValue(r?,baseYear?) {
            var npv = this;
            var v = 0;
            for(var i=0;i<npv.freeCashFlows.length; i++) {
                v += npv.presentFlowValue(i,r,baseYear);
            }
            return v
        }

    }
}