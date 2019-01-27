/**Returns the passed PIXI class wrapped in a class that supports physics simulation
 * Usage:
 * class MyNewPhysicsClass extends WithPhysics(PIXI.Sprite) {
 *     //...
 * }
 */
export function WithPhysics(pixiCls){
  class _WithPhysicsCls extends pixiCls {
    get hasPhysics(){ return true; }

    constructor(...args) {
      super(...args);
      //Units per second
      this.velocity = new PIXI.Point();
      this.acceleration = new PIXI.Point();
      this.angularVelocity = 0;
      this.angularAcceleration = 0;
    }

    /**Override with your things to do when physics is updating
     * and super call to do normal stuff
     */
    onPhysicsUpdate(time, deltaTime) {
      this.velocity.x += this.acceleration.x * deltaTime/1000;
      this.velocity.y += this.acceleration.y * deltaTime/1000;
      this.position.x += this.velocity.x * deltaTime/1000;
      this.position.y -= this.velocity.y * deltaTime/1000;
      this.angularVelocity += this.angularAcceleration;
      this.rotation += this.angularVelocity;
    }

    /**Override to do things when we collide with an object
     */
    onCollision(otherObjects) {}
  }
  return _WithPhysicsCls;
}

/* Stub tests...
let physicsCls = WithPhysics(PIXI.Container);
it("has a velocity and an acceleration", ()=>{
  //arrange
  let container = new physicsCls();

  //assert
  expect(container.velocity instanceof PIXI.Point);
  expect(container.acceleration instanceof PIXI.Point);
});*/


function depthFirstIterate(obj, func){
  if(!obj) { return; }
  obj.children.forEach((child)=>depthFirstIterate(child,func));
  func(obj);
}
let lastTime = Date.now();
/**From a given rootNode, loops through all children and
 * does the physics simulation on them
 */
export function physicsLoop(rootNode){
  let time = Date.now();
  let deltaTime = time - lastTime;
  lastTime = time;
  //Iterate over all objects, collect the physics objects
  //and call the physics simulation
  let physObjs = [];
  depthFirstIterate(rootNode, (obj)=>{
    if(!obj.hasPhysics) {
      return;
    }
    obj.onPhysicsUpdate(time, deltaTime);
    physObjs.push(obj);
  });
  //Determine whether any objects
  //are colliding, O(n^2/2) it's not that smart
  physObjs.forEach((obj1, idx)=>{
    //.slice(idx to NOT REPEAT), should also never get
    //obj1 === obj2
    physObjs.slice(idx+1).forEach((obj2)=>{
      //Box test with pixi.rectangle
      let rect1 = obj1.getBounds();
      let rect2 = obj2.getBounds();
      let instersects =
        //x direction
        rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
        //y direction
        rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
      if(intersects) {
        //Let them know
        obj1.onCollision(obj2);
        obj2.onCollision(obj1);
        //General collision event
        let evt = new Event("collision");
        evt.obj1 = obj1;
        evt.obj2 = obj2;
        evt.time = time;
        window.dispatchEvent(evt);
      }
    });
  });
}
setInterval(physicsLoop, 100);