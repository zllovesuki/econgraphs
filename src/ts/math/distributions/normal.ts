module KGMath.Distributions {

    export interface NormalDefinition extends BaseDefinition {
        mean?: any;
        variance?: any;
        sd?: any;
    }

    export interface INormal extends IBase {
        mean: number;
        variance: number;
        sd: number;
    }

    export class Normal extends Base implements INormal{

        public mean;
        public variance;
        public sd;

        constructor(definition:NormalDefinition,modelPath?) {

            definition = _.defaults(definition,{
                mean: 0,
                sd: 1
            });

            if(definition.hasOwnProperty('sd')) {
                definition.variance = KG.squareDef(definition.sd);
            } else if(definition.hasOwnProperty('variance')) {
                definition.sd = KG.sqrtDef(definition.variance);
            }

            super(definition,modelPath);
        }

        randomDraw() {
            return d3.random.normal(this.mean,this.sd)();
        }

    }

}