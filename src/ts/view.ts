/// <reference path='kg.ts'/>

'use strict';

module KG
{
    export interface ViewDefinition extends ModelDefinition
    {
        element_id?: string;
        show?: any;
        maxDimensions?: IDimensions;
        margins?: IMargins;
        xAxisDef?: AxisDefinition;
        yAxisDef?: AxisDefinition;
        objects?: ViewObjectDefinition[];
        background?: string;
        mask?: boolean;
        square?: boolean;
    }

    export interface IView extends IModel
    {

        scope: IScope;

        show: boolean;
        square: boolean;

        // layers into which objects or text may be rendered, and selectors for those objects once placed
        masked: D3.Selection;
        unmasked: D3.Selection;
        divs: D3.Selection;
        objectGroup: (name:string, init:((newGroup:D3.Selection) => D3.Selection), unmasked:boolean) => D3.Selection;
        getDiv: (name:string) => D3.Selection;

        // axis objects and methods for checking whether a coordinate is within an axis domain
        xAxis: Axis;
        yAxis: Axis;
        xOnGraph: (x:number) => boolean;
        yOnGraph: (x:number) => boolean;
        nearTop: (p:ICoordinates) => boolean;
        nearRight: (p:ICoordinates) => boolean;

        // render given current scope
        render: (redraw:boolean) => void;
        redraw: () => void;
        drawObjects: () => void;

        // view objects
        objects: ViewObject[];

    }

    export class View extends Model implements IView
    {
        public scope;
        public show;
        public square;
        public element_id;
        public maxDimensions;
        public dimensions;
        public margins;
        public masked;
        public unmasked;
        public divs;
        public xAxis;
        public yAxis;
        public objects;
        public background;
        private mask;

        constructor(definition:ViewDefinition, modelPath?:string) {
            definition = _.defaults(definition,{
                background: 'white',
                mask: true,
                show: true,
                square: false
            });
            super(definition, modelPath);
            var view = this;
            if(definition.hasOwnProperty('xAxisDef')){
                this.xAxis = new XAxis(definition.xAxisDef);
            }
            if(definition.hasOwnProperty('yAxisDef')){
                this.yAxis = new YAxis(definition.yAxisDef);
            }
            console.log('initialized view with objects', view.objects);
            if(view.hasOwnProperty('objects')) {
                view.objects.forEach(function(viewObj,index) {
                if(viewObj instanceof ViewObject) {
                    viewObj.createSubObjects(view);
                } else if(viewObj.hasOwnProperty('type') && viewObj.hasOwnProperty('definition')) {
                    var newViewObj:ViewObject = createInstance(viewObj,modelPath + '['+index+']');
                    view.objects[index] = newViewObj;
                    newViewObj.createSubObjects(view);
                }
            });
            console.log('added additional objects to view', view.objects)
            }
        }

        _update(scope) {
            var view = this;
            view.scope = scope;
            console.log('updating objects ',view.objects);
            view.objects.forEach(function(viewObj) {
                viewObj.view = view;
                viewObj.update(scope);
            });
            return view;
        }

        render(redraw) {
            var view = this;
            console.log('calling update');
            if(redraw){
                view.redraw();
            } else {
                view.drawObjects();
            }
        }

        redraw() {
            var view = this;


            // Establish dimensions of the view
            var element = $('#' + view.element_id)[0];

            if(element == undefined) {
                return view;
            }

            var width = Math.min(view.maxDimensions.width, element.clientWidth),
                height = Math.min(view.maxDimensions.height, window.innerHeight - (10 + $('#' + view.element_id).offset().top - $(window).scrollTop()))

            if(view.square) {
                var side = Math.min(width,height);
                view.dimensions = {
                    width: side,
                    height: side
                };
            } else {
                view.dimensions = {
                    width: width,
                    height: height
                };
            }


            var frameTranslation = KG.positionByPixelCoordinates({x:(element.clientWidth - view.dimensions.width)/2,y:0});
            var visTranslation = KG.translateByPixelCoordinates({x:view.margins.left, y:view.margins.top});

            d3.select(element).select('div').remove();

            if(!view.show) {
                return view;
            }

            // Create new div element to contain SVG
            var frame = d3.select(element).append('div').attr({style: frameTranslation});

            // Create new SVG element for the view visualization
            var svg = frame.append('svg')
                .attr('width', view.dimensions.width)
                .attr('height', view.dimensions.height);

            function removeHighlight(){
                if(view.scope.params.highlight != null) {
                    view.scope.updateParams({highlight: null});
                }
            }



            // Establish marker style for arrow
            var markerParameters = [
                {
                    arrowName: "-end-",
                    refX: 11,
                    maskPath: "M3,1 L3,12 L12,7 L12,5 L3,1",
                    arrowPath: "M2,2 L2,11 L10,6 L2,2"
                },
                {
                    arrowName: "-start-",
                    refX: 2,
                    maskPath: "M10,1 L10,12 L0,7 L0,5 L10,1",
                    arrowPath: "M11,2 L11,11 L2,6 L11,2"
                }
            ];

            markerParameters.forEach(function(markerParam){
                var markers = svg.append("svg:defs").selectAll("marker").data(allColors()).enter()
                    .append("marker")
                    .attr("id", function(d){return "arrow" + markerParam.arrowName + d})
                    .attr("refX", markerParam.refX)
                    .attr("refY", 6)
                    .attr("markerWidth", 13)
                    .attr("markerHeight", 13)
                    .attr("orient", "auto")
                    .attr("markerUnits","userSpaceOnUse");

                markers.append("svg:path")
                    .attr("d", markerParam.maskPath)
                    .attr("fill","white");

                markers.append("svg:path")
                    .attr("d", markerParam.arrowPath)
                    .attr("fill",function(d) {return d});

            });

            // Add a div above the SVG for labels and controls
            view.divs = frame.append('div').attr({style: visTranslation});

            if(view.mask){

                // Establish SVG groups for visualization area (vis), mask, axes
                view.masked = svg.append('g').attr('transform', visTranslation);
                var mask = svg.append('g').attr('class','mask');

                // Put mask around vis to clip objects that extend beyond the desired viewable area

                var maskBorder = 5;

                var topMask = mask.append('rect').attr({x: 0, y: 0, width: view.dimensions.width, height: view.margins.top - maskBorder, fill:view.background});
                var bottomMask = mask.append('rect').attr({x: 0, y: view.dimensions.height - view.margins.bottom + maskBorder, width: view.dimensions.width, height: view.margins.bottom - maskBorder, fill:view.background});
                var leftMask = mask.append('rect').attr({x: 0, y: 0, width: view.margins.left - maskBorder, height: view.dimensions.height, fill:view.background});
                var rightMask = mask.append('rect').attr({x: view.dimensions.width - view.margins.right + maskBorder, y: 0, width: view.margins.right - maskBorder, height: view.dimensions.height, fill:view.background});

                topMask.on('mouseover',removeHighlight);
                bottomMask.on('mouseover',removeHighlight);
                leftMask.on('mouseover',removeHighlight);
                rightMask.on('mouseover',removeHighlight);

            }

            if(view.xAxis || view.yAxis) {

                // Establish SVG group for axes
                var axes = svg.append('g').attr('class','axes').attr('transform', visTranslation);

                // Establish dimensions of axes (element dimensions minus margins)
                var axisDimensions = {
                    width: view.dimensions.width - view.margins.left - view.margins.right,
                    height: view.dimensions.height - view.margins.top - view.margins.bottom
                };

                // draw axes
                if(view.xAxis) {
                    view.xAxis.update(view.scope).draw(axes, view.divs, axisDimensions, view.margins);
                }
                if(view.yAxis) {
                    view.yAxis.update(view.scope).draw(axes, view.divs, axisDimensions, view.margins);
                }

            }

            // Establish SVG group for objects that lie above the axes (e.g., points and labels)
            view.unmasked = svg.append('g').attr('transform', visTranslation);

            return view.drawObjects();
        }

        drawObjects() {
            var view = this;
            console.log('drawing objects');
            view.objects.forEach(function(object) {
                if(object instanceof ViewObject) {
                    object.render(view)
                }
            });
            return view;
        }

        addObject(newObj) {
            console.log('evaluating ',newObj)
            var view = this;
            if(newObj instanceof ViewObject) {
                view.objects.push(newObj);
            } else if(typeof newObj == 'string') {
                newObj = view.scope.$eval(newObj);
                if(newObj instanceof ViewObject) {
                    view.objects.push(newObj);
                } else {
                    console.log ("tried to add something that wasn't a view object!")
                }
            }
            console.log(newObj);
            newObj.createSubObjects(view);
        }

        objectGroup(name, init, unmasked) {
            var layer = unmasked ? this.unmasked : this.masked;
            if(layer == undefined) {
                return null;
            }
            var group = layer.select('#' + name);
            if(group.empty()) {
                group = layer.append('g').attr('id',name);
                group = init(group)
            }
            return group;
        }

        getDiv(name) {
            var selection = this.divs.select('#' + name);
            if (selection.empty()) {
                selection = this.divs.append('div').attr('id',name);
            }
            return selection;
        }

        xOnGraph(x:number) {
            return this.xAxis.domain.contains(x);
        }

        yOnGraph(y:number) {
            return this.yAxis.domain.contains(y);
        }

        nearTop(point:ICoordinates) {
            return KG.isAlmostTo(point.y, this.yAxis.domain.max, 0.05)
        }

        nearRight(point:ICoordinates) {
            return KG.isAlmostTo(point.x, this.xAxis.domain.max, 0.05)
        }

        nearBottom(point:ICoordinates) {
            return KG.isAlmostTo(point.y, this.yAxis.domain.min, 0.05, this.yAxis.domain.max - this.yAxis.domain.min)
        }

        nearLeft(point:ICoordinates) {
            return KG.isAlmostTo(point.x, this.xAxis.domain.min, 0.05, this.xAxis.domain.max - this.xAxis.domain.min)
        }

    }
}