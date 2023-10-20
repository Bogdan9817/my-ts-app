import { Coord } from "./Wall";

export default class Drone {
  constructor(
    private xcoord: number,
    private ctx: CanvasRenderingContext2D,
    public crashed: boolean = false,
    public velocity: number = 0
  ) {}

  private draw() {
    this.ctx.moveTo(this.xcoord, 0);
    this.ctx.beginPath();
    this.ctx.lineTo(this.xcoord + 20, 0);
    this.ctx.lineTo(this.xcoord, 0);
    this.ctx.lineTo(this.xcoord + 10, 20);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.fill();
  }

  public isCollide(coords: Coord[]) {
    for (let coord of coords) {
      if (this.checkCollide(coord)) {
        this.crashed = true;
        break;
      }
    }
  }

  private checkCollide(coord: Coord) {
    const droneMidPoint = { x: this.xcoord + 10, y: 10 };
    const deltaX = coord.x - droneMidPoint.x;
    const deltaY = coord.y - droneMidPoint.y;
    const dist = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    return dist <= 12;
  }
  moveLeft() {
    if (this.velocity <= -5) return;
    this.velocity -= 1;
  }

  moveRight() {
    if (this.velocity >= 5) return;
    this.velocity += 1;
  }

  update(coords: Coord[]) {
    if (this.crashed) return;
    if (this.velocity === 0) return this.draw();
    this.xcoord += this.velocity * 0.1;
    this.draw();
    this.isCollide(coords);
  }
}
