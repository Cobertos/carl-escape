import * as PIXI from "pixi.js";
import { DialogTree as dialogTree } from "./MockDialogTree.js";

const TYPING_SPEED = 10; //ms between letter
const SCREEN_PADDING = 20;

class DialogSceneApp extends PIXI.Application {
  constructor(options, dialogTree){
    super(options);
    this.dialogTree = dialogTree;
    this._currentPrompt = undefined;

    //Add all the elements
    let box = this._dialogBox = new PIXI.Graphics();
    box.beginFill(0xFFF0CC);
    box.lineStyle(4, 0xFF3300, 1);
    box.drawRect(0,0,500,200);
    box.endFill();
    this.stage.addChild(box);

    let name = this._dialogName = new PIXI.Text("NAME", {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    name.position.x = 10;
    name.position.y = 10;
    this._dialogBox.addChild(name);

    let text = this._dialogText = new PIXI.Text("Initial Text", {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    text.position.x = 10;
    text.position.y = 40;
    this._dialogInterval = undefined;
    this._dialogBox.addChild(text);

    let face1 = this._leftFace = new PIXI.Sprite(
      PIXI.loader.resources.mc.texture
    );
    let face1Aspect = face1.height/face1.width;
    face1.width = 400;
    face1.height= 400*face1Aspect;
    this.stage.addChild(face1);

    let face2 = this._rightFace = new PIXI.Sprite(
      PIXI.loader.resources.carl.texture
    );
    let face2Aspect = face2.height/face2.width;
    face2.width = 400;
    face2.height= 400*face2Aspect;
    this.stage.addChild(face2);
  }

  get isTyping(){
    return !!this._dialogInterval;
  }

  nextScene(){
    this._currentPrompt = this.dialogTree.getPrompt();
    let { placement, name } = this._currentPrompt;
    let boxBounds = this._dialogBox.getBounds();
    this._dialogBox.x = placement === "left" ? SCREEN_PADDING : (this.screen.width - SCREEN_PADDING - boxBounds.width);
    this._dialogBox.y = this.screen.height - SCREEN_PADDING - boxBounds.height;
    this._dialogName.text = name;

    this._leftFace.x = 20;
    this._leftFace.y = this.screen.height/3;
    this._leftFace.tint = placement === "left" ? 0xFFFFFF : 0x444444;

    this._rightFace.x = (this.screen.width - SCREEN_PADDING - this._rightFace.getBounds().width);
    this._rightFace.y = this.screen.height/3;
    this._rightFace.tint = placement === "left" ? 0x444444 : 0xFFFFFF;

    this.startTyping();
  }

  startTyping(){
    if(this._dialogInterval) {
      //Clear previous dialog
      this.stopTyping();
    }

    //Start a new dialog
    let letters = this._currentPrompt.phrase.split("");
    let currLetter = 0;
    this._dialogInterval = setInterval(()=>{
      this._dialogText.text = letters.slice(0,currLetter).join("");
      currLetter++;
      if(currLetter > this._currentPrompt.phrase.length) {
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

document.addEventListener("DOMContentLoaded", ()=>{
PIXI.loader
  //Backgrounds
  .add("bedroom", "images/bedroom.png")
  //Characters
  .add("carl", "images/crepycarl.png")
  .add("mc", "images/mc.png")
  .load(()=>{
    //WIRE UP THE APP
    const app = new DialogSceneApp({
      antialias: true,
      width: window.innerWidth,
      height: window.innerHeight
    }, dialogTree);
    document.body.appendChild(app.view);

    ["mouseup", "touchend"].forEach((eventName)=>{
      app.view.addEventListener(eventName, ()=>{
        if(app.isTyping) {
          app.endCurrentTypingPhrase();
        }
        else {
          app.nextScene();
        }
      });
    });
  });
});