/**
 * Created by cmakler on 3/3/15.
 */

econgraphs.functions.market.LinearSupply = function () {

    return function (params) {

        var s = new kg.functions.Linear({definitionType: 'slope-intercept'});

        var f = new econgraphs.functions.production.CobbDouglas();

        s.setSlope(1);
        s.setIntercept(0);

        // set default values for Cobb Douglas function f(L,K) = sqrt(LK)
        s.w = 1;
        s.r = 100;
        s.k = 1;
        s.n = 2000;

        s.updateParams = function (params) {

            if (typeof params == 'function') {
                params = params();
            }

            params = params || {};

            if (params.hasOwnProperty('w')) {
                s.w = params.w;
            }

            if (params.hasOwnProperty('r')) {
                s.r = params.r;
            }

            if (params.hasOwnProperty('k')) {
                s.k = params.k;
            }

            if (params.hasOwnProperty('n')) {
                s.n = params.n;
            }

            if (params.hasOwnProperty('fixedCost')) {
                s.fixedCost = params.fixedCost;
            }

            // q(P) = PK/2w => Q(P) = Nq(P) = PKN/2w => P(Q) = 2wQ/NK
            s.setSlope((2* s.w)/((s.n/1000) * s.k));

            return s;

        };

        s.quantitySupplied = function(p) {
            return s.xValue(p);
        };

        s.q = function(p) {
            return s.xValue(p)/(s.n/1000)
        };

        //TODO this doesn't currently update
        s.marginalCostCurve =  f.shortRunMarginalCostCurve(s.w, s.r, s.k);

        //TODO this doesn't currently update
        s.averageCostCurve = f.shortRunAverageCostCurve(s.w, s.r, s.k);

        s.profitArea = function(p) {
            return f.profitArea(p, s.q(p), s.w, s.r, s.k)
        };

        s.updateParams(params);

        s.qEquilibrium = function(demand, tax){
            return s.q(s.marketPrice(demand, tax));
        };

        s.marketPrice = function(demand, tax) {
            return s.linearIntersection(demand, tax).y;
        };

        s.profit = function(p) {
            return f.shortRunProfit(s.q(p), p, s.w, s.r, s.k)
        };

        s.producerSurplus = function(p) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var q = s.quantitySupplied(p);

                    return [
                        {x: xDomain.min, y: yDomain.min},
                        {x: q, y: p},
                        {x: xDomain.min, y: p}
                    ]
                }
            }
        };

        s.taxWedge = function(demand,tax) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var pc = Math.min(s.marketPrice(demand,-tax),yDomain.max),
                        pf = Math.min(s.marketPrice(demand,tax),yDomain.max),
                        q = s.quantitySupplied(pf);

                    return [
                        {x: xDomain.min, y:pc},
                        {x: q, y: pc},
                        {x: q, y: pf},
                        {x: xDomain.min, y: pf}
                    ]

                }
            }
        };

        s.taxDWL = function (demand, tax) {
            return {
                area: function (xDomain, yDomain) {

                    xDomain = domainAsObject(xDomain);
                    yDomain = domainAsObject(yDomain);

                    var pc = Math.min(s.marketPrice(demand, -tax), yDomain.max),
                        pf = Math.min(s.marketPrice(demand, tax), yDomain.max),
                        qt = s.quantitySupplied(pf),
                        pe = s.marketPrice(demand),
                        qe = s.quantitySupplied(pe);

                    return [
                        {x: qt, y: pc},
                        {x: qe, y: pe},
                        {x: qt, y: pf}

                    ]

                }
            }
        }

        return s;
    }

}();