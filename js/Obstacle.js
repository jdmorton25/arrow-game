class Obstacle {
    
    
    constructor(x0, y0, x1, y1) {
        this.pos0;
        this.pos1;

        this.id;
        this.model = {svg: undefined, polygon: undefined};
        
        if(x0 < x1) {
            if(y0 < y1) {
                this.pos0 = new Vector2D(x0, y0);
                this.pos1 = new Vector2D(x1, y1);
            }
            else if(y0 > y1) {
                this.pos0 = new Vector2D(x0, y1);
                this.pos1 = new Vector2D(x1, y0);
            }
        }
        else if(x0 > x1) {
            if(y0 < y1) {
                this.pos0 = new Vector2D(x1, y0);
                this.pos1 = new Vector2D(x0, y1);
            }
            else if(y0 > y1) {
                this.pos0 = new Vector2D(x1, y1);
                this.pos1 = new Vector2D(x0, y0);
            }
        }
    }
    create(id) {
        this.id = id;
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "svg_obstacle" + this.id);
        svg.setAttribute("width", this.pos1.x - this.pos0.x);
        svg.setAttribute("height", this.pos1.y - this.pos0.y);
        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("id", "polygon_obstacle" + this.id);
        svg.appendChild(polygon);
        canvas.appendChild(svg);
        var array = [[ 0                        ,  0                         ], [ this.pos1.x - this.pos0.x, 0                         ], 
                     [ this.pos1.x - this.pos0.x,  this.pos1.y - this.pos0.y ], [ 0                        , this.pos1.y - this.pos0.y ]];
        for (var value of array) {
            var point = svg.createSVGPoint();
            point.x = value[0];
            point.y = value[1];
            polygon.points.appendItem(point);
        }
        
        this.model.svg = document.getElementById("svg_obstacle" + this.id);
        this.model.polygon = document.getElementById("polygon_obstacle" + this.id);

        this.model.svg.setAttribute("transform", "translate(" + this.pos0.x + " " + this.pos0.y +")");
        this.model.polygon.setAttribute("style", "fill: #00ff00; opacity: 0.55; stroke: #000000; stroke-width: 2;");

        this.show("hidden");
    }
    show(status) {
        if(status === "hidden") {
            this.model.svg.style.visibility = "hidden";
        }
        if(status === "visible") {
            this.model.svg.style.visibility = "visible";
        }
    }
    
}