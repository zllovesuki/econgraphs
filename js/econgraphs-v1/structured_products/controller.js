econGraphsApp.controller('StructuredProductsController', function($scope){

    $scope.productParams = {
        time: 3,
        original: 15000,
        current: 17000,
        rate: 3,
        dividend_percent: 1.75
    };

    $scope.$watchCollection("productParams",function(){ $scope.render() });
    window.onresize = function() { $scope.render()};

    $scope.render = function(){

        d3.select('svg').remove();
        drawStructuredProductsGraph($scope,"graph");

    };
});