/**
 * Created by cmakler on 11/6/14.
 */

/**
 * Created by cmakler on 10/31/14.
 */

'use strict';

kgAngular.directive('param', function () {

    function link(scope,el,attrs,ModelCtrl) {
        ModelCtrl.setValue('params',attrs.name,(attrs.type && attrs.type != 'number') ? attrs.value : parseFloat(attrs.value));
    }

    return {
        require: '^model',
        link: link,
        restrict: 'E',
        scope: false
    }

});