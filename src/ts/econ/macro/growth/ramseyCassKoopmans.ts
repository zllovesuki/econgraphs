/// <reference path="../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface RamseyCassKoopmansDefinition extends KG.ModelDefinition
    {
        alpha: any;
        delta: any;
        rho: any;
        n: any;
        theta: any;
        initialK: any;
        initialC: any;
    }

    export interface IRamseyCassKoopmans extends KG.IModel
    {
        alpha: number;
        delta: number;
        rho: number;
        n: number;
        g: number;
        theta: number;
        initialK: number;
        initialC: number;

        y:(k:number) => number;
        r:(k:number) => number;

        growthPath: KG.ICoordinates[];
        balancedGrowthPath: KGMath.Functions.Base;

        steadyCapital: KGMath.Functions.Polynomial;

        steadyStateK: number;
        steadyStateC: number;

        positiveConsumption: boolean;
        steadyStateOnGraph: boolean;

        kdot: (k:number, c:number) => number;
        cdot: (k:number, c:number) => number;

        kMax: number;
        cMax: number;

    }

    export class RamseyCassKoopmans extends KG.Model implements IRamseyCassKoopmans
    {
        public alpha;
        public delta;
        public rho;
        public n;
        public theta;
        public g;
        public initialK;
        public initialC;
        public growthPath;
        public balancedGrowthPath;
        public positiveConsumption;
        public steadyStateOnGraph;
        public steadyCapital;
        public steadyStateK;
        public steadyStateC;
        public cMax;
        public kMax;

        constructor(definition:RamseyCassKoopmansDefinition, modelPath?:string) {
            super(definition, modelPath);
            this.steadyCapital = new KGMath.Functions.Polynomial({termDefs:[
                {
                    coefficient: 1,
                    powers: ['params.alpha']
                },
                {
                    coefficient: '-(params.delta + params.n + params.g)',
                    powers: [1]
                }
            ]});
        }

        _update(scope) {
            var model = this;

            model.steadyCapital.update(scope);
            model.steadyStateK = Math.pow((model.delta + model.rho + model.theta*model.g)/model.alpha,(1/(model.alpha - 1)));
            model.steadyStateC = model.steadyCapital.yValue(model.steadyStateK);
            model.growthPath = model.dynamicPath(model.initialK, model.initialC);
            model.balancedGrowthPath = model.generateBalancedGrowthPathData();
            model.positiveConsumption = (model.steadyStateC >= 0);
            model.steadyStateOnGraph = (model.steadyStateK <= model.kMax) && (model.steadyStateC <= model.cMax);

            return model;
        }

        y(k) {
            var model = this;
            return Math.pow(k,model.alpha); // y = f(k) = k^alpha
        }

        r(k) {
            var model = this;
            return model.alpha*Math.pow(k,model.alpha - 1) - model.delta; // interest rate = f'(k) - delta
        }

        kdot(k,c) {
            var model = this;
            return model.y(k) - c - (model.n + model.g + model.delta)*k;
        }

        cdot(k,c) {
            var model = this;
            return (model.r(k) - model.rho - model.theta * model.g)*c/model.theta;
        }

        normalizedNextPoint(k,c,distance) {

            var model = this;

            var kdot = model.kdot(k,c),
                cdot = model.cdot(k,c);

            // normalize to smooth curve

            var vectorLength = Math.sqrt(kdot*kdot + cdot*cdot),
                deltaK = distance*kdot/vectorLength,
                deltaC = distance*cdot/vectorLength;

            return {k: k + deltaK, c: c + deltaC};
        }

        private generateBalancedGrowthPathData() {

            var model = this;

            function tendsToZeroCapital(testK,testC) {

                var iterations = 0;

                // follow the dynamic path as long as it's heading NE or SW
                while(model.cdot(testK,testC)*model.kdot(testK,testC) > 0 && iterations < 10000) {
                    var next = model.normalizedNextPoint(testK,testC, model.cMax*model.kMax/100);
                    testK = next.k;
                    testC = next.c;
                    iterations++;
                }

                // once it's no longer heading NW or SE, return true if it's heading N or false if it's heading S
                return (model.cdot(testK,testC) > 0 || model.kdot(testK,testC) < 0);
            }

            var points = [{x: 0, y: 0}];

            var k = 0,
                c = 0;

            var edgeNotReached = true,
                kIncrement = model.kMax*0.002,
                cIncrement = model.cMax*0.002;

            while(edgeNotReached) {
                k = k + kIncrement;
                while(!tendsToZeroCapital(k,c) && c < model.cMax) {
                    c += cIncrement;
                }
                if(c < model.cMax) {
                    points.push({x: k, y: c});
                } else {
                    c = model.cMax;
                    k = k - kIncrement;
                    while(tendsToZeroCapital(k,c) && k < model.kMax) {
                        k += kIncrement*0.1;
                    }
                    points.push({x: k, y: c});
                    edgeNotReached = false;
                }
                if(k >= model.kMax) {
                    edgeNotReached = false;
                }
            }

            return points;

        }

        dynamicPath(k,c) {
            var model = this;

            var points = [{x: k, y: c}];

            var steadyStateAchieved = false,
                zeroConsumption = false,
                zeroCapital = false;

            var iterations = 0;

            while(!steadyStateAchieved && !zeroConsumption && !zeroCapital && iterations < 10000) {

                iterations++;

                var next = model.normalizedNextPoint(k,c,0.005);

                if(next.k < 0) {
                    zeroCapital = true;
                } else if(next.c < 0) {
                    zeroConsumption = true;
                } else if(KG.isAlmostTo(next.k,model.steadyStateK, 0.05) && KG.isAlmostTo(next.c,model.steadyStateC, 0.05)) {
                    points.push({x:model.steadyStateK, y:model.steadyStateC});
                    steadyStateAchieved = true;
                } else {
                    k = next.k;
                    c = next.c;
                    points.push({x: k, y: c});
                }
            }

            return points;

        }

    }

}