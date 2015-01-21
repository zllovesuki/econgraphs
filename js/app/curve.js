/**
 * Created by cmakler on 11/3/14.
 */

kgAngular.directive('curve', function (D3Helpers) {

        function link(scope, element, attrs, graphCtrl) {

            // Show unless there is an attribute determining show/hide behavior
            if (!attrs['show']) {
                scope.show = function () {
                    return true
                }
            }

            graphCtrl.addObject({
                
                update: function (shapes,graph) {

                    if(scope.show()) {

                        var p = (typeof scope.fn == 'function') ? scope.fn() : scope.fn;

                        var yofx = [];
                        var xofy = [];

                        if ('y' != scope.ind) {
                            yofx = p.points(graph.xDomain, graph.yDomain)
                        }

                        if ('x' != scope.ind) {
                            xofy = p.points(graph.xDomain, graph.yDomain, true)
                        }

                        function sortObjects(key, descending) {
                            return function (a, b) {
                                var lower = descending ? a[key] : b[key],
                                    higher = descending ? b[key] : a[key];
                                return lower > higher ? -1 : lower < higher ? 1 : lower <= higher ? 0 : NaN;
                            }
                        }

                        var allPoints = d3.merge([yofx, xofy]);

                        if ('y' == scope.ind) {
                            allPoints = allPoints.sort(sortObjects('y'));
                        } else {
                            allPoints = allPoints.sort(sortObjects('x'));
                        }

                        shapes.curves.push({points: graph.curveFunction(allPoints), color: scope.color});

                    }

                    return shapes;

                }
            });

        }

        return {
            link: link,
            require: '^graph',
            restrict: 'E',
            scope: { fn: '&', ind: '@', color: '@', show: '&' }
        }
    }
);