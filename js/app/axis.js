/**
 * Created by cmakler on 10/31/14.
 */

'use strict';

kgAngular.directive('axis', function () {

    function link(scope, el, attrs, GraphCtrl) {

        function addAxis() {
            GraphCtrl.addAxis(scope.dim, {
                min: scope.min(),
                max: scope.max(),
                title: scope.title
            });
        }

        scope.$watch('title', addAxis);

        addAxis();

    }

    return {
        link: link,
        restrict: 'E',
        require: '^graph',
        scope: {dim: '@', min: '&', max: '&', title: '@'}
    }

});