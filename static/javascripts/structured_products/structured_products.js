function drawStructuredProductsGraph($scope,id) {

    var structured_product_graph_data = {
        id : id,
        dimensions : {height: 500, width: 800},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Average Annual Percent Change", min: -30, max: 30},
        y_axis : {title: "Total Portfolio Net Present Value", min: 50, max: 150}
    };

    var graph = createGraph(structured_product_graph_data),
        domain = {min: -30, max: 30, step: 0.01},
        range = {min: 50, max: 150},
        productLabel = {text: "MS", reverse: true, delta: 5},
        indexLabel = {text: "DJIA", reverse: true, delta: 5};

    // percent increase of stock index at maturity, relative to original value
    // given current value, time to maturity, and rate of growth between now and then
    var index_increase = function(average_annual_increase,base_value) {
        var value_at_maturity = $scope.productParams.current*Math.pow(1 + average_annual_increase*0.01,$scope.productParams.time);
        return 100*value_at_maturity/base_value - 100;
    };

    var index_value = function(average_annual_increase) {
        return 100 + index_increase(average_annual_increase,$scope.productParams.current);
    }

    // net present value of value at maturity
    var npv = function(face_value, time_to_maturity, interest_rate) {
        var discount = Math.pow(1 + interest_rate*0.01,time_to_maturity);   // d = (1 + r)^t
        return face_value / discount;                                       // NPV = FV / d
      };

    // structured product rules
    var sp_value = function(average_annual_increase) {
      var raw_increase = index_increase(average_annual_increase,$scope.productParams.original);
      var percent_increase = 0;
      if(raw_increase < -20) {
        percent_increase = raw_increase + 20;
      } else if(raw_increase < 0) {
        percent_increase = 0;
      } else if(raw_increase < 16.5) {
        percent_increase = 16.5;
      } else {
        percent_increase = raw_increase;
      };
      return 100 + percent_increase;
    };

    //
    var present_value_of_structured_product = function(average_annual_increase) {
        return npv(sp_value(average_annual_increase), $scope.productParams.time, $scope.productParams.rate);
    };

    var present_value_of_index = function(average_annual_increase) {
        return npv(index_value(average_annual_increase)*Math.pow(1 + $scope.productParams.dividend_percent*0.01, $scope.productParams.time), $scope.productParams.time, $scope.productParams.rate);
    }

    // Draw demand and supply curves
    drawFunction(present_value_of_structured_product,domain,range,graph,demandColor,productLabel);
    //drawFunction(present_value_of_index,domain,range,graph,supplyColor,indexLabel);


}

