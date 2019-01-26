import * as PIXI from "pixi.js";
import { DialogTree as dialogTree } from "./MockDialogTree.js";

const TYPING_SPEED = 10; //ms between letter

class DialogSceneApp extends PIXI.Application {
  constructor(options, dialogTree){
    super(options);
    this.dialogTree = dialogTree;

    //Add all the elements
    let text = this._dialogText = new PIXI.Text("Initial Text", {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    text.position.x = 10;
    text.position.y = 10;
    this._dialogCurrentPhrase = undefined;
    this._dialogInterval = undefined;
    this.stage.addChild(text);
  }

  get isTyping(){
    return !!this._dialogInterval;
  }

  nextPhrase(){
    if(this._dialogInterval) {
      //Clear previous dialog
      this.stopTyping();
    }

    //Start a new dialog
    this._dialogCurrentPhrase = this.dialogTree.getPrompt();
    let letters = this._dialogCurrentPhrase.split("");
    let currLetter = 0;
    this._dialogInterval = setInterval(()=>{
      this._dialogText.text = letters.slice(0,currLetter).join("");
      currLetter++;
      if(currLetter > this._dialogCurrentPhrase.length) {
        this.stopTyping();
        return;
      }
    }, TYPING_SPEED);
  }

  stopTyping(){
    clearInterval(this._dialogInterval);
    this._dialogInterval = undefined;
  }

  endCurrentTypingPhrase() {
    this.stopTyping();
    this._dialogText.text = this._dialogCurrentPhrase;
  }
}

//WIRE UP THE APP
const app = new DialogSceneApp({
  antialias: true,
  width: window.innerWidth,
  height: window.innerHeight
}, dialogTree);
document.addEventListener("DOMContentLoaded", ()=>{
  document.body.appendChild(app.view);
});

["mouseup", "touchend"].forEach((eventName)=>{
  app.view.addEventListener(eventName, ()=>{
    if(app.isTyping) {
      app.endCurrentTypingPhrase();
    }
    else {
      app.nextPhrase();
    }
  });
});
/*PIXI.loader
  //Backgrounds
  .add("bedroom", "images/bedroom.png")
  //Characters
  .add("creepCarl", "images/creepyCarl.png")
  .add("mc", "images/mc.png")
  .add("creepyCarlWindow", "images/creepyCarlWindow.png")
  .load(()=>{
    let sprite = new PIXI.Sprite(
      PIXI.loader.resources.creepCarl.texture
    );
    app.stage.addChild(sprite);
  });*/

