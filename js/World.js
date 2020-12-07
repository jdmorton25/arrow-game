class World {
    
    constructor(popSize) {
        this.visionVisualisasion = {zone:     {svg: undefined, circle: undefined},
                                    lines:    {svg: undefined, line0: undefined, line1: undefined, line2: undefined},
                                    o_lines:  {svg: undefined, line0: undefined, line1: undefined, line2: undefined},
                                    sz_lines: {svg: undefined, line0: undefined, line1: undefined, line2: undefined}};
        this.obstacles = [this.generateObstacle()];
        this.population = new Population(popSize);
        this.gamma = 17.5;
        for(var i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].create(i);
            this.obstacles[i].show("visible");
        }
        
    }
    
    update() {

        for(var i = 0; i < this.population.arrows.length; i++) {
            while(this.SZonObstacles(this.population.arrows[i].sz)) {
                this.population.arrows[i].sz.model.svg.remove();
                this.population.arrows[i].sz = new SafeZone(randomInt(40, canvasWidth - 40), randomInt(40, canvasHeight - 40));
                this.population.arrows[i].sz.create(i);
            }
        }

        for(var i = 0; i < this.obstacles.length; i++) {
            for(var j = 0; j < this.population.arrows.length; j++) {
                if(this.population.arrows[j].onObstacle(this.obstacles[i])) {
                    this.population.arrows[j].alive = false;
                }
            }
        }


        this.look();
        this.population.calcFitness();
        if(this.population.done()) {
            console.log("Generation " + this.population.gen)
            clearCanvas();
            this.population.naturalSelection();
            this.obstacles = [];
            this.obstacles.push(this.generateObstacle());
            this.obstacles[0].create(0);
            this.obstacles[0].show("visible");
        }
        this.population.update();
        
        
        
    }
    look() {
        this.lookAtAngle(-this.gamma);
        this.lookAtAngle(0);
        this.lookAtAngle(this.gamma);
        for(var i = 0; i < this.population.arrows.length; i++) {
            if(this.population.arrows[i].alive) {
                this.population.arrows[i].decision = this.population.arrows[i].brain.output(this.population.arrows[i].vision);
                var max = 0;
                var maxIndex = 0;
                for (var j = 0; j < this.population.arrows[i].decision.length; j++) {
                    if (max < this.population.arrows[i].decision[j]) {
                        max = this.population.arrows[i].decision[j];
                        maxIndex = j;
                    }
                }
                if(maxIndex == 0) {
                    this.population.arrows[i].alpha += 0;
                        
                } else if (maxIndex == 1) {
                    this.population.arrows[i].alpha -= this.gamma/20;
                }
                else {
                    this.population.arrows[i].alpha += this.gamma/20;
                }
                if(this.population.arrows[i].alpha < -360) this.population.arrows[i].alpha += 360
                if(this.population.arrows[i].alpha > 360) this.population.arrows[i].alpha -= 360
            }
            
        }
    }
    lookAtAngle(delta) {
        
        if(!Number.isFinite(delta))
            return new TypeError();
        for(var i = 0; i < this.population.arrows.length; i++) {
            if(this.population.arrows[i].alive) {
                var temp = new Vector2D(this.population.arrows[i].pos.x, this.population.arrows[i].pos.y);
                var temp1 = 0;
                var temp2 = 0;
                while( temp.x >= 0 && temp.y >= 0 && temp.x < canvasWidth && temp.y < canvasHeight) {
                    temp = temp.add( this.population.arrows[i].vel.multiply(new Vector2D(Math.cos( (this.population.arrows[i].alpha + delta) * Math.PI / 180), 
                                                                                         Math.sin( (this.population.arrows[i].alpha + delta) * Math.PI / 180))) );
                    for(var j = 0; j < this.obstacles.length; j++) {
                        if(temp.x >= this.obstacles[j].pos0.x && temp.x <= this.obstacles[j].pos1.x && 
                           temp.y >= this.obstacles[j].pos0.y && temp.y <= this.obstacles[j].pos1.y && !(temp1 instanceof Vector2D) ) 
                            temp1 = temp.clone();
                    }
                    if(temp.x >= this.population.arrows[i].sz.pos.x - SafeZone.size/2 && temp.x <= this.population.arrows[i].sz.pos.x + SafeZone.size/2 && 
                       temp.y >= this.population.arrows[i].sz.pos.y - SafeZone.size/2 && temp.y <= this.population.arrows[i].sz.pos.y + SafeZone.size/2 && !(temp2 instanceof Vector2D) ) 
                        temp2 = temp.clone();
                }
                
                if(this.population.arrows[i].alive && !showAll && i == this.population.currentBestArrow) {
                    var r = this.population.arrows[i].pos.distance(this.population.arrows[i].sz.pos);
                    if(this.visionVisualisasion.zone.svg === undefined) {
//============================================================ CIRCLE ============================================================
                        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svg.setAttribute("id", "zone_svg_vision");
                        
                        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        circle.setAttribute("id", "circle_vision");
                        circle.setAttribute("style", "fill: #ff8080; opacity: 0.05;");

                        svg.appendChild(circle);
                        canvas.appendChild(svg);
                        this.visionVisualisasion.zone.svg = document.getElementById("zone_svg_vision");
                        this.visionVisualisasion.zone.circle = document.getElementById("circle_vision");
                    } else {
                        this.visionVisualisasion.zone.svg.setAttribute("width", 2*r);
                        this.visionVisualisasion.zone.svg.setAttribute("height", 2*r);
                        this.visionVisualisasion.zone.svg.setAttribute("transform", "translate(" + (this.population.arrows[i].pos.x - r) + " " + (this.population.arrows[i].pos.y - r) +")");
                        this.visionVisualisasion.zone.circle.setAttribute("cx", r);
                        this.visionVisualisasion.zone.circle.setAttribute("cy", r);
                        this.visionVisualisasion.zone.circle.setAttribute("r", r);
                    }

                    if(this.visionVisualisasion.lines.line0 === undefined) {
//============================================================ LINES ============================================================
                        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svg.setAttribute("id", "lines_svg_vision");
                        svg.setAttribute("width", canvasWidth);
                        svg.setAttribute("height", canvasHeight);

                        var line0 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line0.setAttribute("id", "lines_line0_vision");
                        line0.setAttribute("style", "stroke: #ffff00; opacity: 0.25;");
                        svg.appendChild(line0);

                        var line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line1.setAttribute("id", "lines_line1_vision");
                        line1.setAttribute("style", "stroke: #ffff00; opacity: 0.25;");
                        svg.appendChild(line1);

                        var line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line2.setAttribute("id", "lines_line2_vision");
                        line2.setAttribute("style", "stroke: #ffff00; opacity: 0.25;");
                        svg.appendChild(line2);
                        
                        canvas.appendChild(svg);

                        this.visionVisualisasion.lines.svg = document.getElementById("lines_svg_vision");
                        this.visionVisualisasion.lines.line0 = document.getElementById("lines_line0_vision");
                        this.visionVisualisasion.lines.line1 = document.getElementById("lines_line1_vision");
                        this.visionVisualisasion.lines.line2 = document.getElementById("lines_line2_vision");
                    } else {
                        if(delta === -this.gamma) {
                            this.visionVisualisasion.lines.line0.setAttribute('x1', this.population.arrows[i].pos.x);
                            this.visionVisualisasion.lines.line0.setAttribute('y1', this.population.arrows[i].pos.y);
                            this.visionVisualisasion.lines.line0.setAttribute('x2', temp.x);
                            this.visionVisualisasion.lines.line0.setAttribute('y2', temp.y);
                        }
                        if(delta === 0) {
                            this.visionVisualisasion.lines.line1.setAttribute('x1', this.population.arrows[i].pos.x);
                            this.visionVisualisasion.lines.line1.setAttribute('y1', this.population.arrows[i].pos.y);
                            this.visionVisualisasion.lines.line1.setAttribute('x2', temp.x);
                            this.visionVisualisasion.lines.line1.setAttribute('y2', temp.y);
                        }
                        if(delta === this.gamma) {
                            this.visionVisualisasion.lines.line2.setAttribute('x1', this.population.arrows[i].pos.x);
                            this.visionVisualisasion.lines.line2.setAttribute('y1', this.population.arrows[i].pos.y);
                            this.visionVisualisasion.lines.line2.setAttribute('x2', temp.x);
                            this.visionVisualisasion.lines.line2.setAttribute('y2', temp.y);
                        }
                    }
                    if(this.visionVisualisasion.o_lines.line0 === undefined) {
//============================================================ O_LINES ==========================================================
                        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svg.setAttribute("id", "o_lines_svg_vision");
                        svg.setAttribute("width", canvasWidth);
                        svg.setAttribute("height", canvasHeight);

                        var line0 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line0.setAttribute("id", "o_lines_line0_vision");
                        line0.setAttribute("style", "stroke: #ff0000; opacity: 0.5;");
                        svg.appendChild(line0);

                        var line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line1.setAttribute("id", "o_lines_line1_vision");
                        line1.setAttribute("style", "stroke: #ff0000; opacity: 0.5;");
                        svg.appendChild(line1);

                        var line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line2.setAttribute("id", "o_lines_line2_vision");
                        line2.setAttribute("style", "stroke: #ff0000; opacity: 0.5;");
                        svg.appendChild(line2);

                        canvas.appendChild(svg);

                        this.visionVisualisasion.o_lines.svg = document.getElementById("o_lines_svg_vision");
                        this.visionVisualisasion.o_lines.line0 = document.getElementById("o_lines_line0_vision");
                        this.visionVisualisasion.o_lines.line1 = document.getElementById("o_lines_line1_vision");
                        this.visionVisualisasion.o_lines.line2 = document.getElementById("o_lines_line2_vision");
                    } else {
                        if(delta === -this.gamma) {
                            if(temp1 instanceof Vector2D) {
                                this.visionVisualisasion.o_lines.line0.setAttribute('x1', this.population.arrows[i].pos.x);
                                this.visionVisualisasion.o_lines.line0.setAttribute('y1', this.population.arrows[i].pos.y);
                                this.visionVisualisasion.o_lines.line0.setAttribute('x2', temp1.x);
                                this.visionVisualisasion.o_lines.line0.setAttribute('y2', temp1.y);
                                this.visionVisualisasion.o_lines.line0.style.visibility = "visible";
                            }
                            else this.visionVisualisasion.o_lines.line0.style.visibility = "hidden";
                        }
                        if(delta === 0) {
                            if(temp1 instanceof Vector2D) {
                                this.visionVisualisasion.o_lines.line1.setAttribute('x1', this.population.arrows[i].pos.x);
                                this.visionVisualisasion.o_lines.line1.setAttribute('y1', this.population.arrows[i].pos.y);
                                this.visionVisualisasion.o_lines.line1.setAttribute('x2', temp1.x);
                                this.visionVisualisasion.o_lines.line1.setAttribute('y2', temp1.y);
                                this.visionVisualisasion.o_lines.line1.style.visibility = "visible";
                            }
                            else this.visionVisualisasion.o_lines.line1.style.visibility = "hidden";
                        }
                        if(delta === this.gamma) {
                            if(temp1 instanceof Vector2D) {
                                this.visionVisualisasion.o_lines.line2.setAttribute('x1', this.population.arrows[i].pos.x);
                                this.visionVisualisasion.o_lines.line2.setAttribute('y1', this.population.arrows[i].pos.y);
                                this.visionVisualisasion.o_lines.line2.setAttribute('x2', temp1.x);
                                this.visionVisualisasion.o_lines.line2.setAttribute('y2', temp1.y);
                                this.visionVisualisasion.o_lines.line2.style.visibility = "visible";
                            }
                            else this.visionVisualisasion.o_lines.line2.style.visibility = "hidden";
                            
                        }
                    }
                    
                    if(this.visionVisualisasion.sz_lines.line0 === undefined) {
//============================================================ SZ_LINES =========================================================
                        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svg.setAttribute("id", "sz_lines_svg_vision");
                        svg.setAttribute("width", canvasWidth);
                        svg.setAttribute("height", canvasHeight);

                        var line0 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line0.setAttribute("id", "sz_lines_line0_vision");
                        line0.setAttribute("style", "stroke: #0000ff; opacity: 0.5;");
                        svg.appendChild(line0);

                        var line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line1.setAttribute("id", "sz_lines_line1_vision");
                        line1.setAttribute("style", "stroke: #0000ff; opacity: 0.5;");
                        svg.appendChild(line1);

                        var line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line2.setAttribute("id", "sz_lines_line2_vision");
                        line2.setAttribute("style", "stroke: #0000ff; opacity: 0.5;");
                        svg.appendChild(line2);

                        canvas.appendChild(svg);

                        this.visionVisualisasion.sz_lines.svg = document.getElementById("sz_lines_svg_vision");
                        this.visionVisualisasion.sz_lines.line0 = document.getElementById("sz_lines_line0_vision");
                        this.visionVisualisasion.sz_lines.line1 = document.getElementById("sz_lines_line1_vision");
                        this.visionVisualisasion.sz_lines.line2 = document.getElementById("sz_lines_line2_vision");
                    } else {
                        if(delta === -this.gamma) {
                            if(temp2 instanceof Vector2D) {
                                this.visionVisualisasion.sz_lines.line0.setAttribute('x1', this.population.arrows[i].pos.x);
                                this.visionVisualisasion.sz_lines.line0.setAttribute('y1', this.population.arrows[i].pos.y);
                                this.visionVisualisasion.sz_lines.line0.setAttribute('x2', temp2.x);
                                this.visionVisualisasion.sz_lines.line0.setAttribute('y2', temp2.y);
                                this.visionVisualisasion.sz_lines.line0.style.visibility = "visible";
                            }
                            else this.visionVisualisasion.sz_lines.line0.style.visibility = "hidden";
                        }
                        if(delta === 0) {
                            if(temp2 instanceof Vector2D) {
                                this.visionVisualisasion.sz_lines.line1.setAttribute('x1', this.population.arrows[i].pos.x);
                                this.visionVisualisasion.sz_lines.line1.setAttribute('y1', this.population.arrows[i].pos.y);
                                this.visionVisualisasion.sz_lines.line1.setAttribute('x2', temp2.x);
                                this.visionVisualisasion.sz_lines.line1.setAttribute('y2', temp2.y);
                                this.visionVisualisasion.sz_lines.line1.style.visibility = "visible";
                            }
                            else this.visionVisualisasion.sz_lines.line1.style.visibility = "hidden";
                        }
                        if(delta === this.gamma) {
                            if(temp2 instanceof Vector2D) {
                                this.visionVisualisasion.sz_lines.line2.setAttribute('x1', this.population.arrows[i].pos.x);
                                this.visionVisualisasion.sz_lines.line2.setAttribute('y1', this.population.arrows[i].pos.y);
                                this.visionVisualisasion.sz_lines.line2.setAttribute('x2', temp2.x);
                                this.visionVisualisasion.sz_lines.line2.setAttribute('y2', temp2.y);
                                this.visionVisualisasion.sz_lines.line2.style.visibility = "visible";
                            }
                            else this.visionVisualisasion.sz_lines.line2.style.visibility = "hidden";
                            
                        }
                    }
                    
                }
                
                this.population.arrows[i].vision[0] = Math.sqrt(1 / this.population.arrows[i].pos.distance(this.population.arrows[i].sz.pos));
                if(delta === -this.gamma) {
                    this.population.arrows[i].vision[1] = (!temp2 ? 10e-8 : 1)
                    this.population.arrows[i].vision[4] = (!temp1 ? 10e-8 : Math.sqrt(temp1.distance(this.population.arrows[i].pos) / temp.distance(this.population.arrows[i].pos)))
                    this.population.arrows[i].vision[7] = Math.sqrt(1 / temp.distance(this.population.arrows[i].pos))
                }
                if(delta === 0) {
                    this.population.arrows[i].vision[2] = (!temp2 ? 10e-8 : 1)
                    this.population.arrows[i].vision[5] = (!temp1 ? 10e-8 : Math.sqrt(temp1.distance(this.population.arrows[i].pos) / temp.distance(this.population.arrows[i].pos)))
                    this.population.arrows[i].vision[8] = Math.sqrt(1 / temp.distance(this.population.arrows[i].pos))
                }
                if(delta === this.gamma) {
                    this.population.arrows[i].vision[3] = (!temp2 ? 10e-8 : 1)
                    this.population.arrows[i].vision[6] = (!temp1 ? 10e-8 : Math.sqrt(temp1.distance(this.population.arrows[i].pos) / temp.distance(this.population.arrows[i].pos)))
                    this.population.arrows[i].vision[9] = Math.sqrt(1 / temp.distance(this.population.arrows[i].pos))
                }
                
                
            }
        }
    }
    generateObstacle() {
        var pos0 = new Vector2D(randomInt(150, canvasWidth - 150), randomInt(150, canvasHeight - 150));
        var pos1 = new Vector2D(randomInt(150, canvasWidth - 150), randomInt(150, canvasHeight - 150));
        while(pos0.isEqual(pos1) || Math.abs(pos0.x - pos1.x) < 20 || Math.abs(pos0.y - pos1.y) < 20  ) {
            pos0 = new Vector2D(randomInt(150, canvasWidth - 150), randomInt(150, canvasHeight - 150));
            pos1 = new Vector2D(randomInt(150, canvasWidth - 150), randomInt(150, canvasHeight - 150));
        }
        return new Obstacle(pos0.x, pos0.y, pos1.x, pos1.y);
    }
    SZonObstacles(sz) {
        for(var j = 0; j < this.obstacles.length; j++) {
            /*
            if( (sz.pos.x + SafeZone.size/2 >= this.obstacles[j].pos0.x && sz.pos.y + SafeZone.size/2 >= this.obstacles[j].pos0.y && 
                 sz.pos.x + SafeZone.size/2 <= this.obstacles[j].pos1.x && sz.pos.y + SafeZone.size/2 <= this.obstacles[j].pos1.y) ||
                (sz.pos.x - SafeZone.size/2 >= this.obstacles[j].pos0.x && sz.pos.y + SafeZone.size/2 >= this.obstacles[j].pos0.y && 
                 sz.pos.x - SafeZone.size/2 <= this.obstacles[j].pos1.x && sz.pos.y + SafeZone.size/2 <= this.obstacles[j].pos1.y) ||
                (sz.pos.x + SafeZone.size/2 >= this.obstacles[j].pos0.x && sz.pos.y - SafeZone.size/2 >= this.obstacles[j].pos0.y && 
                 sz.pos.x + SafeZone.size/2 <= this.obstacles[j].pos1.x && sz.pos.y - SafeZone.size/2 <= this.obstacles[j].pos1.y) ||
                (sz.pos.x - SafeZone.size/2 >= this.obstacles[j].pos0.x && sz.pos.y - SafeZone.size/2 >= this.obstacles[j].pos0.y && 
                 sz.pos.x - SafeZone.size/2 <= this.obstacles[j].pos1.x && sz.pos.y - SafeZone.size/2 <= this.obstacles[j].pos1.y) ||
                (this.obstacles[j].pos0.x <= sz.pos.x && this.obstacles[j].pos0.y <= sz.pos.y && 
                 this.obstacles[j].pos1.x >= sz.pos.x && this.obstacles[j].pos1.y >= sz.pos.y  ))*/
            if(sz.pos.x - SafeZone.size/2 < this.obstacles[j].pos1.x &&
               sz.pos.x + SafeZone.size/2 > this.obstacles[j].pos0.x &&
               sz.pos.y - SafeZone.size/2 < this.obstacles[j].pos1.y &&
               sz.pos.y + SafeZone.size/2 > this.obstacles[j].pos0.y)
                return true;
        }
        return false;
    }
}