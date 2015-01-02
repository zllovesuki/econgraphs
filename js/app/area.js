/**
 * Created by cmakler on 11/3/14.
 */

kgAngular.directive('area', function (D3Helpers) {

        function link(scope, element, attrs, graphCtrl) {

            graphCtrl.addObject({
                
                update: function (shapes,graph) {

                    var p = (typeof scope.fn == 'function') ? scope.fn() : scope.fn;

                    shapes.areas.push({points: graph.curveFunction(p.area(graph.xDomain, graph.yDomain)), color: scope.color});

                    return shapes;

                }
            });

        }

        return {
            link: link,
            require: '^graph',
            restrict: 'E',
            scope: { fn: '&', ind: '@', color: '@' }
        }
    }
);