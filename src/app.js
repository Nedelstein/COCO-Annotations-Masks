import "./styles.css";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
const json = require("./filenames_captions.json");

import SpeakText from "./SpeakText.js";
import { typeText, clearText } from "./TextIsTyping.js";

document.body.setAttribute("style", "margin:0; padding:0;");
document.body.style.background = "#430354";
// document.body.style.backgroundColor = "transparent";

let textDiv = document.createElement("div");
textDiv.id = "textDiv";

document.body.appendChild(textDiv);

let view = document.createElement("CANVAS");
document.body.appendChild(view);

(function() {
  console.log(json);
  // const view = document.querySelector(".view");
  let width, height, app;
  let diffX, diffY;

  let pointerDownTarget = 0;
  let pointerStart = new PIXI.Point();
  let pointerDiffStart = new PIXI.Point();
  let uniforms;
  let loader = PIXI.Loader.shared;

  // store loaded resources here
  const resources = PIXI.Loader.shared.resources;
  let viewport;

  // set dimensions
  function initDimensions() {
    width = window.innerWidth;
    height = window.innerHeight;
    diffX = 0;
    diffY = 0;
  }

  function initUniforms() {
    uniforms = {
      uResolution: new PIXI.Point(width, height),
      uPointerDown: pointerDownTarget,
      uPointerDiff: new PIXI.Point()
    };
  }
  loader.add(["shaders/stageFrag.glsl"]).load(init);
  // // init pixijs app
  function initApp() {
    app = new PIXI.Application({ view });

    // resize the renderer view in css pixels to allow for resolutions other than 1
    app.renderer.autoDensity = true;

    app.renderer.resize(width, height);

    viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 5000,
      worldHeight: 5000,
      // worldWidth: json.length,
      // worldHeight: json.length,
      interaction: app.renderer.plugins.interaction
    });
    viewport.moveCorner(0, 0);
    viewport.fitWidth(window.innerWidth);

    viewport
      .drag()
      .pinch()
      // .bounce();
      // .clamp({ direction: "all" });
      .wheel();
    // .decelerate();

    // viewport.moveCorner(100, -100);

    // load resources and then init the app
    // set the distortion filter for the entire stage
    const stageFragmentShader = resources["shaders/stageFrag.glsl"].data;
    const stageFilter = new PIXI.Filter(
      undefined,
      stageFragmentShader,
      uniforms
    );
    app.stage.filters = [stageFilter];
    app.stage.addChild(viewport);
  }

  // load resources and then init the app
  // loader.reset();
  // PIXI.utils.clearTextureCache();
  // loader.add(["shaders/backgroundFrag.glsl"]).load(init);

  // function initBackground() {
  //   let background = new PIXI.Sprite();
  //   background.width = width;
  //   background.height = height;

  //   // load frag shader
  //   const backgroundFragShader = resources["shaders/backgroundFrag.glsl"].data;

  //   // create a filter using the frag shader. no vertex shader, so 'undefined'
  //   const backgroundFilter = new PIXI.Filter(
  //     undefined,
  //     backgroundFragShader,
  //     uniforms
  //   );
  //   // assign the filter to the background sprite
  //   background.filters = [backgroundFilter];

  //   app.stage.addChild(background);
  // }

  function initEvents() {
    app.stage.interactive = true;

    app.stage
      .on("pointerdown", onPointerDown)
      .on("pointerup", onPointerUp)
      .on("pointerupoutside", onPointerUp)
      .on("pointermove", onPointerMove);
  }

  function onPointerDown(e) {
    // console.log("down");
    const { x, y } = e.data.global;
    pointerDownTarget = 1;
    pointerStart.set(x, y);
    pointerDiffStart = uniforms.uPointerDiff.clone();
  }

  function onPointerUp() {
    // console.log("up");
    pointerDownTarget = 0;
  }

  // On pointer move, calculate coordinates diff
  function onPointerMove(e) {
    const { x, y } = e.data.global;
    if (pointerDownTarget) {
      // console.log("dragging");
      diffX = pointerDiffStart.x + (x - pointerStart.x);
      diffY = pointerDiffStart.y + (y - pointerStart.y);

      // to limit the scrolling so it never goes past the rectangles
      // diffX =
      //   diffX > 0
      //     ? Math.min(diffX, centerX + imagePadding)
      //     : Math.max(diffX, -(centerX + widthRest));
      // diffY =
      //   diffY > 0
      //     ? Math.min(diffY, centerY + imagePadding)
      //     : Math.max(diffY, -(centerY + heightRest));
    }
  }

  // let container;
  // // Initialize a Container element for solid rectangles and images
  // function initContainer() {
  //   container = new PIXI.Container();
  //   app.stage.addChild(container);
  // }

  function loadImgs() {
    let displayImg;
    for (let i = 0; i < json.length; i++) {
      // loader.reset();
      // PIXI.utils.clearTextureCache();
      let filename = json[i].filename;
      displayImg = "image_masks/" + filename;
      app.loader.add(json[i].caption, displayImg);
      json[i].image = displayImg;
    }

    app.loader.load((loader, resources) => {
      for (let key in json) {
        const caption = json[key].caption;
        const imgSprite = new PIXI.Sprite(resources[caption].texture);
        imgSprite.anchor.x = 0.5;
        imgSprite.anchor.y = 0.5;
        imgSprite.width = 200;
        imgSprite.height = 100;
        imgSprite.x = (key % 20) * imgSprite.width * 1.02;
        imgSprite.y = Math.floor(key / 25) * imgSprite.height * 1.05;
        imgSprite.interactive = true;

        imgSprite.on("mouseover", () => {
          imgSprite.width = imgSprite.width * 1.2;
          imgSprite.height = imgSprite.height * 1.2;
          imgSprite.zIndex += 100;
          SpeakText(caption);
          typeText(caption);
        });

        imgSprite.on("mouseout", () => {
          imgSprite.width = imgSprite.width / 1.2;
          imgSprite.height = imgSprite.height / 1.2;
          imgSprite.zIndex -= 100;
          speechSynthesis.cancel();
          clearText();
        });
        viewport.addChild(imgSprite);
      }
    });
  }

  setInterval(() => {
    let index = Math.floor(Math.random() * json.length);
    let currentCaption = json[index].caption;
    let currentImage = json[index].filename;
    console.log(currentImage, currentCaption);
    SpeakText(currentCaption);
    typeText(currentCaption);
  }, 7000);

  function init() {
    initDimensions();
    initUniforms();
    initApp();
    // initBackground();
    initEvents();
    // initContainer();
    loadImgs();
    app.ticker.add(() => {
      // Multiply the values by a coefficient to get a smooth animation
      uniforms.uPointerDown +=
        (pointerDownTarget - uniforms.uPointerDown) * 0.075;
      uniforms.uPointerDiff.x += (diffX - uniforms.uPointerDiff.x) * 0.2;
      uniforms.uPointerDiff.y += (diffY - uniforms.uPointerDiff.y) * 0.2;
      // Set position for the container
      // container.x = uniforms.uPointerDiff.x - centerX;
      // container.y = uniforms.uPointerDiff.y - centerY;
    });
  }

  // // Clean the current Application
  // function clean() {
  //   // Stop the current animation
  //   app.ticker.stop();

  //   // Remove event listeners
  //   app.stage
  //     .off("pointerdown", onPointerDown)
  //     .off("pointerup", onPointerUp)
  //     .off("pointerupoutside", onPointerUp)
  //     .off("pointermove", onPointerMove);
  // }

  // On resize, reinit the app (clean and init)
  // But first debounce the calls, so we don't call init too often
  // let resizeTimer;
  // function onResize() {
  //   if (resizeTimer) clearTimeout(resizeTimer);
  //   resizeTimer = setTimeout(() => {
  //     clean();
  //     init();
  //   }, 200);
  // }
  // // Listen to resize event
  // window.addEventListener("resize", onResize);

  init();
})();
