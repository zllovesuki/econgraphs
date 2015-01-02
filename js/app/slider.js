/**
 * Created by cmakler on 10/31/14.
 */

'use strict';

kgAngular.directive('slider', function () {

        function link(scope, el, attrs, ModelCtrl) {
            el = el[0];

            var raw_value = scope.value; // needed to help smoothe slider motion

            var height = 40,
                radius = height / 2,
                margin = 20;

            var svg,circle, line;

            scope.width = el.parentElement.clientWidth - 2*margin;

            scope.innerWidth = scope.width - 2 * radius;

            function positionDelta(dx) {
                return dx * (scope.max - scope.min) / scope.innerWidth
            }

            svg = d3.select(el).append('svg')
                .attr({width: el.parentElement.clientWidth, height: 2 * radius});

            var drag = d3.behavior.drag()
                .on("dragstart", function () {
                    this.parentNode.appendChild(this);
                    d3.select(this).transition()
                        .ease("elastic")
                        .duration(500)
                        .attr("r", radius * 0.8);
                })
                .on("drag", function () {
                    var dragPosition = parseFloat(raw_value) + positionDelta(d3.event.dx);
                    raw_value = Math.max(scope.min, Math.min(scope.max, dragPosition));
                    scope.$apply(function() {
                        scope.value = Math.round(raw_value / parseFloat(scope.precision)) * scope.precision;
                    });
                    ModelCtrl.update();
                })
                .on("dragend", function () {
                    d3.select(this).transition()
                        .ease("elastic")
                        .duration(500)
                        .attr("r", radius * 0.7);
                });

            // Draw slider line
            line = svg.append('line').attr({x1: radius, x2: radius + scope.innerWidth, y1: radius, y2: radius, stroke: 'blue', strokeWidth: 1});

            // Establish y-coordinate and radius for control circle
            circle = svg.append('circle')
                .attr({cy: radius, r: radius * 0.7 })
                .call(drag);

            // Set and update x-coordinate for control circle
            scope.$watch('value', function (value) {
                circle.attr({cx: function() {
                    return radius + scope.innerWidth * (value - scope.min) / (scope.max - scope.min);
                }});
            });

            scope.$on('resize', function() {
                scope.width = el.parentElement.clientWidth - 2*margin;
                scope.innerWidth = scope.width - 2*radius;
                svg.attr('width',el.parentElement.clientWidth);
                line.attr('x2', radius + scope.innerWidth);
                circle.attr({cx: function () {
                    return radius + scope.innerWidth * (scope.value - scope.min) / (scope.max - scope.min);
                }});
            })


        }

        return {
            link: link,
            require: '^model',
            restrict: 'E',
            scope: { value: '=', min: '=', max: '=', precision: '=' }
        };
    });