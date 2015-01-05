/**
 * Created by cmakler on 11/3/14.
 */

kgAngular.directive('point', function () {

        function link(scope, element, attrs, graphCtrl) {

            graphCtrl.addObject({

                update: function (shapes,graph) {

                    var p = (typeof scope.point == 'function') ? scope.point() : scope.point;

                    var droplines = scope.droplines || 'none'; // set droplines to "none" by default

                    var x = p[0],
                        y = p[1];

                    var xInDomain = (x <= graph.xDomain[1] && x >= graph.xDomain[0]),
                        yInDomain = (y <= graph.yDomain[1] && y >= graph.yDomain[0]);

                    var cx = graph.x(x),
                        cy = graph.y(y);

                    // Add point to shapes if it's in the graph domain
                    if(xInDomain && yInDomain) {

                        shapes.circles.push({
                            color: scope.color,
                            cx: cx,
                            cy: cy
                        });

                    }

                    // Add associated droplines and labels only if the each is in its dimension of the graph domain

                    if (droplines != 'none') {

                        // Add a vertical dropline unless droplines == horizontal
                        if (droplines != 'horizontal' && xInDomain) {
                            shapes.lines.push({class: scope.style + ' dropline', color: scope.color,
                                x1: cx, y1: Math.max(cy,0), x2: cx, y2: graph.height + 25});
                            if (scope.xlabel != '') {
                                shapes.texts.push({
                                    text: scope.xlabel,
                                    x: cx,
                                    y: graph.height + 40,
                                    anchor: 'middle'
                                })
                            }
                        }

                        // Add a horizontal dropline unless droplines == vertical
                        if (droplines != 'vertical' && yInDomain) {
                            shapes.lines.push({class: scope.style + ' dropline', color: scope.color,
                                x1: Math.min(cx,graph.width), y1: cy, x2: -25, y2: cy});
                            if (scope.ylabel != '') {
                                shapes.texts.push({
                                    text: scope.ylabel,
                                    x: -27,
                                    y: cy + 5,
                                    anchor: 'end'
                                })
                            }
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
            scope: { point: '&', droplines: '@', xlabel: '@', ylabel: '@', color: '@'}
        }
    }
);