// create module for custom directives
var econGraphsApp = angular.module('econGraphsApp', []);

econGraphsApp.controller('Controller', function($scope){

    $scope.quantitativeAnalysis = true;

   });

econGraphsApp.directive('slider', function () {

    function link(scope, el, attr) {
        el = el[0]

        var width = 200,
            height = 40,
            radius = height / 2,
            innerWidth = width - height;

        function position(x) {
            return radius + innerWidth * (x - scope.min) / (scope.max - scope.min)
        }

        function positionDelta(dx) {
            return dx * (scope.max - scope.min) / innerWidth;
        }

        var svg = d3.select(el).append('svg')
            .attr({width: width, height: 2 * radius})

        scope.$watch('value', function (value) {
            circle.attr({cx: position(value)});
        });

        var drag = d3.behavior.drag()
            .on("dragstart", dragstarted)
            .on("drag", function () {
                var dragPosition = parseFloat(scope.value) + positionDelta(d3.event.dx);
                scope.value = Math.max(scope.min, Math.min(scope.max, dragPosition))
                scope.$apply();
            })
            .on("dragend", dragended);

        function dragstarted() {
            this.parentNode.appendChild(this);

            d3.select(this).transition()
                .ease("elastic")
                .duration(500)
                .attr("r", radius * 0.8);
        }

        function dragended() {
            d3.select(this).transition()
                .ease("elastic")
                .duration(500)
                .attr("r", radius * 0.7);
        }

        var axis = svg.append('line').attr({x1: radius, x2: radius + innerWidth, y1: radius, y2: radius, stroke: 'blue', strokeWidth: 1});

        var circle = svg.append('circle')
            .attr({cy: radius, r: radius * 0.7 })
            .call(drag);


    }

    return {
        link: link,
        restrict: 'E',
        scope: { value: '=', min: '=', max: '=' }
    };
});