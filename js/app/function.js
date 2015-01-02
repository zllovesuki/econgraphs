/**
 * Created by cmakler on 11/6/14.
 */

'use strict';

kgAngular.directive('function', function () {

    function link(scope,el,attrs,ModelCtrl) {

        var fn = new econgraphs.functions[scope.category][scope.form];

        if (scope.fnParams) {
            fn = fn.updateParams(scope.fnParams);
        }
        ModelCtrl.setValue('functions', scope.name, fn);

    }

    return {
        require: '^model',
        link: link,
        restrict: 'E',
        scope: { name: '@', category: '@', form: '@', fnParams: '&' }
    }

});