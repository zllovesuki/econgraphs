/// <reference path="../kg.ts"/>

'use strict';

module KG
{

    // Graph definition objects
    export interface GraphDefinition extends ViewDefinition
    {
        xAxisDef: AxisDefinition;
        yAxisDef: AxisDefinition;
    }

    // Additions to the scope of a graph
    export interface IGraph extends IView
    {
        // methods for handling points outside the graph area
        onGraph: (coordinates:ICoordinates) => boolean;

        // methods for converting model coordiantes to pixel coordinates
        pixelCoordinates: (coordinates:ICoordinates,moveToClosest?:boolean) => ICoordinates;
        modelCoordinates: (coordinates:ICoordinates,moveToClosest?:boolean) => ICoordinates;
        dataCoordinates: (coordinateArray:ICoordinates[],moveToClosest?:boolean) => ICoordinates[];

        // convenience methods for corner coordinates of graph;
        corners: {
            bottom: {left: ICoordinates; right: ICoordinates; };
            top: {left: ICoordinates; right: ICoordinates; };
        };
    }

    export class Graph extends View implements IGraph
    {

        public corners;

        constructor(definition:GraphDefinition, modelPath?: string) {

            // ensure dimensions and margins are set; set any missing elements to defaults
            definition.maxDimensions = _.defaults(definition.maxDimensions || {}, { width: 1000, height: 1000 });
            definition.margins = _.defaults(definition.margins || {}, {top: 20, left: 50, bottom: 70, right: 20});
            super(definition, modelPath);
        }

        _update(scope) {
            var g = this;
            g.corners = {
                bottom: {
                    left: {x: g.xAxis.min, y: g.yAxis.min},
                    right: {x: g.xAxis.max, y: g.yAxis.min}
                },
                top: {
                    left: {x: g.xAxis.min, y: g.yAxis.max},
                    right: {x: g.xAxis.max, y: g.yAxis.max}
                }
            };
            super._update(scope);
            return g;
        }

        // Check to see if a point is on the graph
        onGraph(coordinates:ICoordinates) {
            var ok = (coordinates != null) && (coordinates != undefined) && coordinates.hasOwnProperty('x') && coordinates.hasOwnProperty('y');
            if(!ok) {
                return false;
            }
            return (this.xOnGraph(coordinates.x) && this.yOnGraph(coordinates.y));
        }

        // Convert model coordinates to pixel coordinates for a single point
        pixelCoordinates(coordinates:ICoordinates,moveToClosest?:boolean) {
            var xAxis = this.xAxis,
                yAxis = this.yAxis;
            try {
                coordinates.x = xAxis.scale(coordinates.x);
                coordinates.y = yAxis.scale(coordinates.y);
                if(moveToClosest) {
                    coordinates.y = Math.max(0,coordinates.y);
                }
            } catch(error) {
                console.log(error)
            }
            return coordinates;
        }

        // Convert pixel coordinates to model coordinates for a single point
        modelCoordinates(coordinates:ICoordinates,moveToClosest?:boolean) {
            var xAxis = this.xAxis,
                yAxis = this.yAxis;
            coordinates.x = xAxis.scale.invert(coordinates.x);
            coordinates.y = yAxis.scale.invert(coordinates.y);
            return coordinates;
        }

        // Transform pixel coordinates
        translateByCoordinates(coordinates:ICoordinates) {
            return KG.translateByPixelCoordinates(this.pixelCoordinates(coordinates));
        }

        positionByCoordinates(coordinates:ICoordinates, dimension?:IDimensions) {
            return KG.positionByPixelCoordinates(this.pixelCoordinates(coordinates), dimension);
        }

        // Convert model coordinates to pixel coordinates for an array of points
        dataCoordinates(coordinateArray:ICoordinates[], moveToClosest?:boolean) {
            var graph = this;
            var onGraphElements:boolean[] = coordinateArray.map(graph.onGraph, graph);
            var dataCoordinatesOnGraph = [];
            for(var i=0; i<coordinateArray.length; i++) {
                if(moveToClosest) {
                    dataCoordinatesOnGraph.push(graph.pixelCoordinates(coordinateArray[i],true))
                } else if(onGraphElements[i] || onGraphElements[i-1] || onGraphElements[i+1]) {
                    dataCoordinatesOnGraph.push(graph.pixelCoordinates(coordinateArray[i]));
                }
            }
            return dataCoordinatesOnGraph;
        }

    }

}

