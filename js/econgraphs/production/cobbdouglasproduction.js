/**
 * Created by cmakler on 2/17/15.
 */


econgraphs.functions.production.CobbDouglas = function () {

    return function (params) {

        var f = new econgraphs.functions.utility.CobbDouglas(params);

        f = econgraphs.functions.production.addProductionMethods(f, params);

        f._shortRunProfitMaxQ = function(p,w,r,k) {
            return 3;
        };

        return f;
    }

}();