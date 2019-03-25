// BACKGROUND SET UP

let backGround = new PIXI.Graphics()
backGround.beginFill(0xFFFFFF)
backGround.drawRoundedRect(0,0,windowWidth,windowHeight)
backGround.endFill()
backGround.interactive = true
numberline.stage.addChild(backGround)

// CONSTANTS


const dim = window.innerWidth/12
const centerLine = window.innerHeight/2
const lineWidth = 10*dim

const pinkCircle = new PIXI.Graphics();
pinkCircle.lineStyle(2, 0x000000, 2)
pinkCircle.beginFill(COLORS.GRAY);
pinkCircle.drawCircle(dim/5+1, dim/5+1,dim/5);
pinkCircle.endFill();

const blueCircle = new PIXI.Graphics();
blueCircle.lineStyle(2, 0x000000, 2)
blueCircle.beginFill(COLORS.BLUE);
blueCircle.drawCircle(dim/5+1, dim/5+1,dim/5);
blueCircle.endFill();



// STATE VARIABLES

let blocksOnLine = []


// Temp storage for feedback logic
let setPins = []
let unsetPins = []
let setLabels = []
let unsetLabels = []
let nodes = []

let pinsOnLine = []
let labelsOnLine = []

let activeEntity = new PIXI.Sprite()


let pinkCircleTexture = numberline.renderer.generateTexture(pinkCircle)

let blockKeys = [0,1,2,3,4,5,6,7,8]

let lineMax; // Max value of the line
let wholeWidth; // physical width of "one whole" on the number line
let minStep; // Minmum block width for measuring or placing pins/labels
let currentProblem;

function removeElement(e,arr){
  console.log("incoming arr length",arr.length)
  if (arr.length != 0){
    let i = arr.indexOf(e)
    arr.splice(i,1)
  }
  console.log("array after removeal",arr.length)
}

function createFeedBackLbl(){
  let c = new PIXI.Container()
}

function createActionButton(text,action) {

  var graphics = new PIXI.Graphics();
  graphics.lineStyle(0, 0xb7b7b7, 1)
  graphics.beginFill(COLORS.ORANGE);
  graphics.drawRoundedRect(0, 0,4*dx,dx ,5);
  graphics.endFill();

    var texture = numberline.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    tile.anchor.set(0.5)

    let den = new PIXI.Text(text,{fontFamily : 'Chalkboard SE', fontSize: dx/2, fill : 0xFFFFFF, align : 'center'});
    den.anchor.set(0.5)

    let tileContainer = new PIXI.Container()

    tileContainer.addChild(tile)
    tileContainer.addChild(den)

    tileContainer.active = false
    tileContainer.interactive = true;
    tileContainer.buttonMode = true;

    tileContainer.on('pointerdown', action)

    // move the sprite to its designated position
    tileContainer.x = 10*dim
    tileContainer.y = dx
    tileContainer.checkAnswer = true
    tileContainer.text = den

    tileContainer.tile = tile
    return tileContainer
}

function freezeView(){

}

function createTick(nodeIndex){
  let tick = new PIXI.Graphics()
  tick.lineStyle(3, 0xb7b7b7, 1)
  tick.moveTo(0,0)
  tick.lineTo(0,dim/4)
  tick.x = dim + minStep*nodeIndex
  tick.y = 2.875*dim
  return tick
}

function refreshGame(){
    for (e of [...pinsOnLine,...labelsOnLine]){
      e.onLine = false
    }
}

function checkAnswer() {
  if (this.checkAnswer) {
    let validSetting = true

    for (e of [...pinsOnLine,...labelsOnLine]){
      if (!e.onLine){
          validSetting = false
      }
    }

    if (validSetting){
      animateFeedBack([...feedBlocks],[dim,2.7*dim],[...pinsOnLine],[...labelsOnLine],0)
      this.checkAnswer = false
      for (b of blocksOnLine){
        //numberline.stage.removeChild(b)
      }
    } else {
      dropNotification("Make sure to set all the pins!")
    }

  } else {
    for (b of feedBlocks){
      this.checkAnswer = true
      this.text.text = "Go"
      b.x = -100
      b.y = -50
    }
  }
}

let goButton = createActionButton("Go",checkAnswer)
numberline.stage.addChild(goButton)


function loadProblem(problem) {

  currentProblem = problem
  lineMax = problem.max
  wholeWidth = lineWidth/lineMax
  minStep = lineWidth/8

  pinsOnLine = problem.pinKeys.map((e,i)=>{

    let p = createPin()
        p.on('pointerdown',onPinDragStart)
         .on('pointermove',onPinDragMove)
         .on('pointerup',onPinDragEnd)
        p.x = dim+1.2*p.width*i
        p.y = 1.5*dim
    nodes.push(false)
    numberline.stage.addChild(p)
    p.originalLocation = [p.x,p.y]
    return p
  })


  labelsOnLine = problem.labels.map((e) => {return createFractionLbl(e)})

  labelsOnLine.map((c,i) => {
    c.on('pointerdown',onLblDragStart)
      .on('pointermove',onLblDragMove)
      .on('pointerup',onLblDragEnd)

    numberline.stage.addChild(c)
    flipLbl(c)


    c.x = dim+1.2*c.width*i
    c.y = 3.75*dim
    c.originalLocation = [c.x,c.y]
    c.expectedLocation = dim + wholeWidth*c._n/c._d

    /*
    if (c._n/c._d == problem.max || c._n/c._d == problem.min){
        createjs.Tween.get(c).to({x: c.expectedLocation,y: 3*dim}, 500, createjs.Ease.getPowInOut(4))
    }
    */

  })

}

loadProblem(PROBLEM_1)

let t = createTick(4)
//numberline.stage.addChild(t)


numberline.renderer.interactive = true
backGround.on('pointerup',globalPointerUp)

function globalPointerUp() {
  activeEntity.dragging = false
  activeEntity.alpha = 1

  if (activeEntity.x+activeEntity.width/2 < dim && activeEntity.mutable == true){
    let i = blocksOnLine.indexOf(activeEntity)
    blocksOnLine.splice(i,1)
    numberline.stage.removeChild(activeEntity)
  }
}

let feedBlocks = blockKeys.map((k)=>{return createMeasureBlock(minStep,1,4,true)} )

feedBlocks.map(b => {
  b.x = -b.width
  b.y = 3*dim
  numberline.stage.addChild(b)})

function getNearestObject(pins,location){

  let closestPin = pins[0]

  let deltaClosestPin = Math.abs(closestPin.x - location[0])

  for (let i = 1;i<pins.length;i++){
    let currentPin = pins[i]
    let deltaCurrentPin = Math.abs(currentPin.x -location[0])

    if (deltaCurrentPin < deltaClosestPin){
      deltaClosestPin = deltaCurrentPin
      closestPin = currentPin
    }
  }

  return closestPin
}

function resetGame(){

}

function animateFeedBack(blocks,start,pins,labels,i){
  console.log("pins length",pins.length)
  console.log("labels length",labels.length)
  console.log("nodes.length",nodes.length)
  console.log("IIIIIII",i)
  if (blocks.length == 0){
    if (pins.length == 0 && labels.length == 0){
      dropNotification("You Did It!")
    }
    for (p of pins){
       createjs.Tween.get(p).to({x: p.originalLocation[0],y: p.originalLocation[1]}, 500, createjs.Ease.getPowInOut(4))
    }
    for (l of labels){
       createjs.Tween.get(l).to({x: l.originalLocation[0],y: l.originalLocation[1]}, 500, createjs.Ease.getPowInOut(4))
    }
    labelsOnLine = labels
    pinsOnLine = pins
    goButton.text.text = "Try Again"
    refreshGame()
    return
  }
  else {
      console.log("blocks.length",blocks.length)
      let b = blocks.pop()
      let newStart = [start[0]+b.width,start[1]]
      let animateTo = i == 0 ? [b.x,b.y] : [start[0]-b.width,start[1]]
      createjs.Tween.get(b).to({x: animateTo[0],y: animateTo[1],alpha: 1}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
      // HELLO! The nearest pin needs to also be on the line - maybe have boolean "on the line" property

      let nearestPin = getNearestObject(pins,start)

      // Label Logic
      let setLabel = false
      let nearestLabel = null
      console.log("labels",)
      for (l of labels){
          if (Math.abs(start[0] - l.expectedLocation) < 0.25*minStep && Math.abs(l.x - l.expectedLocation) < 0.25*minStep){
            setLabel = true
            nearestLabel = l
            removeElement(l,labels)
          }
      }

      // Pin Logic
      let setPin =  Math.abs(nearestPin.x - start[0]) < 0.25*minStep && nodes[i] == false ? true : false

      if (setPin && nodes[i] == false) {
        console.log("REMOVING PIN")
        nodes[i] = true
        //nearestPin.circleSprite.texture = blueCircle
        setPins.push(nearestPin)
        removeElement(nearestPin,pins)
      }

    if (setPin && setLabel) {
      createjs.Tween.get(nearestPin).to({x: start[0],y: 2.5*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
      createjs.Tween.get(nearestLabel).to({x: start[0],y: 3*dim},500,createjs.Ease.getPowInOut(4)).call(() => {
            setPins.push
            nearestPin.set = true
            nearestLabel.set = true
            i += 1
            animateFeedBack(blocks,newStart,pins,labels,i)
        })
      })
    } else if (setPin){
      createjs.Tween.get(nearestPin).to({x: start[0],y: 2.5*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
            nearestPin.set = true
            i += 1
            animateFeedBack(blocks,newStart,pins,labels,i)
      })
    } else if (setLabel) {
      createjs.Tween.get(nearestLabel).to({x: start[0],y: 3*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
          nearestLabel.set = true
          i += 1
          animateFeedBack(blocks,newStart,pins,labels,i)
      })
    } else {
         i += 1
         animateFeedBack(blocks,newStart,pins,labels,i)
    }
    })
  }
}



function createBlockWidget(blocks,wholeWidth) {
  for (let i = 0;i<blocks.length;i++){
    let block = new PIXI.Graphics();
    block.beginFill(COLORS.BLUE);
    block.drawRoundedRect(dim, dim/8+i*3*dim/8,wholeWidth/blocks[i].den*blocks[i].num, dim/4,5);
    block.endFill();
    block.num = blocks[i].num
    block.den = blocks[i].den
    block.interactive = true
    block.on('pointerdown',onBlockWidgetSelected)
    numberline.stage.addChild(block)
  }
}


// Do I need to pass this the Numberline max so I can calculate the block
// width based on the fraction is supposed to represent.
createBlockWidget([WHOLE_BLOCK,HALF_BLOCK,FOURTH_BLOCK],5*dim)


function createMeasureBlock(width,num,den,label) {


  let blockContainer = new PIXI.Container()
  var block = new PIXI.Graphics();
  block.beginFill(COLORS.BLUE);
  block.drawRoundedRect(0, 0, width, dim/4,5);
  block.endFill();
  let blockTexture = numberline.renderer.generateTexture(block)
  let blockSprite = new PIXI.Sprite(blockTexture)
  blockSprite.alpha = 0.7
  blockContainer.addChild(blockSprite)
  blockContainer.hitSpot = blockSprite

  let text = new PIXI.Text(num+'/'+den,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
  text.anchor.set(0.5)
  text.x = width/2
  text.y = dim/8
  text.style.fill = 0xFFFFFF
  if (label){
      blockContainer.addChild(text)
  }

  blockContainer.text = text
  blockContainer.mutable = true
  blockContainer.interactive = true
  blockContainer.on('pointerdown',onBlockDragStart)
    .on('pointermove',onBlockDragMove)
    .on('pointerup',onBlockDragEnd)

  blocksOnLine.push(blockContainer)

  return blockContainer
}

function createPin() {

    let h = 1/2*dim
    let w = dim/4

    var circle = new PIXI.Graphics();
    circle.lineStyle(2, 0x000000, 2)
    circle.beginFill(0xFFFFFF);
    // why dim/5?
    circle.drawCircle(dim/5+1, dim/5+1,dim/5);
    circle.endFill();

    var circleTexture = numberline.renderer.generateTexture(circle);
    let circleSprite = new PIXI.Sprite(circleTexture)
    circleSprite.alpha = 0.5
    circleSprite.anchor.set(0.5)
    circleSprite.texture = pinkCircleTexture

    var stem = new PIXI.Graphics();
    stem.lineStyle(2, 0x000000, 10)
    stem.moveTo(0,dim/5)
    stem.lineTo(0,dim/2)

    let pinContainer = new PIXI.Container()
    pinContainer.addChild(circleSprite)
    pinContainer.addChild(stem)

    pinContainer.active = false
    pinContainer.interactive = true;

    pinContainer.x = 0
    pinContainer.y = 0
    pinContainer.draggable = true
    pinContainer.onLine = false
    pinContainer.circleSprite = circleSprite

    return pinContainer
}

function createFractionLbl(frac) {

    let tileContainer = new PIXI.Container()

    let n = frac[0]
    let d = frac[1]

    let whole = d == 1 ? true : false

    let h = d == 1 ? dim/4 : 1/2*dim
    let w = dim/4

    var block = new PIXI.Graphics();
    block.lineStyle(2,0x000000,2)
    block.beginFill(0xFFFFFF);
    block.drawRoundedRect(1, 1, w, h,5);
    block.endFill();

    var blockTexture = numberline.renderer.generateTexture(block);
    let tile = new PIXI.Sprite(blockTexture)
    tile.alpha = 0.5
    tile.anchor.set(0.5)


    // All or only some of these may exist depending on if we're using a "whole" or not.
    let mid;
    let num;
    let den;
    let l;

    if (!whole) {
      l = new PIXI.Graphics();
      l.lineStyle(2, 0x000000, 2)
      l.moveTo(0,dim/4)
      l.lineTo(0,dim/2)
      mid = new PIXI.Graphics()
      mid.lineStyle(2, 0x000000, 2)
      mid.moveTo(-dim/10,0)
      mid.lineTo(dim/10,0)
      num = new PIXI.Text(n,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
      num.anchor.set(0.5)
      num.y = -h/6
      den = new PIXI.Text(d,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
      den.anchor.set(0.5)
      den.y = h/6
    } else {
      l = new PIXI.Graphics();
      l.lineStyle(2, 0x000000, 2)
      l.moveTo(0,dim/8)
      l.lineTo(0,dim/2)
      num = new PIXI.Text(n,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
      num.anchor.set(0.5)
      num.y = 0
    }

    tileContainer.addChild(tile)
    tileContainer.addChild(num)
    tileContainer.addChild(l)
    tileContainer.hitSpot = tile

    // Line style appears grey unless we add this after the prefious if block - not sure why.
    if (mid){tileContainer.addChild(mid)
          tileContainer.addChild(den)}

    tileContainer.active = false
    tileContainer.interactive = true;

    tileContainer.x = dim
    tileContainer.y = 0
    tileContainer.d = den
    tileContainer.n = num
    tileContainer._d = d
    tileContainer._n = n
    tileContainer.pivot.x = 0
    tileContainer.pivot.y = dim/2
    tileContainer.onLine = false

    return tileContainer
}


let line = createNumberLine()
numberline.stage.addChild(line)

function createNumberLine(den) {
  let line = new PIXI.Graphics();
  line.lineStyle(4, 0xb7b7b7, 1);
  line.moveTo(dim, 3*dim);
  line.lineTo(dim+10*dim, 3*dim);
  return line
}

function onBlockWidgetSelected() {
    let b = createMeasureBlock(this.width,this.num,this.den)
    numberline.stage.addChild(b)
    b.x = dim
    b.y = 3*dim - b.height
}


// Label Actions

function onLblDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    activeEntity = this
    this.parent.addChild(this)
    this.onLine = true
    // Should be "active Label"
}


function onLblDragEnd()
{
    this.alpha = 1;

    this.dragging = false;
    // set the interaction data to null
    this.data = null;

}

function onLblDragMove()
{

    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        //let position = new PIXI.Point(newPosition.x,newPosition.y)
        if (false){
          this.dragging = false
          this.alpha = 1
        }
        // this.circleSprite.alpha = 1 - Math.abs(this.expectedLocation - this.x)/this.expectedLocation
        this.onLine = true
        this.position.x = newPosition.x;
        this.position.y = 3*dim
    }
}

// Block Actions

// Label Actions

function onBlockDragStart(event)
{
    let touchedAtX = event.data.global.x
    let touchedAtY = event.data.global.y
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    activeEntity = this
    this.parent.addChild(this)
}


function onBlockDragEnd(){
    this.alpha = 1;
    if (this.x+this.width/2 < dim){
      let i = blocksOnLine.indexOf(this)
      blocksOnLine.splice(i,1)
      numberline.stage.removeChild(this)
    }

    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onBlockDragMove(){

    if (this.dragging){
        var newPosition = this.data.getLocalPosition(this.parent);
        //let position = new PIXI.Point(newPosition.x,newPosition.y)
        if (false){
          this.dragging = false
          this.alpha = 1
        }
        //this.position.x = newPosition.x-this.width/2;
        this.x = newPosition.x + this.deltaTouch[0]
    }
}




// Pin Actions

function onPinDragStart(event)
{
    // Store a reference to the data
    if (this.draggable) {
      this.data = event.data;
      this.alpha = 0.5;
      this.dragging = true;
      activeEntity = this
      this.onLine = true
      this.parent.addChild(this)
    }
}


function onPinDragEnd()
{
    this.alpha = 1;

    this.dragging = false;
    // set the interaction data to null
    this.data = null;
    this.onLine = true
}

function onPinDragMove()
{

    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        if (false){
          this.dragging = false
          this.alpha = 1
        }
        this.position.x = newPosition.x;
        this.position.y = 2.5*dim
    }
}





function flipLbl(lbl){
  if (lbl.d) {
    lbl.scale.y = lbl.scale.y*(-1)
    lbl.d.scale.y = lbl.d.scale.y*(-1)
    lbl.n.scale.y = lbl.n.scale.y*(-1)
    let numY = lbl.n.y
    lbl.n.y = lbl.d.y
    lbl.d.y = numY
  } else {
    lbl.scale.y = lbl.scale.y*(-1)
    lbl.n.scale.y = lbl.n.scale.y*(-1)
  }
}



document.addEventListener('keydown', function(event) {

    if (event.keyCode == 40 && activeEntity.scale.y == 1) {
      event.preventDefault()
      flipLbl(activeEntity)
    }

    if (event.keyCode == 38 && activeEntity.scale.y == -1) {
      event.preventDefault()
      flipLbl(activeEntity)
    }
})
