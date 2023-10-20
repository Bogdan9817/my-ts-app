export default class Gauges {
  private velocityV: number = 0;
  private velocityH: number = 0;
  public scoreValue: number = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvasHeight: number,
    private complexity: number = 0
  ) {}

  private draw() {
    this.ctx.moveTo(0, this.canvasHeight);
    this.ctx.beginPath();
    this.ctx.font = "12px Arial";
    this.ctx.fillText(
      `Vertical speed ${this.velocityV * 10},Horizontal speed ${
        this.velocityH * 10
      }, Score: ${Math.round(
        (this.scoreValue += 2 * (this.velocityV * this.complexity))
      )}`,
      10,
      this.canvasHeight
    );
  }

  update(v: number, h: number) {
    this.velocityH = h;
    this.velocityV = v;
    this.draw();
  }
}
