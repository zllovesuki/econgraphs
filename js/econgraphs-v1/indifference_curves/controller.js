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

        drawCobbDouglass($scope,'graph');

    }

});