const startBtn = document.getElementById("start");

let a;
let asharp;
let b;
let c;
let csharp;
let d;
let dsharp;
let e;
let f;
let fsharp;
let g;
let gsharp;
function preload() {
  a = loadSound("/piano/piano-A4.mp3");
  // voiceE = loadSound("/chorus/chorus-male-e3-PB-loop.wav");
  // voiceFsharp = loadSound("/chorus/chorus-male-fsharp3-PB-loop.wav");
  b = loadSound("/piano/piano-B4.mp3");
  c = loadSound("/piano/piano-C4.mp3");
  // csharp = loadSound("piano/piano-C#4.mp3");
  d = loadSound("/piano/piano-D4.mp3");
  // dsharp = loadSound("piano/piano-D#4.mp3");
  e = loadSound("/piano/piano-E4.mp3");
  // f = loadSound("piano/piano-F4.mp3");
  fsharp = loadSound("/piano/piano-Fsharp4.mp3");
  g = loadSound("piano/piano-G4.mp3");
  // gsharp = loadSound("piano/piano-G#4.mp3");
}
var fft;
var smoothing = 0.8; // play with this, between 0 and .99
var binCount = 1024; // size of resulting FFT array. Must be a power of 2 between 16 an 1024
var particles = new Array(binCount);

function setup() {
  createCanvas(400, 400);
  setInterval(playE, Math.floor(Math.random() * 24000));

  setInterval(playA, Math.floor(Math.random() * 14000));
  setInterval(playC, Math.floor(Math.random() * 72000));
  setInterval(playB, Math.floor(Math.random() * 19000));
  setInterval(playD, Math.floor(Math.random() * 16000));

  setInterval(playFsharp, Math.floor(Math.random() * 18000));
  setInterval(playG, 20000);
  setInterval(playG, 20000);
  reverb = new p5.Reverb();
  reverb.process(a, 50, 4);
  reverb.process(b, 50, 4);
  reverb.process(e, 50, 4);
  reverb.process(c, 50, 4);
  reverb.process(d, 50, 4);
  reverb.process(fsharp, 50, 4);
  reverb.process(g, 50, 4);
  reverb.drywet(0.9);

  amp = new p5.Amplitude();

  fft = new p5.FFT(smoothing, binCount);
  for (var i = 0; i < particles.length; i++) {
    var x = map(i, 0, binCount, 0, width * 2);
    var y = random(0, height);
    var position = createVector(x, y);
    particles[i] = new Particle(position);
  }
}

function playA() {
  a.play();
}
// function voiceE() {
//   voiceFsharp.play();
// }
// function voiceFsharp() {
//   voiceE.play();
// }
function playB() {
  b.play();
}
function playC() {
  c.play();
}
function playD() {
  d.play();
}
function playG() {
  g.play();
}
function playFsharp() {
  fsharp.play();
}
function playE() {
  e.play();
}

function draw() {
  background("#4a4a4a");

  let dryWet = constrain(map(mouseX, 0, width, 0, 1), 0, 1);
  // 1 = all reverb, 0 = no reverb
  reverb.drywet(dryWet);

  var spectrum = fft.analyze(binCount);

  noStroke();
  fill("purple");
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }

  // update and draw all [binCount] particles!
  // Each particle gets a level that corresponds to
  // the level at one bin of the FFT spectrum.
  // This level is like amplitude, often called "energy."
  // It will be a number between 0-255.
  for (var i = 0; i < binCount; i++) {
    var thisLevel = map(spectrum[i], 0, 255, 0, 1);

    // update values based on amplitude at this part of the frequency spectrum
    particles[i].update(thisLevel);

    // draw the particle
    particles[i].draw();

    // update x position (in case we change the bin count while live coding)
    particles[i].position.x = map(i, 0, binCount, 0, width * 4);
  }
}

var Particle = function (position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = createVector(0, random(0, 10));
  this.color = [random(0, 20), random(0, 40), random(0, 255)];
};

var theyExpand = 1;

// use FFT bin level to change speed and diameter
Particle.prototype.update = function (someLevel) {
  this.position.y += this.speed.y / (someLevel * 2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  this.diameter = map(someLevel, 0, 1, 0, 100) * this.scale * theyExpand;
};

Particle.prototype.draw = function () {
  fill(this.color);
  ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
};

// ================
// Helper Functions
// ================

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   background(0);
// }
