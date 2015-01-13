/**
 * Created by cmakler on 01/09/15.
 */

'use strict';

kgAngular.directive('toggle', function () {

    function link(scope, el, attrs, ModelCtrl) {

        if(scope.init == 'true') {
            scope.param = true;
        }

        scope.toggle = function() {
            scope.param = !scope.param;
            ModelCtrl.update();
        };

    }

    return {
        link: link,
        require: '^model',
        restrict: 'E',
        replace: true,
        transclude: true,
        template: "<button ng-click='toggle()')><span ng-transclude/></button>",
        scope: { param: '=', init:'@' }
    };
});