/**
 * Created by cmakler on 2/17/15.
 */


econgraphs.functions.production.CobbDouglas = function () {

    return function (params) {

        var f = new econgraphs.functions.utility.CobbDouglas(params);

        f = econgraphs.functions.production.addProductionMethods(f, params);

        return f;
    }

}();