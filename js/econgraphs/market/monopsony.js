/**
 * Created by cmakler on 3/3/15.
 */

econgraphs.functions.market.Monopsony = function () {

    return function (params) {

        var m = {};

        // We're assuming a monopoly's marginal revenue product of labor is linear

        m.MRPL = new kg.functions.Linear({definitionType: 'slope-intercept'});

        m.MRPL.setSlope(0);
        m.MRPL.setIntercept(1);

        m.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            params = params || {};

            if (params.hasOwnProperty('mrplSlope')) {
                m.MRPL.setSlope(params['mrplSlope']);
            }

            if (params.hasOwnProperty('mrplIntercept')) {
                m.MRPL.setIntercept(params['mrplIntercept']);
            }

            if (params.hasOwnProperty('fixedCost')) {
                m.fixedCost = params['fixedCost']
            }

            return m;

        };

        m.updateParams(params);

        // total cost is FC plus the integral of marginal cost
        // MC = a + bq
        // TC = FC + aq + 0.5bq^2
        m.totalCost = function (q) {
            return m.fixedCost + q * m.MRPL.intercept + 0.5 * q * q * m.MRPL.slope;
        };

        m.averageCost = function (q) {
            return m.totalCost(q)/q;
        };

        m.totalCostCurve = function () {
            return {
                points: function (xDomain, yDomain) {
                    return functionPoints(m.totalCost, xDomain, yDomain);
                }
            }
        };

        m.averageCostCurve = function () {
            return {
                points: function (xDomain, yDomain) {
                    return functionPoints(m.averageCost, xDomain, yDomain);
                }
            }
        };

        m.optimalCondition = function(supply) {
            return m.MRPL.linearIntersection(supply.marginalExpense)
        };

        m.optimalOffer = function(supply) {
            return {x: m.Q(supply), y: m.P(supply)};
        };

        m.Q = function(supply) {
            return m.optimalCondition(supply).x;
        };

        m.P = function (supply) {
            return supply.yValue(m.Q(supply));
        };

        m.profit = function(supply) {
            var offer = m.optimalOffer(supply),
                revenue = offer.x * offer.y,
                cost = m.totalCost(offer.x);

            return revenue - cost;
        };

        m.profitArea = function (supply) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var price = Math.min(m.P(supply), yDomain.max),
                        quantity = Math.min(m.Q(supply), xDomain.max),
                        ac = Math.min(m.averageCost(quantity), yDomain.max);

                    return [
                        {x: xDomain.min, y: ac},
                        {x: quantity, y: ac},
                        {x: quantity, y: price},
                        {x: xDomain.min, y: price}
                    ]
                }
            }
        };

        m.producerSurplus = function(supply) {
            return {
                area: function(xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var price = Math.min(m.P(supply), yDomain.max),
                        quantity = Math.min(m.Q(supply), xDomain.max),
                        mrplZero = Math.min(m.MRPL.yValue(0), yDomain.max),
                        mrplQuantity = Math.min(m.MRPL.yValue(quantity), yDomain.max);

                    return [
                        {x: xDomain.min, y: mrplZero},
                        {x: quantity, y: mrplQuantity},
                        {x: quantity, y: price},
                        {x: xDomain.min, y: price}
                    ]

                }
            }
        }


        return m;
    }

}();