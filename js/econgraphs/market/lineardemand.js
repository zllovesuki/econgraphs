/**
 * Created by cmakler on 3/3/15.
 */

econgraphs.functions.market.LinearDemand = function () {

    return function (params) {

        var d = new kg.functions.Linear({definitionType: 'slope-intercept'});

        d.qIntercept = 40;
        d.dQdP = -1;

        d.marginalRevenue = new kg.functions.Linear({definitionType: 'slope-intercept'});

        d.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            params = params || {};

            // intercept is quantity demanded at P = 0
            if (params.hasOwnProperty('intercept')) {
                d.qIntercept = params.intercept;
            }

            // slope is dQ/dP
            if (params.hasOwnProperty('slope')) {
                d.dQdP = params.slope;
            }

            // invert the slope and intercept
            d.setIntercept(-d.qIntercept / d.dQdP);
            d.setSlope(1/ d.dQdP);

            // set new slope and intercept for marginal revenue
            d.marginalRevenue.setIntercept(d.intercept);
            d.marginalRevenue.setSlope(2*d.slope);

            return d;

        };

        d.quantityDemanded = function(p) {
            return d.xValue(p);
        };

        d.maximumPrice = function(q) {
            return d.yValue(q);
        };

        d.revenue = function(q) {
            return q* d.maximumPrice(q);
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

                    if(qmax > 0) {
                        return [
                            {x: xDomain.min, y: p},
                            {x: q, y: p},
                            {x: qmax, y: yDomain.max},
                            {x: xDomain.min, y: yDomain.max}
                        ]
                    } else {
                        return [
                            {x: xDomain.min, y: p},
                            {x: q, y: p},
                            {x: xDomain.min, y: d.yIntercept()}
                        ]
                    }
                }
            }
        };

        d.marginalRevenueLoss = function (q1,q2) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var p1 = d.maximumPrice(q1),
                        p2 = d.maximumPrice(q2),
                        right = Math.min(q1,q2,xDomain.max),
                        lowerPrice = Math.min(p1,p2),
                        higherPrice = Math.max(p1,p2),
                        bottom = Math.min(lowerPrice, yDomain.max),
                        top = Math.min(higherPrice, yDomain.max);

                    return [
                        {x: xDomain.min, y: bottom},
                        {x: right, y: bottom},
                        {x: right, y: top},
                        {x: xDomain.min, y: top}
                    ]

                }
            }
        };

        d.marginalRevenueGain = function (q1, q2) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var p1 = d.maximumPrice(q1),
                        p2 = d.maximumPrice(q2),
                        top = Math.min(p1, p2, yDomain.max),
                        lowerQuantity = Math.min(q1, q2),
                        higherQuantity = Math.max(q1, q2),
                        left = Math.min(lowerQuantity, xDomain.max),
                        right = Math.min(higherQuantity, xDomain.max);

                    return [
                        {x: left, y: yDomain.min},
                        {x: right, y: yDomain.min},
                        {x: right, y: top},
                        {x: left, y: top}
                    ]

                }
            }
        };

        d.unchangedRevenue = function (q1, q2) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var quantity = Math.min(q1, q2),
                        price = d.maximumPrice(quantity),
                        top = Math.min(price, yDomain.max),
                        right = Math.min(quantity, xDomain.max);

                    return [
                        {x: xDomain.min, y: yDomain.min},
                        {x: right, y: yDomain.min},
                        {x: right, y: top},
                        {x: xDomain.min, y: top}
                    ]

                }
            }
        };

        d.totalRevenue = function (quantity) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var price = d.maximumPrice(quantity),
                        top = Math.min(price, yDomain.max),
                        right = Math.min(quantity, xDomain.max);

                    return [
                        {x: xDomain.min, y: yDomain.min},
                        {x: right, y: yDomain.min},
                        {x: right, y: top},
                        {x: xDomain.min, y: top}
                    ]

                }
            }
        };

        d.totalRevenueCurve = function () {
            return {
                points: function (xDomain, yDomain) {
                    return functionPoints(d.revenue, xDomain, yDomain);
                }
            }
        };

        d.mrTangentLine = function (q) {
            var point = {x: q, y: d.revenue(q)},
                slope = d.marginalRevenue.yValue(q),
                l = new kg.functions.Linear({definitionType: 'point-slope', point: point, slope: slope});
            return l;
        };


        d.updateParams(params);

        return d;
    }

}();