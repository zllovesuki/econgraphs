/**
 * Created by cmakler on 2/17/15.
 */

econgraphs.functions.production = {

    addProductionMethods: function (f, params) {

        f.totalCostCurve = function (w,r) {

            return {points: function (xDomain, yDomain) {

                xDomain = domainAsObject(xDomain);
                yDomain = domainAsObject(yDomain);

                var points = [];

                var x, y;

                for (var i = 0; i < 51; i++) {

                    x = xDomain.min + (i / 50) * (xDomain.max - xDomain.min);
                    y = f.lowestPossibleCost(x,w,r);
                    if (inRange(y, yDomain)) {
                        points.push({x: x, y: y});
                    }
                }

                return points;
            }
            }


        };

        return f;

    }


}