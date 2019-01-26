import * as PIXI from "pixi.js";
import { WithPhysics, physicsLoop } from "./engine/WithPhysics.js";

class BottleFlipGameApp extends PIXI.Application {
  constructor(options, dialogTree){
    super(options);

    //Add all the elements
    class Bottle extends WithPhysics(PIXI.Sprite) {
      constructor(...args){
        super(PIXI.loader.resources.fijiBottle.texture);
        let bottleAspect = this.height/this.width;
        this.width = 200;
        this.height= this.width*bottleAspect;
      }
    }

    let bottle = this._bottle = new Bottle();
    bottle.interactive = true;
    bottle.buttonMode = true;
    let lastPostion;
    let secondLastPosition;
    let lastTime;
    let secondLastTime;
    bottle.on("pointerdown", (e)=>{
      bottle.dragging = true;
      bottle.data = e.data;
      //reset physics
      bottle.velocity.set(0);
      bottle.acceleration.set(0);
      //set anchor pos to mouse position
      let offsetPos = bottle.data.getLocalPosition(bottle); //relative to anchor
      offsetPos.x /= bottle.width;
      offsetPos.y /= bottle.height;
      offsetPos.x += bottle.anchor.x; //Remove the anchor contribution to reset anchor from top left
      offsetPos.y += bottle.anchor.y;
      bottle.anchor.x = offsetPos.x;
      bottle.anchor.y = offsetPos.y;
      //set the bottle position
      lastPostion = bottle.data.getLocalPosition(bottle.parent);
      bottle.position.x = lastPostion.x;
      bottle.position.y = lastPostion.y;
      lastTime = Date.now();
    });
    bottle.on("pointermove", (e)=>{
      if(bottle.dragging) {
        //set new position
        let parentPosition = bottle.data.getLocalPosition(bottle.parent);
        bottle.position.copy(parentPosition);
        secondLastPosition = lastPostion;
        lastPostion = parentPosition;
        secondLastTime = lastTime;
        lastTime = Date.now();

        //bottle.angularVelocity += (Math.random()-0.5)/200; //Math.sqrt(Math.pow(mouseOffset.x,2) + Math.pow(mouseOffset.y,2)) * deltaTime;
      }
    });
    bottle.on("pointerup", (e)=>{
      bottle.dragging = false;
      bottle.acceleration.y = -9.8*450; //gravity, 9.8m/s^2 * 450 pixels / meter?

      //TODO
      //set anchor to middle but keep bottle position
      //let anchorDiff = new PIXI.Point();
      //anchorDiff.x = bottle.anchor.x - 0.5;
      //anchorDiff.y = bottle.anchor.y - 0.5;
      bottle.anchor.set(0.5);

      //velocity on let go
      let mouseVelocity = new PIXI.Point();
      mouseVelocity.x = lastPostion.x - secondLastPosition.x;
      mouseVelocity.y = lastPostion.y - secondLastPosition.y;
      let deltaTime = lastTime - secondLastTime;
      mouseVelocity.x = mouseVelocity.x/(deltaTime/1000);
      mouseVelocity.y = -mouseVelocity.y/(deltaTime/1000);

      bottle.velocity.set(Math.max(mouseVelocity.x/4, 40), Math.max(mouseVelocity.y/4, 40));
      console.log(deltaTime);

      bottle.data = null;
    });
    this.stage.addChild(bottle);
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
PIXI.loader
  .add("fijiBottle", "images/fijiBottle.png")
  .load(()=>{
    //WIRE UP THE APP
    const app = new BottleFlipGameApp({
      antialias: true,
      width: window.innerWidth,
      height: window.innerHeight
    });
    document.body.appendChild(app.view);

    setInterval(()=>{
      physicsLoop(app.stage);
    }, 10);
  });
});