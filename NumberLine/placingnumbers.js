// BACKGROUND SET UP

const QUE_INDEX = window.localStorage['activityIndex']
if (QUE_INDEX){
  PROBLEM_QUE = ACTIVITY_QUE[QUE_INDEX]
} else {
  PROBLEM_QUE = ACTIVITY_QUE[0]
}

let numberOfProblems = PROBLEM_QUE.length

let PROBLEM_INDEX = 0

console.log("localStorage problem index",window.localStorage['problemIndex'])

let backGround = new PIXI.Graphics()
backGround.beginFill(0xFFFFFF)
backGround.drawRoundedRect(0,0,windowWidth,windowHeight)
backGround.endFill()
backGround.interactive = true
backGround.static = false
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

let expectedPins = 0



// STATE VARIABLES
let blocksOnLine = []

// Temp storage for feedback logic
let pinsCurrentlySet = []
let feedBlocks;

let pinsOffLineCount = 0

let presetPins = []
let presetLabels = []
let pinsInPlay = []
let labelsOnLine = []
let problemIndex = 0
let ticksOnLine = []

let blocksInWidget = []

let firstTry = true
let pinWidget = {}

let activeEntity = new PIXI.Sprite()

let pinkCircleTexture = numberline.renderer.generateTexture(pinkCircle)

let lineMax; // Max value of the line
let wholeWidth; // physical width of "one whole" on the number line
let minStep; // Minmum block width for measuring or placing pins/labels
let currentProblem;
let dT;

// So i don't lose a reference to this shit when I'm resetting the game
let globalPinRef = []
let globalLabelRef = []

let activityQue;

function areAllPinsSet(pins){
  let set = true
  for (p of pinsInPlay) {
    if (p.onLine == false){
      set = false
    }
  }
  return set
}

function removeElement(e,arr){
  if (arr.length != 0){
    let i = arr.indexOf(e)
    arr.splice(i,1)
  }
}

function createFeedBackLbl(){
  let c = new PIXI.Container()
}

function createPinWidget(){
  let p = createPin()
  let plus = new PIXI.Text("+",{fontFamily : 'Chalkboard SE', fontSize: dx/2, fill : 0x000000, align : 'center'});
  plus.anchor.set(0.5)
  plus.x = 0
  plus.y = 0
  p.addChild(plus)
  p.on('pointerdown',createPinFromWidget)
  p.originalLocation = [0,0]
  p.x = dim
  p.y = 1.5*dim
  pinWidget = p
  p.static = false
  p.isSet = false
  numberline.stage.addChild(p)
}

function createPinFromWidget(){
  pinsOffLineCount += 1
  let p = createPin()
      p.on('pointerdown',onPinDragStart)
       .on('pointermove',onPinDragMove)
       .on('pointerup',onPinDragEnd)
  p.x = dim
  p.y = 1.5*dim
  createjs.Tween.get(p).to({x: dim+1.1*p.width*pinsOffLineCount,y: 1.5*dim}, 500, createjs.Ease.getPowInOut(4))
  p.onLine = false
  p.isSet = false
  p.mutable = true
  pinsInPlay.push(p)
  globalPinRef.push(p)
  numberline.stage.addChild(p)
  numberline.stage.addChild(pinWidget)
}

function setTicks(numberOfTicks){
   let ticks = []
   let tickSpace = lineWidth/(numberOfTicks-1)
   for (let i = 0;i < numberOfTicks;i++){
      let t = createTick(i,tickSpace)
      ticks.push(t)
      numberline.stage.addChild(t)
   }
   ticksOnLine = ticks
}

//setTicks(10)

function createTick(nodeIndex,width){
  let tick = new PIXI.Graphics()
  tick.lineStyle(3, 0xb7b7b7, 1)
  tick.moveTo(0,0)
  tick.lineTo(0,dim/4)
  tick.x = dim + width*nodeIndex
  tick.y = 2.875*dim
  return tick
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
  for (c of [...pinsInPlay,...blocksOnLine,...labelsOnLine,pinWidget,...blocksInWidget]){
      c.interactive = false
  }
}

function unfreezeView(){
  for (c of [...pinsInPlay,...blocksOnLine,...labelsOnLine,pinWidget,...blocksInWidget]){
    if (c.isSet == false){
        c.interactive = true
      }
  }
}



function refreshGame(){
    for (e of [...pinsInPlay,...labelsOnLine]){
      e.onLine = false
    }
    firstTry = false
}

function getMaxLabelX(lbls){
  let maxLabel;
  let val = 0
  for (let i = 0;i<lbls.length;i++){
    let curr = lbls[i]
    let currVal = curr._n/curr._d
    if (currVal > val) {
      val = currVal
      maxLabel = curr
    }
  }
  return maxLabel.x
}


function checkAnswer() {

console.log("Active Pins",pinsInPlay.length)

  if (this.checkAnswer) {

    let validSetting = true

    for (e of [...pinsInPlay,...labelsOnLine]){
      if (!e.onLine){
          validSetting = false
      }
    }

    for (b of blocksOnLine){
      numberline.stage.removeChild(b)
    }
    blocksOnLine = []

    // Compute the "min step"
    if (firstTry && !currentProblem.unique) {
      let maxlblX = getMaxLabelX(labelsOnLine)
      minStep = (maxlblX-dim)/currentProblem.partitionsPerLine
    } else if (currentProblem.labels.length == 0) {
       minStep = 10*dim/currentProblem.partitionsPerLine
    }
    // Generate Feed Blocks Here
    feedBlocks = currentProblem.pinKeys.map((k)=>{return createFeedBlock(minStep,1,currentProblem.partitionsPerWhole,true)} )

    feedBlocks.map(b => {
      b.x = -b.width
      b.y = 3*dim
      numberline.stage.addChild(b)})

    if (validSetting){
      freezeView()
      animateFeedBack([...feedBlocks],[dim,2.7*dim],[...pinsInPlay],[...labelsOnLine],0)
      this.checkAnswer = false
      for (b of blocksOnLine){
        //numberline.stage.removeChild(b)
      }
    } else {
      dropNotification("Make sure to set all the pins!")
    }
  } else {
    unfreezeView()
    this.checkAnswer = true
    this.text.text = "Go"
    for (b of feedBlocks){
      b.x = -b.width
      b.y = 3*dim
    }
  }
}

let goButton = createActionButton("Go",checkAnswer)
goButton.static = false
numberline.stage.addChild(goButton)


function loadProblem(problem) {

  currentProblem = problem
  lineMax = problem.max
  wholeWidth = lineWidth/lineMax
  minStep = lineWidth/problem.partitionsPerLine
  dT = problem.tolerance

  pinsCurrentlySet = problem.presetPinKeys.map((k) => {
    if (k == 1){
      return true
    } else if (k == 0){
      return false
    }
  })

  if (!currentProblem.pinWidget){
    pinsInPlay = problem.pinKeys.map((e,i) => {
      let p = createPin()
      if (e != 0){
        p.on('pointerdown',onPinDragStart)
        .on('pointermove',onPinDragMove)
        .on('pointerup',onPinDragEnd)
        p.x = dim+1.2*p.width*i
        p.y = 1.5*dim
        p.isSet = false
        p.mutable = false
        p.static = false
      } else if (e == 0){
        // "Dummy Pins"
        p.isSet = true
        p.alpha = 0
        p.x = dim + lineWidth/problem.partitionsPerLine*i
        p.y = 2.5*dim
        p.onLine = true
        p.static = true
        p.interactive = false
      }
        numberline.stage.addChild(p)
        p.originalLocation = [p.x,p.y]

    return p
  })

  globalPinRef = pinsInPlay

  pinsInPlay = pinsInPlay.filter(p => p.onLine == false)

}

if (problem.presetLabels.length != 0){
  presetLabels = problem.presetLabels.map((e) => {return createFractionLbl(e)})
  presetLabels.map(l => {
    l.x = dim + wholeWidth*l._n/l._d
    l.y = 3*dim
    flipLbl(l)
    l.static = true
    numberline.stage.addChild(l)
  })
}

if (currentProblem.pinWidget) {
    createPinWidget()
}

presetPins = problem.presetPinKeys.map((e,i) => {
  if (e == 1){
      let p = createStaticPin()
      p.x = dim + lineWidth/problem.partitionsPerLine*i
      p.y = 2.5*dim
      numberline.stage.addChild(p)
      return p
    } else {
      expectedPins += 1
    }
  })

  if (currentProblem.numberOfTicks != 0){
    setTicks(currentProblem.numberOfTicks)
  }

  // HELLO! This is empty when
  if (problem.labels.length != 0){
    labelsOnLine = problem.labels.map((e) => {return createFractionLbl(e)})
  } else {
    labelsOnLine = []
    globalLabelRef = []
  }

  labelsOnLine.map((c,i) => {
    c.on('pointerdown',onLblDragStart)
      .on('pointermove',onLblDragMove)
      .on('pointerup',onLblDragEnd)

    numberline.stage.addChild(c)
    flipLbl(c)

   globalLabelRef = labelsOnLine

    c.x = dim+1.2*c.width*i
    c.y = 3.75*dim
    c.originalLocation = [c.x,c.y]
    c.expectedLocation = dim + wholeWidth*c._n/c._d


  })

  /*
  if (currentProblem.endPins) {
    console.log("setting end Pins")
    let first = createStaticPin()
    let second = createStaticPin()
    first.x = dim
    first.y = 2.5*dim
    second.x = 11*dim
    second.y = 2.5*dim
    numberline.stage.addChild(first)
    numberline.stage.addChild(second)
  }
  */

  createBlockWidget(problem.blocks,wholeWidth)

  console.log("PINS AFTER SETUP",pinsInPlay)

}

loadProblem(PROBLEM_QUE[0])

let t = createTick(4)
//numberline.stage.addChild(t)

//numberline.renderer.interactive = true
backGround.on('pointerup',globalPointerUp)

function globalPointerUp() {
  activeEntity.dragging = false
  activeEntity.alpha = 1
  if (activeEntity.x+activeEntity.width/2 < dim && activeEntity.mutable == true){
    if (activeEntity.isFeedBlock){
      let i = blocksOnLine.indexOf(activeEntity)
      blocksOnLine.splice(i,1)
    }
    if (activeEntity.isPin){

      let i = pinsInPlay.indexOf(activeEntity)
      pinsInPlay.splice(i,1)
    }
    numberline.stage.removeChild(activeEntity)
  }
}

function getNearestObject(pins,location){
  let closestPin = null

  if (pins.length != 0){
  closestPin = pins[0]

  let deltaClosestPin = Math.abs(closestPin.x - location[0])

  for (let i = 1;i<pins.length;i++){
    let currentPin = pins[i]
    let deltaCurrentPin = Math.abs(currentPin.x -location[0])

    if (deltaCurrentPin < deltaClosestPin){
      deltaClosestPin = deltaCurrentPin
      closestPin = currentPin
    }
  }
  }

  return closestPin
}

// This should be load next problem
function loadNextGame(nextGame){
  PROBLEM_INDEX += 1
  let nextProblem = PROBLEM_QUE[PROBLEM_INDEX%numberOfProblems]
  goButton.text.text = "Go"
  goButton.checkAnswer = true
  firstTry = true
  console.log("pins at the end of game",pinsInPlay)
  console.log("labels at the end of the game",labelsOnLine)
  pinsInPlay = []
  labelsOnLine = []
  pinsCurrentlySet = []

  for (p of presetLabels){
    numberline.stage.removeChild(p)
  }
  for (p of globalPinRef){
    numberline.stage.removeChild(p)
  }
  for (t of ticksOnLine){
    numberline.stage.removeChild(t)
  }
  for (b of feedBlocks){
    numberline.stage.removeChild(b)
  }
  for (b of blocksOnLine){
    numberline.stage.removeChild(b)
  }
  for (l of globalLabelRef){
    numberline.stage.removeChild(l)
  }
  for (p of presetPins){
    numberline.stage.removeChild(p)
  }

  numberline.stage.removeChild(pinWidget)

  presetPins = []
  feedBlocks = []
  ticksOnLine = []
  blocksOnLine = []
  globalLabelRef = []
  globalPinRef = []

  loadProblem(nextProblem)
}



function animateFeedBack(blocks,start,pins,labels,i){
  console.log("pins length",pins.length)
  console.log("labels length",labels.length)
  //console.log("nodes.length",nodes.length)
  console.log("IIIIIII",i)
  // Loop end criteria is based on the feedBlocks
  if (blocks.length == 0){
    // Check answer criteria is going to change.
    // Make sure all necessary pins are set:
    let allPinsSet = true
    for (b of pinsCurrentlySet){
        if (!b){
          allPinsSet = false
        }
    }
    console.log('pinsCurrentlySet',pinsCurrentlySet)
    console.log('pins.length',pins.length)
    console.log('labels.length',labels.length)
    // No leftover pins, no leftover labels, all required pins are set
    if (pins.length == 0 && labels.length == 0 && allPinsSet){
      dropGameOverModal(loadNextGame)
      // Drop next game modal here
    }
      for (p of pins) {
        if (!currentProblem.pinWidget){
          createjs.Tween.get(p).to({x: p.originalLocation[0],y: p.originalLocation[1]}, 500, createjs.Ease.getPowInOut(4))
        }
      }

      if (pins.length != 0) {
          dropNotification("Check Your Pins!")
        }

      for (l of labels){
          createjs.Tween.get(l).to({x: l.originalLocation[0],y: l.originalLocation[1]}, 500, createjs.Ease.getPowInOut(4))
      }

    labelsOnLine = labels
    pinsInPlay = pins
    goButton.text.text = "Try Again"
    refreshGame()
    return
  }
  else {
      console.log("blocks.length",blocks.length)
      let b = blocks.pop()
      let newStart = [start[0]+b.width,start[1]]
      //
      let animateTo = i == 0 ? [b.x,b.y] : [(i-1)*minStep + dim,start[1]]
      createjs.Tween.get(b).to({x: animateTo[0],y: animateTo[1]}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
      // HELLO! The nearest pin needs to also be on the line - maybe have boolean "on the line" property

      let nearestPin = getNearestObject(pins,start)
      console.log("nearestPin",nearestPin)

      // Label Logic
      let setLabel = false
      let nearestLabel = null

      for (l of labels) {
        let expectedLocation = l._n/l._d*minStep*currentProblem.partitionsPerWhole+dim
        console.log("start[0],expectedLocation",start[0],expectedLocation)
          if (Math.abs(start[0] - expectedLocation) < dT*minStep && Math.abs(l.x - expectedLocation) < dT*minStep){
            setLabel = true
            nearestLabel = l
            l.isSet = true
            l.interactive = false
            removeElement(l,labels)
          }
      }
      //console.log("Math.abs(nearestPin.x - start[0]) < dT*minStep",Math.abs(nearestPin.x - start[0]) < dT*minStep)
      //console.log("nearestPin.x",nearestPin.x)
      //console.log("start[0]",start[0])
      //console.log("nodes[i]=false",nodes[i] == false )

      let setPin = nearestPin && Math.abs(nearestPin.x - start[0]) < dT*minStep && pinsCurrentlySet[i] == false ? true : false

      console.log("SET PIN",setPin)
      if (setPin) {
        console.log("REMOVING PIN")
        pinsCurrentlySet[i] = true
        nearestPin.circleSprite.texture = numberline.renderer.generateTexture(blueCircle)
        nearestPin.draggable = false
        removeElement(nearestPin,pins)
      }

    if (setPin && setLabel) {
      createjs.Tween.get(nearestPin).to({x: animateTo[0]+minStep,y: 2.5*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
      createjs.Tween.get(nearestLabel).to({x: animateTo[0]+minStep,y: 3*dim},500,createjs.Ease.getPowInOut(4)).call(() => {
            nearestPin.set = true
            nearestLabel.set = true
            i += 1
            nearestPin.isSet = true
            animateFeedBack(blocks,newStart,pins,labels,i)
        })
      })
    } else if (setPin){
      createjs.Tween.get(nearestPin).to({x: animateTo[0]+minStep,y: 2.5*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
            nearestPin.isSet = true
            i += 1
            animateFeedBack(blocks,newStart,pins,labels,i)
      })
    } else if (setLabel) {
      createjs.Tween.get(nearestLabel).to({x: animateTo[0]+minStep,y: 3*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
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
    block.isSet = false
    block.on('pointerdown',onBlockWidgetSelected)
    blocksInWidget.push(block)
    numberline.stage.addChild(block)
  }
}


// Do I need to pass this the Numberline max so I can calculate the block
// width based on the fraction is supposed to represent.

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

function createFeedBlock(width,num,den,label) {

  let blockContainer = new PIXI.Container()
  var block = new PIXI.Graphics();
  block.beginFill(COLORS.BLUE);
  block.drawRoundedRect(0, 0, width+0.5, dim/4,5);
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
  blockContainer.static = false
  blockContainer.isFeedBlock = true

  return blockContainer
}


function createStaticPin() {

    let h = 1/2*dim
    let w = dim/4

    var circleTexture = numberline.renderer.generateTexture(blueCircle);
    let circleSprite = new PIXI.Sprite(circleTexture)
    circleSprite.alpha = 0.5
    circleSprite.anchor.set(0.5)

    var stem = new PIXI.Graphics();
    stem.lineStyle(2, 0x000000, 10)
    stem.moveTo(0,dim/5)
    stem.lineTo(0,dim/2)

    let pinContainer = new PIXI.Container()
    pinContainer.addChild(circleSprite)
    pinContainer.addChild(stem)

    pinContainer.active = false
    pinContainer.interactive = false;
    pinContainer.mutable = false

    pinContainer.x = 0
    pinContainer.y = 0
    pinContainer.draggable = true
    pinContainer.onLine = true
    pinContainer.isPin = true
    pinContainer.static = true
    pinContainer.circleSprite = circleSprite

    return pinContainer
}

function createPin() {

    let h = 1/2*dim
    let w = dim/4

    var circle = new PIXI.Graphics();
    circle.lineStyle(2, 0x000000, 2)
    circle.beginFill(0xFFFFFF);
    // why dim/5? - cause that's what I decided.
    circle.drawCircle(dim/5+1, dim/5+1,dim/5);
    circle.endFill();

    let circleTexture = numberline.renderer.generateTexture(circle);
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
    pinContainer.isPin = true
    pinContainer.mutable = true
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
    tileContainer.isSet = false
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
    if (areAllPinsSet(pinsInPlay)){
      pinsOffLineCount = 0
    }
}






function onPinDragEnd()
{
    this.alpha = 1;

    if (this.x+this.width/2 < dim && this.mutable == true){
        let i = pinsInPlay.indexOf(this)
        pinsInPlay.splice(i,1)
        numberline.stage.removeChild(this)
    }

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
