import { ImageJS } from "./lib/imagejs/imagejs.js";
import { length2, length3 } from "./lib/sdf/mathpls.js";
import { lineSegment, SDFsquare, SDFsquare3 } from "./lib/sdf/sdf.js";

const keys = {};

window.addEventListener('keyup', event => {
  keys[event.code] = false;
});

window.addEventListener('keydown', event => {
  keys[event.code] = true;
});

const mouse = {
  x: 0,
  y: 0,
  btn:[],
  move(event) {
    this.x = event.offsetX;
    this.y = event.offsetY;
  }
};

window.addEventListener('mousemove', event => mouse.move(event));
window.addEventListener('mousedown', event => {
  mouse.btn[event.button] = true;
});
window.addEventListener('mouseup', event => {
  mouse.btn[event.button] = false;
});

//const p1 = {
  //x: 0,
  //y: 0
//};

window.p2 = {
  x: -0.1933931975376713,
  y: -0.2867625631909865,
  z: 0.2900000000000001,
  camX: 0.4400000000000003,
  camY: -1.6200000000000006
};



const lp1 = {
  x: 0.5,
  y: 0.8
};

const lp2 = {
  x: -1.2,
  y: 1
};

const triWave = (x) => Math.abs(Math.abs(x % 2) - 1);

const squareSize = 0.1;

{
  const canvas = document.getElementsByTagName('canvas')[0];
  const ctx = canvas.getContext('2d');

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  //resizeCanvas();

  //window.addEventListener('resize', resizeCanvas);

  const imagejs = new ImageJS(canvas.width, canvas.height);

  const aspectRatio = canvas.width / canvas.height;

  const mainImage = (fragColor, fragCoord) => {
    const t = performance.now() / 1000;

    const x = 2 * (fragCoord.x / canvas.width - 0.5) * aspectRatio;
    const y = 2 * (fragCoord.y / canvas.height- 0.5);

    const square = 0.5 + 0.5 * Math.cos(SDFsquare({ x: x, y: y}, squareSize) * Math.PI * 20 + t);

    fragColor(0, 0, 0, 1.0);
  };

  const loop = () => {
    //imagejs.draw(mainImage);
    //imagejs.putImage(ctx);

    const mx = 2 * (mouse.x / canvas.width - 0.5) * aspectRatio;
    const my = 2 * (mouse.y / canvas.height- 0.5);

    //if(mouse.btn[0]) {p1.x = mx; p1.y = my};
    //if(mouse.btn[1]) {p2.x = mx; p2.y = my};
    //if(mouse.btn[2]) {p2.z = mx};

    const square = SDFsquare({ x: p2.x, y: p2.z}, squareSize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2.0, canvas.height / 2.0);
    ctx.scale(canvas.height / 2.0, canvas.height / 2.0);

    ctx.lineWidth = 0.5 / canvas.height;

    ctx.strokeRect(-squareSize, -squareSize, squareSize * 2, squareSize * 2);

    ctx.fillStyle = '#00000040'

    //ctx.beginPath();
    //ctx.arc(p1.x, p1.y , 0.01, 0, 2 * Math.PI);
    //ctx.fill();

    ctx.beginPath();
    ctx.arc(p2.x, p2.y , 0.01, 0, 2 * Math.PI);
    ctx.fill();

    //Ray marching

    let rx = p2.x;
    let ry = p2.y;

    ctx.beginPath();
    ctx.moveTo(lp1.x, lp1.y);
    ctx.lineTo(lp2.x, lp2.y);
    ctx.stroke();

    for(let i = 0; i < 255; i++) {
      const len = length2(p2.x - rx,p2.y - ry);

      const square = SDFsquare({x: rx, y: ry}, squareSize);
      const line = lineSegment({x: rx, y: ry}, lp1, lp2);

      const scene = Math.min(
        square, 
        line
      );

      if(scene < 0.0001 || len > 8) break

      ctx.beginPath();
      ctx.arc(rx, ry, scene, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rx, ry);

      rx = rx + Math.sin(p2.camY) * scene;
      ry = ry + Math.cos(p2.camY) * scene;

      ctx.lineTo(rx, ry);
      ctx.stroke();
    };

    ctx.resetTransform();


    ctx.fillStyle = '#000000'
    //ctx.font = "30px Arial";
    //ctx.fillText('depth: '+length2(rx - p2.x, ry - p2.y), 10, 100);

    requestAnimationFrame(loop);
  };

  loop(); 
};

const cam = {
  x: 1.5,
  y: 0,
  degX: 0,
}

{
  const canvas = document.getElementsByTagName('canvas')[1];
  const ctx = canvas.getContext('2d');

  let lockedPointer = false;

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', () => {
    document.pointerLockElement?
    lockedPointer = true : lockedPointer = false;
  });

  document.addEventListener("mousemove", e => {
    if(lockedPointer) {
      const sen = 0.005;
      p2.camX += e.movementX * sen;
      p2.camY += e.movementY * sen;
      //p2.camY = Math.min(Math.max(p2.camY, -Math.PI / 2), Math.PI / 2);
    };
  });

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  //resizeCanvas();

  //window.addEventListener('resize', resizeCanvas);

  const imagejs = new ImageJS(canvas.width, canvas.height);

  const aspectRatio = canvas.width / canvas.height;

  const speed= 0.01;

  const loop = () => {
    const axyX = {
      x: Math.sin(p2.camX) * speed,
      y: Math.cos(p2.camX) * speed
    };
    
    const axyY = {
      x: Math.cos(-p2.camX) * speed,
      y: Math.sin(-p2.camX) * speed
    };
  
    p2.x += keys.KeyW? axyX.x : keys.KeyS? -axyX.x: 0.0;
    p2.y += keys.KeyW? axyX.y : keys.KeyS? -axyX.y: 0.0;
    p2.x -= keys.KeyA? axyY.x : keys.KeyD? -axyY.x: 0.0;
    p2.y -= keys.KeyA? axyY.y : keys.KeyD? -axyY.y: 0.0;
    p2.z += keys.Space? speed : keys.ShiftLeft? -speed: 0.0;

    const mx = 2 * (mouse.x / canvas.width - 0.5) * aspectRatio;
    const my = 2 * (mouse.y / canvas.height- 0.5);

    //if(mouse.btn[0]) {p1.x = mx; p1.y = my};
    //if(mouse.btn[1]) {p2.x = mx; p2.y = my};
    //if(mouse.btn[3]) {p2.x = mx; p2.y = my};

    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    //let deg = Math.atan2(p1.x - p2.x, p1.y - p2.y);
    let rx = p2.x;
    let ry = p2.y;
    let rz = p2.z;

    const mainImage = (fragColor, fragCoord) => {
      const t = performance.now() / 1000;
  
      const x = 2 * (fragCoord.x / canvas.width - 0.5) * aspectRatio;
      const y = 2 * (fragCoord.y / canvas.height- 0.5);

      rx = p2.x;
      ry = p2.y;
      rz = p2.z;

      let as = canvas.width - 1;
      let ar = canvas.width - 1;

      const cx = (fragCoord.x - (as / 2)) / as;
      const cy = (fragCoord.y - (ar / 2)) / ar;

      for(let j = 0; j < 15; j++) {
        const len = length3(p2.x - rx, p2.y - ry, p2.z - rz);

        const square = SDFsquare3({
          x: rx,
          y: ry,
          z: rz
        }, squareSize);

        const square1 = SDFsquare3({
          x: rx + 0.25,
          y: ry,
          z: rz
        }, squareSize);

        const scene = Math.min(
          square,
          square1
        );

        if(scene < 0.0001 || len > 1) break

        rx = rx + Math.sin(p2.camX + cx) * scene;
        ry = ry + Math.cos(p2.camX + cx) * scene;
        rz = rz + Math.sin(p2.camY + cy) * scene;
      };
  
      const depth = 1 - length3(
        rx - p2.x,
        ry - p2.y,
        rz - p2.z
      );

      fragColor(depth, depth, depth, 1.0);
    };

    imagejs.draw(mainImage);
    imagejs.putImage(ctx);
    //ctx.translate(canvas.width / 2.0, canvas.height / 2.0);
    //ctx.scale(canvas.height / 2.0, canvas.height / 2.0);

    ctx.lineWidth = 0.5 / canvas.height;

    //ctx.strokeRect(-squareSize, -squareSize, squareSize * 2, squareSize * 2);

    //ctx.beginPath();
    //ctx.arc(p1.x, p1.y , 0.01, 0, 2 * Math.PI);
    //ctx.fill();

    //ctx.beginPath();
    //ctx.arc(p2.x, p2.y , 0.01, 0, 2 * Math.PI);
    //ctx.fill();

    //Ray marching

    //ctx.beginPath();
    //ctx.moveTo(lp1.x, lp1.y);
    //ctx.lineTo(lp2.x, lp2.y);
    //ctx.stroke();

    
/*
    let sc = canvas.width

    for(let i = 0; i < sc; i++) {
      rx = p2.x;
      ry = p2.y;

      let as = sc - 1;
      const cx = (i - (as / 2)) / as;

      for(let j = 0; j < 255; j++) {
        const len = length2(p2.x - rx,p2.y - ry);

        const square = SDFsquare3({x: rx, y: ry, z: 0}, squareSize);
        const line = lineSegment({x: rx, y: ry}, lp1, lp2);

        const scene = Math.min(
          square,
          line
        );

        if(scene < 0.0001 || len > 8) break

        rx = rx + Math.sin(deg + cx) * scene;
        ry = ry + Math.cos(deg + cx) * scene;
      }
      //const depth = length2(rx - p2.x, ry - p2.y);
      //ctx.fillStyle = `hsl(0deg 0% ${100 * depth}%)`
      //ctx.fillRect(i, 0, 1, canvas.height);
    };
   
    //ctx.resetTransform();

    ctx.fillStyle = '#000000'
    //ctx.font = "30px Arial";
    //ctx.fillText('depth: '+length2(rx - p2.x, ry - p2.y), 10, 100);
    */
    requestAnimationFrame(loop);
  };

  loop(); 
};
