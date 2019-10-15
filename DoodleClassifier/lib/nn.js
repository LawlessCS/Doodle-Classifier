function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  //return sigmoid(x) * (1 - sigmoid(x));
  // Where y is sigmoid value already
  return y * (1 - y);
}

class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomise();
    this.weights_ho.randomise();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h.randomise();
    this.bias_o.randomise();

    this.learning_rate = 0.2;
  }

  setLearningRate(learning_rate) {
    this.learning_rate = learning_rate;
  }

  feedforward(input_array) {
    // Generating the hidden outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // Activation function
    hidden.map(sigmoid);

    // Generating the output's output
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);

    // Sending it back to the caller
    return outputs.toArray();
  }

  train(input_array, target_array) {
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // Activation function
    hidden.map(sigmoid);

    // Generating the output's output
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);

    let targets = Matrix.fromArray(target_array);
    //outputs = Matrix.fromArray(outputs);

    // ---OUTPUT LAYER-------------------------

    // Calculate output layer errors
    // ERROR = TARGET - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs);

    // Calculate output gradients
    let output_gradient = Matrix.map(outputs, dsigmoid);
    output_gradient.multiply(output_errors);
    output_gradient.multiply(this.learning_rate);

    // Calculate hidden->output deltas
    let hidden_T = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(output_gradient, hidden_T);

    // Adjust hidden->output weights by gradient
    this.weights_ho.add(weight_ho_deltas);
    // Adjust output bias by output gradient
    this.bias_o.add(output_gradient);

    // ---HIDDEN LAYER-------------------------

    // Calulate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradients
    let hidden_gradient = Matrix.map(hidden, dsigmoid);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);   

    
    // Calculate input->hidden deltas
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
    
    // Adjust input->hidden weights by gradient
    this.weights_ih.add(weight_ih_deltas);
    // Adjust hidden bias by hidden gradient
    this.bias_h.add(hidden_gradient)
  }
}
