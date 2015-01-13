/**
 * Created by cmakler on 11/10/14.
 */

kgAngular.directive('renderedMath',function() {

    function link(scope,el) {

        if(scope.expression) {

            function render() {
                katex.render(scope.expression, el[0]);
            }

            scope.$on('redraw', render);

            render();

        } else {

            katex.render(el[0].innerText, el[0])

        }


    }

    return {
        link: link,
        restrict: 'A',
        scope: {expression: '@'}
    }

});