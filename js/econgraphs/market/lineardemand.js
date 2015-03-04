/**
 * Created by cmakler on 3/3/15.
 */

econgraphs.functions.market.LinearDemand = function () {

    return function (params) {

        var d = new kg.functions.Linear({definitionType: 'slope-intercept'});

        d.intercept = 40;
        d.slope = -1;

        d.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            params = params || {};

            // intercept is quantity demanded at P = 0
            if (params.hasOwnProperty('intercept')) {
                d.intercept = params.intercept;
            }

            // slope is dQ/dP
            if (params.hasOwnProperty('slope')) {
                d.slope = params.slope;
            }

            // invert the slope and intercept
            d.setIntercept(-d.intercept / d.slope);
            d.setSlope(1/ d.slope);

            console.log('set intercept to ' + d.intercept + 'and slope to ' + d.slope);

            return d;

        };

        d.quantityDemanded = function(p) {
            return d.xValue(p);
        };

        d.marketPrice = function (supply,tax) {
            return d.linearIntersection(supply,tax).y;
        };

        d.consumerSurplus = function (p) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var q = d.quantityDemanded(p),
                        qmax = d.quantityDemanded(yDomain.max);

                    return [
                        {x: xDomain.min, y: yDomain.min},
                        {x: q, y: p},
                        {x: xDomain.min, y: p}
                    ]
                }
            }
        };

        d.updateParams(params);

        return d;
    }

}();