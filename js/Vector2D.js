class Vector2D {
    
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        
    }
    add(vec) {
        var temp = new Vector2D();
        temp.x += (this.x + vec.x)
        temp.y += (this.y + vec.y)
        return temp;
    }
    multiply(k) {
        if(k instanceof Vector2D) {
            return new Vector2D(this.x*k.x, this.y*k.y);
        }
        else if(k instanceof Number) {
            return new Vector2D(this.x*k, this.y*k);
        } else { return new TypeError() }
    }
    distance(a) {
        return Math.sqrt( (this.x - a.x) ** 2 + (this.y - a.y) ** 2 );
    }
    toArray() {
        return [this.x, this.y];
    }
    clone() {
        return new Vector2D(this.x, this.y);
    }
    isEqual(vec) {
        return ( (this.x === vec.x && this.y === vec.y) ? true : false ); 
    }
}