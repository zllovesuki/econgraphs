/**
 * Created by cmakler on 10/31/14.
 */
var kgAngular = angular.module('kineticGraphs', []);

kgAngular.controller('kgController', function ($scope) {

    Reveal.addEventListener('slidechanged', function (event) {
        $scope.$broadcast('resize');
    });

});