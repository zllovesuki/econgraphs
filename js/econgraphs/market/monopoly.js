/**
 * Created by cmakler on 3/3/15.
 */

econgraphs.functions.market.Monopoly = function () {

    return function (params) {

        var m = {};

        // We're assuming a monopoly's cost structure is defined by its (linear) marginal cost

        m.marginalCost = new kg.functions.Linear({definitionType: 'slope-intercept'});

        m.marginalCost.setSlope(0);
        m.marginalCost.setIntercept(1);

        // If MC =

        m.fixedCost = 12;

        m.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            params = params || {};

            if (params.hasOwnProperty('mcSlope')) {
                m.marginalCost.setSlope(params['mcSlope']);
            }

            if (params.hasOwnProperty('mcIntercept')) {
                m.marginalCost.setIntercept(params['mcIntercept']);
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
            return m.fixedCost + q * m.marginalCost.intercept + 0.5 * q * q * m.marginalCost.slope;
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

        m.optimalCondition = function(demand) {
            return m.marginalCost.linearIntersection(demand.marginalRevenue)
        };

        m.optimalOffer = function(demand) {
            return {x: m.Q(demand), y: m.P(demand)};
        };

        m.Q = function(demand) {
            return m.optimalCondition(demand).x;
        };

        m.P = function (demand) {
            return demand.yValue(m.Q(demand));
        };

        m.profit = function(demand) {
            var offer = m.optimalOffer(demand),
                revenue = offer.x * offer.y,
                cost = m.totalCost(offer.x);

            return revenue - cost;
        };

        m.profitArea = function (demand) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var price = Math.min(m.P(demand), yDomain.max),
                        quantity = Math.min(m.Q(demand), xDomain.max),
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

        m.producerSurplus = function(demand) {
            return {
                area: function(xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var price = Math.min(m.P(demand), yDomain.max),
                        quantity = Math.min(m.Q(demand), xDomain.max),
                        mcZero = Math.min(m.marginalCost.yValue(0), yDomain.max),
                        mcQuantity = Math.min(m.marginalCost.yValue(quantity), yDomain.max);

                    return [
                        {x: xDomain.min, y: mcZero},
                        {x: quantity, y: mcQuantity},
                        {x: quantity, y: price},
                        {x: xDomain.min, y: price}
                    ]

                }
            }
        };

        m.deadWeightLoss = function (demand) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    // TODO handle cases where one or more points is off the graph

                    var monopolyPrice = m.P(demand),
                        monopolyQuantity = m.Q(demand),
                        monopolyMC = m.marginalCost.yValue(monopolyQuantity);

                    return [
                        {x: monopolyQuantity, y: monopolyMC},
                        {x: monopolyQuantity, y: monopolyPrice},
                        m.marginalCost.linearIntersection(demand)
                    ]

                }
            }
        };


        return m;
    }

}();