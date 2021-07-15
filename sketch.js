/*
Created by : Dale Chester N10581618
SKETCH NAME : The Trip
ARTIST / ALBUM :   Chelou /  Out of Sight
Description :   A hero-image / banner meant for websites or mobile phones.
The sketch has voice activation and response to commands.  Speak the commands on the bottom of the screen, shake your phone or dragging/swiping  to advance the sketch to the next stage.  The final stage is an image/gif that is sharable on social media to promote the album.   The 4 stages are 
0. Asleep  -  Say WAKE UP
1. Awake  -  Say LISTEN
2. Listening - Say SHARE
3. Sharing. The end of the sketch.

During any stage press a mouse button or keyboard to access print media promotional material.

Note : Actual social media sharing not implemented and additional animations happen when the sketch detechs any sound from the mind.
Additional Note : Stars collect if alt-tabbed, and shoot out at once but this corrects over time.

*/
//M
let state = 0;
let myFont;
let myFont2;

//hue manager used for unifiying hue transitions
let myHue;

//sound and image management
let speech = new p5.SpeechRec();
let speechText = "";
let speechAlpha = 100;
let speechFader;
let stars = [];
let opentrip;
let closetrip;
let hue = 1;
let mic;
let rainbow;
let sample;
let analyzer;
let fft;
let socials = [];

//background nebula images
let nebula;
let nebula2;
let nebula3;
let nebula4;

//interaction mangement variables
let touchStart;
let shakeCooldown = false;
let startShakeCooldown;

function preload() {
  sample = loadSound("sample.mp3");
  myFont = loadFont("dontdodrugs.ttf");
  myFont2 = loadFont("shortstack.ttf");
  opentrip = loadImage("open.svg");
  closetrip = loadImage("close.svg");
  socials.push(loadImage("instagram.png"));
  socials.push(loadImage("facebook.png"));
  socials.push(loadImage("tiktok.png"));
  pixelDensity(1);
  myHue = new Huemanager();
}

function setup() {
  createCanvas(windowWidth, 500);
  background(0);

  //Generate background image
  nebula = createGraphics(width * 2, height * 2, P2D);
  nebulaGen(nebula, 0);
  nebula2 = createGraphics(width * 2, height * 2, P2D);
  nebulaGen(nebula2, 10);
  nebula3 = createGraphics(width * 2, height * 2, P2D);
  nebulaGen(nebula3, 20);
  nebula4 = createGraphics(width * 2, height * 2, P2D);
  nebulaGen(nebula4, 30);

  //setup music
  analyzer = new p5.Amplitude();
  analyzer.setInput(sample);
  fft = new p5.FFT();

  //Setup rainbow equilizer for the 'Listen' stage
  let rainbowWidth = 250;
  rainbow = new Rainbowlizer(
    myHue,
    createVector(width / 2 - rainbowWidth / 2, height - rainbowWidth * 0.75),
    rainbowWidth
  );

  //Add stars to stars array over time
  angleMode(DEGREES);
  popStars = setInterval(() => {
    if (stars.length > 50) {
      clearInterval(popStars);
    }
    let star = new Star();
    stars.push(star);
  }, 350);

  //Turn on mic and speech-to-text
  mic = new p5.AudioIn();
  mic.start();
  speech.onResult = showResult; // bind callback function to trigger when speech is recognized
  speech.continuous = true;
  speech.start(); // start listening
}

//Generates a background cosmos look to load into an image.
function nebulaGen(neb, c) {
  neb.loadPixels();
  for (var y = 0; y < neb.height; y++) {
    for (var x = 0; x < neb.width; x++) {
      var index = (x + y * neb.width) * 4;
      neb.pixels[index + 0] = noise(x / 100.0, y / 100.0) * 50;
      neb.pixels[index + 1] = 1;
      neb.pixels[index + 2] = random(c, c + 40);
      neb.pixels[index + 3] = 255;
    }
  }
  neb.updatePixels();
}

//Callback function after processing user speech.
function showResult() {
  if (speech.resultString.includes("sleep")) {
    stateSwitch(0);
  } else if (speech.resultString.includes("wake up")) {
    stateSwitch(1);
  } else if (speech.resultString.includes("listen")) {
    stateSwitch(2);
  } else if (
    speech.resultString.includes("share") ||
    speech.resultString.includes("Cher")
  ) {
    stateSwitch(3);
  }

  //console.log(speech.resultString);
  speechAlpha = 100;
  speechFader = setInterval(() => {
    if (speechAlpha === 0) {
      clearInterval(speechFader);
    } else {
      speechAlpha = speechAlpha -= 10;
    }
  }, 200);
  speechText = speech.resultString;
}

function touchStarted() {
  touchStart = createVector(mouseX, mouseY);
}

function touchEnded() {
  if (mouseX - touchStart.x > 50 || touchStart.x - mouseX > 50) {
    stateSwitch();
  }
}

function deviceShaken() {
  if (shakeCooldown) {
    return;
  }

  //Adds a cooldown between screen changes
  shakeCooldown = true;
  stateSwitch();
  let startShakeCooldown = setInterval(() => {
    shakeCooldown = false;
    clearInterval(startShakeCooldown);
  }, 3000);
}

//Update the state of the sketch
function stateSwitch(newState) {
  sample.stop();
  if (newState === undefined) {
    state = state >= 3 ? 3 : state + 1;
  } else {
    state = newState;
  }
  switch (state) {
    case 1:
      //WAKE UP STATE

      break;
    case 2:
      //LISTEN STATE

      sample.play();
      for (let i = 0; i < 5; i++) {
        if (stars[i] != undefined) {
          stars[i].type = "note";
        }
      }
      break;
    case 3:
      //SHARE STATE
      for (let i = 6; i < 21; i++) {
        if (stars[i] != undefined) {
          stars[i].type = "flutter";
        }
      }
      break;
    default:
      break;
  }
}

//Set background to new nebula
function drawBG() {
  switch (state) {
    case 1:
      image(nebula2, 0, 0);
      break;
    case 2:
      image(nebula3, 0, 0);
      break;
    case 3:
      image(nebula4, 0, 0);
      break;
    default:
      image(nebula, 0, 0);
      break;
  }
}

function draw() {
  background(0);
  drawBG();

  translate(width / 2, height / 2);
  imageMode(CENTER);

  //Microphone Head Aura
  let vol = mic.getLevel() * 2.5;
  let overload = false;
  strokeWeight(2.5);
  colorMode(HSB, 100);
  beginShape();
  for (let i = 0; i < 36; i++) {
    var angle = map(i, 0, 36, 0, 360);
    var r = map(vol, 0, 1, 20, 200);

    if (state == 3) {
      r = 50;
    }

    if (r > 100) {
      overload = true;
    }
    var x = r * cos(angle);
    var y = r * sin(angle);
    stroke((angle / 36) * 10, 100, 100, 100);
    line(0, 0, x, y);
  }
  endShape();

  //Speech to Text
  if (state < 3) {
    noStroke();
    colorMode(HSB, 360, 100, 100);
    fill(360, 0, 100, speechAlpha);
    textFont(myFont2);
    textSize(28);
    text(speechText, 0, height / 2 - 400);
  }
  
  //Set Speech command font.
  textFont(myFont);
  textSize(48);

  if (state == 0) {
    rectMode(CENTER);
    textAlign(CENTER);
    stroke(75, 100, 100, 100);
    fill(64, 40, 15, 100);

    if (keyIsPressed || mouseIsPressed) {
      promotionText();
    } else {
      if (overload == false) {
        text("WAKE UP", 0, height / 2 - 50);
      }
    }
    image(closetrip, 0, 30);
    return;
  }

  rainbow.draw();
  playStars();
  image(opentrip, 0, 30);

  //Wake up State
  if (state == 1) {
    rectMode(CENTER);
    textAlign(CENTER);
    stroke(88, 100, 100, 100);
    fill(75, 40, 15, 100);
    if (keyIsPressed || mouseIsPressed) {
      promotionText();
    } else {
      if (overload == false) {
        text("Listen", 0, height / 2 - 50);
      }
    }
    return;
  }

  //Listen State
  if (state == 2) {
    rectMode(CENTER);
    textAlign(CENTER);
    stroke(140, 100, 100, 100);
    fill(85, 40, 15, 100);
    if (keyIsPressed || mouseIsPressed) {
      promotionText();
    } else {
      if (overload == false) {
        text("Share!", 0, height / 2 - 50);
      }
    }

    return;
  }

  //Share State
  if (state == 3) {
    rectMode(CENTER);
    textAlign(CENTER);
    let x = -90;
    let y = height / 2 - 50;
    for (let i = 0; i < socials.length; i++) {
      image(socials[i], x, y);
      x = x + 100;
    }
    stroke(160, 100, 100, 100);
    fill(85, 40, 15, 100);
    promotionText();
  }
}


//Shows the # for the promotional images
function promotionText() {
  push();
  if (state == 2) {
    translate(0, 300);
  }
  text("Out of Sight", 0, height / 2 - 400);
  textFont(myFont2);
  text("4-20-22", 0, height / 2 - 350);
  pop();
  noStroke();
  fill("white");
  textFont(myFont2);
  textSize(24);
  let w = 0 - width / 2 + 55;
  let h = 0 - height / 2 + 25;
  text("#chelou", 0, h);
}

//Function for looping and displaying stars
function playStars() {
  for (let s of stars) {
    s.update(state);
    s.show(state);
  }
}

/* Star class.
Stars eminate from the third eye and can be one of three types.
'star',  'flutter', 'note'
*/

class Star extends p5.Vector {
  constructor(x = 0, y = 0, type = "star") {
    super(x, y);
    this.prevPos = this.copy();
    this.color = random(150, 255);
    this.weight = random(0.5, 3.5);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.time = millis();
    this.angle = random(360);
    this.type = type;
  }

  //draws a note instead of a star
  drawNote() {
    push();
    colorMode(HSB, 360, 100, 100);
    stroke(this.color, 100, 100, 100);
    fill(this.color, 100, 100, 100);
    let v = this;
    let v2 = createVector(v.x + 5, v.y - 15);
    circle(v.x, v.y, 7);
    strokeWeight(3);
    line(v.x + 3, v.y, v2.x, v2.y);
    quad(v2.x, v2.y, v2.x + 5, v2.y + 2, v2.x + 6, v2.y, v2.x, v2.y - 2);
    pop();
  }

  //draws a random thingy instead of a star
  drawFlutter() {
    colorMode(HSB, 360, 100, 100);
    stroke(this.color, 100, 100, 100);
    strokeWeight(this.weight);
    beginShape();
    vertex(this.x, this.y);
    vertex(this.x + random(-5, 5), this.y + random(-5, 5));
    vertex(this.x + random(-5, 5), this.y + random(-5, 5));
    vertex(this.x + random(-5, 5), this.y + random(-5, 5));
    endShape();
  }

  drawStar() {
    stroke(this.color);
    strokeWeight(this.weight);
    point(this.x, this.y);
  }

  show() {
    push();
    switch (this.type) {
      case "note":
        this.drawNote();
        break;
      case "flutter":
        this.drawFlutter();
        break;
      default:
        this.drawStar();
        break;
    }
    pop();
  }

  update(stage = 0) {
    push();
    scale(233);
    this.prevPos = this.copy();
    let r = (millis() - this.time) * 0.002;
    this.vel.x = r * cos(this.angle);
    this.vel.y = r * sin(this.angle);

    if (
      this.x < (width / 2) * -1 ||
      this.x > width / 2 ||
      this.y < (height / 2) * -1 ||
      this.y > height / 2
    ) {
      //RESET THE STAR
      this.x = 0;
      this.y = 0;
      this.time = millis();
      this.angle = random(360);
      switch (stage) {
        case 2:
        case 3:
          this.color = random(360);
          break;
        default:
          this.color = random(150, 255);
          break;
      }
    } else {
      this.add(this.vel);
    }
    pop();
  }
}

// A class for managing rotating hue.
class Huemanager {
  constructor() {
    this.lowHue = 0;
    this.highHue = 50;
    this.inc = 4;

    this.hueChange = setInterval(() => {
      if (this.lowHue >= 360) {
        this.lowHue = 1;
      } else if (this.lowHue >= 310 && this.highHue > 360) {
        this.highHue = 1;
      }

      this.highHue += this.inc;
      this.lowHue += this.inc;
    }, 150);
  }
}
