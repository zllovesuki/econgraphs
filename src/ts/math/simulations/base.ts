module KGMath.Simulations {

    export interface BaseDefinition {
        numDraws: number;
        distribution: {type: string; definition: KGMath.Distributions.BaseDefinition;}
    }

    export interface IBase extends KG.IModel {
        numDraws: number;
        distribution: KGMath.Distributions.Base;
        newDraw: (numDraws?:number, returnSum?:boolean) => number[];
        subDraw: (numSubDraws?:number, returnSum?:boolean) => number[];
        draws: number[];
        sumDraws: number[];
    }

    export class Base extends KG.Model {

        public numDraws;
        public distribution;
        public draws;
        public sumDraws;


        constructor(definition,modelPath?) {

            definition = _.defaults(definition,{
                numDraws: 1,
                distribution: {type: 'KGMath.Distributions.Normal', definition: {}}
            });

            super(definition,modelPath);

            this.newDraw(definition.numDraws);

        }

        newDraw(numDraws?: number, returnSum?:boolean) {
            var sim = this;

            returnSum = !!returnSum;

            // establish the number of draws
            if(numDraws) {
                sim.numDraws = numDraws;
            }

            // initialize draws
            var sum = 0;
            sim.draws = [];
            sim.sumDraws = [];

            var currentDraw;
            for(var i=0;i<sim.numDraws;i++) {
                currentDraw = sim.distribution.draw();
                sim.draws.push(currentDraw);
                sum += currentDraw;
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