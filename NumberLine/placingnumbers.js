// Problem que setup
let PROBLEM_QUE;
const ACTIVITY_ID = window.localStorage['activityIndex']
PROBLEM_QUE = NUMBERLINE_ACTIVITIES[ACTIVITY_ID]
let numberOfProblems = PROBLEM_QUE.length
let PROBLEM_INDEX = 0

let backDrop = new PIXI.Sprite.from('../images/blue-gradient.png')
backDrop.width = WINDOW_WIDTH
backDrop.height = WINDOW_HEIGHT
backDrop.x = 0
backDrop.y = 0
backDrop.alpha = 0
numberline.stage.addChild(backDrop)
createjs.Tween.get(backDrop).to({alpha: 1}, 500, createjs.Ease.getPowInOut(4))


let backGround = new PIXI.Sprite.from('../images/blue-gradient.png')
backGround.width = WINDOW_WIDTH
backGround.height = WINDOW_HEIGHT
backGround.interactive = true
backGround.static = false
numberline.stage.addChild(backGround)
createjs.Tween.get(backGround).to({alpha: 1}, 500, createjs.Ease.getPowInOut(4))

// CONSTANTS

const dim = window.innerWidth/12
const centerLine = window.innerHeight/2
const lineWidth = 10*dim
const topMargin = 3/4*dim


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
let feedBackLabels = []

let blocksInWidget = []

let firstTry = true
let pinWidget = {}

let activeEntity = new PIXI.Sprite()

let pinkCircleTexture = numberline.renderer.generateTexture(pinkCircle)

let lineMax; // Max value of the line
let wholeWidth; // physical width of "one whole" on the number line
let minStep; // Minmum block width for measuring or placing pins/labels
let originalMinStep;
let currentProblem;
let dT;

// So i don't lose a reference to this shit when I'm resetting the game
let globalPinRef = []
let globalLabelRef = []

let activityQue



function createPrompt(prompt){
  let note = new PIXI.Container()
  var graphics = new PIXI.Graphics();
  graphics.lineStyle(0, 0x000000, 3)
  graphics.drawRoundedRect(0, 0,10*dim,0.9*topMargin ,5);
  graphics.endFill();

    var texture = numberline.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    tile.anchor.set(0.5)

    let promptLength = prompt.length
    console.log("promptLength",promptLength)
    let textSize = promptLength*0.5*topMargin > 10*dim ? 20*dim/(promptLength) : 0.5*topMargin

    let den = new PIXI.Text(prompt,{fontFamily : 'Chalkboard SE', fontSize: textSize, fill : 0x000000, align : 'center'});
    den.anchor.set(0.5)

    let tileContainer = new PIXI.Container()

    tileContainer.addChild(tile)
    tileContainer.addChild(den)

    tileContainer.active = false
    tileContainer.interactive = true;
    tileContainer.buttonMode = true;
    tileContainer.x = windowWidth/2
    tileContainer.y = -2*dx

    tileContainer.tile = tile

    return tileContainer
}

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

function createFeedBackLbl(labels){
  return labels.map((l)=> {
      let t = new PIXI.Text(l._n + "/" + l._d,{fontFamily : 'Chalkboard SE', fontSize: dx/2, fill : 0x000000, align : 'center'});
      t.anchor.set(0.5)
      numberline.stage.addChild(t)
      console.log("min Step, original originalMinStep",minStep,originalMinStep)
      t.x = dim + (l.expectedLocation-dim)*minStep/originalMinStep
      l.expectedLocation = t.x
      t.y = 3.2*dim
      return t
    })
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
  p.x = 11*dim
  p.y = 4*dim
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
  p.x = 11*dim
  p.y = 4*dim
  createjs.Tween.get(p).to({x: 11*dim-1.1*p.width*pinsOffLineCount,y: 4*dim}, 500, createjs.Ease.getPowInOut(4))
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
  tick.lineStyle(3, 0x000000, 1)
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
  graphics.drawRoundedRect(0, 0,2*dim,0.5*dim ,5);
  graphics.endFill();

    var texture = numberline.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    tile.anchor.set(0.5)

    let den = new PIXI.Text(text,{fontFamily : 'Chalkboard SE', fontSize: dim/4, fill : 0xFFFFFF, align : 'center'});
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
    tileContainer.y = topMargin + tileContainer.height/2
    tileContainer.checkAnswer = true
    tileContainer.text = den

    tileContainer.tile = tile
    return tileContainer
}

function freezeView(){
  for (c of [...pinsInPlay,...blocksOnLine,...labelsOnLine,pinWidget,...blocksInWidget]){
      c.interactive = false
  }
  goButton.interactive = false
}

function unfreezeView(){
  for (c of [...pinsInPlay,...blocksOnLine,...labelsOnLine,pinWidget,...blocksInWidget,goButton]){
    if (c.isSet == false){
        c.interactive = true
      }
  }
  goButton.interactive = true
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

if (this.text.text == "Next Problem"){
  if (PROBLEM_INDEX+1 >= PROBLEM_QUE.length){
      dropGameOverModal(()=>{window.history.back()})
  } else {
      loadNextGame()
  }
  return
}

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
    if (!currentProblem.unique) {
      // Need to update this so that the "feedback labels "expectedLocation"
      // gets updated dynamically
      if (firstTry){
        let maxlblX = getMaxLabelX(labelsOnLine)
        minStep = (maxlblX-dim)/currentProblem.partitionsPerLine
        labelsOnLine.forEach(l=>{l.expectedLocation = (l.expectedLocation-dim)*minStep/originalMinStep+dim})
      }
    } else if (currentProblem.labels.length == 0) {
       minStep = 10*dim/currentProblem.partitionsPerLine
    }
    // Generate Feed Blocks Here
    let label = currentProblem.noFeedBlockLabel ? false : true
    feedBlocks = currentProblem.pinKeys.map((k)=>{return createFeedBlock(minStep,1,currentProblem.partitionsPerWhole,label)} )
    //feedBackLabels = createFeedBackLbl(labelsOnLine)


    // feed labels
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
      dropNotification("Make sure everything is in place.")
    }
  } else {
    this.checkAnswer = true
    this.text.text = "Go"
    unfreezeView()
    if (currentProblem.dontReset){
      for (b of feedBlocks){
        b.x = -b.width
        b.y = 3*dim
      }
    } else {
       resetGame()
    }
  }
}

let goButton = createActionButton("Go",checkAnswer)
goButton.static = false

numberline.stage.addChild(goButton)

let resetButton = createActionButton("Reset Problem",resetGame)

function resetGame() {
  PROBLEM_INDEX = PROBLEM_INDEX - 1
  loadNextGame()
}

// numberline.stage.addChild(resetButton)

resetButton.y = resetButton.y + 1.2*resetButton.height



function loadProblem(problem) {

  currentProblem = problem
  lineMax = problem.max
  wholeWidth = lineWidth/lineMax
  minStep = lineWidth/problem.partitionsPerLine
  originalMinStep = minStep
  dT = problem.tolerance

  /* Preset pin keys - equal to one if the pin is set, equal
  to zero if the pin is not yet set */
  pinsCurrentlySet = problem.presetPinKeys.map((k) => {
    if (k == 1 || currentProblem.dontScorePins){
      return true
    } else if (k == 0){
      return false
    }
  })

  console.log("pinsCurrentlyset",pinsCurrentlySet)

  if (!currentProblem.pinWidget){
    pinsInPlay = problem.pinKeys.map((e,i) => {
      let p = createPin()
      if (e != 0){
        p.on('pointerdown',onPinDragStart)
        .on('pointermove',onPinDragMove)
        .on('pointerup',onPinDragEnd)
        p.x = 11*dim-1.2*p.width*i
        p.y = 4*dim
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
  pinsInPlay.forEach((p,i)=>{
          p.x = 11*dim-1.2*p.width*i
          p.y = 4*dim})


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

  //dropNotification(currentProblem.prompt)

  let prompt = createPrompt(currentProblem.prompt)
  numberline.stage.addChild(prompt)
  prompt.x = windowWidth/2
  prompt.y = topMargin/2

}

//dropNotification("Check Your Pins!")


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
function loadNextGame(){
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

  for (l of feedBackLabels){
    numberline.stage.removeChild(l)
  }
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
  feedBackLabels = []
  ticksOnLine = []
  blocksOnLine = []
  globalLabelRef = []
  globalPinRef = []

  loadProblem(nextProblem)
}

function itemsLessThan(x,items){
  let itemsLess = []
  if (items.length != 0){
  for (l of items){
    console.log("in loop")
      if (l.x < x && l.onLine == true){
        console.log("pushing")
        itemsLess.push(l)
      }
    }
  }
  return itemsLess
}

function animateFeedBack(blocks,start,pins,labels,i){

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

    if (currentProblem.pinWidget){
      allPinsSet = true
    }

    // No leftover pins, no leftover labels, all required pins are set
    if ((pins.length == 0 || currentProblem.dontScorePins || currentProblem.pinWidget) && labels.length == 0 && allPinsSet){
      console.log("HELLO THE FUCKING GAME IS OVER!!!!!")
      goButton.interactive = true
      goButton.text.text = "Next Problem"
      //dropGameOverModal(loadNextGame)
      return
    } else {
      for (p of pins) {
        if (!currentProblem.pinWidget){
          createjs.Tween.get(p).to({x: p.originalLocation[0],y: p.originalLocation[1]}, 500, createjs.Ease.getPowInOut(4))
        }
      }

      if (pins.length != 0) {
          //dropNotification("Check Your Pins!")
        }

    console.log("labels count",labels.length)
    //eatLeftovers(labels,()=>{})

    labelsOnLine = labels
    pinsInPlay = pins
    goButton.text.text = "Try Again"
    goButton.interactive = true
    refreshGame()
    return
  }
  }
  else {
      let b = blocks.pop()
      let newStart = [start[0]+b.width,start[1]]
      //
      let animateTo = i == 0 ? [b.x,b.y] : [(i-1)*minStep + dim,start[1]]
      createjs.Tween.get(b).to({x: animateTo[0],y: animateTo[1]}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
      // HELLO! The nearest pin needs to also be on the line - maybe have boolean "on the line" property

      let nearestPin = getNearestObject(pins,start)

      // Label Logic
      let setLabel = false
      let nearestLabel = null

      for (l of labels) {
        let expectedLocation = l._n/l._d*minStep*currentProblem.partitionsPerWhole+dim
          if (Math.abs(start[0] - expectedLocation) < dT*minStep && Math.abs(l.x - expectedLocation) < dT*minStep){
            setLabel = true
            nearestLabel = l
            l.isSet = true
            l.interactive = false
            removeElement(l,labels)
          }
      }

    let leftoverLabels = itemsLessThan(start[0],labels)
    let setPin = nearestPin && Math.abs(nearestPin.x - start[0]) < dT*minStep && pinsCurrentlySet[i] == false ? true : false

    if (setPin) {
      pinsCurrentlySet[i] = true
      nearestPin.circleSprite.texture = numberline.renderer.generateTexture(blueCircle)
      nearestPin.draggable = false
      removeElement(nearestPin,pins)
    }

    if (setPin && setLabel) {
      console.log("HOLY SHIT SETTING LABEL AND PIN WTF WTF WTF")

      createjs.Tween.get(nearestPin).to({x: animateTo[0]+minStep,y: 2.5*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
      createjs.Tween.get(nearestLabel).to({x: animateTo[0]+minStep,y: 3*dim},500,createjs.Ease.getPowInOut(4)).call(() => {
            i += 1
            nearestPin.isSet = true

      if (leftoverLabels.length != 0){
        eatLeftovers(leftoverLabels,() => {animateFeedBack(blocks,newStart,pins,labels,i)} )
      } else {
        animateFeedBack(blocks,newStart,pins,labels,i)
      }

        })
      })
    } else if (setPin){
      createjs.Tween.get(nearestPin).to({x: animateTo[0]+minStep,y: 2.5*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
            console.log("JUST SETTING PIN")
            nearestPin.isSet = true
            i += 1
            if (leftoverLabels.length != 0){
              eatLeftovers(leftoverLabels,() => {animateFeedBack(blocks,newStart,pins,labels,i)} )
            } else {
              animateFeedBack(blocks,newStart,pins,labels,i)
            }
      })
    } else if (setLabel) {
      createjs.Tween.get(nearestLabel).to({x: animateTo[0]+minStep,y: 3*dim}, 500, createjs.Ease.getPowInOut(4)).call(() => {
          i += 1
          if (leftoverLabels.length != 0){
            eatLeftovers(leftoverLabels,() => {animateFeedBack(blocks,newStart,pins,labels,i)} )
          } else {
            animateFeedBack(blocks,newStart,pins,labels,i)
          }
      })
    } else {
        i += 1
        if (leftoverLabels.length != 0){
          eatLeftovers(leftoverLabels,() => {animateFeedBack(blocks,newStart,pins,labels,i)} )
        } else {
          animateFeedBack(blocks,newStart,pins,labels,i)
        }
    }
    })
  }
}

function eatLeftovers(leftovers,dessert){
  if (leftovers.length == 0){
     dessert()
     return
  } else {
    let curr = leftovers.pop()
    let customFeedBlockWidth = curr.expectedLocation-dim

    let customFeedBlock = createFeedBlock(customFeedBlockWidth,curr._n,curr._d,true,true)

    customFeedBlock.x = dim
    customFeedBlock.y = 2.7*dim
    customFeedBlock.alpha = 0

    numberline.stage.addChild(customFeedBlock)

    createjs.Tween.get(curr).to({x: curr.originalLocation[0],y: curr.originalLocation[1]},1000,createjs.Ease.getPowInOut(4)).call(()=>{
      curr.onLine = false
      numberline.stage.removeChild(customFeedBlock)
      eatLeftovers(leftovers,dessert)
    })
  }
}


function createBlockWidget(blocks,wholeWidth) {
  for (let i = 0;i<blocks.length;i++){
    let block = new PIXI.Graphics();
    block.beginFill(COLORS.BLUE);
    block.drawRoundedRect(dim, topMargin+i*3*dim/8,wholeWidth/blocks[i].den*blocks[i].num, dim/4,5);
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

function createFeedBlock(width,num,den,label,custom) {

  let blockContainer = new PIXI.Container()
  var block = new PIXI.Graphics();
  let blockFill = custom ? 0xFFFFFF : COLORS.BLUE
  block.beginFill(blockFill);
  let lineWidth = custom ? 1: 0
  block.lineStyle(lineWidth,0x000000,1)
  block.drawRoundedRect(0, 0, width+0.5, dim/4,5);
  block.endFill();
  let blockTexture = numberline.renderer.generateTexture(block)
  let blockSprite = new PIXI.Sprite(blockTexture)
  let alpha = custom ? 1 : 0.7
  blockSprite.alpha = alpha
  blockContainer.addChild(blockSprite)
  blockContainer.hitSpot = blockSprite

  let textFill = custom ? 0x000000 : 0xFFFFFF
  let text = new PIXI.Text(num+'/'+den,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : textFill, align : 'center'});
  text.anchor.set(0.5)
  text.x = width/2
  text.y = dim/8

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
    circle.lineStyle(2, 0x000000)
    circle.beginFill(0xFFFFFF);
    // why dim/5? - cause that's what I decided.
    circle.drawCircle(dim/5, dim/5,dim/5);
    circle.endFill();
    circle.x = 0.5
    circle.y = 0.5

    let circleTexture = numberline.renderer.generateTexture(circle);
    let circleSprite = new PIXI.Sprite(circleTexture)
    circleSprite.alpha = 0.5
    circleSprite.anchor.set(0.5)
    //circleSprite.texture = pinkCircleTexture

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
    let textSize = 0.7*w


    var block = new PIXI.Graphics();
    block.lineStyle(2,0x000000)
    block.beginFill(0xFFFFFF);
    block.drawRoundedRect(0, 0, w, h,3);
    block.endFill();
    block.x = 1
    block.y = 1

    var blockTexture = numberline.renderer.generateTexture(block);
    let tile = new PIXI.Sprite(blockTexture)
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
      num = new PIXI.Text(n,{fontFamily : 'Chalkboard SE', fontSize: textSize, fill : 0x000000, align : 'center'});
      num.anchor.set(0.5)
      num.y = -h/5
      den = new PIXI.Text(d,{fontFamily : 'Chalkboard SE', fontSize: textSize, fill : 0x000000, align : 'center'});
      den.anchor.set(0.5)
      den.y = h/5
    } else {
      l = new PIXI.Graphics();
      l.lineStyle(2, 0x000000, 2)
      l.moveTo(0,dim/8)
      l.lineTo(0,dim/2)
      num = new PIXI.Text(n,{fontFamily : 'Chalkboard SE', fontSize: textSize, fill : 0x000000, align : 'center'});
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
  line.lineStyle(4, 0x000000, 1);
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

/*
    if (event.keyCode == 40 && activeEntity.scale.y == 1) {
      event.preventDefault()
      flipLbl(activeEntity)
    }

    if (event.keyCode == 38 && activeEntity.scale.y == -1) {
      event.preventDefault()
      flipLbl(activeEntity)
    }
*/

})
