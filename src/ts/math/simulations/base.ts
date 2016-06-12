module KGMath.Simulations {

    export interface BaseDefinition {
        numDraws: number;
        distribution: {type: string; definition: KGMath.Distributions.BaseDefinition;}
    }

    export interface IBase extends KG.IModel {
        numDraws: number;
        distribution: KGMath.Distributions.Base;
        drawOne: () => any;
        drawShocks: (numDraws:number) => any[];
        transformShock: (shock:any) => any;
        newDraw: (newShocks?: boolean, numDraws?:number, returnSum?:boolean) => any[];
        subDraw: (numSubDraws?:number, returnSum?:boolean) => any[];
        shocks: any[];
        draws: any[];
        sumDraws: any[];
    }

    export class Base extends KG.Model {

        public numDraws;
        public distribution;
        public shocks;
        public draws;
        public sumDraws;

        constructor(definition,modelPath?) {

            definition = _.defaults(definition,{
                numDraws: 1,
                distribution: {type: 'KGMath.Distributions.Normal', definition: {}}
            });

            super(definition,modelPath);

        }

        _update(scope) {
            var sim = this;
            sim.newDraw(false, sim.numDraws, false);
            return sim;
        }
        
        drawOne() {
            return this.distribution.randomDraw();
        }

        drawShocks(numDraws) {
            var sim = this, shocks = [];
            for(var i=0;i<numDraws;i++) {
                shocks.push(sim.drawOne());
            }
            return shocks;
        }

        transformShock(shock) {
            return shock;
        }

        newDraw(newShocks?: boolean, numDraws?: number, returnSum?:boolean) {
            var sim = this;

            newShocks = !!newShocks;
            returnSum = !!returnSum;

            // establish the number of draws
            if(numDraws) {
                sim.numDraws = numDraws;
            }

            if(newShocks) {
                sim.shocks = sim.drawShocks(sim.numDraws);
            }

            sim.draws = sim.shocks.map(function(s) {return sim.transformShock(s)});

            sim.sumDraws = [];

            var drawIsNumber = (typeof sim.draws[0] == 'number');

            // assume each draw is either a number or an array of numbers, for now
            var sum = drawIsNumber ? 0 : sim.draws[0].map(function() {return 0});

            for(var i=0;i<sim.numDraws;i++) {
                if(drawIsNumber) {
                    // draw is a number
                    sum += sim.draws[i];
                } else {
                    // draw is an array
                    for(var j=0; j<sim.draws[i].length; j++) {
                        sum[j] += sim.draws[i][j];
                    }
                }
                sim.sumDraws.push(sum);
            }

            return returnSum ? sim.sumDraws : sim.draws;

        }

        subDraw(numDraws: number, returnSum?: boolean) {
            returnSum = !!returnSum;
            return returnSum ? this.draws.slice(0,numDraws) : this.sumDraws.slice(0,numDraws);
        }


    }

}