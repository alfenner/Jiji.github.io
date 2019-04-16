
// Constants
const DIM = WINDOW_WIDTH/15
const JIJI_SPEED = 0.2
const CONT_BORD = DIM/10
const LINE_WIDTH = 5 // Should be some fraction of DIM or window
const WINDOW_CENTER_X = WINDOW_WIDTH/2
const TOP_MARGIN = DIM/2
const CONTAINER_HEIGHT = 3*DIM+4
const CONTAINER_WIDTH = 3*DIM+4
const LEFT_CONTAINER_CENTER_X = WINDOW_WIDTH/3
const RIGHT_CONTAINER_CENTER_X = WINDOW_WIDTH/3*2
const CONTAINER_CENTER_Y = 2/3*WINDOW_HEIGHT
const CONTAINER_BOTTOM = CONTAINER_CENTER_Y+CONTAINER_HEIGHT/2
const CONTAINER_TOP = CONTAINER_CENTER_Y-CONTAINER_HEIGHT/2
const CENTER_CONTAINER_X = WINDOW_WIDTH/2
const FRACTION_CENTER = [1/2*WINDOW_WIDTH,1/4*WINDOW_HEIGHT]
const FRACT_DIM = [DIM,2*DIM]
const GO_BUTTON_CENTER = [DIM,TOP_MARGIN]
const TOLERANCE = 0.01*CONTAINER_HEIGHT
const DELTA_BRIDGE = LEFT_CONTAINER_CENTER_X+0.7*CONTAINER_WIDTH - (RIGHT_CONTAINER_CENTER_X-0.7*CONTAINER_WIDTH)
const BRIDGE_LENGTH = Math.sqrt(TOLERANCE*TOLERANCE+DELTA_BRIDGE*DELTA_BRIDGE)+LINE_WIDTH/2
const ESTIMATING = window.localStorage['mc'] == 'true' ? true : false
const ORIGINAL_WATER_LOCATION = [LEFT_CONTAINER_CENTER_X+CONTAINER_WIDTH/2,2/3*WINDOW_HEIGHT+CONTAINER_HEIGHT/2]
const ORIGINAL_CONTAINER_LOCATION = [CENTER_CONTAINER_X,2/3*WINDOW_HEIGHT]
const WATER_CENTER = CENTER_CONTAINER_X+CONTAINER_WIDTH/2-CONT_BORD/2
const WATER_LEFT = LEFT_CONTAINER_CENTER_X + 3*DIM/2 - CONT_BORD/2

// COMPUTED CONSTANTS
const correct_ans_y = () => {
  if (ESTIMATING){
    return CONTAINER_BOTTOM - CONTAINER_HEIGHT*submittedMCAnswer[0]/submittedMCAnswer[1]
  } else {
    return CONTAINER_BOTTOM - CONTAINER_HEIGHT*currentProblem.num/currentProblem.den
  }

}

const SUBMITTED_ANS_Y = () => {
  if (ESTIMATING){
    console.log("calling submitted answer y")
    return CONTAINER_BOTTOM-water.height
  } else {
    return slider.y + slider.height/2
  }
}

const BRIDGE_START_CORDS = () => {
  let x = LEFT_CONTAINER_CENTER_X+0.7*CONTAINER_WIDTH
  let y = SUBMITTED_ANS_Y()
  return [x,y]
}

const BRIDGE_END_CORDS = () => {
  let x = RIGHT_CONTAINER_CENTER_X-0.7*CONTAINER_WIDTH
  let y = correct_ans_y()
  return [x,y]
}

const JIJI_START_CORDS = () => {
  let y = SUBMITTED_ANS_Y()
  let x = 0.1*WINDOW_WIDTH
  return [x,y]
}

const JIJI_END_CORDS = () => {
  let y = correct_ans_y()
  let x = WINDOW_WIDTH*1.1
  return [x,y]
}

const CHECK_ANSWER = () => {
  if (!ESTIMATING){
   let tolerance = Math.abs(CONTAINER_HEIGHT)*0.075
   let difference = Math.abs(BRIDGE_START_CORDS()[1]-BRIDGE_END_CORDS()[1])
   return difference < tolerance ? true : false
 }
  else {
    return submittedMCAnswer[0] == currentProblem.num && submittedMCAnswer[1] == currentProblem.den
  }
}

// Problem Sets
let activityIndex = window.localStorage['estActivityIndex']
let activityObj = PROBLEM_SETS[activityIndex]
let problemSet = activityObj.problems
let problemCount = problemSet.length
let problemIndex = 0
let currentProblem = problemSet[problemIndex%problemCount]


// Where the fricks come from - why is this in function case?
let num_cords;
let den_cords;

// State
let feedBlocks = []
let feedFricks = []
let frameBlocks = []
let frameFricks = []
let walkWayRef = []
let multipleChoices = []
let submittedAnswer = []
let submittedMCAnswer = []


// Background
let backGround = new PIXI.Graphics()
backGround.beginFill(0xFFFFFF)
backGround.drawRoundedRect(0,0,windowWidth,windowHeight)
backGround.endFill()
backGround.interactive = true
backGround.static = false
app.stage.addChild(backGround)
backGround.on('pointerup',()=> {slider.dragging = false})


// Initializations


let frac = createFraction(currentProblem.num,currentProblem.den)
app.stage.addChild(frac)
frac.x = FRACTION_CENTER[0]
frac.y = FRACTION_CENTER[1]
num_cords = [FRACTION_CENTER[0],FRACTION_CENTER[1]-5/4*frac.width]
den_cords = [FRACTION_CENTER[0],FRACTION_CENTER[1]-frac.width/4]


let adjustableContainer = createContainer(3*DIM)
app.stage.addChild(adjustableContainer)
adjustableContainer.x = LEFT_CONTAINER_CENTER_X
adjustableContainer.y = 2/3*WINDOW_HEIGHT

let slider = createSlider(DIM)
app.stage.addChild(slider)
slider.on('pointerdown',onSliderStart)
slider.on('pointerup',onSliderEnd)
slider.on('pointermove',onSliderMove)
slider.x = adjustableContainer.x+adjustableContainer.width/2
slider.y = CONTAINER_BOTTOM-slider.height/2


let water = createWater()
app.stage.addChild(water)
water.y = CONTAINER_BOTTOM - CONT_BORD/2
water.x = adjustableContainer.x+3*DIM/2
water.height = 0
water.width = 3*DIM - CONT_BORD/2


let feedBackContainer = createContainer(3*DIM)
app.stage.addChild(feedBackContainer)
feedBackContainer.x = RIGHT_CONTAINER_CENTER_X
feedBackContainer.y = 2/3*WINDOW_HEIGHT
feedBackContainer.alpha = 0

let actionButton = createActionButton("Go",submitAnswer)
app.stage.addChild(actionButton)
actionButton.x = GO_BUTTON_CENTER[0]
actionButton.y = GO_BUTTON_CENTER[1]
app.stage.addChild(adjustableContainer)


if (ESTIMATING){
  console.log("MC MODE")
  queMultipleChoiceFormat()
  layoutChoices()
  frac.alpha = 0
  actionButton.alpha = 0
  actionButton.interactive = false
}

// FUNCTIONS
function queMultipleChoiceFormat(){
  adjustableContainer.x = WINDOW_CENTER_X
  slider.x = adjustableContainer.x + adjustableContainer.width/2
  water.x = WATER_CENTER
}

function layoutChoices(){
  console.log("calling layout choices")
  water.height = adjustableContainer.height*currentProblem.num/currentProblem.den
  slider.interactive = false
  slider.alpha = 0
  let answerIndex = currentProblem.answerIndex
  currentProblem.multichoice.forEach((c,i)=>{
    let b = createFraction(c[0],c[1])
    b.num = c[0]
    b.den = c[1]
    b.prompt = c
    if (currentProblem.num == c[0] && currentProblem.den == c[1]){
      b.correct = true
    }
    app.stage.addChild(b)
    console.log("TEXT_TO_FRAC_KEY",TEXT_TO_FRAC_KEY[c])
    b.y = frac.y
    b.x = WINDOW_CENTER_X + 2*b.width*i - 3*b.width
    b.interactive = true
    b.on('pointerdown',checkMCAnswer)
    multipleChoices.push(b)
  })
}

if (activityObj.prompt != null){
  console.log("should drop modal?")
  dropDiscussionModal(activityObj.prompt,()=>{})
}



// Factory functions

function checkMCAnswer(){
  multipleChoices.forEach(c =>{
    if (c == this){
        createjs.Tween.get(c).to({x: frac.x,y: frac.y}, 1000, createjs.Ease.getPowInOut(4))
        createjs.Tween.get(c.border).to({alpha: 0}, 1000, createjs.Ease.getPowInOut(4))
    } else {
        createjs.Tween.get(c).to({alpha: 0}, 500, createjs.Ease.getPowInOut(4))
    }
  })
  if (this.prompt == currentProblem.answer) {
      submittedMCAnswer = [currentProblem.num,currentProblem.den]
      createjs.Tween.get(water).to({x: WATER_LEFT,y: ORIGINAL_WATER_LOCATION[1]}, 1000, createjs.Ease.getPowInOut(4))
      createjs.Tween.get(adjustableContainer).to({x: LEFT_CONTAINER_CENTER_X,y: ORIGINAL_CONTAINER_LOCATION[1]}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{
      animateAnswer(currentProblem.num,currentProblem.den)
    })
  } else {
      submittedMCAnswer = [this.num,this.den]
      createjs.Tween.get(water).to({x: WATER_LEFT,y: ORIGINAL_WATER_LOCATION[1]}, 1000, createjs.Ease.getPowInOut(4))
      createjs.Tween.get(adjustableContainer).to({x: LEFT_CONTAINER_CENTER_X,y: ORIGINAL_CONTAINER_LOCATION[1]}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{
      animateAnswer(this.num,this.den)
    })
  }
}


function createMultipleChoice(text) {

    var block = new PIXI.Graphics();
    block.lineStyle(2,COLORS.DARK_GRAY,2)
    block.beginFill(0xFFFFFF);
    block.drawRoundedRect(1, 1, DIM, DIM/2,5);
    block.endFill();

    let t = new PIXI.Text(text,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
    t.anchor.set(0.5)

    var blockTexture = app.renderer.generateTexture(block);
    let tile = new PIXI.Sprite(blockTexture)
    tile.anchor.set(0.5)

    let blockContainer = new PIXI.Container()

    blockContainer.addChild(tile)
    blockContainer.addChild(t)
    blockContainer.textVal = t

    return blockContainer
}


function submitAnswer(){
  if (actionButton.text.text == "Next" || actionButton.text.text == "Retry" ){
    reset()
  } else {
    animateAnswer(currentProblem.num,currentProblem.den)
  }
}

// FEEDBACK SHIT
function animateTo(obj,loc,callback){
    let x1 = loc[0]
    let y1 = loc[1]
    let x2 = obj.x
    let y2 = obj.y
    let dx = x2-x1
    let dy = y2-y1
    let d = Math.sqrt(dx*dx+dy*dy)
    let t = d/JIJI_SPEED
    createjs.Tween.get(obj).to({x:loc[0],y:loc[1]}, t, createjs.Ease.getPowInOut(1)).call(callback)
}

function animateJiji(){
  let jiji = createJijiAsset(1,2)
  app.stage.addChild(jiji)
  let start = JIJI_START_CORDS()
  jiji.x = start[0]
  jiji.y = start[1]
  //jiji.alpha = 0

  let endSeq = () => {
    setTimeout(()=>{
          createjs.Tween.get(jiji).to({alpha: 0}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{app.stage.removeChild(jiji)})
          createjs.Tween.get(actionButton).to({alpha: 1}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
            if (problemIndex == problemSet.length-1){
              dropDiscussionModal(activityObj.discussion,()=>{})
            }
          })
    },1000)
  }


  let a3 = () => {animateTo(jiji,JIJI_END_CORDS(),endSeq)}
  let a2 = CHECK_ANSWER() ? () => {animateTo(jiji,BRIDGE_END_CORDS(),a3)} : endSeq
  let a1 = () => {animateTo(jiji,BRIDGE_START_CORDS(),a2)}
  a1()
}


function createPlatformLeft(){
  let platformGraphic = new PIXI.Graphics()
  platformGraphic.lineStyle(5,COLORS.DARK_GRAY)
  platformGraphic.moveTo(0,SUBMITTED_ANS_Y())
  platformGraphic.lineTo(BRIDGE_START_CORDS()[0],SUBMITTED_ANS_Y())
  platformGraphic.alpha = 0
  app.stage.addChild(platformGraphic)
  walkWayRef.push(platformGraphic)
  createjs.Tween.get(platformGraphic).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
}

function createPlatformRight(){
  let platformGraphic = new PIXI.Graphics()
  platformGraphic.lineStyle(5,COLORS.DARK_GRAY)
  let y;
  if (ESTIMATING && CHECK_ANSWER()){
    y = SUBMITTED_ANS_Y()
  } else {
    y = correct_ans_y()
  }
  platformGraphic.moveTo(BRIDGE_END_CORDS()[0],y)
  platformGraphic.lineTo(WINDOW_WIDTH,y)
  platformGraphic.alpha = 0
  app.stage.addChild(platformGraphic)
  walkWayRef.push(platformGraphic)
  createjs.Tween.get(platformGraphic).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
}


function animateBridge(startTheBlock){

  let deltaBridge_X = BRIDGE_END_CORDS()[0] - BRIDGE_START_CORDS()[0]
  let correctMCQuestion = CHECK_ANSWER() && ESTIMATING
  let deltaBridge = correctMCQuestion ? 0 : BRIDGE_END_CORDS()[1] - BRIDGE_START_CORDS()[1]
  let theta = Math.PI/2+Math.atan(deltaBridge/deltaBridge_X)

  let start = BRIDGE_START_CORDS()
  let end = BRIDGE_END_CORDS()
  console.log("check answer",CHECK_ANSWER())
  let bridgeGraphic = new PIXI.Graphics()
  let bridgeContainer = new PIXI.Container()
  bridgeContainer.x = BRIDGE_START_CORDS()[0]
  bridgeContainer.y = BRIDGE_START_CORDS()[1]
  if (CHECK_ANSWER()){
    console.log("ANSWER IS FUCKING CORRECT!!!")
    bridgeGraphic.lineStyle(5,COLORS.DARK_GRAY)
    bridgeGraphic.moveTo(0,0)
    bridgeGraphic.lineTo(0,-BRIDGE_LENGTH)
    bridgeGraphic.alpha = 0
    bridgeContainer.addChild(bridgeGraphic)
    app.stage.addChild(bridgeContainer)
    walkWayRef.push(bridgeContainer)
    createjs.Tween.get(bridgeGraphic).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{
      createjs.Tween.get(bridgeGraphic).to({rotation: theta}, 2000, createjs.Ease.getPowInOut(1)).call(()=>{startTheBlock()})
    })
  } else {
    let bridgeGraphic = new PIXI.Graphics()
    bridgeGraphic.lineStyle(5,COLORS.DARK_GRAY)
    let deltaBridge_X = BRIDGE_END_CORDS()[0] - BRIDGE_START_CORDS()[0]
    let deltaBridge = BRIDGE_END_CORDS()[1] - BRIDGE_START_CORDS()[1]
    let above = deltaBridge > 0 ? true : false
    theta = Math.PI
    bridgeGraphic.moveTo(0,0)
    bridgeGraphic.lineTo(0,-0.95*BRIDGE_LENGTH)
    bridgeGraphic.alpha = 0
    bridgeContainer.addChild(bridgeGraphic)
    app.stage.addChild(bridgeContainer)
    walkWayRef.push(bridgeContainer)
    createjs.Tween.get(bridgeGraphic).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{
      createjs.Tween.get(bridgeGraphic).to({rotation: theta}, 2000, createjs.Ease.getPowInOut(1)).call(()=>{startTheBlock()})
    })
  }
}



function createContainer(width){
  let containerGraphic = new PIXI.Graphics()
  containerGraphic.lineStyle(CONT_BORD,0x000000)
  containerGraphic.moveTo(0,0)
  containerGraphic.lineTo(0,width)
  containerGraphic.lineTo(width,width)
  containerGraphic.lineTo(width,0)
  containerGraphic.interactive = true
  containerGraphic.x = CONT_BORD/2.5

  let containerTexture = app.renderer.generateTexture(containerGraphic)
  let containerSprite = new PIXI.Sprite(containerTexture)
  containerSprite.anchor.set(0.5)
  containerSprite.width = containerGraphic.width
  containerSprite.height = containerGraphic.height
  return containerSprite
}


function createWater(){

  let waterGraphic = new PIXI.Graphics()
  waterGraphic.beginFill(COLORS.BLUE)
  waterGraphic.drawRoundedRect(0,0,2*DIM,1,0)
  waterGraphic.endFill()

  let waterTexture = app.renderer.generateTexture(waterGraphic)
  let waterSprite = new PIXI.Sprite(waterTexture)
  waterSprite.anchor.set(1)

  return waterSprite
}


function adjustWaterLevel(val){
  water.height = val
  water.y = adjustableContainer.y+adjustableContainer.height/2
  water.x = LEFT_CONTAINER_CENTER_X+CONTAINER_WIDTH/2-CONT_BORD/2
}

function createSlider(width) {
  let height = 2/3*width
  let sliderGraphic = new PIXI.Graphics()
  sliderGraphic.lineStyle(1,0x000000)
  sliderGraphic.beginFill(COLORS.DARK_GRAY)
  sliderGraphic.moveTo(0,height/2)
  sliderGraphic.lineTo(width/3,0)
  sliderGraphic.lineTo(width,0)
  sliderGraphic.lineTo(width,height)
  sliderGraphic.lineTo(width/3,height)
  sliderGraphic.lineTo(0,height/2)
  sliderGraphic.endFill()
  sliderGraphic.alpha = 0.5
  sliderGraphic.interactive = true
  return sliderGraphic
}

function createActionButton(text,action) {

    let graphics = new PIXI.Graphics();
    graphics.lineStyle(0, 0xb7b7b7, 1)
    graphics.beginFill(COLORS.ORANGE);
    graphics.drawRoundedRect(0, 0,DIM,DIM/2 ,5);
    graphics.endFill();

    let texture = app.renderer.generateTexture(graphics);
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

    tileContainer.checkAnswer = true
    tileContainer.text = den

    tileContainer.tile = tile
    return tileContainer
}

function createFrick(a,b){
  let frickGraphic = new PIXI.Graphics()
  frickGraphic.lineStyle(2, 0x000000)
  frickGraphic.moveTo(a[0],a[1])
  frickGraphic.lineTo(b[0],b[1])
  frickGraphic.alpha = 0
  return frickGraphic
}

function createFeedBlock(w,h){
  let blockGraphic = new PIXI.Graphics();
  blockGraphic.lineStyle(2, 0x000000)
  blockGraphic.beginFill(COLORS.ORANGE);
  blockGraphic.drawRoundedRect(4,0,w,h,1);
  blockGraphic.endFill();
  blockGraphic.alpha = 0
  app.stage.addChild(blockGraphic)
  return blockGraphic
}

function createPartitionBlock(h,w){
  let blockGraphic = new PIXI.Graphics();
  blockGraphic.lineStyle(2, 0x000000)
  blockGraphic.drawRoundedRect(0,0,h,w,1);
  blockGraphic.alpha = 0
  app.stage.addChild(blockGraphic)
  return blockGraphic
}

function animateAnswer(num,den,numCords,denCords){
  let dy = CONTAINER_WIDTH/den
  let animateTo = [RIGHT_CONTAINER_CENTER_X-CONTAINER_WIDTH/2,CONTAINER_BOTTOM]
  for (let i = 0;i<num;i++){
    let b = createFeedBlock(CONTAINER_WIDTH-8,dy)
    b.x = RIGHT_CONTAINER_CENTER_X-CONTAINER_WIDTH/2
    b.y = CONTAINER_BOTTOM-dy*(i+1)
    let f = createFrick(num_cords,[b.x+b.width/2,b.y+b.height/2])
    feedFricks.push(f)
    feedBlocks.push(b)
  }
  for (let j = 0;j<den;j++){
    let b = createPartitionBlock(CONTAINER_WIDTH,dy)
    b.x = RIGHT_CONTAINER_CENTER_X-CONTAINER_WIDTH/2
    b.y = CONTAINER_BOTTOM-dy*(j+1)
    let f = createFrick(den_cords,[b.x+b.width/2,b.y+b.height/2])
    frameFricks.push(f)
    frameBlocks.push(b)
  }

  //createjs.Tween.get(adjustableContainer).to({x: LEFT_CONTAINER_CENTER_X}, 1000, createjs.Ease.getPowInOut(4))
  createjs.Tween.get(feedBackContainer).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{
    animateFrameBlocks([...frameBlocks],()=>{
      setTimeout(()=> {animateFeedBlocks([...feedBlocks],[...feedFricks])},1000)

    })
  })
  //createjs.Tween.get(water).to({x: LEFT_CONTAINER_CENTER_X+CONTAINER_WIDTH/2}, 1000, createjs.Ease.getPowInOut(4))
  createjs.Tween.get(slider).to({alpha: 0}, 100, createjs.Ease.getPowInOut(4)).call(()=>{
    slider.interactive = false
  })
  createjs.Tween.get(actionButton).to({alpha: 0}, 100, createjs.Ease.getPowInOut(4)).call(()=>{
    actionButton.interactive = false
  })
}

function reset(){

  if (CHECK_ANSWER()){
    problemIndex += 1
  }

  currentProblem = problemSet[problemIndex]
  frac.n.text = currentProblem.num
  frac.d.text = currentProblem.den

  multipleChoices.forEach(c=>app.stage.removeChild(c))
  multipleChoices = []

  walkWayRef.forEach(w=>{app.stage.removeChild(w)})
  walkWayRef = []

  feedBlocks.forEach(b=>{app.stage.removeChild(b)})
  console.log("REMOVING feed FRICKS")
  feedFricks.forEach(f=>{app.stage.removeChild(f)})
  frameBlocks.forEach(b=>{app.stage.removeChild(b)})
  frameFricks.forEach(f=>{app.stage.removeChild(f)})
  feedBlocks = []
  feedFricks = []
  frameBlocks = []
  frameFricks = []

  if (!ESTIMATING) {

      /*
      createjs.Tween.get(adjustableContainer).to({x: LEFT_CONTAINER_CENTER_X}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{
      createjs.Tween.get(slider).to({alpha: 0.5}, 1000, createjs.Ease.getPowInOut(4))
      slider.y = CONTAINER_BOTTOM - slider.height/2
      createjs.Tween.get(frac).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
      createjs.Tween.get(water).to({x: CENTER_CONTAINER_X+CONTAINER_WIDTH/2}, 1000, createjs.Ease.getPowInOut(4))
      createjs.Tween.get(water).to({height: 0}, 1000, createjs.Ease.getPowInOut(4))
      createjs.Tween.get(feedBackContainer).to({alpha: 0}, 1000, createjs.Ease.getPowInOut(4))
      */
      adjustableContainer.x = LEFT_CONTAINER_CENTER_X
      slider.alpha = 0.5
      frac.alpha = 1
      slider.y = CONTAINER_BOTTOM - slider.height/2
      water.x = WATER_LEFT
      water.height = 0
      feedBackContainer.alpha = 0
      slider.interactive = true
      actionButton.text.text = "Go"


  } else {
    console.log("Estimate reset")
    actionButton.alpha = 0
    /*
    createjs.Tween.get(adjustableContainer).to({x: WINDOW_CENTER_X}, 1000, createjs.Ease.getPowInOut(4))
    createjs.Tween.get(water).to({height: CONTAINER_HEIGHT*currentProblem.num/currentProblem.den}, 1000, createjs.Ease.getPowInOut(4))
    createjs.Tween.get(water).to({x: WATER_CENTER}, 1000, createjs.Ease.getPowInOut(4))
    createjs.Tween.get(feedBackContainer).to({alpha: 0}, 1000, createjs.Ease.getPowInOut(4))
    */

    adjustableContainer.x = WINDOW_CENTER_X
    water.height = CONTAINER_HEIGHT*currentProblem.num/currentProblem.den
    water.x = WATER_CENTER
    feedBackContainer.alpha = 0


    layoutChoices()
  }


}

function animateToleranceFeedBack(){

  createPlatformLeft()
  createPlatformRight()
  animateBridge(animateJiji)

  actionButton.text.text = CHECK_ANSWER() ? "Next" : "Retry"

}

function animateFrameBlocks(blocks,callback){
  blocks.forEach((b,i) => {
      app.stage.addChild(frameFricks[i])
      createjs.Tween.get(b).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
      createjs.Tween.get(frameFricks[i]).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
  })

  feedBlocks.forEach(b=>{app.stage.addChild(b)})
  frameFricks.forEach(f=>{app.stage.addChild(f)})
  app.stage.addChild(feedBackContainer)

  setTimeout(()=>{
    blocks.forEach((b,i) => {
        createjs.Tween.get(frameFricks[i]).to({alpha: 0}, 500, createjs.Ease.getPowInOut(4))
      })
      callback()
  },1000)
}

function prepareForToleranceFeedback(){
  createjs.Tween.get(frac).to({alpha: 0}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{
      actionButton.interactive = true
      animateToleranceFeedBack()
  })
  feedFricks.forEach(f=> {
    createjs.Tween.get(f).to({alpha: 0}, 1000, createjs.Ease.getPowInOut(4))
  })

}

/*
function animateFeedBlocks(blocks,fricks){
  if (blocks.length == 0){
    //reset()
    prepareForToleranceFeedback()

    return
  } else {
    let b = blocks.shift()
    let f = fricks.shift()
    app.stage.addChild(f)
    createjs.Tween.get(f).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
    createjs.Tween.get(b).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4)).call(() => {
        animateFeedBlocks(blocks,fricks)
    })
  }
}
*/

function animateFeedBlocks(blocks,fricks){
    fricks.forEach(f=>{
        app.stage.addChild(f)
        createjs.Tween.get(f).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
    })
    blocks.forEach(b=>{
        createjs.Tween.get(b).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
    })
    setTimeout(()=>{prepareForToleranceFeedback()},1000)
}

function animateFeedBack(){
    animateFractionBlocks()
}

function createJijiAsset(n,d) {

    var block = new PIXI.Graphics();
    block.lineStyle(3,COLORS.DARK_GRAY)
    block.beginFill(0xFFFFFF);
    block.drawRoundedRect(0,0, DIM, DIM,3);
    block.endFill();
    block.x = 1
    block.y = 1

    let blockTexture = app.renderer.generateTexture(block)
    let blockSprite = new PIXI.Sprite(blockTexture)
    blockSprite.anchor.set(1)

    return blockSprite
}

function createFraction(n,d) {

    let sf = 0.7

    let tileContainer = new PIXI.Container()

    let whole = d == 1 ? true : false

    let h = d == 1 ? DIM : 2*DIM
    let w = DIM
    h = h*sf
    w = w*sf

    var block = new PIXI.Graphics();
    block.lineStyle(3,0x000000,2)
    block.beginFill(0xFFFFFF);
    block.drawRoundedRect(0, 0, 1.2*w, 1.2*h,5);
    block.endFill();
    block.x = 1
    block.y = 1

    var blockTexture = app.renderer.generateTexture(block);
    let tile = new PIXI.Sprite(blockTexture)
    tile.anchor.set(0.5)

    // All or only some of these may exist depending on if we're using a "whole" or not.
    let mid;
    let num;
    let den;

    if (true) {
      mid = new PIXI.Graphics()
      mid.lineStyle(4, 0x000000, 2)
      mid.moveTo(-w/2,0)
      mid.lineTo(w/2,0)
      num = new PIXI.Text(n,{fontFamily : 'Chalkboard SE', fontSize: w, fill : 0x000000, align : 'center'});
      num.anchor.set(0.5)
      num.y = -w/2
      den = new PIXI.Text(d,{fontFamily : 'Chalkboard SE', fontSize: w, fill : 0x000000, align : 'center'});
      den.anchor.set(0.5)
      den.y = w/2
    } else {
      num = new PIXI.Text(n,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
      num.anchor.set(0.5)
      num.y = 0
    }

    if (ESTIMATING){
      tileContainer.addChild(tile)
    }
    tileContainer.addChild(num)
    tileContainer.border = tile


    // Line style appears grey unless we add this after the prefious if block - not sure why.
    if (mid){tileContainer.addChild(mid)
          tileContainer.addChild(den)}

    tileContainer.active = false
    tileContainer.interactive = true;

    tileContainer.x = DIM
    tileContainer.y = 0
    // Objects
    tileContainer.d = den
    tileContainer.n = num
    // Values
    tileContainer._d = d
    tileContainer._n = n
    tileContainer.isSet = false
    tileContainer.pivot.x = 0
    tileContainer.pivot.y = DIM/2
    tileContainer.onLine = false

    return tileContainer
}


function onSliderStart(event){
    this.data = event.data;
    this.dragging = true
}

function onSliderEnd(){
    let pointerPosition = this.data.getLocalPosition(this.parent);
    let inRange = pointerPosition.y < CONTAINER_BOTTOM ? true : false
    if (!inRange){
        console.log("Animating back")
        createjs.Tween.get(this).to({y: CONTAINER_BOTTOM-this.height/2}, 500, createjs.Ease.getPowInOut(4))
    }
    this.data = null;
    this.dragging = false
}

function onSliderMove(){
    if (this.dragging){
      let pointerPosition = this.data.getLocalPosition(this.parent);
      let inRange = pointerPosition.y < CONTAINER_BOTTOM ? true : false
      if (inRange){
        this.position.y = pointerPosition.y - this.height/2
        adjustWaterLevel(CONTAINER_BOTTOM-pointerPosition.y)
      }
    }
}
