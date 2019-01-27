import * as PIXI from "pixi.js";
import WebFont from "webfontloader";
//import { DialogTree as dialogTree } from "./MockDialogTree.js";
import * as Dialogue from "./dialogue_node.js";
import { PowerMeterGame } from "./PowerMeterGame.js";
import { KeyFlipGame } from "./BottleFlipGame.js";
import { physicsLoop } from "./engine/WithPhysics.js";
import {Howl, Howler} from 'howler';

const TYPING_SPEED = 10; //ms between letter
const SCREEN_PADDING = 20;

const BACKGROUND_TO_URL = {
  "bedroom": "images/bedroom.png",
  "frontyard": "images/frontyard.png",
  "frontyardSide": "images/frontyardSide.png"
};

class DialogSceneApp extends PIXI.Application {
  constructor(options, dialogTree){
    super(options);
    if(dialogTree == null){
      console.log("Dialogue tree null.");
    }
    this.renderer.autoResize = true; //I dont think this works?
    this.renderer.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", ()=>{
      this.renderer.resize(window.innerWidth, window.innerHeight);
      this.updateUI();
    });
    this.optionButtons = [];
    this.actions = [];
    this.dialogTree = dialogTree;
    this._currentNode = undefined;

    //Add all the elements
    let background = this._background = document.createElement("div");
    background.classList.add("bg");
    document.body.appendChild(background);
    background.style.backgroundImage = `url(${BACKGROUND_TO_URL["bedroom"]})`;

    this._dialogBox = new PIXI.Container();
    this.stage.addChild(this._dialogBox);
    this._dialogFrame = new PIXI.mesh.NineSlicePlane(PIXI.loader.resources.dialogFrame.texture, 66, 66, 66, 66);
    this._dialogBox.addChild(this._dialogFrame);

    this._dialogName = new PIXI.Text("NAME", {fontFamily : 'Arial', fontSize: 24, fill : 0x000000, align : 'left', fontWeight: "bold"});
    this._dialogFrame.addChild(this._dialogName);

    this._dialogText = new PIXI.Text("Initial Text",
      {fontFamily : 'Varela Round', fontSize: 24, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 400});
    this._dialogInterval = undefined;
    this._dialogFrame.addChild(this._dialogText);

    this._leftFace = new PIXI.Sprite(
      PIXI.loader.resources.mc.texture
    );
    this.stage.addChild(this._leftFace);

    this._rightFace = new PIXI.Sprite(
      PIXI.loader.resources.carl.texture
    );
    this.stage.addChild(this._rightFace);

    this.view.addEventListener("pointerdown", this.stopTyping.bind(this));
    window.addEventListener("keydown", (e)=>{
      if(e.key === " ") {
        this.stopTyping();
        e.preventDefault(); //Stop the scrolling  
      }
    });

    this.nextScene();
    this.render();
    setTimeout(this.render(),200);
  }

  updateUI() {
    let { speaker : name, background } = this._currentNode;

    let heightMul = Math.min(1, Math.max(0.5, this.screen.height/900)); //Scale down if less than 900
    console.log(heightMul, this.screen.height);

    //at a screen size of 1400 will start decreasing
    //at a screen size of 600
    //at a screen size of 400
    let cremsStart = 1400;
    let crems = Math.min(0.025 * this.screen.width / 35, 1);


    //Set background image
    this._background.style.backgroundImage = `url(${BACKGROUND_TO_URL[background]})`;

    let face1Aspect = this._leftFace.height/this._leftFace.width;
    this._leftFace.width = this.screen.width/4 * crems;
    this._leftFace.height= this._leftFace.width*face1Aspect;
    this._leftFace.position.x = SCREEN_PADDING;
    this._leftFace.position.y = SCREEN_PADDING;
    let placement = name === "" ? "left" : "right"; //name === "" is MC
    this._leftFace.tint = placement === "left" ? 0xFFFFFF : 0x444444;

    let face2Aspect = this._rightFace.height/this._rightFace.width;
    this._rightFace.width = this.screen.width/4 * crems;
    this._rightFace.height= this._rightFace.width*face2Aspect;
    this._rightFace.position.y = SCREEN_PADDING;
    this._rightFace.position.x = this.screen.width-this._rightFace.width-SCREEN_PADDING;
    this._rightFace.tint = placement === "left" ? 0x444444 : 0xFFFFFF;

    console.log(crems);
    this._dialogBox.width = cremsStart/2*crems;
    this._dialogBox.height = 300*crems;
    console.log(cremsStart/2*crems, this._dialogBox.width);
    
    this._dialogBox.x = SCREEN_PADDING;
    this._dialogBox.y = this.screen.height - SCREEN_PADDING - this._dialogBox.height;

    this._dialogFrame.width = this._dialogBox.width;
    this._dialogFrame.height = this._dialogBox.height;
    this._dialogName.style.fontSize = 24*crems;
    this._dialogName.position.x = 45;
    this._dialogName.position.y = 45;
    this._dialogText.style.fontSize = 24*crems;
    this._dialogText.style.wordWrapWidth = this._dialogBox.width - 40*2;
    this._dialogText.position.x = 45;
    this._dialogText.position.y = 45+30*crems;

    this._dialogName.text = name;

    //options
    let options = this.dialogTree.options(this.actions);
    for(let i in this.optionButtons){
      this.stage.removeChild(this.optionButtons[i]);
    }
    this.optionButtons = [];

    if(options) {
      options.forEach((option, idx)=>{
        let button = new PIXI.mesh.NineSlicePlane(PIXI.loader.resources.buttonFrame.texture, 70, 70, 70, 70);
        button.width = 600*crems;
        button.height = 150*crems;
        button.position.x = this.screen.width - SCREEN_PADDING - button.width;
        button.position.y = this.screen.height - SCREEN_PADDING - button.height * (1-idx) - button.height;
        this.stage.addChild(button);

        let buttonText = new PIXI.Text(option.text, {fontFamily : 'Varela Round', fontSize: 24*crems, fill : 0x000000, align : 'left'});
        buttonText.anchor.y = 0.5;
        button.addChild(buttonText);
        buttonText.position.x = 70*crems;
        buttonText.position.y = 70*crems;

        button.interactive = true;
        button.buttonMode = true;
        button.on("pointerdown", (evt) => {
          this.chooseOption(option);
        });

        this.optionButtons.push(button);
      });
    }
  }

  get isTyping(){
    return !!this._dialogInterval;
  }

  nextScene(){
    this.stopTyping();
    this._currentNode = this.dialogTree.currentNode2();
    this.updateUI();

    this.startTyping();
  }

  chooseOption(option){
    console.log("Chose option " + option.text);
    
    let actions = option.actions;

    for(let i in actions){
      if(actions[i] === "CreepyMusic"){
        this.playSound("audio/AmbientAlert.wav");
      }
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
      this.playSound("audio/SkillCheck1.wav");
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
        intrinsicWidth: this.screen.width/3,
        intrinsicHeight: this.screen.width/3*2/5,
        //oscillationTime: 1000,
        //greenAreaWidth: 0.4
        ...extraOptions
      });
      game.position.x = this.screen.width/2 - this.screen.width/3/2;
      game.position.y = SCREEN_PADDING;
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
        this.playSound("audio/correctAnswer2.wav");
      }
      else{
        console.log("Lost the game");
        this.playSound("audio/wrongAnswer.wav"); 
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
    let prompt = this._currentNode.prompt;
    console.log("Typing prompt:" + prompt);
    //Start a new dialog
    let letters = prompt.split("");
    let currLetter = 0;
    this._dialogInterval = setInterval(()=>{
      this._dialogText.text = letters.slice(0,currLetter).join("");
      currLetter++;
      if(currLetter > prompt.length) {
        this.stopTyping();
        return;
      }
    }, TYPING_SPEED);
  }

  stopTyping(){
    clearInterval(this._dialogInterval);
    this._dialogInterval = undefined;
    if(this._currentNode){
      this._dialogText.text = this._currentNode.prompt;
    }
  }

  playSound(path){
    if(this.activeSound){
      this.activeSound.stop();
    }

    // Setup the new Howl.

    this.activeSound = new Howl({
      src: [path]
    });

    // Play the sound.
    this.activeSound.play();

    // Change global volume.
    Howler.volume(0.5);
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
    height: window.innerHeight,
    transparent: true
  }, Dialogue.loadJsonFile("mainTree"));
  app.view.classList.add("renderer");
  document.body.appendChild(app.view);
  //app.playSound("audio/Unsettle1.wav");
  //lock for mobile devices (throws if device doesn't support)
  /*try {
    screen.orientation.lock('landscape');
  }
  catch(e) {}*/
});