import * as PIXI from "pixi.js";
import { WithPhysics, physicsLoop } from "./engine/WithPhysics.js";
import { QuickParticleSystem } from "./engine/QuickParticleSystem.js";

const dist = (point)=>Math.sqrt(Math.pow(point.x,2) + Math.pow(point.y,2))

class KeyFlipGameApp extends PIXI.Application {
  constructor(options){
    super(options);

    //Add all the elements
    class Key extends WithPhysics(PIXI.Sprite) {
      constructor(...args){
        super(PIXI.loader.resources.key.texture);
        let keyAspect = this.height/this.width;
        this.width = 200;
        this.height= this.width*keyAspect;
        this.interactive = true;
        this.buttonMode = true;

        this._lastPosition;
        this._secondLastPosition;
        this._lastVelocity;
        this._vecToCenterFromMouse;
        this._lastTime;
        this._secondLastTime;
        this.on("pointerdown", this.onPointerDown.bind(this));
        this.on("pointermove", this.onPointerMove.bind(this));
        this.on("pointerup", this.onPointerUp.bind(this));
      }

      onPointerDown(e){
        if(this._frozen) {
          return;
        }
        this.dragging = true;
        this.data = e.data;
        //reset physics
        this.velocity.set(0);
        this.acceleration.set(0);
        //set anchor pos to mouse position
        let offsetPos = this.data.getLocalPosition(this); //relative to anchor
        console.log(offsetPos);
        offsetPos.x /= 585;
        offsetPos.y /= 183;
        offsetPos.x += this.anchor.x; //Remove the anchor contribution to reset anchor from top left
        offsetPos.y += this.anchor.y;
        this.anchor.x = offsetPos.x;
        this.anchor.y = offsetPos.y;
        //set the key position
        this._lastPosition = this.data.getLocalPosition(this.parent);
        this.position.x = this._lastPosition.x;
        this.position.y = this._lastPosition.y;
        this._lastTime = Date.now();
        //calculate the mouse offset for other stuff
        this._vecToCenterFromMouse = new PIXI.Point();
        this._vecToCenterFromMouse.x = 0.5 - this.anchor.x;
        this._vecToCenterFromMouse.x *= this.width;
        this._vecToCenterFromMouse.y = 0.5 - this.anchor.y;
        this._vecToCenterFromMouse.y *= this.height;
      }
      onPointerMove(e){
        if(!this.dragging || this._frozen) {
          return;
        }
        //set new position
        let parentPosition = this.data.getLocalPosition(this.parent);
        this.position.copy(parentPosition);
        this._secondLastPosition = this._lastPosition;
        this._lastPosition = parentPosition;
        this._secondLastTime = this._lastTime;
        this._lastTime = Date.now();

        //adjust angular contribution
        //get velocity
        let mouseVelocity = new PIXI.Point();
        mouseVelocity.x = this._lastPosition.x - this._secondLastPosition.x;
        mouseVelocity.y = this._lastPosition.y - this._secondLastPosition.y;
        let deltaTime = this._lastTime - this._secondLastTime;
        mouseVelocity.x = mouseVelocity.x/(deltaTime/1000);
        mouseVelocity.y = -mouseVelocity.y/(deltaTime/1000);
        this._lastVelocity = mouseVelocity;
      }
      onPointerUp(e){
        if(this._frozen) {
          return;
        }
        this.dragging = false;
        key.acceleration.y = -9.8*300; //gravity, 9.8m/s^2 * 450 pixels / meter?

        //TODO
        //set anchor to middle but keep key position
        //let anchorDiff = new PIXI.Point();
        //anchorDiff.x = this.anchor.x - 0.5;
        //anchorDiff.y = this.anchor.y - 0.5;
        this.anchor.set(0.5);

        //velocity on let go
        this.velocity.set(Math.max(this._lastVelocity.x/4, 40), Math.max(this._lastVelocity.y/4, 40));
        this.data = null;
      }

      onPhysicsUpdate(time, deltaTime) {
        super.onPhysicsUpdate(time, deltaTime);

        console.log(this.rotation % (2*Math.PI));
        if(this.dragging && this._lastVelocity && !this._frozen) {
          //get velocity
          let velocityMagnitude = dist(this._lastVelocity);
          if(velocityMagnitude < 10) {
            return;
          }
          //decompose into parallel and perpendicular
          let offset = new PIXI.Point();
          offset.copy(this._vecToCenterFromMouse);
          //rotate by rotation
          offset.x = offset.x * Math.cos(this.rotation) - offset.y * Math.sin(this.rotation); // now x is something different than original vector x
          offset.y = offset.x * Math.sin(this.rotation) + offset.y * Math.cos(this.rotation);
          let angleBetweenOffsetAndVelocity = Math.atan2(
            offset.x*this._lastVelocity.y-offset.x*this._lastVelocity.x,
            offset.x*this._lastVelocity.x+offset.x*this._lastVelocity.y);

          let magnitudeOfPerpendicular = dist(offset);
          magnitudeOfPerpendicular *= Math.sin(angleBetweenOffsetAndVelocity);

          //Apply to acceleration
          this.angularVelocity += magnitudeOfPerpendicular/20000; //Math.sqrt(Math.pow(mouseOffset.x,2) + Math.pow(mouseOffset.y,2)) * deltaTime;
          this.angularVelocity /= 1.1; //Math.sqrt(Math.pow(mouseOffset.x,2) + Math.pow(mouseOffset.y,2)) * deltaTime;
          this._lastVelocity.set(0);
        }
      }



      freeze(){
        this._frozen = true;
        this.dragging = false;
        this.acceleration.set(0);
        this.velocity.set(0);
        this.angularVelocity = 0;
        this.linearVelocity = 0;
      }
    }

    let key = this._key = new Key();
    this.stage.addChild(key);

    //Landing pad for the key
    let self = this;
    class KeyHole extends WithPhysics(PIXI.Graphics) {
      constructor(...args){
        super(...args);
        this._keyTime = undefined;
      }
      onCollision(otherObj){
        if(key._frozen || otherObj !== key) {
          return;
        }
        let rot = Math.abs(key.rotation % (Math.PI*2));
        let inRotationRange = rot > Math.PI*2 - 0.1 || rot < 0 + 0.1;
        if(inRotationRange) {
          this._keyTime = Date.now();
          key.tint = 0xFFFF00;
          key.freeze();

          //Blink effect
          this._blinkEffect = new PIXI.Sprite(PIXI.loader.resources.star.texture);
          this._blinkEffect.alpha = 0.3;
          let blinkAspect = this._blinkEffect.height/this._blinkEffect.width;
          this._blinkEffect.width = 100;
          this._blinkEffect.height = this._blinkEffect.width*blinkAspect;
          this._blinkEffect.x = key.position.x + key.width/2;
          this._blinkEffect.y = key.position.y;
          this._blinkEffect.anchor.set(0.5);
          self.stage.addChild(this._blinkEffect);

          //Star particles
          this._particleSystem = new QuickParticleSystem({
              texture: PIXI.loader.resources.star.texture,
              size: 10,
              sizeVariance: 40,
              tint: 0xFFFF00,
              emitTime: 800,
              lifeTime: 2000,
              lifeTimeVariance: 500,
              spawnRate: 20,
              gravity: false,
              velocityAmount: new PIXI.Point(500,500),
              velocityDirectionalVariance: new PIXI.Point(1,1)
            });
          this._particleSystem.x = key.position.x + key.width/2;
          this._particleSystem.y = key.position.y;
          self.stage.addChild(this._particleSystem);
        }
        else {
          key.angularAcceleration = 0;
          key.angularVelocity /= 4;
        }
      }

      onPhysicsUpdate(...args) {
        super.onPhysicsUpdate(...args);
        if(this._keyTime) {
          let tween = (Date.now() - this._keyTime) / 2000; //over 2000ms
          let blinkAspect = this._blinkEffect.height/this._blinkEffect.width;
          this._blinkEffect.width = 100 + (7000*Math.pow(tween,2)); //100 to 7000 with tween^2 easing
          this._blinkEffect.height = this._blinkEffect.width*blinkAspect;
          this._blinkEffect.rotation += (Math.random()-0.5)*0.01; //Really small rotation changes

          if(tween > 1.0) {
            this._blinkEffect.visible = false;
            this._keyTime = 0;
          }
        }
      }
    }
    this._landingArea = new KeyHole();
    this._landingArea.beginFill(0xFFFF55);
    this._landingArea.drawRectBound = this._landingArea.drawRect.bind(this._landingArea,
      this.screen.width-20, this.screen.height/2, 20, this.screen.height/6);
    this._landingArea.drawRectBound();
    this._landingArea.endFill();
    this.stage.addChild(this._landingArea);

    class Floor extends WithPhysics(PIXI.Graphics) {
      onCollision(otherObj){
        if(key._frozen || otherObj !== key) {
          return;
        }
        key.velocity.set(0);
        key.acceleration.set(0);
        key.angularVelocity = 0;
        key.angularAcceleration = 0;
      }
    }
    this._floor = new Floor();
    this._floor.beginFill(0x555555);
    this._floor.drawRectBound = this._floor.drawRect.bind(this._floor,
      0, this.screen.height-20, this.screen.width, 20);
    this._floor.drawRectBound();
    this._floor.endFill();
    this.stage.addChild(this._floor);
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
PIXI.loader
  .add("key", "images/key.png")
  .add("star", "images/star.png")
  .load(()=>{
    //WIRE UP THE APP
    const app = new KeyFlipGameApp({
      antialias: true,
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true
    });
    document.body.appendChild(app.view);

    setInterval(()=>{
      physicsLoop(app.stage);
    }, 10);
  });
});