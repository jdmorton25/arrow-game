class Population {
    
    constructor(size) {
        this.arrows = new Array(size);
        this.gen = 1;
        this.globalBest = 0;
        this.globalBestFitness = 0;
        this.currentBest = 0;
        this.currentBestArrow = 0;
        this.globalBestArrow;

        for(var i = 0; i < size; i++) {
            this.arrows[i] = new Arrow();
            this.arrows[i].create(i);
        }
    }
    update() {
        
        for(var i = 0; i < this.arrows.length; i++) {
            if(this.arrows[i].alive) {
                this.arrows[i].move();
                if(this.arrows[i].alive && (i == this.currentBestArrow || showAll ) ) {
                    this.arrows[i].show("visible");
                }  
            } else {
                if(this.arrows[i].model.svg.style.visibility === "visible") {
                    this.arrows[i].show("hidden");
                }
            }
        }
        this.setCurrentBest();
    }
    done() {
        for(var i = 0; i < this.arrows.length; i++) {
            if(this.arrows[i].alive)
                return false;
        }
        return true;
    }

    calcFitness() {
        for(var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].calcFitness();
        }
    }
    naturalSelection() {
        var newArrows = [];
        for(var i = 0; i < this.arrows.length; i++) {
            newArrows.push(new Arrow());
        }
        this.setBestArrow();
        newArrows[0] = this.globalBestArrow.clone();
        newArrows[0].create(i);
        for (var i = 1; i < newArrows.length; i++) {
        var parent1 = this.selectArrow();
        var parent2 = this.selectArrow();
        var child = parent1.crossover(parent2);
        child.mutate(globalMutationRate);
        newArrows[i] = child;
        newArrows[i].create(i);
        }
        this.arrows = newArrows.slice(0);
        this.gen++;
        this.currentBest = 0;
    }
    mutate() {
        for (var i = 1; i < this.arrows.length; i++) {
            this.arrows[i].mutate(globalMutationRate);
        }
    }
    setBestArrow() {
        var max = 0;
        var maxIndex = 0;
        for(var i = 0; i < this.arrows.length; i++) {
            if(this.arrows[i].fitness > max) {
                max = this.arrows[i].fitness;
                maxIndex = i;
            }
        }
        if(max >= this.globalBestFitness) {
            this.globalBestFitness = max;
            this.globalBestArrow = this.arrows[maxIndex].clone();
        }
    }
    selectArrow() {
        var fitnessSum = 0;
        for (var i = 0; i < this.arrows.length; i++) {
            fitnessSum += this.arrows[i].fitness;
        }
        var rand = Math.floor(randomInt(0, fitnessSum));
        var runningSum = 0;
        for (var i = 0; i< this.arrows.length; i++) {
            runningSum += this.arrows[i].fitness; 
            if (runningSum > rand) {
                return this.arrows[i];
            }
        }
        return this.arrows[0];
    }
    setCurrentBest() {
        if(!this.done()) {
            var max = 0;
            var maxIndex = 0;
            for(var i = 0; i < this.arrows.length; i++) {
                if(this.arrows[i].alive && this.arrows[this.currentBestArrow].passed > max) {
                    max = this.arrows[this.currentBestArrow].passed;
                    maxIndex = i;
                }
            }
            if(max > this.currentBest) {
                this.currentBest = Math.floor(max);
            }
            if(!this.arrows[this.currentBestArrow].alive || max > this.arrows[this.currentBestArrow].passed + 5) {
                this.currentBestArrow  = maxIndex;
            }
            if(this.currentBest >= this.globalBest) {
                this.globalBest = this.currentBest;
            }
        }
    }
}