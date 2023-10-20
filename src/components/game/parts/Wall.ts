export type Coord = { x: number; y: number };

export default class Wall {
  private anchorY = 0;
  private stepY: number;
  private coords: Coord[] = [];
  public potentialCollide: Coord = {
    x: -100,
    y: -100,
  };
  private baseSpeed: number;
  public velocity: number = 0;

  constructor(
    private xcoords: number[],
    private ctx: CanvasRenderingContext2D,
    private midX: number,
    private complexity: number = 1
  ) {
    this.stepY = 20;
    this.coords = [];
    this.baseSpeed = this.complexity * 0.1;
  }

  private draw() {
    this.coords = [];
    this.ctx.moveTo(this.midX + this.xcoords[0], this.anchorY);
    this.ctx.beginPath();
    let anchor = this.anchorY;

    for (let coord of this.xcoords) {
      this.ctx.lineTo(this.midX + coord, anchor);
      this.coords.push({ x: this.midX + coord, y: anchor });
      if (anchor >= 0 && anchor < this.stepY) {
        this.potentialCollide = { x: this.midX + coord, y: anchor };
      }
      anchor += this.stepY;
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }

  get isLevelPassed() {
    if (this.coords.length > 0) {
      return this.coords[this.coords.length - 1].y < 0;
    }
    return false;
  }

  incrementVelocity() {
    if (this.velocity >= 5) return;
    this.velocity += 1;
  }

  decrementVelocity() {
    if (this.velocity <= 0) return;
    this.velocity -= 1;
  }
  update() {
    if (this.velocity === 0) return this.draw();
    this.anchorY -= this.velocity * this.baseSpeed;
    this.draw();
  }
}
