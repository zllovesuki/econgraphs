/**
 * Created by cmakler on 10/31/14.
 */

'use strict';

kgAngular.directive('model', function () {

    function controller($scope, $window) {

        $scope.params = $scope.params || {};
        $scope.functions = $scope.functions || {};

        // Redraw graph objects when a child calls this update function
        this.update = function() {
            $scope.$broadcast('redraw');
        };

        Reveal.addEventListener('ready',function(event) {
            console.log('content loaded');
            $scope.$broadcast('resize');
        });

        // Redraw graph objects when parameters change
        $scope.$watchCollection('params',function(){$scope.$broadcast('redraw');});




        // Setters for parameters and functions
        this.setValue = function(category,name,value) {
            $scope[category][name] = value;
        };

    }

    return {
        restrict: 'E',
        scope: true,
        controller: controller
    }

})