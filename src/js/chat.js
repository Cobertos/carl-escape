import * as PIXI from "pixi.js";
import WebFont from "webfontloader";
//import { DialogTree as dialogTree } from "./MockDialogTree.js";
import * as Dialogue from "./dialogue_node.js";
import { PowerMeterGame } from "./PowerMeterGame.js";
import { KeyFlipGame } from "./BottleFlipGame.js";
import { physicsLoop } from "./engine/WithPhysics.js";

const TYPING_SPEED = 10; //ms between letter
const SCREEN_PADDING = 20;

class DialogSceneApp extends PIXI.Application {
  constructor(options, dialogTree){
    super(options);
    if(dialogTree == null){
      console.log("Dialogue tree null.");
    }
    this.optionButtons = [];
    this.actions = [];
    this.dialogTree = dialogTree;
    this._currentPrompt = undefined;

    //Add all the elements
    let background = this._background = new PIXI.Sprite(
      PIXI.loader.resources.bedroom.texture
    );
    let backgroundAspect = background.height/background.width;
    background.width = this.screen.width;
    background.height= background.width*backgroundAspect;
    this.stage.addChild(background);

    this._dialogBox = new PIXI.Container();
    this.stage.addChild(this._dialogBox);
    let frame = new PIXI.mesh.NineSlicePlane(PIXI.loader.resources.dialogFrame.texture, 117, 117, 117, 117);
    frame.width = 1000;
    frame.height = 400;
    frame.scale.x = 0.5;
    frame.scale.y = 0.5;
    this._dialogBox.addChild(frame);

    let name = this._dialogName = new PIXI.Text("NAME", {fontFamily : 'Varela Round', fontSize: 24, fill : 0x000000, align : 'center'});
    name.position.x = 50;
    name.position.y = 50;
    this._dialogBox.addChild(name);

    let text = this._dialogText = new PIXI.Text("Initial Text", {fontFamily : 'Varela Round', fontSize: 24, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 400});
    text.position.x = 50;
    text.position.y = 80;
    this._dialogInterval = undefined;
    this._dialogBox.addChild(text);

    let face1 = this._leftFace = new PIXI.Sprite(
      PIXI.loader.resources.mc.texture
    );
    let face1Aspect = face1.height/face1.width;
    face1.width = this.screen.width/2.8;
    face1.height= face1.width*face1Aspect;
    this.stage.addChild(face1);

    let face2 = this._rightFace = new PIXI.Sprite(
      PIXI.loader.resources.carl.texture
    );
    let face2Aspect = face2.height/face2.width;
    face2.width = this.screen.width/2.8;
    face2.height= face2.width*face2Aspect;
    this.stage.addChild(face2);
  }

  get isTyping(){
    return !!this._dialogInterval;
  }

  nextScene(){
    this.stopTyping();
    this._currentPrompt = this.dialogTree.prompt();
    //let { placement, name, options } = this._currentPrompt;

    let placement = "left";
    let name = "Test";
    let options = this.dialogTree.options(this.actions);
    
    for(let i in this.optionButtons){
      this.stage.removeChild(this.optionButtons[i]);
    }
    this.optionButtons = [];

    let boxBounds = this._dialogBox.getBounds();
    this._dialogBox.x = placement === "left" ? SCREEN_PADDING : (this.screen.width - SCREEN_PADDING - boxBounds.width);
    this._dialogBox.y = this.screen.height - SCREEN_PADDING - boxBounds.height;
    this._dialogName.text = name;

    this._leftFace.x = 20;
    this._leftFace.y = this.screen.height/4;
    this._leftFace.tint = placement === "left" ? 0xFFFFFF : 0x444444;

    this._rightFace.x = (this.screen.width - SCREEN_PADDING - this._rightFace.getBounds().width);
    this._rightFace.y = this.screen.height/4;
    this._rightFace.tint = placement === "left" ? 0x444444 : 0xFFFFFF;

    if(options) {
      options.forEach((option, idx)=>{
        let button = new PIXI.mesh.NineSlicePlane(PIXI.loader.resources.buttonFrame.texture, 231, 214, 231, 214);
        button.width = 300 * 8;
        button.height = 80 * 8;
        button.scale.x = 0.125;
        button.scale.y = 0.125;
        button.position.x = 10;
        button.position.y = 10 + 80 * idx;
        this.stage.addChild(button);

        let buttonText = new PIXI.Text(option.text, {fontFamily : 'Varela Round', fontSize: 24, fill : 0x000000, align : 'left'});
        buttonText.anchor.y = 0.5;
        button.addChild(buttonText);
        buttonText.position.x = 30 * 8;
        buttonText.position.y = 80/2 * 8;
        buttonText.scale.x = 8;
        buttonText.scale.y = 8;

        button.interactive = true;
        button.buttonMode = true;
        button.on("pointerdown", (evt) => {
          this.chooseOption(option);
        });

        this.optionButtons.push(button);
      });
    }

    this.startTyping();
  }

  chooseOption(option){
    console.log("Chose option " + option.text);
    
    let actions = option.actions;

    for(let i in actions){
      if(this.isGameAction(actions[i])){
        this.playGame(actions[i], option.destination);
        return;
      }
      else{
        this.actions.push(actions[i]);
      }
    }

    let dest = option.destination;
    
    if(dest == -1){
      console.log("End of current tree.");
      return;
    }

    this.dialogTree.selectNode(dest);
    this.nextScene();
  }

  isGameAction(action){
    return ["PlayGameEasy", "PlayGameNormal", "PlayGameHard", "PlayGameKey"].includes(action);
  }

  playGame(action, destination){
    let game;
    let teardown;
    if(action === "PlayGameEasy" || action === "PlayGameNormal" || action === "PlayGameHard"){
      let extraOptions;
      if(action === "PlayGameEasy") {
        extraOptions = {
          oscillationTime: 1000,
          greenAreaWidth: 0.4
        };
      }
      else if(action === "PlayGameNormal") {
        extraOptions = {
          oscillationTime: 700,
          greenAreaWidth: 0.3
        };
      }
      else if(action === "PlayGameHard") {
        extraOptions = {
          oscillationTime: 400,
          greenAreaWidth: 0.2
        };
      }
      game = new PowerMeterGame({
        width: this._dialogBox.getBounds().width,
        height: this._dialogBox.getBounds().height,
        //oscillationTime: 1000,
        //greenAreaWidth: 0.4
        ...extraOptions
      });
      game.position.x = SCREEN_PADDING;
      game.position.y = this.screen.height - 200 - SCREEN_PADDING;
      let listener1 = game.stop.bind(game);
      let listener2 = (e)=>{
        if(e.key === " ") {
          game.stop();
          e.preventDefault(); //Stop the scrolling  
        }
      };
      this.view.addEventListener("pointerdown", listener1);
      window.addEventListener("keydown", listener2);
      teardown = ()=>{
        this.view.removeEventListener("pointerdown", listener1);
        window.removeEventListener("keydown", listener2);
      };
    }
    if(action === "PlayGameKey"){
      game = new KeyFlipGame({
        intrinsicWidth: 3*this.screen.width/4, 
        intrinsicHeight: 3*this.screen.height/4, 
      });
      game.position.x = this.screen.width/4;
      game.position.y = 0;
      let interval = setInterval(()=>{
        physicsLoop(game);
      }, 10);
      teardown = ()=>{
        clearInterval(interval);
      };
    }
    this.stage.addChild(game);

    let raf;
    const loop = ()=>{
      game.onUpdate();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    let difficulty = action.replace("PlayGame", "");
    game.on("ended", (e)=>{
      console.log(e);
      teardown();

      if(e.won){
        console.log("Won the game!");
        this.actions.push("WinGame" + difficulty);
      }
      else{
        console.log("Lost the game");
        this.actions.push("LoseGame" + difficulty);
      }
      this.stage.removeChild(game);
      this.dialogTree.selectNode(destination);
      this.nextScene();
    });
  }

  startTyping(){
    if(this._dialogInterval) {
      //Clear previous dialog
      this.stopTyping();
    }
    console.log("Typing prompt:" + this._currentPrompt);
    //Start a new dialog
    let letters = this._currentPrompt.split("");
    let currLetter = 0;
    this._dialogInterval = setInterval(()=>{
      console.log("Anything");
      this._dialogText.text = letters.slice(0,currLetter).join("");
      currLetter++;
      if(currLetter > this._currentPrompt.length) {
        this.stopTyping();
        return;
      }
    }, TYPING_SPEED);
  }

  stopTyping(){
    clearInterval(this._dialogInterval);
    this._dialogInterval = undefined;
    if(this._currentPrompt){
      this._dialogText.text = this._currentPrompt;
    }
  }

}

Promise.all([
  new Promise((resolve, reject)=>{
    WebFont.load({
      active: resolve,
      google: {
        families: ['Varela Round', 'ZCOOL KuaiLe']
      }
    });
  }),
  new Promise((resolve, reject)=>{
    PIXI.loader
      //Backgrounds
      .add("bedroom", "images/bedroom.png")
      .add("frontyard", "images/frontyard.png")
      //Characters
      .add("carl", "images/crepycarl-clothed.png")
      .add("mc", "images/mc-clothed.png")
      //Other assets
      .add("dialogFrame", "images/frameyboi.png")
      .add("buttonFrame", "images/buttonboi.png")
      //games
      .add(KeyFlipGame.getAssetsToLoad())
      .load(resolve);
  }),
  new Promise((resolve, reject)=>{
    document.addEventListener("DOMContentLoaded", resolve);
  })
]).then(()=>{
  //WIRE UP THE APP
  const app = new DialogSceneApp({
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight
  }, Dialogue.loadJsonFile("mainTree"));
  document.body.appendChild(app.view);

  //lock for mobile devices (throws if device doesn't support)
  /*try {
    screen.orientation.lock('landscape');
  }
  catch(e) {}*/

  ["mouseup", "touchend"].forEach((eventName)=>{
    app.view.addEventListener(eventName, ()=>{
      if(app.isTyping) {
        app.stopTyping();
      }
      else {
        app.nextScene();
      }
    });
  });
});