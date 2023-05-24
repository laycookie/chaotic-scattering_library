import { simulate } from "chaos_theory";
import * as PIXI from "pixi.js";
import {Settings} from './main.d.ts'

const res_x = 500;
const res_y = 500;
let app = new PIXI.Application({
  width: res_x,
  height: res_y,
  antialias: true,
});
document.body.appendChild(app.view as unknown as Node);

const SCALER_CONST = 30;

function calculateNewPoint(originalX: number, originalY: number, angleInDegrees: number, distance: number) {
    // Convert angle from degrees to radians
    let angleInRadians = angleInDegrees * (Math.PI / 180);
  
    // Calculate the new coordinates
    let newX = (distance * Math.cos(angleInRadians)) + originalX;
    let newY =  (distance * Math.sin(angleInRadians)) + originalY;
  
    // Return the new coordinates as an object
    return { x: newX, y: newY };
  }

export function render({circleAmountX, circleAmountY, circleDistance, circleRadius, ini_y, ini_angle}: Settings) {
// clear canvas before the next render
app.stage.removeChildren();



const out = JSON.parse(simulate(circleAmountX, circleAmountY, circleDistance,
circleRadius, 0, ini_y, ini_angle));
// create circle sprite
for (let i of out.circles) {
  let circle = new PIXI.Graphics();
  circle.beginFill(0x9966ff);
  circle.drawCircle(
    i.x * SCALER_CONST,
    -i.y * SCALER_CONST,
    i.radius * SCALER_CONST
  );
  circle.endFill();
  circle.x = res_x / 2;
  circle.y = res_y / 2;
  app.stage.addChild(circle);
}
// create laser beams
for (let i of out.laser_beams) {
  if (!i.bounces) {
    let line = new PIXI.Graphics();
    line.lineStyle(1, 0xffffff);
    line.moveTo(i.x * SCALER_CONST, -i.y * SCALER_CONST);

    const line_end = calculateNewPoint(i.x, i.y, i.angle, 100);
    line.lineTo(line_end.x * SCALER_CONST, -line_end.y * SCALER_CONST);

    line.x = res_x / 2;
    line.y = res_y / 2;
    app.stage.addChild(line);
    console.log(i);
    break;
  }

  let line = new PIXI.Graphics();
  line.lineStyle(1, 0xffffff);
  line.moveTo(i.x * SCALER_CONST, -i.y * SCALER_CONST);
  line.lineTo(i.end_x * SCALER_CONST, -i.end_y * SCALER_CONST);
  line.x = res_x / 2;
  line.y = res_y / 2;
  app.stage.addChild(line);
}
}