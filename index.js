import { ImageJS } from "./lib/imagejs/imagejs.js";
import { SDFsquare } from "./lib/sdf/sdf.js";

const squareSize = 0.25;

{
  const canvas = document.getElementsByTagName('canvas')[0];
  const ctx = canvas.getContext('2d');

  const imagejs = new ImageJS(canvas.width, canvas.height);

  const aspectRatio = canvas.width / canvas.height;

  const mainImage = (fragColor, fragCoord) => {
    const t = performance.now() / 1000;

    const x = fragCoord.x / canvas.width * aspectRatio - 1;
    const y = fragCoord.y / canvas.height - 0.5;

    const square = 0.5 + 0.5 * Math.cos(SDFsquare({ x: x, y: y}, squareSize) * Math.PI * 40 + t);

    fragColor(square, square, square, 1.0);
  };

  const loop = () => {
    imagejs.draw(mainImage);
    imagejs.putImage(ctx);
    requestAnimationFrame(loop);
  };

  loop(); 
};

{
  const canvas = document.getElementsByTagName('canvas')[1];
  const ctx = canvas.getContext('2d');

  const ws = canvas.width / 2;
  const hs = canvas.height / 2;

  const draw = () => {
    ctx.lineWidth = 1 / canvas.height;
    ctx.strokeRect(-squareSize, -squareSize, squareSize * 2, squareSize * 2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, 2 * Math.PI, false);
    ctx.stroke();
  };

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(ws, hs);
    ctx.scale(canvas.height, canvas.height);
    draw()
    ctx.resetTransform();
    requestAnimationFrame(loop);
  };

  loop();
};
