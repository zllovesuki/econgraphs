/**
 * Created by cmakler on 10/31/14.
 */

'use strict';

kgAngular.directive('graph', function (D3Helpers) {

    function link(scope, el, attrs) {

        el = el[0];

        scope.graph_definition = scope.graph_definition || {};
        
        scope.x_axis = scope.x_axis || {min: 0, max: 10, title: 'X axis'};
        scope.y_axis = scope.y_axis || {min: 0, max: 10, title: 'Y axis'};
        scope.dimensions = {height: attrs.height || 700, width: attrs.width || 700};
        scope.margin = {top: 10, right: 10, bottom: 70, left: 70};

        scope.$on('redraw', drawObjects);
        scope.$on('resize', resize);

        // These are D3 selectors for each type of shape on the graph
        var circles, lines, curves, rects, areas, texts, x_axis, y_axis, x_axis_label, y_axis_label;

        // Regenerate current definitions of plotted shapes from graph objects.
        function plotted_shapes () {

            // reset plotted shapes
            var shapes = {lines: [], circles: [], curves: [], texts: [], rects: [], areas: []};

            // get current coordinates for shapes
            scope.graph_definition.objects.forEach(function (graph_object) {
                shapes = graph_object.update(shapes,scope.graph_definition);
            });

            return shapes;

        }

        function drawObjects() {

            // get updated data based on current parameters
            var data = plotted_shapes();

            // update the data for each of the D3 shape selectors
            areas = D3Helpers.drawAreas(data.areas, areas);
            rects = D3Helpers.drawRects(data.rects, rects);
            lines = D3Helpers.drawLines(data.lines,lines);
            curves = D3Helpers.drawCurves(data.curves,curves);
            circles = D3Helpers.drawCircles(data.circles,circles);
            texts = D3Helpers.drawTexts(data.texts,texts);

            // Add x axis
            x_axis.call(d3.svg.axis().scale(scope.graph_definition.x).orient("bottom"));
            x_axis_label.text(scope.x_axis.title);

            // Add y axis
            y_axis.call(d3.svg.axis().scale(scope.graph_definition.y).orient("left"));
            y_axis_label.text(scope.y_axis.title);

        }

        function resize() {
            if (scope.graph_definition.vis) {
                d3.select(el).select('svg').remove();
                drawGraph();
            }
        }


        function drawGraph() {

            // The width and height of the drawn graph are the width and height of the alloted space, minus the margins.
            scope.graph_definition.width = Math.min(el.parentElement.clientWidth,scope.dimensions.width) - scope.margin.left - scope.margin.right;
            scope.graph_definition.height = scope.dimensions.height - scope.margin.top - scope.margin.bottom;

            // Create the D3 visualization object
            scope.graph_definition.vis = d3.select(el)
                .append("svg")
                .attr("width", el.parentElement.clientWidth)
                .attr("height", scope.dimensions.height)
                .append("g")
                .attr("transform", "translate(" + scope.margin.left + "," + scope.margin.top + ")");

            areas = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.area');
            rects = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.rect');
            curves = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.curve');
            lines = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.line');
            circles = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.circle');
            texts = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.text');
            x_axis = scope.graph_definition.vis.append('g').attr('class', 'x axis').attr("transform", "translate(0," + scope.graph_definition.height + ")");
            y_axis = scope.graph_definition.vis.append('g').attr('class', 'y axis');
            x_axis_label = x_axis.append("text")
                .attr("x", scope.graph_definition.width / 2)
                .attr("y", "4em")
                .style("text-anchor", "middle");
            y_axis_label = y_axis.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -scope.graph_definition.height / 2)
                .attr("y", "-4em")
                .style("text-anchor", "middle");


            // Establish axes and scales
            scope.graph_definition = D3Helpers.addAxes(scope.graph_definition, scope.x_axis, scope.y_axis);


            drawObjects();
        }

        drawGraph();

    }

    function controller($scope) {

        $scope.graph_definition = $scope.graph_definition || {};

        var graph_objects = $scope.graph_definition.objects = [];

        this.addObject = function(newObject) {
            graph_objects.push(newObject);
        };

        this.addAxis = function(dim,axis_definition) {
            $scope[dim+'_axis'] = axis_definition;
        };

    }

    return {
        link: link,
        controller: controller,
        restrict: 'E',
        scope: true
    }

});