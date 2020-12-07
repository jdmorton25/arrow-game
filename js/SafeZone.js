class SafeZone {
    
    
    static size = 10;
    constructor(x, y) {
        this.pos = new Vector2D(x, y);

        this.id;
        this.model = {svg: undefined, polygon: undefined};
    }
    create(id) {
        this.id = id;
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "svg_sz" + this.id);
        svg.setAttribute("width", SafeZone.size);
        svg.setAttribute("height", SafeZone.size);
        
        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("id", "polygon_sz" + this.id);
        svg.appendChild(polygon);
        canvas.appendChild(svg);
        
        var array = [[ 0            , 0             ], [ SafeZone.size, 0             ], 
                     [ SafeZone.size, SafeZone.size ], [ 0            , SafeZone.size ]];
        for (var value of array) {
            var point = svg.createSVGPoint();
            point.x = value[0];
            point.y = value[1];
            polygon.points.appendItem(point);
        }
        
        this.model.svg = document.getElementById("svg_sz" + this.id);
        this.model.polygon = document.getElementById("polygon_sz" + this.id);

        this.model.svg.setAttribute("transform", "translate(" + (this.pos.x - SafeZone.size/2) + " " + (this.pos.y - SafeZone.size/2) +")");
        this.model.polygon.setAttribute("style", "fill: #008080; opacity: 0.55; stroke: #000000; stroke-width: 2;");

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