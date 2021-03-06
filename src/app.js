import "./styles.css";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { BulgePinchFilter, RGBSplitFilter } from "pixi-filters";
const json = require("./filenames_captions.json");

import SpeakText from "./SpeakText.js";
import { typeText, clearText } from "./TextIsTyping.js";

import { dynamic, fixed, legacy, clearIntervalAsync } from "set-interval-async";
const { setIntervalAsync: setIntervalAsyncD } = dynamic;
const { setIntervalAsync: setIntervalAsyncF } = fixed;
const { setIntervalAsync: setIntervalAsyncL } = legacy;

document.body.setAttribute("style", "margin:0; padding:0;");
document.body.style.background = "#430354";

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
  let viewport, container;
  let bulge, splitFilter;

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
      worldWidth: 2000,
      worldHeight: 2000,
      interaction: app.renderer.plugins.interaction
    });
    viewport.moveCorner(0, 0);
    // viewport.fitWidth(window.innerWidth);

    viewport
      .drag()
      .pinch()
      .mouseEdges({ radius: "350", speed: "7" });
    // .bounce();
    // .clamp({ direction: "all" });
    // .wheel();
    // .decelerate();
    // viewport.moveCorner(100, -100);

    // load resources and then init the app
    // set the distortion filter for the entire stage
    // const stageFragmentShader = resources["shaders/stageFrag.glsl"].data;
    // const stageFilter = new PIXI.Filter(
    //   undefined,
    //   stageFragmentShader,
    //   uniforms
    // );
    // app.stage.filters = [stageFilter];

    // Initialize a Container element
    container = new PIXI.Container();
    container.interactive = true;
    container.addChild(viewport);
    app.stage.addChild(container);
    app.stage.interactive = true;

    bulge = new BulgePinchFilter();
    bulge.center.x = 0.5;
    bulge.center.y = 0.5;
    bulge.radius = 200;
    bulge.strength = 1;

    app.stage.on("pointermove", moveBulge);
    function moveBulge(e) {
      let mousePos = e.data.global;
      //normalize mouse positions for bulge filter
      bulge.center.x = mousePos.x / app.renderer.width;
      bulge.center.y = mousePos.y / app.renderer.height;
    }

    splitFilter = new RGBSplitFilter();
    splitFilter.enabled = false;
    splitFilter.red.x = -10;
    splitFilter.red.y = 0;
    splitFilter.green.x = -3;
    splitFilter.green.y = 0;

    app.stage.filters = [bulge, splitFilter];
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

  let imgSprites = [];
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
      splitFilter.enabled = false;
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
          // SpeakText(caption);
          typeText(caption);
        });

        imgSprite.on("mouseout", () => {
          speechSynthesis.cancel();
          clearText();
        });
        viewport.addChild(imgSprite);
        imgSprites.push(imgSprite);
      }
    });
  }

  // clearIntervalAsync();
  // setIntervalAsyncD(() => {
  //   let index = Math.floor(Math.random() * json.length);
  //   let currentCaption = json[index].caption;
  //   console.log(currentCaption);
  //   // let currentFile = json[index].filename;
  //   let currentImgSprite = imgSprites[index];

  //   // currentImgSprite.width += 0.2;
  //   // currentImgSprite.height += 0.2;
  //   // currentImgSprite.zIndex += 99999999;

  //   SpeakText(currentCaption);
  //   typeText(currentCaption);

  //   bulge.center.x =
  //     currentImgSprite.getGlobalPosition().x / (viewport.worldWidth + 100);
  //   bulge.center.y =
  //     currentImgSprite.getGlobalPosition().y / (viewport.worldHeight + 50);

  //   console.log(bulge.center.x, bulge.center.y);
  //   viewport.snap(currentImgSprite.x, currentImgSprite.y);
  // }, 7000);

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
