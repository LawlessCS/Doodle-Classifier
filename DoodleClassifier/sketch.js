const len = 784;
const total_data = 1000;

const CAT = 0;
const DOG = 1;
const TRAIN = 2;
const RAINBOW = 3;

let cats_data;
let dogs_data;
let trains_data;
let rainbows_data;

let cats = {};
let dogs = {};
let trains = {};
let rainbows = {};

let nn;

function preload() {
	let dataPrefix = "./data/";
	// cats_data = loadBytes(dataPrefix + "cats1000.bin");
	// dogs_data = loadBytes(dataPrefix + "dogs1000.bin");
	// trains_data = loadBytes(dataPrefix + "trains1000.bin");
  // rainbows_data = loadBytes(dataPrefix + "rainbows1000.bin");
  cats_data = loadBytes(dataPrefix + "cats2500.bin");
	dogs_data = loadBytes(dataPrefix + "dogs2500.bin");
	trains_data = loadBytes(dataPrefix + "trains2500.bin");
	rainbows_data = loadBytes(dataPrefix + "rainbows2500.bin");
}

function prepareData(category, data, label) {
	category.training = [];
	category.testing = [];

	for (let i = 0; i < total_data; i++) {
		let offset = i * len;
		let threshold = floor(total_data * 0.8);

		if (i < threshold) {
			category.training[i] = data.bytes.subarray(offset, offset + len);
			category.training[i].label = label;
		} else {
			category.testing[i - threshold] = data.bytes.subarray(offset, offset + 784);
			category.testing[i - threshold].label = label;
		}
	}
}

function drawImages() {
	let total = 100;

	for (let n = 0; n < total; n++) {
		let img = createImage(28, 28);
		let offset = n * 784;

		img.loadPixels();

		for (let i = 0; i < 784; i++) {
			let val = 255 - cats_data.bytes[i + offset];
			img.pixels[i * 4] = val;
			img.pixels[i * 4 + 1] = val;
			img.pixels[i * 4 + 2] = val;
			img.pixels[i * 4 + 3] = val;
		}

		img.updatePixels();
		let x = (n % 10) * 28;
		let y = floor(n / 10) * 28;
		image(img, x, y);
	}
}

function trainEpoch(training) {
  // Training for 1 epoch
	shuffle(training, true);

	for (let i = 0; i < training.length; i++) {
		let data = training[i];
		let inputs = Array.from(data).map(x => x / 255);

		let label = training[i].label;
		let targets = [0, 0, 0, 0];
		targets[label] = 1;

		// console.log(inputs);
		// console.log(label);
		// console.log(targets);

		nn.train(inputs, targets);
  }
}

function testAll(testing) {
	let correct = 0;

	for (let i = 0; i < testing.length; i++) {
		let data = testing[i];
		let inputs = Array.from(data).map(x => x / 255);
		let label = testing[i].label;

		let guess = nn.feedforward(inputs);

		let m = max(guess);
		let classification = guess.indexOf(m);

		//console.log(guess);
		//console.log(classification);
		//console.log(label);

		if (classification === label) {
			correct++;
		}
	}

	return correct / testing.length;
}

function setup() {
	createCanvas(280, 280);
	background(255);

	// Preparing the data
	prepareData(cats, cats_data, CAT);
	prepareData(dogs, dogs_data, DOG);
	prepareData(trains, trains_data, TRAIN);
	prepareData(rainbows, rainbows_data, RAINBOW);

	// Making the neural network
	nn = new NeuralNetwork(784, 64, 4);

	// Gather and randomise training data
	let training = [];
	training = training.concat(cats.training);
	training = training.concat(dogs.training);
	training = training.concat(trains.training);
  training = training.concat(rainbows.training);
  
  let testing = [];
	testing = testing.concat(cats.testing);
	testing = testing.concat(dogs.testing);
	testing = testing.concat(trains.testing);
	testing = testing.concat(rainbows.testing);
	shuffle(training, true);
  
  //console.log("Starting training...");

  // for (let i = 0; i < 5; i++) {
  //   trainEpoch(training);
  //   console.log("Epoch " + (i + 1));
  //   console.log("% correct: " + testAll(testing));
  // } 

  let trainButton = select("#train");
  trainButton.mousePressed(function() {
    console.log("Training for 1 epoch...");
    trainEpoch(training);
    console.log("Training complete!")
  });

  let testButton = select("#test");
  testButton.mousePressed(function() {
    console.log("Testing for 1 epoch...")
    console.log("Correct: " + nf(testAll(testing) * 100, 2, 2) + "%");
  });

  let guessButton = select("#guess");
  guessButton.mousePressed(function() {
    let inputs = [];
    let img = get();
    img.resize(28, 28);
    img.loadPixels();

    for (let i = 0; i < len; i++) {
      let bright = img.pixels[i * 4];
      inputs[i] = (255 - bright) / 255.0;
    }

    let guess = nn.feedforward(inputs);
    let m = max(guess);
    let classificaion = guess.indexOf(m);

    switch (classificaion) {
      case CAT:
        console.log("CAT");
        break;
      case DOG:
        console.log("DOG");
        break;
      case TRAIN:
        console.log("TRAIN");
        break;
      case RAINBOW:
        console.log("RAINBOW");
        break;
    }
  });

  let clearButton = select("#clear");
  clearButton.mousePressed(function() {
    background(255);
  });
}

function draw() {
  strokeWeight(8);
  stroke(0);
  if(mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}