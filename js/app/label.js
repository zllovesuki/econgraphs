/**
 * Created by cmakler on 1/9/15.
 */

kgAngular.directive('label', function () {

        function link(scope, element, attrs, graphCtrl) {

            // Show unless there is an attribute determining show/hide behavior
            if(!attrs['show']) { scope.show = function(){return true} }

            graphCtrl.addObject({

                update: function (shapes, graph) {

                    if (scope.show()) {

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

                            shapes.divs.push({
                                html: l,
                                x: cx - 75,
                                y: cy + 5,
                                width: 150,
                                align: 'center',
                                color: scope.color,
                                math: false,
                                size: '14pt'
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