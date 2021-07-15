
//This is a custom equalizer
class Rainbowlizer {
  
  constructor(hueManager, point, width = 400) {
    this.fft = new p5.FFT(0.8, 32);
    this.point = point;
    this.width = width;
    this.height = width * 0.75;
    this.points = [];
    this.space = 0;
    this.hueManager = hueManager;
    this.isPaused = false;

    this.setup = () => {
      angleMode(DEGREES);
      let space = this.width / 16;
      this.space = this.width / 16;
      let col = [];

      for (let x = 1; x <=8; x++) {
        this.angle = map(x, 1, 8, 200, 340);
        for (let y = 1; y <=12; y++) {
          let r = (y * 10) 
          this.point.x = r * cos(this.angle);
          this.point.y = r * sin(this.angle);
          let loc = createVector(this.point.x,this.point.y);
          col.push(loc);
        }
        this.points.push(col);
        col = [];
      }
    };
    this.setup();
  }

  draw() {
    push();

    //Run the Equilizer
    let spectrum = this.fft.analyze();
    let runningCount = 1;

    for (let c = 0; c < this.points.length; c++) {
      for (let i = 0; i < this.points[c].length; i++) {
        let s = map(spectrum[c], 1, 255, 1, 12);
        //s = 12 - s;
        runningCount++;
        let h = map(
          runningCount,
          1,
          this.points.length * this.points[c].length,
          this.hueManager.lowHue,
          this.hueManager.highHue
        );
        colorMode(HSB, 360, 100, 100);
        noStroke();

        fill(h, 100, 100, i <= s || this.isPaused ? 100 : 0);
        // THE ORIGINAL RECTANGLE SHAPE FOR THE EQUILIZER
        //  rect(this.points[c][i].x, this.points[c][i].y, this.space * 0.85, this.space * 0.85, 4);
        //
       /* rect(          this.points[c][i].x,
          this.points[c][i].y,
          this.space * 0.85,
          this.space * 0.85,
          2
        );*/
        circle(this.points[c][i].x, this.points[c][i].y, 8)
      }
    }

    pop();
  }
}
