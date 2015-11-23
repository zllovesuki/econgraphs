module KGMath.Functions {

    export interface MinAxByDefinition extends BaseDefinition {
        xCoefficient: any;
        yCoefficient: any;
    }

    export interface IMinAxBy extends IBase {
        definition: MinAxByDefinition;
        xCoefficient: number;
        yCoefficient: number;
    }

    export class MinAxBy extends Base implements IMinAxBy {

        public xCoefficient;
        public yCoefficient;
        public definition;

        constructor(definition:MinAxByDefinition, modelPath?: string) {
            super(definition, modelPath);
        }

        value(bases?) {

            var m = this;

            if(bases) {
                m.setBases(bases);
            }

            var xMinimand = m.xCoefficient*m.bases[0],
                yMinimand = m.yCoefficient*m.bases[1];

            if(isNaN(xMinimand)) {
                return yMinimand;
            } else if(isNaN(yMinimand)) {
                return xMinimand;
            } else {
                return Math.min(xMinimand, yMinimand);
            }

        }

        derivative(n?) {

            var m = this;

            var d = new KGMath.Functions.Linear({
                coefficients: {
                    a: m.definition.xCoefficient,
                    b: m.definition.yCoefficient,
                    c: 0
                }
            });

            d.value = function(bases) {

                if(bases) {
                    d.setBases(bases)
                }

                var xMinimand = d.coefficients.a*d.bases[0],
                    yMinimand = d.coefficients.b*d.bases[1];

                if(n == 1 && xMinimand < yMinimand) {
                    return d.coefficients.a
                } else if(n == 2 && yMinimand < xMinimand) {
                    return d.coefficients.b
                } else {
                    return 0
                }

            };

            return d;


        }

        points(view) {

            var m = this;

            var criticalX = m.level/m.xCoefficient,
                criticalY = m.level/m.yCoefficient;

            return [
                {
                    x: criticalX,
                    y: view.yAxis.max
                },
                {
                    x: criticalX,
                    y: criticalY
                },
                {
                    x: view.xAxis.max,
                    y: criticalY
                }
            ]

        }
    }

}