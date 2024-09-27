/*
 * Add some bodies to our canvas
 */
function addBodies(Bodies, w, h) {

  let ground = Bodies.rectangle(w / 2, h, w, 150, { isStatic: true });

  // TODO: Add boxes
  // Bodies.rectangle(x, y, w, h);
  //
  let box = Bodies.rectangle(400, 200, 80, 80);

  // TODO: Add 30 circles using a for loop
  // Bodies.circle(x, y, w, h, {options})
  // Options: friction: 0.3
  //          frictionAir: 0.1
  //          restitution: 0.8
  // https://brm.io/matter-js/docs/classes/Body.html
  let circles = [];
  for (let i = 0; i < 200; i++) {
    const randomY = Math.floor(Math.random() * w);
    let circle = Bodies.circle(i, 20, 10, 10);
    circles.push(circle);
  }

  // TODO: Create left and right walls (rectangles)

  return [ground, box, ...circles];
}

document.addEventListener("DOMContentLoaded", onDomLoaded);

function onDomLoaded() {
  const canvas = document.querySelector("canvas");

  //width and height of the page
  let w = window.innerWidth;
  let h = window.innerHeight;

  // module aliases
  let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World;

  // create an engine
  let engine = Engine.create();
  let world = engine.world;

  // create a renderer
  let render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: w,
      height: h,
      showAngleIndicator: true,
      background: "#000000",
      wireframes: false,
    },
  });

  //
  const bodies = addBodies(Bodies, w, h);

  // add bodies to our world
  World.add(engine.world, bodies);

  // add mouse control
  let mouse = Mouse.create(render.canvas);
  let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  // Add the mouse to the world
  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // run the renderer
  Render.run(render);

  // create runner
  let runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);
}
