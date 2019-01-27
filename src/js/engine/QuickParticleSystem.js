import * as PIXI from "pixi.js";
import { WithPhysics } from "./WithPhysics.js";
export class QuickParticleSystem extends PIXI.Container {
  constructor(options){
    super(options);
    Object.assign(this, options);

    var self = this;
    class QuickParticle extends WithPhysics(PIXI.Sprite) {
      constructor(...args){
        super(...args);
        this._endTime = Date.now() + self.lifeTime + self.lifeTimeVariance * Math.random();
      }
      get doCollisions() { return false; }

      onPhysicsUpdate(...args){
        super.onPhysicsUpdate(...args);
        if(Date.now() > this._endTime) {
          this.visible = false;
        }
      }
    }
    this._particleCls = QuickParticle;
    this._spriteTexture = options.texture;
    let endTime = Date.now() + this.emitTime;
    let interval = setInterval(()=>{
      this.spawnParticle();
      if(Date.now() > endTime) {
        clearInterval(interval);
      }
    }, this.spawnRate);
  }
  spawnParticle() {
    let particle = new (this._particleCls)(this._spriteTexture);
    let particleAspect = particle.height/particle.width;
    particle.width = this.size + Math.random() * this.sizeVariance;
    particle.height = particle.width*particleAspect;
    particle.tint = this.tint;
    if(this.gravity) {
      particle.acceleration.set(0,-9.8*200);
    }
    let normalRandom = ()=>Math.random();
    let doubleRandom = ()=>(Math.random()-0.5)*2;
    particle.velocity.set(
      (this.velocityDirectionalVariance.x ? doubleRandom : normalRandom)()*this.velocityAmount.x,
      (this.velocityDirectionalVariance.y ? doubleRandom : normalRandom)()*this.velocityAmount.y);
    if(!this.rotationIsTrajectory) {
      particle.angularAcceleration = (Math.random()-0.5);
      particle.angularVelocity = (Math.random()-0.5)/4;
    }
    else {
      //TODO: I dont think this fully works oh well
      particle.rotation = Math.atan2(particle.velocity.y, particle.velocity.x);
    }
    particle.anchor.set(0.5);
    this.addChild(particle);
  }
}