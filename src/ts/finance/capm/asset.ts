/// <reference path="../fg.ts"/>

'use strict';

// numeric lacks a definitions file for now; need to add this to make Typescript happy
declare var numeric: any;

module FinanceGraphs
{
    export interface AssetDefinition extends KG.ModelDefinition
    {
        mean: any;
        stDev: any;
    }

    export interface IAsset extends KG.IModel
    {
        mean: number;
        stDev: number;
    }

    export class Asset extends KG.Model implements IAsset {

        public mean;
        public stDev;

        constructor(definition:AssetDefinition, modelPath?: string) {
            super(definition, modelPath);
        }
    }
}