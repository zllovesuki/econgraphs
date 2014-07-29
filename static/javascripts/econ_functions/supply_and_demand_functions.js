/**
 * Created by cmakler on 5/29/14.
 */

var CE_QuantityAtPrice = function(curveParams,price) {
    return curveParams.q * Math.pow(price/curveParams.p,curveParams.elasticity);
};

var CE_EquilibriumPrice = function(demandParams,supplyParams,tax_rate) {
    var supply_ratio = supplyParams.q / Math.pow(supplyParams.p,supplyParams.elasticity),
        demand_ratio = demandParams.q / Math.pow(demandParams.p,demandParams.elasticity),
        tax_factor = Math.pow(1 + 0.01*tax_rate, demandParams.elasticity);

    return Math.pow(supply_ratio/(demand_ratio*tax_factor),(1/(demandParams.elasticity - supplyParams.elasticity)));
};

var slope = function(curveParams) {
    return CE_QuantityAtPrice(curveParams,curveParams.p + 0.5) - CE_QuantityAtPrice(curveParams,curveParams.p - 0.5)
};

var LinearQuantityAtPrice = function(curveParams,price) {

    // use point-slope formula q = q* + m(p - p*)
    var linear_quantity = (curveParams.q + slope(curveParams) * (price - curveParams.p));

    if(linear_quantity > 0) {
        return linear_quantity
    } else {
        return 0
    }
};

var LinearEquilibriumPrice = function(demandParams,supplyParams,tax_rate) {
    var demand_slope = slope(demandParams),
        supply_slope = slope(supplyParams);

    return (supplyParams.q - demandParams.q + demand_slope*demandParams.p - supply_slope*supplyParams.p) / (demand_slope*(1 + tax_rate*0.01) - supply_slope);
}