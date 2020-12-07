class NeuralNet {
    //constructor
    constructor(inputs, hiddenNo, outputNo) {
        // set dimensions from parameters
        // No. of input nodes
        this.iNodes = inputs; 
        // No. of hidden nodes
        this.oNodes = outputNo;
        // No. of output nodes 
        this.hNodes = hiddenNo; 
        // create first layer weights 
        // included bias weight
        // matrix containing weights between the input nodes and the hidden nodes
        this.whi = new Matrix(this.hNodes, this.iNodes + 1); 
        // create second layer weights
        // include bias weight
        // matrix containing weights between the hidden nodes and the second layer hidden nodes
        this.whh = new Matrix(this.hNodes, this.hNodes + 1); 
        // create second layer weights
        // include bias weight
        // matrix containing weights between the second hidden layer nodes and the output nodes
        this.woh = new Matrix(this.oNodes, this.hNodes + 1); 
        // set the matricies to random values
        this.whi.randomize();
        this.whh.randomize();
        this.woh.randomize();
    }

    // mutation function for genetic algorithm
    mutate(mr) {
        if(Number.isFinite(mr)) {
            //mutates each weight matrix
            this.whi.mutate(mr);
            this.whh.mutate(mr);
            this.woh.mutate(mr);
        } else { return new Error("wrong type of argument!") }
    }
    
    // calculate the output values by feeding forward through the neural network
    output(inputsArr) {
        if(Array.isArray(inputsArr)) {
            // convert array to matrix
            // Note woh has nothing to do with it its just a function in the Matrix class
            var inputs = this.woh.singleColumnMatrixFromArray(inputsArr);
            // add bias 
            var inputsBias = inputs.addBias();
            // calculate the guessed output
            // apply layer one weights to the inputs
            var hiddenInputs = this.whi.dot(inputsBias);
            // pass through activation function(sigmoid)
            var hiddenOutputs = hiddenInputs.activate();
            // add bias
            var hiddenOutputsBias = hiddenOutputs.addBias();
            // apply layer two weights
            var hiddenInputs2 = this.whh.dot(hiddenOutputsBias);
            var hiddenOutputs2 = hiddenInputs2.activate();
            var hiddenOutputsBias2 = hiddenOutputs2.addBias();
            // apply level three weights
            var outputInputs = this.woh.dot(hiddenOutputsBias2);
            // pass through activation function(sigmoid)
            var outputs = outputInputs.activate();
            // convert to an array and return
            return outputs.toArray();
        } else { return new Error("wrong type of argument!") }
    }

    // crossover function for genetic algorithm
    crossover(partner) {
        if(partner instanceof NeuralNet) {
            //creates a new child with layer matrices from both parents
            var child = new NeuralNet(this.iNodes, this.hNodes, this.oNodes);
            child.whi = this.whi.crossover(partner.whi);
            child.whh = this.whh.crossover(partner.whh);
            child.woh = this.woh.crossover(partner.woh);
            return child;
        } else { return new Error("wrong type of argument!") }
    }

    // return a neural net which is a clone of this Neural net
    clone() {
        var clone  = new NeuralNet(this.iNodes, this.hNodes, this.oNodes); 
        clone.whi = this.whi.clone();
        clone.whh = this.whh.clone();
        clone.woh = this.woh.clone();
        return clone;
    }
}