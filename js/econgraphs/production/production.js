/**
 * Created by cmakler on 2/17/15.
 */

econgraphs.functions.production = {

    addProductionMethods: function (f, params) {

        f.longRunTotalCost = function(q,w,r) {
            return f.lowestPossibleCost(q,w,r);
        };

        f.longRunTotalCostCurve = function (w, r) {

            return {
                points: function (xDomain, yDomain) {

                    var longRunTotalCost = function (q) {
                        return f.longRunTotalCost(q, w, r)
                    };

                    return functionPoints(longRunTotalCost, xDomain, yDomain);
                }
            }

        };

        f.laborToProduceQ = function(q,k) {
            f.setLevel(q);
            return f.xValue(k);
        };

        f.shortRunFixedCost = function(r,k) {
            return r*k;
        };

        f.shortRunFixedCostCurve = function (r, k) {

            return {
                points: function (xDomain, yDomain) {

                    var shortRunFixedCost = function (q) {
                        return f.shortRunFixedCost(r, k)
                    };

                    return functionPoints(shortRunFixedCost, xDomain, yDomain);
                }
            }

        };

        f.shortRunVariableCost = function(q,w,k) {
            return w* f.laborToProduceQ(q,k);
        };

        f.shortRunVariableCostCurve = function (w, k) {

            return {
                points: function (xDomain, yDomain) {

                    var shortRunVariableCost = function (q) {
                        return f.shortRunVariableCost(q, w, k)
                    };

                    return functionPoints(shortRunVariableCost, xDomain, yDomain);
                }
            }

        };

        f.shortRunTotalCost = function(q,w,r,k) {
            return f.shortRunFixedCost(r,k) + f.shortRunVariableCost(q,w,k);
        };

        f.shortRunTotalCostCurve = function (w, r, k) {

            return {
                points: function (xDomain, yDomain) {

                    var shortRunTotalCost = function (q) {
                        return f.shortRunTotalCost(q, w, r, k)
                    };

                    return functionPoints(shortRunTotalCost, xDomain, yDomain);
                }
            }

        };

        f.longRunMarginalCost = function(q,w,r) {
            return (f.longRunTotalCost(q+0.01,w,r) - f.longRunTotalCost(q,w,r))*100;
        };

        f.longRunMarginalCostCurve = function (w, r) {

            return {
                points: function (xDomain, yDomain) {

                    var longRunMarginalCost = function (q) {
                        return f.longRunMarginalCost(q, w, r)
                    };

                    return functionPoints(longRunMarginalCost, xDomain, yDomain);
                }
            }

        };

        f.shortRunMarginalCost = function (q, w, r, k) {
            return (f.shortRunTotalCost(q + 0.01, w, r, k) - f.shortRunTotalCost(q, w, r, k)) * 100;
        };

        f.shortRunMarginalCostCurve = function (w, r, k) {

            return {
                points: function (xDomain, yDomain) {

                    var shortRunMarginalCost = function (q) {
                        return f.shortRunMarginalCost(q, w, r, k)
                    };

                    return functionPoints(shortRunMarginalCost, xDomain, yDomain);
                }
            }

        };

        f.longRunAverageCost = function (q, w, r) {
            return f.longRunTotalCost(q, w, r)/q;
        };

        f.longRunAverageCostCurve = function (w, r) {

            return {
                points: function (xDomain, yDomain) {

                    var longRunAverageCost = function (q) {
                        return f.longRunAverageCost(q, w, r)
                    };

                    return functionPoints(longRunAverageCost, xDomain, yDomain);
                }
            }

        };

        f.shortRunAverageCost = function (q, w, r, k) {
            return f.shortRunTotalCost(q, w, r, k) / q;
        };

        f.shortRunAverageCostCurve = function (w, r, k) {

            return {
                points: function (xDomain, yDomain) {

                    var shortRunAverageCost = function (q) {
                        return f.shortRunAverageCost(q, w, r, k)
                    };

                    return functionPoints(shortRunAverageCost, xDomain, yDomain);
                }
            }

        };

        f.shortRunAverageFixedCost = function (q, r, k) {
            return r * k / q;
        };

        f.shortRunAverageFixedCostCurve = function (r, k) {

            return {
                points: function (xDomain, yDomain) {

                    var shortRunAverageFixedCost = function (q) {
                        return f.shortRunAverageFixedCost(q, r, k)
                    };

                    return functionPoints(shortRunAverageFixedCost, xDomain, yDomain);
                }
            }

        };


        f.shortRunAverageVariableCost = function (q, w, k) {
            return f.shortRunVariableCost(q,w,k) / q;
        };

        f.shortRunAverageVariableCostCurve = function (w, r, k) {

            return {
                points: function (xDomain, yDomain) {

                    var shortRunAverageVariableCost = function (q) {
                        return f.shortRunAverageVariableCost(q, w, r, k)
                    };

                    return functionPoints(shortRunAverageVariableCost, xDomain, yDomain);
                }
            }

        };

        return f;

    }

};