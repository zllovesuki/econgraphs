module KGMath.Distributions {

    export interface BaseDefinition {

    }

    export interface IBase extends KG.IModel {
        randomDraw: () => number;
        frequency: (x:any) => number;
        cumulative: (x:any) => number;
    }

    export class Base extends KG.Model {

        constructor(definition,modelPath?) {
            super(definition,modelPath);
        }

        randomDraw() {
            return 0; //overridden by subclass
        }

        frequency(x) {
            return 0; //overridden by subclass
        }

        cumulative(x) {
            return 0; //overridden by subclass
        }

    }

}