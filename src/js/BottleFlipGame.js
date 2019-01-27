import * as PIXI from "pixi.js";
import { WithPhysics, physicsLoop } from "./engine/WithPhysics.js";
import { QuickParticleSystem } from "./engine/QuickParticleSystem.js";

const dist = (point)=>Math.sqrt(Math.pow(point.x,2) + Math.pow(point.y,2))
const COUNTDOWN_LENGTH = 20;

class KeyFlipGame extends PIXI.Container {
  constructor(options){
    super(options);
    this.intrinsicWidth = options.intrinsicWidth || 500;
    this.intrinsicHeight = options.intrinsicHeight || 200;

    this._started = false;
    this._stopped = false;
    this._spawnTime = Date.now();
    this._stoppedTime = undefined;
    this._startedTime = undefined;
    this._won = false;
    this._lastTime = 0;
    
    this._timeText = new PIXI.Text(COUNTDOWN_LENGTH+"",
      {fontFamily : 'Impact', fontSize: 200, fill : 0xffffff, align : 'center',
        stroke: 0x000000, strokeThickness: 20 });
    this._timeText.position.x = this.intrinsicWidth/2;
    this._timeText.position.y = this.intrinsicHeight/2;
    this._timeText._initialPosition = new PIXI.Point(this.intrinsicWidth/2, this.intrinsicHeight/2);;
    this._timeText.visible = false;
    this._timeText.anchor.set(0.5);
    this.addChild(this._timeText);

    this._doorImage = new PIXI.Sprite(PIXI.loader.resources.door.texture);
    this._doorImage.anchor.set(1,0);
    this._doorImage.position.x = this.intrinsicWidth;
    this._doorImage.position.y = 0;
    let doorAspect = this._doorImage.width/this._doorImage.height;
    this._doorImage.height= this.intrinsicHeight;
    this._doorImage.width = this._doorImage.height*doorAspect;
    this.addChild(this._doorImage);


    //Add all the elements
    class Key extends WithPhysics(PIXI.Sprite) {
      constructor(...args){
        super(PIXI.loader.resources.key.texture);
        let keyAspect = this.height/this.width;
        this.width = 200;
        this.height= this.width*keyAspect;
        this.interactive = true;

        this._lastPosition;
        this._secondLastPosition;
        this._lastVelocity;
        this._vecToCenterFromMouse;
        this._lastTime;
        this._secondLastTime;
      }

      start() {
        this.buttonMode = true;
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
        //console.log(offsetPos);
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
        key.acceleration.y = -9.8*300; //gravity, 9.8m/s^2 * 300 pixels / meter?

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

        //console.log(this.rotation % (2*Math.PI));
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
        this.buttonMode = false;
        this.dragging = false;
        this.acceleration.set(0);
        this.velocity.set(0);
        this.angularVelocity = 0;
        this.linearVelocity = 0;
      }

      bonk() {
        this.dragging = false;
        this.acceleration.set(0, -9.8*300); //gravity in y
        this.velocity.x = -500;
        this.angularVelocity = 0;
        this.linearVelocity = 0;

        //spawn bonk particle
        this._bonkSystem = new QuickParticleSystem({
            texture: PIXI.loader.resources.line.texture,
            size: 10,
            sizeVariance: 20,
            tint: 0x333333,
            emitTime: 100,
            lifeTime: 200,
            lifeTimeVariance: 500,
            spawnRate: 20,
            gravity: false,
            velocityAmount: new PIXI.Point(-500,500),
            velocityDirectionalVariance: new PIXI.Point(0,1),
            rotationIsTrajectory: true
          });
        this._bonkSystem.x = this.position.x + this.width/2;
        this._bonkSystem.y = this.position.y;
        this.parent.addChild(this._bonkSystem);
      }
    }

    let key = this._key = new Key();
    this.addChild(key);

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
        let inRotationRange = rot > Math.PI*2 - Math.PI/5 || rot < 0 + Math.PI/5; //tolerance in radians
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
          self.addChild(this._blinkEffect);

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
          self.addChild(this._particleSystem);

          self.win();
        }
        else {
          key.angularAcceleration = 0;
          key.angularVelocity /= 4;
          key.bonk();
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
    let lockHeightOffset = 780*this.intrinsicHeight/1500;
    let lockHeight = 2*this.intrinsicHeight/1500;
    this._landingArea.drawRect(this.intrinsicWidth-(380*this._doorImage.width/681), lockHeightOffset, 20, lockHeight);
    this._landingArea.endFill();
    this._landingArea.visible = false;
    this.addChild(this._landingArea);

    class Wall extends WithPhysics(PIXI.Graphics) {
      onCollision(otherObj){
        if(key._frozen || otherObj !== key) {
          return;
        }
        key.angularAcceleration = 0;
        key.angularVelocity /= 4;
        key.bonk();
      }
    }
    this._wall = new Wall();
    this._wall.beginFill(0x55FF55);
    this._wall.drawRect(this.intrinsicWidth-(360*this._doorImage.width/681), 0, 20, this.intrinsicHeight);
    this._wall.endFill();
    this._wall.visible = false;
    this.addChild(this._wall);

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
      0, this.intrinsicHeight-20, this.intrinsicWidth, 20);
    this._floor.drawRectBound();
    this._floor.endFill();
    this.addChild(this._floor);

    //Win loss stuff
    this._instructText = new PIXI.Text("PUT THE KEY IN",
      {fontFamily : 'Impact', fontSize: 200, fill : 0xffffff, align : 'center',
        stroke: 0x000000, strokeThickness: 20 });
    this._instructText.position.x = this.intrinsicWidth/2;
    this._instructText.position.y = this.intrinsicHeight/2;
    this._instructText._initialWidth = this._instructText.width;
    this._instructText._initialHeight = this._instructText.height;
    this._instructText.anchor.set(0.5);
    this.addChild(this._instructText);

    this._arrowSprite = new PIXI.Sprite(PIXI.loader.resources.arrow.texture);
    this._arrowSprite.position.x = 50;
    this._arrowSprite.position.y = 50;
    let arrowAspect = this._arrowSprite.height/this._arrowSprite.width;
    this._arrowSprite.width = 200;
    this._arrowSprite.height= this._arrowSprite.width*arrowAspect;
    this.addChild(this._arrowSprite);

    this._winText = new PIXI.Text("NAILED IT!",
      {fontFamily : 'Impact', fontSize: 200, fill : 0xffffff, align : 'center',
        stroke: 0x000000, strokeThickness: 20 });
    this._winText.position.x = this.intrinsicWidth/2;
    this._winText.position.y = this.intrinsicHeight/2;
    this._winText._initialWidth = this._winText.width;
    this._winText._initialHeight = this._winText.height;
    this._winText.visible = false;
    this._winText.anchor.set(0.5);
    this.addChild(this._winText);

    this._loseBg = new PIXI.Graphics();
    this._loseBg.beginFill(0xFF0000);
    this._loseBg.alpha = 0.0; //fades in
    this._loseBg.drawRect(0, 0, this.intrinsicWidth, this.intrinsicHeight);
    this._loseBg.endFill();
    this._loseBg.visible = false;
    this.addChild(this._loseBg);

    this._loseText = new PIXI.Text("N",
      {fontFamily : 'Impact', fontSize: 200, fill : 0xffffff, align : 'center',
        stroke: 0x000000, strokeThickness: 20 });
    this._loseText.position.x = this.intrinsicWidth/2;
    this._loseText.position.y = this.intrinsicHeight/2;
    this._loseText._initialWidth = this._loseText.width;
    this._loseText._initialHeight = this._loseText.height;
    this._loseText.visible = false;
    this._loseText.anchor.set(0.5);
    this.addChild(this._loseText);
  }

  win() {
    this._stopped = true;
    this._stoppedTime = Date.now();
    this._won = true;
    
  }

  lose() {
    this._stopped = true;
    this._stoppedTime = Date.now();
    this._won = false;
    this._key.freeze();
    this._key.tint = 0xFF4444;
  }

  onUpdate() {
    let time = Date.now();
    let deltaTime = time - this._lastTime;
    this._lastTime = time;
    if(!this._started) {
      let now = Date.now() - this._spawnTime;
      this._arrowSprite.visible = Math.floor(now / 500) % 2 === 0;
      if(now > 3000) {
        this._instructText.visible = false;
        this._arrowSprite.visible = false;
        this._timeText.visible = true;
        this._started = true;
        this._startedTime = Date.now();
        this._key.start();
      }
    }
    else if(!this._stopped) {
      let now = Date.now() - this._startedTime;
      let timeLeft = COUNTDOWN_LENGTH - now/1000;
      let timeToGo = now/1000;
      if(timeLeft < 0) {
        this.lose();
        return;
      }
      this._timeText.text = Math.floor(timeLeft)+"";
      this._timeText.position.set(
        this._timeText._initialPosition.x + (Math.random()-0.5)*2*Math.max(timeToGo-COUNTDOWN_LENGTH/2,0),
        this._timeText._initialPosition.y + (Math.random()-0.5)*2*Math.max(timeToGo-COUNTDOWN_LENGTH/2,0));
    }
    else {
      let now = Date.now() - this._stoppedTime;
      this._timeText.visible = false;
      if(this._won) {
        this._winText.visible = true;
        this._winText.rotation = Math.sin(now/2000*Math.PI*2)/5;//Period ever 2 seconds, -0.2 to 0.2
      }
      else {
        this._timeText.visible = false;
        this._loseText.visible = true;
        this._loseBg.visible = true;
        let tween = Math.min(now / 1000 * 0.6, 0.6);
        this._loseBg.alpha = tween;

        //Scrolling end text
        let endText = "NAAAAAHHHHHHH";
        let tween2 = Math.pow(Math.min(now / 3000, 1.0), 2);
        tween2 = Math.floor(tween2 * endText.length) + 1;
        this._loseText.text = endText.slice(0,tween2);

        if(now > 10000) {
          this._loseText.text = "D:";
        }
      }

      if(now > 3000 && !this._ended) {
        this._ended = true;
        this.emit("ended", { won: this._won});
      }
    }
  }

  get won() {
    return this._stopped ? this._won : undefined;
  }

  static getAssetsToLoad(){
    return [
      {name:"key", url:"images/key.png"},
      {name:"star", url:"images/star.png"},
      {name:"arrow", url:"images/arrow.png"},
      {name:"door", url:"images/door.png"},
      {name:"line", url:"images/line.png"}
    ];
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
PIXI.loader
  .add(KeyFlipGame.getAssetsToLoad())
  .load(()=>{
    //WIRE UP THE APP
    const app = new PIXI.Application({
      antialias: true,
      width: window.innerWidth,
      height: window.innerHeight
    });
    document.body.appendChild(app.view);
    let game = new KeyFlipGame({
      intrinsicWidth: app.screen.width, 
      intrinsicHeight: app.screen.height, 
    });
    app.stage.addChild(game);

    setInterval(()=>{
      physicsLoop(app.stage);
    }, 10);

    let raf;
    const loop = ()=>{
      game.onUpdate();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  });
});