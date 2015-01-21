/**
 * Created by cmakler on 10/31/14.
 */

'use strict';

kgAngular.directive('graph', function (D3Helpers) {

    function link(scope, el, attrs, ModelCtrl) {

        el = el[0];

        scope.graph_definition = scope.graph_definition || {};
        
        scope.x_axis = scope.x_axis || {min: 0, max: 10, title: 'X axis', ticks: 1};
        scope.y_axis = scope.y_axis || {min: 0, max: 10, title: 'Y axis', ticks: 1};
        scope.dimensions = {height: attrs.height || 700, width: attrs.width || 700};
        scope.margin = {top: 10, right: 10, bottom: 80, left: 90};

        scope.$on('redraw', drawObjects);
        scope.$on('resize', resize);

        // These are D3 selectors for each type of shape on the graph
        var circles, lines, curves, rects, areas, texts, divs, x_axis, y_axis, x_axis_label, y_axis_label;

        // Regenerate current definitions of plotted shapes from graph objects.
        function plotted_shapes () {

            // reset plotted shapes
            var shapes = {lines: [], circles: [], curves: [], texts: [], rects: [], areas: [], divs: []};

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
            divs = D3Helpers.drawDivs(data.divs,divs);

            // Add x axis
            x_axis.call(d3.svg.axis().scale(scope.graph_definition.x).orient("bottom").ticks(scope.x_axis.ticks));
            x_axis_label.text(scope.x_axis.title);

            // Add y axis
            y_axis.call(d3.svg.axis().scale(scope.graph_definition.y).orient("left").ticks(scope.y_axis.ticks));
            y_axis_label.text(scope.y_axis.title);

        }

        function resize() {
            if (scope.graph_definition.vis) {
                d3.select(el).select('svg').remove();
                d3.select(el).selectAll('div').remove();
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

            d3.select(el.parentNode).select('div').remove();
            scope.graph_definition.divs = d3.select(el.parentNode)
                .append("div")
                .attr("style", "position:absolute; left: " + scope.margin.left + "px; top: " + scope.margin.top + "px; width: " + scope.graph_definition.width + "px; height: " + scope.graph_definition.height + "px");

            areas = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.area');
            rects = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.rect');
            curves = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.curve');
            lines = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.line');
            circles = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.circle');
            texts = scope.graph_definition.vis.append('g').attr('class', 'graph-objects').selectAll('g.text');
            divs = scope.graph_definition.divs.append('div').attr('class', 'graph-divs').selectAll('div');
            x_axis = scope.graph_definition.vis.append('g').attr('class', 'x axis').attr("transform", "translate(0," + scope.graph_definition.height + ")");
            y_axis = scope.graph_definition.vis.append('g').attr('class', 'y axis');
            x_axis_label = x_axis.append("text")
                .attr("x", scope.graph_definition.width / 2)
                .attr("y", "5em")
                .style("text-anchor", "middle");
            y_axis_label = y_axis.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -scope.graph_definition.height / 2)
                .attr("y", "-5em")
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
        var graph_divs = $scope.graph_definition.divs = [];

        this.addObject = function(newObject) {
            graph_objects.push(newObject);
        };

        this.addAxis = function(dim,axis_definition) {
            $scope[dim+'_axis'] = axis_definition;
        };

        this.addDiv = function(newDiv) {
            graph_divs.push(newDiv)
        };



    }

    return {
        link: link,
        controller: controller,
        require: '^model',
        restrict: 'E',
        scope: true
    }

});