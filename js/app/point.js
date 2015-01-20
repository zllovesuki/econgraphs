/**
 * Created by cmakler on 11/3/14.
 */

kgAngular.directive('point', function () {

        function link(scope, element, attrs, graphCtrl) {

            // Show unless there is an attribute determining show/hide behavior
            if (!attrs['show']) {
                scope.show = function () {
                    return true
                }
            }

            graphCtrl.addObject({

                update: function (shapes,graph) {

                    if (scope.show()) {

                        var p = (typeof scope.point == 'function') ? scope.point() : scope.point;

                        var droplines = scope.droplines || 'none'; // set droplines to "none" by default

                        var label = scope.label || 'none';

                        var x = p[0],
                            y = p[1];

                        var xInDomain = (x <= graph.xDomain[1] && x >= graph.xDomain[0]),
                            yInDomain = (y <= graph.yDomain[1] && y >= graph.yDomain[0]);

                        var cx = graph.x(x),
                            cy = graph.y(y);

                        // Add point to shapes if it's in the graph domain
                        if (xInDomain && yInDomain) {

                            shapes.circles.push({
                                color: scope.color,
                                cx: cx,
                                cy: cy
                            });

                        }

                        if (label != 'none') {
                            shapes.texts.push({
                                text: scope.label,
                                x: cx,
                                y: cy + 5,
                                anchor: 'middle',
                                color: 'white'
                            })
                        }


                        // Add associated labels only if each is in its dimension fo the graph domain
                        if (scope.xlabel != '' && xInDomain) {
                            shapes.divs.push({
                                html: scope.xlabel,
                                x: cx - 50,
                                y: graph.height + 20,
                                width: 100,
                                color: scope.color
                            })
                        }

                        if (scope.ylabel != '' && yInDomain) {
                            shapes.divs.push({
                                html: scope.ylabel,
                                x: -70,
                                y: cy - 20,
                                width: 50,
                                color: scope.color
                            })
                        }

                        // Add associated droplines only if the each is in its dimension of the graph domain

                        if (droplines != 'none') {

                            // Add a vertical dropline unless droplines == horizontal
                            if (droplines != 'horizontal' && xInDomain) {
                                shapes.lines.push({class: scope.style + ' dropline', color: scope.color,
                                    x1: cx, y1: Math.max(cy, 0), x2: cx, y2: graph.height + 25});
                            }

                            // Add a horizontal dropline unless droplines == vertical
                            if (droplines != 'vertical' && yInDomain) {
                                shapes.lines.push({class: scope.style + ' dropline', color: scope.color,
                                    x1: Math.min(cx, graph.width), y1: cy, x2: -25, y2: cy});
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
            scope: { point: '&', droplines: '@', label: '@', xlabel: '@', ylabel: '@', color: '@', show:'&'}
        }
    }
);