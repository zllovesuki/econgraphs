/**
 * Created by cmakler on 1/9/15.
 */

kgAngular.directive('rect', function (D3Helpers) {

        function link(scope, element, attrs, graphCtrl) {

            graphCtrl.addObject({

                update: function (shapes, graph) {

                    var show = (false != scope.show);

                    if(show) {

                        var p = (typeof scope.points == 'function') ? scope.points() : scope.points;

                        var x1 = graph.x(p[0][0]),
                            y1 = graph.y(p[0][1]),
                            x2 = graph.x(p[1][0]),
                            y2 = graph.y(p[1][1]);

                        var x = Math.min(x1,x2),
                            y = Math.min(y1,y2),
                            width = Math.abs(x1 - x2),
                            height = Math.abs(y1 - y2);

                        shapes.rects.push({x: x, y: y, width: width, height:height , color: scope.color});

                    }

                    return shapes;

                }
            });

        }

        return {
            link: link,
            require: '^graph',
            restrict: 'E',
            scope: { points: '&', show: '&', color: '@' }
        }
    }
);