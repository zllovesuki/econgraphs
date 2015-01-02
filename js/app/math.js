/**
 * Created by cmakler on 11/10/14.
 */

kgAngular.directive('renderedMath',function() {

    function link(scope,el) {

        function render() {
            katex.render(scope.expression, el[0]);
        }

        scope.$on('redraw', render);

        render();

    }

    return {
        link: link,
        restrict: 'A',
        scope: {expression: '@'}
    }

});