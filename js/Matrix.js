class Matrix {
    // contructor for matrices
    // you can make your matrix in two ways: using array or give only dimentional of the matrix
    constructor() {
        if(arguments.length === 1 && Array.isArray(arguments[0])) {
            this.rows = arguments[0].length;
            this.cols = arguments[0][0].length;
            this.matrix = arguments[0];
        }
        else if(arguments.length === 2 && Number.isInteger(arguments[0]) && Number.isInteger(arguments[1])){
            this.rows = arguments[0];
            this.cols = arguments[1];
            this.matrix = new Array(arguments[0]);
            for(var i = 0; i < this.matrix.length; i++) {
                this.matrix[i] = new Array(arguments[1]);
            }
        }
    }
    // print matrix
    print() {
        for(var i = 0; i < this.rows; i++) {
            var string = "";
            for(var j = 0; j < this.cols; j++) {
                string += this.matrix[i][j] + " ";
            }
            console.log(string);
        }
    }
    // multiply by scalar
    multiply(n) {
        if(Number.isFinite(n)) {
            for(var i = 0; i < this.rows; i++) {
                for(var j = 0; j < this.cols; j++) {
                    this.matrix[i][j] *= n;
                }
            }
        }
        else if(n instanceof Matrix) {
            var newMatrix = new Matrix(this.rows, this.cols);
            if (this.cols == n.cols && this.rows == n.rows) {
                for(var i = 0; i < this.rows; i++) {
                    for(var j = 0; j < this.cols; j++) {
                        newMatrix.matrix[i][j] = this.matrix[i][j] * n.matrix[i][j];
                    }
                }
            } else { return new Error("this.cols must be equal n.cols and this.rows must be equal n.rows!") }
            return newMatrix;
        }
    }
    // return a matrix which is this matrix dot product parameter matrix 
    dot(n) {
        if(n instanceof Matrix) {
            var result = new Matrix(this.rows, n.cols);
            if(this.cols == n.rows) {
                for(var i = 0; i < this.rows; i++) {
                    for(var j = 0; j < n.cols; j++) {
                        var sum = 0;
                        for(var k = 0; k < this.cols; k++) {
                            sum += this.matrix[i][k]*n.matrix[k][j];
                        }
                        result.matrix[i][j] = sum;
                    }
                }
            } else { return new Error("this.cols must be equal n.rows!") }
            return result;
        }
    }
    // fill the matrix by randomized values from -1 to 1
    randomize() {
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                this.matrix[i][j] = randomFloat(-1, 1);
            }
        }
    }
    // add number to matrix or matrix to matrix
    add(n) {
        if(Number.isFinite(n)) {
            for(var i =0; i < this.rows; i++) {
                for(var j = 0; j < this.cols; j++) {
                    this.matrix[i][j] += n;
                }
            }
        }
        else if(n instanceof Matrix) {
            var newMatrix = new Matrix(this.rows, this.cols);
            if(this.cols == n.cols && this.rows == n.rows) {
                for(var i = 0; i < this.rows; i++) {
                    for(var j = 0; j < this.cols; j++) {
                        newMatrix.matrix[i][j] = this.matrix[i][j] + n.matrix[i][j];
                    }
                }
            } else { return new Error("this.cols must be equal n.cols and this.rows must be equal n.rows!") }
            return newMatrix;
        }
    }
    // subtract matrix from matrix
    subtract(n) {
        if(n instanceof Matrix) {
            var newMatrix = new Matrix(this.cols, this.rows);
            if (cols == n.cols && rows == n.rows) {
                for(var i =0; i < this.rows; i++) {
                    for(var j = 0; j < this.cols; j++) {
                        newMatrix.matrix[i][j] = this.matrix[i][j] - n.matrix[i][j];
                    }
                }
            }
            return newMatrix;
        } else { return new Error("the argument must have Matrix type!") }
    }
    // return matrix which is transposed matrix of this matrix
    transpose() {
        var n = new Matrix(this.cols, this.rows);
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                n.matrix[j][i] = this.matrix[i][j];
            }
        }
        return n;
    }
    // creates a single column array from the parameter array
    singleColumnMatrixFromArray(arr) {
        if(Array.isArray(arr)) {
            var n = new Matrix(arr.length, 1);
            for(var i = 0; i < arr.length; i++) {
                n.matrix[i][0] = arr[i];
            }
            return n;
        } else { return new Error("the argument must have Array type!") }
        
    }
    // sets this matrix from an array
    fromArray(arr) {
        if(Array.isArray(arr)) {
            for (var i = 0; i< this.rows; i++) {
                for (var j = 0; j < this.cols; j++) {
                    this.matrix[i][j] = arr[j+i*this.cols];
                }
            }
        } else { return new Error("the argument must have Array type!") }
    }   
    // returns an array which represents this matrix
    toArray() {
        var arr = new Array(this.rows*this.cols);
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j< this.cols; j++) {
                arr[j+i*this.cols] = this.matrix[i][j];
            }
        }
        return arr;
    }
    // for ix1 matrixes adds one to the bottom
    addBias() {
        var n = new Matrix(this.rows+1, 1);
        for(var i = 0; i < this.rows; i++) {
            n.matrix[i][0] = this.matrix[i][0];
        }
        n.matrix[this.rows][0] = 1;
        return n;
    }
    // sigmoid activation function
    sigmoid(x) {
        if(Number.isFinite(x)) 
            return  1 / (1 + Math.exp(-x));
        else { return new Error("wrong type of argument!") }
    }
    // returns the matrix that is the derived sigmoid function of the current matrix
    sigmoidDerived() {
        var n = new Matrix(this.rows, this.cols);
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                n.matrix[i][j] = (this.matrix[i][j] * (1 - this.matrix[i][j]));
            }
        }
        return n;
    }
    // applies the activation function(sigmoid) to each element of the matrix
    activate() {
        var n = new Matrix(this.rows, this.cols);
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                n.matrix[i][j] = this.sigmoid(this.matrix[i][j]);
            }
        }
        return n;
    }
    // returns the matrix which is this matrix with the bottom layer removed
    removeBottomLayer() {
        var n = new Matrix(this.rows-1, this.cols);      
        for (var i = 0; i < n.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                n.matrix[i][j] = this.matrix[i][j];
            }
        }
        return n;
    }
    // Mutation function for genetic algorithm 
    mutate(mutationRate) {
        if(Number.isFinite(mutationRate)) {
            //for each element in the matrix
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.cols; j++) {
                    var rand = randomFloat(0, 1);
                    //if chosen to be mutated
                    if (rand < mutationRate) {    
                        //add a random value to it(can be negative)
                        this.matrix[i][j]+=randomGaussian()/5;
                        //set the boundaries to 1 and -1
                        if (this.matrix[i][j] > 1) {
                            this.matrix[i][j] = 1;
                        }
                        if (this.matrix[i][j] < -1) {
                            this.matrix[i][j] = -1;
                        }
                    }
                }
            }
        } else { return new Error("wrong type of argument!") }
    }
    // returns a matrix which has a random number of values from this matrix and the rest from the parameter matrix
    crossover(partner) {
        if(partner instanceof Matrix) {
            var child = new Matrix(this.rows, this.cols);
            // pick a random point in the matrix
            var randC = Math.floor(randomInt(0, this.cols));
            var randR = Math.floor(randomInt(0, this.rows));
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.cols; j++) {
                    if ((i < randR)|| (i == randR && j <= randC)) {
                        // if before the random point then copy from this matric
                        child.matrix[i][j] = this.matrix[i][j];
                    } else {
                        // if after the random point then copy from the parameter array
                        child.matrix[i][j] = partner.matrix[i][j];
                    }
                }
            }
            return child;
        } else { return new Error("wrong type of argument!") }
    }
    // make clone of the matrix
    clone() {
        var clone = new Matrix(this.rows, this.cols);
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                clone.matrix[i][j] = this.matrix[i][j];
            }
        }
        return clone;
      }
}