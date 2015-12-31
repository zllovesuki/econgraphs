/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    export interface ViewObjectWithDomainDefinition extends ViewObjectDefinition
    {
        xDomainDef?: DomainDef;
        yDomainDef?: DomainDef;
        xDomain?: Domain;
        yDomain?: Domain;
    }

    export interface IViewObjectWithDomain extends IViewObject
    {
        xDomain?: Domain;
        yDomain?: Domain;
    }

    export class ViewObjectWithDomain extends ViewObject implements IViewObjectWithDomain
    {

        public xDomain;
        public yDomain;

        constructor(definition:ViewObjectWithDomainDefinition, modelPath?: string) {

            super(definition, modelPath);

            var viewObj = this;

            if(definition.hasOwnProperty('xDomainDef')) {
                viewObj.xDomain = new KG.Domain(definition.xDomainDef.min, definition.xDomainDef.max);
            }
            if(definition.hasOwnProperty('yDomainDef')) {
                viewObj.yDomain = new KG.Domain(definition.yDomainDef.min, definition.yDomainDef.max);
            }

        }

    }



}