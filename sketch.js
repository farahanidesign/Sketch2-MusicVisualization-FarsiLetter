// By Mehdi Farahani
// Galaxy Visual with Depth of Field

var song;
var fft;
let particles = [];
let maxRadius = 350;
let minRadius = 10;
let font;
let img;
let imgWidth = 20;
let imgHeight = 20;
let centerImageSize = 60;

function preload() {
  song = loadSound('2.mp3');
  font = loadFont('MehrNastaliqWebRegular.ttf');
  img = loadImage('2-1.png');
  centerImg = loadImage('2-2.png');
}

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  rectMode(CENTER);
  fft = new p5.FFT();

  for (let i = 0; i < 500; i++) {
    particles.push(new Particle());
  }
  
  particles[0].isCenter = true;
  particles[0].vel = createVector(0, 0);
}

function draw() {
  background(250);
  strokeWeight(2);
  stroke(255);
  noFill();

  translate(width / 2, height / 2);

  // analyze the audio frequencies
  fft.analyze();
  amp = fft.getEnergy(400, 400);

  var wave = fft.waveform();

  for (var t = -1; t <= 1; t += 2) {
    for (let i = 0; i <= 180; i++) {
      let index = floor(map(i, 0, 300, 0, wave.length - 1));
      let r = map(wave[index], -0, 0, minRadius, maxRadius);
      let x = r * sin(i) * t;
      let y = r * cos(i);
      point(x, y);
      vertex(x, y);
    }
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
  
  imageMode(CENTER);
  image(centerImg, 0, 0, centerImageSize, centerImageSize);
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(random(100, maxRadius));
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    this.acc = createVector(0, 0);
    this.size = random(1, 8);
    this.c = color(random(255), random(255), random(255), 150);
    this.isCenter = false;
  }

  show() {
    noStroke();
    fill(this.c);
    textSize(this.size);
    textFont(font);
    textAlign(CENTER, CENTER);
    let depth = map(this.pos.mag(), 0, maxRadius, 0, 1);
    let size = this.size + depth * 70; // Scale size based on depth
    imageMode(CENTER);
    image(img, this.pos.x, this.pos.y, size, size);
  }

  update() {
    this.vel.add(this.acc);
    
    if (!this.isCenter) {
      this.pos.add(this.vel);
      
      if (this.pos.mag() > maxRadius) {
        this.pos = p5.Vector.random2D().mult(random(100, maxRadius));
      }
    }
  }
}
