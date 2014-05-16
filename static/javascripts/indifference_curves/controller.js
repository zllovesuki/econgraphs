/**
 * Created by cmakler on 5/12/14.
 */

econGraphsApp.controller('IndifferenceCurvesController',function($scope){

    $scope.utilityParams = {
        alpha : 0.5
    };

    $scope.allocation = {
        x : 5,
        y : 5
    };

    $scope.$watchCollection("utilityParams",function(){ $scope.render() });
    $scope.$watchCollection("allocation",function(){ $scope.render() });
    window.onresize = function() { $scope.render()};

    $scope.render = function(){

        d3.select('svg').remove();

        var indifference_curve_graph_data = {
            id : "graph",
            dimensions : {height: 500, width: 500},
            margin : {top: 10, right: 100, bottom: 100, left: 70},
            x_axis : {title: "Units of Good X", min: 0, max: 10, ticks: 10},
            y_axis : {title: "Units of Good Y", min: 0, max: 10, ticks: 10}
        };

        var indifference_curve_graph = createGraph(indifference_curve_graph_data);
        drawCobbDouglass(indifference_curve_graph,$scope);

    }

});