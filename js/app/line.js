/**
 * Created by cmakler on 11/3/14.
 */

kgAngular.directive('line', function (D3Helpers) {

        function link(scope, element, attrs, graphCtrl) {

            // Show unless there is an attribute determining show/hide behavior
            if (!attrs['show']) {
                scope.show = function () {
                    return true
                }
            }

            graphCtrl.addObject({

                update: function (shapes, graph) {

                    if (scope.show()) {

                        if(scope.params() != undefined && scope.params().hasOwnProperty('definitionType')) {
                            scope.fn = new kg.functions.Linear(scope.params());
                        }

                        var l = (typeof scope.fn == 'function') ? scope.fn() : scope.fn;

                        if(l != undefined) {var points = l.points(graph.xDomain, graph.yDomain),
                            x1 = graph.x(points[0].x),
                            y1 = graph.y(points[0].y),
                            x2 = graph.x(points[1].x),
                            y2 = graph.y(points[1].y);

                        shapes.lines.push({x1: x1, y1: y1, x2: x2, y2: y2, color: scope.color});}

                        // Add label to last point

                        var label = scope.label || 'none';

                        if (label != 'none') {
                            var labelObject = D3Helpers.configLabel({
                                graph: graph,
                                html: label,
                                point: points[1],
                                xOffset: parseInt(scope.labelOffsetX),
                                yOffset: parseInt(scope.labelOffsetY)
                            });
                            labelObject.color = scope.color;

                            shapes.divs.push(labelObject);
                        }
                    }

                    return shapes;

                }
            });

        }

        return {
            link: link,
            require: '^graph',
            restrict: 'E',
            scope: { fn: '&', color: '@', show:'&', params: '&', label:'@', labelOffsetX:'&', labelOffsetY:'&'}
        }
    }
);

kgAngular.directive('segment', function () {

        function link(scope, element, attrs, graphCtrl) {

            // Show unless there is an attribute determining show/hide behavior
            if (!attrs['show']) {
                scope.show = function () {
                    return true
                }
            }

            graphCtrl.addObject({

                update: function (shapes, graph) {

                    if (scope.show()) {

                        var points = (typeof scope.points == 'function') ? scope.points() : scope.points;

                        var x1 = graph.x(points[0].x),
                            y1 = graph.y(points[0].y),
                            x2 = graph.x(points[1].x),
                            y2 = graph.y(points[1].y);

                        shapes.lines.push({x1: x1, y1: y1, x2: x2, y2: y2, color: scope.color});

                    }

                    return shapes;

                }
            });

        }

        return {
            link: link,
            require: '^graph',
            restrict: 'E',
            scope: { points: '&', color: '@', show:'&'}
        }
    }
);