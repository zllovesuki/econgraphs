/**
 * Created by cmakler on 1/9/15.
 */

kgAngular.directive('label', function () {

        function link(scope, element, attrs, graphCtrl) {

            graphCtrl.addObject({

                update: function (shapes, graph) {

                    var show = (scope.show() == true);

                    if (show) {

                        var p = (typeof scope.point == 'function') ? scope.point() : scope.point;
                        var l = (typeof scope.label == 'function') ? scope.label() : scope.label;

                        var x = p[0],
                            y = p[1];

                        var xInDomain = (x <= graph.xDomain[1] && x >= graph.xDomain[0]),
                            yInDomain = (y <= graph.yDomain[1] && y >= graph.yDomain[0]);

                        var cx = graph.x(x),
                            cy = graph.y(y);

                        // Add label to shapes if it's in the graph domain
                        if (xInDomain && yInDomain) {

                            shapes.texts.push({
                                text: l,
                                x: cx,
                                y: cy + 5,
                                anchor: 'middle',
                                color: scope.color
                            });

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
            scope: { point: '&', label: '@', color: '@', show:'&'}
        }
    }
);