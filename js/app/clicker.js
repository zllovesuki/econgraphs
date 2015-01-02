/**
 * Created by cmakler on 12/17/14.
 */

// Set the CSV to be used throughout the session.
// This doesn't change, though the data in it will.
kgAngular.directive('clickerFile', function () {
    return {
        restrict: 'E',
        scope: false,
        template: "<input ng-if='!currentFile' type='file'/>",
        link: function (scope, element) {
            element.on('change', function (onChangeEvent) {
                scope.currentFile = (onChangeEvent.srcElement || onChangeEvent.target).files[0];
                scope.$apply();
            });
        }
    };
});

kgAngular.directive('clickerQuestion', function () {
    return {
        restrict: 'E',
        scope: true,
        transclude: true,
        replace: true,
        template: "<div><div ng-transclude></div><hr/><div ng-if='currentFile'><button ng-click='update()'>Reveal</button><button ng-click='reset()'>Reset</button><p>{{count}}</p></div></div>",
        controller: function ($scope) {

            $scope.options = {}

            this.addOption = function(scope) {
                $scope.options[scope.letter] = scope;
            };

            function updateChildren() {
                for (var letter in $scope.options) {
                    var count = $scope.count[letter],
                        frequency = 100 * count / $scope.total,
                        option = $scope.options[letter];
                    option.frequency = frequency;
                    option.count = count;
                    option.$apply();
                }
            }

            function parseCSV(csvdata) {

                var data = csvdata['data'];

                $scope.reset();

                // i starts at 5 because student data begins on the sixth line of the CSV
                for (var i = 5; i < data.length; i++) {
                    var studentResponse = data[i];
                    if (studentResponse.length > 2) {

                        // Each student's most response to the last question is in the third-to-last column of the CSV
                        var responseLetter = studentResponse[studentResponse.length - 3];
                        if ($scope.count.hasOwnProperty(responseLetter)) {
                            $scope.count[responseLetter] += 1;
                        } else {
                            $scope.count[responseLetter] = 1;
                        }
                        $scope.total++;
                    }
                    updateChildren();
                }


            }

            // Get latest data from CSV.
            $scope.update = function () {

                if ($scope.currentFile) {
                    Papa.parse($scope.currentFile, {
                        complete: parseCSV //when data is loaded, call parseCSV
                    });
                }

            };

            $scope.reset = function () {
                // Reset count and frequency objects for this scope.
                $scope.count = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0};
                $scope.frequency = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0};
                $scope.total = 0;
                updateChildren();
            }

        }
    }
});

kgAngular.directive('clickerOption', function () {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        transclude: true,
        require: '^clickerQuestion',
        template: "<div class='col-lg-5 well'><h2>{{letter}}</h2><div ng-transclude style='height: 150px'></div><hr/><h3>{{ count }} ({{ frequency | number: 0}}%)</h3></div>",
        link: function (scope, element, attrs, ClickerCtrl) {
            scope.letter = attrs['letter'];
            scope.count = '-';
            scope.frequency = '-';
            ClickerCtrl.addOption(scope)

        }
    }
});