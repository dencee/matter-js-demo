document.addEventListener("DOMContentLoaded", onDomLoaded);

function onDomLoaded() {
  const canvas = document.querySelector("canvas");

  // module aliases
  let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites;
  (Events = Matter.Events),
    (Constraint = Matter.Constraint),
    (MouseConstraint = Matter.MouseConstraint),
    (Mouse = Matter.Mouse),
    (World = Matter.World),
    (Bodies = Matter.Bodies);

  // create an engine
  let engine = Engine.create();
  let world = engine.world;

  // create a renderer
  let render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      wireframes: false,
    },
  });

  // add bodies
  let ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true }),
    rockOptions = { density: 0.004 },
    rock = Bodies.polygon(170, 450, 8, 20, rockOptions),
    anchor = { x: 170, y: 450 },
    elastic = Constraint.create({
      pointA: anchor,
      bodyB: rock,
      stiffness: 0.05,
    });

  let pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, 25, 40);
  });

  let ground2 = Bodies.rectangle(610, 250, 200, 20, { isStatic: true });

  let pyramid2 = Composites.pyramid(550, 0, 5, 10, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, 25, 40);
  });

  World.add(engine.world, [ground, pyramid, ground2, pyramid2, rock, elastic]);

  Events.on(engine, "afterUpdate", function () {
    if (
      mouseConstraint.mouse.button === -1 &&
      (rock.position.x > 190 || rock.position.y < 430)
    ) {
      rock = Bodies.polygon(170, 450, 7, 20, rockOptions);
      World.add(engine.world, rock);
      elastic.bodyB = rock;
    }
  });

  // add mouse control
  let mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 },
  });

  // run the renderer
  Render.run(render);

  // create runner
  let runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);
}
