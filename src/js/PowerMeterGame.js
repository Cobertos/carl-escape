import * as PIXI from "pixi.js";
import { WithPhysics, physicsLoop } from "./engine/WithPhysics.js";

/**Along with normal PIXI.Application options
 * oscillationTime The time it takes the sweeper to do one pass over the width in MS
 * greenAreaWidth 0-1 of the width of the container
 */
export class PowerMeterGame extends PIXI.Container {
  constructor(options){
    options.transparent = true;
    super(options);
    this.width2 = options.width || 500;
    this.height2 = options.height || 200;

    this.oscillationTime = options.oscillationTime || 1000;
    this.greenAreaWidth = options.greenAreaWidth || 0.5;

    this.greenAreaPixelWidth = this.width2*this.greenAreaWidth;

    //Add all the elements
    this._redArea = new PIXI.Graphics();
    this._redArea.beginFill(0xAA5555);
    this._redArea.drawRectBound = this._redArea.drawRect.bind(this._redArea,
      0, this.height2/6, this.width2, 2*this.height2/3);
    this._redArea.drawRectBound();
    this._redArea.endFill();
    this.addChild(this._redArea);
    this._greenArea = new PIXI.Graphics();
    this._greenArea.beginFill(0x55AA55);
    this._greenArea.drawRectBound = this._greenArea.drawRect.bind(this._greenArea,
      (this.width2-this.greenAreaPixelWidth)/2,this.height2/6,this.greenAreaPixelWidth,2*this.height2/3);
    this._greenArea.drawRectBound();
    this._greenArea.endFill();
    this.addChild(this._greenArea);

    this._stopBar = new PIXI.Graphics();
    this._stopBar.beginFill(0xFFFFFF);
    this._stopBar.lineStyle(4, 0x000000, 1);
    this._stopBar.drawRect(0,0,20,this.height2);
    this._stopBar.endFill();
    this.addChild(this._stopBar);

    let text = this._skillCheckText = new PIXI.Text("SKILL CHECK",
      {fontFamily : 'Impact', fontSize: 200, fill : 0xffffff, align : 'center',
        stroke: 0x000000, strokeThickness: 20 });
    text.position.x = this.width2/2;
    text.position.y = this.height2/2;
    text._initialWidth = text.width;
    text._initialHeight = text.height;
    text.visible = false;
    this._skillCheckText.anchor.set(0.5);
    this.addChild(text);

    this._barPos = 0;

    this._initialTime = Date.now();
    this._started = false;
    this._startTime;
    this._stopped = false;
    this._hitGreenArea = undefined;
  }

  onUpdate() {
    if(!this._started || this._skillCheckText.visible) {
      let now = Date.now() - this._initialTime;
      if(now < 300) { //0 - 300ms
        this._skillCheckText.visible = true;
        this._skillCheckText.width = this._skillCheckText._initialWidth*0.5;
        this._skillCheckText.height = this._skillCheckText._initialHeight*0.5;
      }
      else if(now < 600) { //300 - 600ms
        let tween = (now - 300) / 300;
        tween = tween*0.5 + 0.5;
        console.log(tween);
        this._skillCheckText.width = this._skillCheckText._initialWidth*tween;
        this._skillCheckText.height = this._skillCheckText._initialHeight*tween;
      }
      else if(now < 1000) { //600 - 1000ms
        let tween = (now - 600) / 400;
        tween = 1 - tween;
        this._skillCheckText.width = this._skillCheckText._initialWidth*tween;
        this._skillCheckText.height = this._skillCheckText._initialHeight*tween;
        
      }
      else if(now > 1000) {
        this._skillCheckText.visible = false;
      }

      if(now > 800) {
        this._started = true;
        this._startTime = Date.now();
      }
    }
    else {
      if(!this._stopped) {
        let now = Date.now() - this._startTime;
        let shouldMirror = (Math.floor((now / this.oscillationTime)) % 2) === 0;
        this._barPos = Math.abs((shouldMirror ? 0 : 1) - (now % this.oscillationTime / this.oscillationTime));
        this._stopBar.x = this.width2 * this._barPos - this._stopBar.getBounds().width/2;
      }
      else if(this._stopped) {
        let blinkInterval = (Math.floor((Date.now() / 300)) % 2) === 0; //every 1 second
        if(this._hitGreenArea) {
          this._greenArea.beginFill(blinkInterval ? 0x00FF00 : 0x55AA55);
          this._greenArea.drawRectBound();
          this._greenArea.endFill();
        }
        else {
          this._redArea.beginFill(blinkInterval ? 0xFF0000 : 0xAA5555);
          this._redArea.drawRectBound();
          this._redArea.endFill();
        }
      }
    }
  }

  stop() {
    if(!this._started) {
      return;
    }
    this._stopped = true;
    let stopPos = this._barPos;
    let greenBoxX = (this.width2-this.greenAreaPixelWidth)/2; //can't use .x because the object is at 0,0 but the rectangle is drawn at the offset...
    let greenAreaStart = greenBoxX/this.width2;
    let greenAreaEnd = (greenBoxX+this._greenArea.width)/this.width2;
    this._hitGreenArea = (stopPos > greenAreaStart) && (stopPos < greenAreaEnd);
  }

  //Whether the player has won, undefiend if not finished
  get won() {
    return this._hitGreenArea;
  }
}