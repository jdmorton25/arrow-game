class Arrow {
    
    
    constructor() {
        this.pos = new Vector2D(100, canvasHeight / 2);
        this.vel = new Vector2D(2.55, 2.55);
        this.alpha = randomInt(-90, 90);
        this.sz;
        this.alive = true;

        this.id;
        this.model = {svg: undefined, polygon: undefined};    

        this.brain = new NeuralNet(10, 30, 3);
        this.vision = [];
        this.decision;

        this.passed = 1;
        this.lifetime = 0;
        this.leftToLive = 1000;
        this.fitness = 0;
        this.score = 0;
        
    }
    create(id) {
        this.id = id;
        this.sz = new SafeZone(randomInt(40, canvasWidth - 40), randomInt(40, canvasHeight - 40));
        this.sz.create(this.id);
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "svg_arrow" + this.id);
        svg.setAttribute("width", 20);
        svg.setAttribute("height", 20);
        
        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("id", "polygon_arrow" + this.id);
        svg.appendChild(polygon);
        canvas.appendChild(svg);

        var array = [[ 10,  2.5 ], [ 15, 17.5 ], [ 5,  17.5 ]];
        for (var value of array) {
            var point = svg.createSVGPoint();
            point.x = value[0];
            point.y = value[1];
            polygon.points.appendItem(point);
        }
        this.model.svg = document.getElementById("svg_arrow" + this.id);
        this.model.polygon = document.getElementById("polygon_arrow" + this.id);
        
        this.model.svg.setAttribute("transform", "translate(" + (this.pos.x - 10) + " " + (this.pos.y - 10) +")")
        this.model.polygon.setAttribute("transform", "rotate(" + (this.alpha + 90) + " 10 10)");

        this.show("hidden");
    }
    show(status) {
        if(status === "hidden") {
            this.model.svg.style.visibility = "hidden";
            this.sz.show("hidden");
        }
        if(status === "visible") {
            this.model.svg.style.visibility = "visible";
            this.sz.show("visible");
        }
        
    }
    move() {
        this.lifetime++;
        this.leftToLive--;
        if(this.leftToLive < 0 || this.gonnaDie()) {
            this.alive = false;
        }
        if(this.onSafeZone()) {
            this.leftToLive += 1000;
            this.score++;
            this.sz.model.svg.remove();
            this.sz = new SafeZone(randomInt(40, canvasWidth - 40), randomInt(40, canvasHeight - 40));
            this.sz.create(this.id);
        }
        var delta = this.pos.add(this.vel.multiply(new Vector2D(Math.cos(this.alpha * Math.PI / 180), Math.sin(this.alpha * Math.PI / 180))));
        this.passed += this.pos.distance(this.pos.add(this.vel.multiply(new Vector2D(Math.cos(this.alpha * Math.PI / 180), Math.sin(this.alpha * Math.PI / 180)))))
        this.pos = delta;

        if(this.model.svg.style.visibility === "visible") {
            this.model.svg.setAttribute("transform", "translate(" + (this.pos.x - 10) + " " + (this.pos.y - 10) +")")
            this.model.polygon.setAttribute("transform", "rotate(" + (this.alpha + 90) + " 10 10)");
        }
    }
    gonnaDie() {
        if( !(this.pos.x >= 0 && this.pos.y >= 0 && this.pos.x < canvasWidth && this.pos.y < canvasHeight) ) {
            this.alive = false;
        }
    }
    onObstacle(o) {
        if(this.pos.x >= o.pos0.x && this.pos.x <= o.pos1.x && this.pos.y >= o.pos0.y && this.pos.y <= o.pos1.y) {
            return true;
        }
        return false;
    }
    onSafeZone() {
        if(this.pos.x >= this.sz.pos.x - 5*SafeZone.size/8 && this.pos.x <= this.sz.pos.x + 5*SafeZone.size/8 && 
           this.pos.y >= this.sz.pos.y - 5*SafeZone.size/8 && this.pos.y <= this.sz.pos.y + 5*SafeZone.size/8) {
            return true;
        }
        return false;
    }
    calcFitness() {
        if(this.lifetime < 100) {
            this.fitness = this.lifetime ** 2 / Math.sqrt(this.passed) * 4 ** 4 * (this.score + 1);
        } else {
            this.fitness = this.lifetime / Math.sqrt(this.passed) * 4 ** 8 * (this.score + 1) ** 4;
        }
            
    }
    
    crossover(partner) {
        var child = new Arrow();
        child.brain = this.brain.crossover(partner.brain);
        return child;
    }
    mutate(mr) {
        this.brain.mutate(mr);
    }
    clone() {
        var clone = new Arrow();
        clone.brain = this.brain.clone();
        clone.alive = true;
        return clone;
    }
}