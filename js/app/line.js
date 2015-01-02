/**
 * Created by cmakler on 11/3/14.
 */

kgAngular.directive('line', function () {

        function link(scope, element, attrs, graphCtrl) {

            graphCtrl.addObject({

                update: function (shapes, graph) {

                    var l = (typeof scope.fn == 'function') ? scope.fn() : scope.fn;

                    var points = l.points(graph.xDomain,graph.yDomain),
                        x1 = graph.x(points[0].x),
                        y1 = graph.y(points[0].y),
                        x2 = graph.x(points[1].x),
                        y2 = graph.y(points[1].y);

                    shapes.lines.push({x1: x1, y1: y1, x2: x2, y2: y2, color: scope.color})

                    return shapes;

                }
            });

        }

        return {
            link: link,
            require: '^graph',
            restrict: 'E',
            scope: { fn: '&', color: '@'}
        }
    }
);