/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// \"use strict\";\n\ndocument.body.setAttribute(\"style\", \"margin:0; padding:0;\");\ndocument.body.style.background = \"#430354\";\n// document.body.style.background = \"black\";\n\n// var colc = new Colcade(\".grid\", {\n//   columns: \".grid-col\",\n//   items: \".grid-item\"\n// });\n\n(function() {\n  const view = document.querySelector(\".view\");\n  let width, height, app;\n  let diffX, diffY;\n\n  let pointerDownTarget = 0;\n  let pointerStart = new PIXI.Point();\n  let pointerDiffStart = new PIXI.Point();\n  let uniforms;\n  let loader = PIXI.Loader.shared;\n\n  // store loaded resources here\n  const resources = PIXI.Loader.shared.resources;\n  let viewport;\n\n  // set dimensions\n  function initDimensions() {\n    width = window.innerWidth;\n    height = window.innerHeight;\n    diffX = 0;\n    diffY = 0;\n  }\n\n  function initUniforms() {\n    uniforms = {\n      uResolution: new PIXI.Point(width, height),\n      uPointerDown: pointerDownTarget,\n      uPointerDiff: new PIXI.Point()\n    };\n  }\n  loader.add([\"shaders/stageFrag.glsl\"]).load(init);\n  // // init pixijs app\n  function initApp() {\n    app = new PIXI.Application({ view });\n\n    // resize the renderer view in css pixels to allow for resolutions other than 1\n    app.renderer.autoDensity = true;\n\n    app.renderer.resize(width, height);\n\n    viewport = new Viewport.Viewport({\n      screenWidth: window.innerWidth,\n      screenHeight: window.innerHeight,\n      worldWidth: 200 * 20 * 1.02,\n      worldHeight: 100 * 25 * 1.05,\n      interaction: app.renderer.plugins.interaction\n    });\n    // app.stage.addChild(viewport);\n    app.stage.addChild(viewport);\n\n    viewport\n      .drag()\n      .pinch()\n      .bounce()\n      .clamp({ direction: \"all\" });\n    // .wheel();\n    // .decelerate();\n\n    // viewport.moveCorner(100, -100);\n\n    // load resources and then init the app\n    // set the distortion filter for the entire stage\n    const stageFragmentShader = resources[\"shaders/stageFrag.glsl\"].data;\n    const stageFilter = new PIXI.Filter(\n      undefined,\n      stageFragmentShader,\n      uniforms\n    );\n    app.stage.filters = [stageFilter];\n  }\n\n  // load resources and then init the app\n  // loader.reset();\n  // PIXI.utils.clearTextureCache();\n  // loader.add([\"shaders/backgroundFrag.glsl\"]).load(init);\n\n  function initBackground() {\n    let background = new PIXI.Sprite();\n    background.width = width;\n    background.height = height;\n\n    // // load frag shader\n    // const backgroundFragShader = resources[\"shaders/backgroundFrag.glsl\"].data;\n\n    // // create a filter using the frag shader. no vertex shader, so 'undefined'\n    // const backgroundFilter = new PIXI.Filter(\n    //   undefined,\n    //   backgroundFragShader,\n    //   uniforms\n    // );\n    // assign the filter to the background sprite\n    // background.filters = [backgroundFilter];\n\n    app.stage.addChild(background);\n  }\n\n  function initEvents() {\n    app.stage.interactive = true;\n\n    app.stage\n      .on(\"pointerdown\", onPointerDown)\n      .on(\"pointerup\", onPointerUp)\n      .on(\"pointerupoutside\", onPointerUp)\n      .on(\"pointermove\", onPointerMove);\n  }\n\n  function onPointerDown(e) {\n    // console.log(\"down\");\n    const { x, y } = e.data.global;\n    pointerDownTarget = 1;\n    pointerStart.set(x, y);\n    pointerDiffStart = uniforms.uPointerDiff.clone();\n  }\n\n  function onPointerUp() {\n    // console.log(\"up\");\n    pointerDownTarget = 0;\n  }\n\n  // On pointer move, calculate coordinates diff\n  function onPointerMove(e) {\n    const { x, y } = e.data.global;\n    if (pointerDownTarget) {\n      // console.log(\"dragging\");\n      diffX = pointerDiffStart.x + (x - pointerStart.x);\n      diffY = pointerDiffStart.y + (y - pointerStart.y);\n\n      // to limit the scrolling so it never goes past the rectangles\n      // diffX =\n      //   diffX > 0\n      //     ? Math.min(diffX, centerX + imagePadding)\n      //     : Math.max(diffX, -(centerX + widthRest));\n      // diffY =\n      //   diffY > 0\n      //     ? Math.min(diffY, centerY + imagePadding)\n      //     : Math.max(diffY, -(centerY + heightRest));\n    }\n  }\n\n  // let container;\n  // // Initialize a Container element for solid rectangles and images\n  // function initContainer() {\n  //   container = new PIXI.Container();\n  //   app.stage.addChild(container);\n  // }\n\n  let maskImgSrc = [];\n\n  function loadImgs() {\n    fetch(\"./filenames_captions.json\").then(resp => {\n      return resp.json().then(data => {\n        // console.log(data);\n        for (let i = 0; i < data.length; i++) {\n          loader.reset();\n          PIXI.utils.clearTextureCache();\n          let filename = data[i].filename;\n          maskImgSrc.push(\"image_masks/\" + filename);\n          loader.add(maskImgSrc);\n        }\n\n        loader.load();\n      });\n    });\n  }\n\n  function handleLoadComplete() {\n    const imagePadding = 100;\n    for (let i = 0; i < maskImgSrc.length; i++) {\n      let texture = loader.resources[maskImgSrc[i]].texture;\n      let imgSprite = new PIXI.Sprite(texture);\n      // imgSprite.anchor.x = 0.5;\n      // imgSprite.anchor.y = 0.5;\n      imgSprite.width = 200;\n      imgSprite.height = 100;\n      imgSprite.x = (i % 20) * imgSprite.width * 1.02;\n      imgSprite.y = Math.floor(i / 25) * imgSprite.height * 1.05;\n      imgSprite.interactive = true;\n\n      imgSprite.on(\"mouseover\", () => {\n        imgSprite.width = imgSprite.width * 1.2;\n        imgSprite.height = imgSprite.height * 1.2;\n        imgSprite.zIndex += 10000;\n      });\n\n      imgSprite.on(\"mouseout\", () => {\n        imgSprite.width = imgSprite.width / 1.2;\n        imgSprite.height = imgSprite.height / 1.2;\n        imgSprite.zIndex -= 10000;\n      });\n      viewport.addChild(imgSprite);\n    }\n  }\n\n  function init() {\n    initDimensions();\n    initUniforms();\n    initApp();\n    // initBackground();\n    initEvents();\n    // initContainer();\n    loadImgs();\n    loader.onComplete.add(handleLoadComplete);\n\n    app.ticker.add(() => {\n      // Multiply the values by a coefficient to get a smooth animation\n      uniforms.uPointerDown +=\n        (pointerDownTarget - uniforms.uPointerDown) * 0.075;\n      uniforms.uPointerDiff.x += (diffX - uniforms.uPointerDiff.x) * 0.2;\n      uniforms.uPointerDiff.y += (diffY - uniforms.uPointerDiff.y) * 0.2;\n      // Set position for the container\n      // container.x = uniforms.uPointerDiff.x - centerX;\n      // container.y = uniforms.uPointerDiff.y - centerY;\n    });\n  }\n\n  // // Clean the current Application\n  function clean() {\n    // Stop the current animation\n    app.ticker.stop();\n\n    // Remove event listeners\n    app.stage\n      .off(\"pointerdown\", onPointerDown)\n      .off(\"pointerup\", onPointerUp)\n      .off(\"pointerupoutside\", onPointerUp)\n      .off(\"pointermove\", onPointerMove);\n  }\n\n  // On resize, reinit the app (clean and init)\n  // But first debounce the calls, so we don't call init too often\n  let resizeTimer;\n  function onResize() {\n    if (resizeTimer) clearTimeout(resizeTimer);\n    resizeTimer = setTimeout(() => {\n      clean();\n      init();\n    }, 200);\n  }\n  // Listen to resize event\n  window.addEventListener(\"resize\", onResize);\n\n  init();\n})();\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });