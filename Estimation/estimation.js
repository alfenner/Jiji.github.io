
// Constants
const LINE_WIDTH = 5 // Should be some fraction of DIM or window
const DIM = WINDOW_WIDTH/15
const TOP_MARGIN = DIM/2
const CONTAINER_HEIGHT = 3*DIM+4
const CONTAINER_WIDTH = 3*DIM+4
const LEFT_CONTAINER_CENTER_X = WINDOW_WIDTH/4
const RIGHT_CONTAINER_CENTER_X = WINDOW_WIDTH/4*3
const CONTAINER_CENTER_Y = 2/3*WINDOW_HEIGHT
const CONTAINER_BOTTOM = CONTAINER_CENTER_Y+CONTAINER_HEIGHT/2
const CONTAINER_TOP = CONTAINER_CENTER_Y-CONTAINER_HEIGHT/2
const CENTER_CONTAINER_X = LEFT_CONTAINER_CENTER_X
const FRACTION_CENTER = [1/2*WINDOW_WIDTH,1/4*WINDOW_HEIGHT]
const FRACT_DIM = [DIM,2*DIM]
const GO_BUTTON_CENTER = [DIM,TOP_MARGIN]
const TOLERANCE = 0.10*CONTAINER_HEIGHT
const DELTA_BRIDGE = LEFT_CONTAINER_CENTER_X+0.7*CONTAINER_WIDTH - (RIGHT_CONTAINER_CENTER_X-0.7*CONTAINER_WIDTH)
const BRIDGE_LENGTH = Math.sqrt(TOLERANCE*TOLERANCE+DELTA_BRIDGE*DELTA_BRIDGE)+LINE_WIDTH/2

// COMPUTED CONSTANTS
const correct_ans_y = () => {
  return CONTAINER_BOTTOM - CONTAINER_HEIGHT*currentProblem.num/currentProblem.den
}

const SUBMITTED_ANS_Y = () => {
  return slider.y + slider.height/2
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
   let tolerance = Math.abs(CONTAINER_HEIGHT)*0.10
   let difference = Math.abs(BRIDGE_START_CORDS()[1]-BRIDGE_END_CORDS()[1])
   console.log("difference",difference)
   console.log("tolerance",tolerance)
  return difference < tolerance ? true : false
}


let num_cords;
let den_cords;
//const


// State
let feedBlocks = []
let feedFricks = []
let frameBlocks = []
let frameFricks = []
let walkWayRef = []
let problemIndex = 0
let problemCount = PROBLEM_SET_ONE.length
let currentProblem = PROBLEM_SET_ONE[problemIndex%problemCount]



// Sprites & Containers

// Background
let backGround = new PIXI.Graphics()
backGround.beginFill(0xFFFFFF)
backGround.drawRoundedRect(0,0,windowWidth,windowHeight)
backGround.endFill()
backGround.interactive = true
backGround.static = false
app.stage.addChild(backGround)
backGround.on('pointerup',()=> {slider.dragging = false})


let frac = createFraction(currentProblem.num,currentProblem.den)
app.stage.addChild(frac)
frac.x = FRACTION_CENTER[0]
frac.y = FRACTION_CENTER[1]
num_cords = [FRACTION_CENTER[0],FRACTION_CENTER[1]-5/4*frac.width]
den_cords = [FRACTION_CENTER[0],FRACTION_CENTER[1]-frac.width/4]


let adjustableContainer = createContainer(3*DIM)
app.stage.addChild(adjustableContainer)
adjustableContainer.x = CENTER_CONTAINER_X
adjustableContainer.y = 2/3*WINDOW_HEIGHT

let slider = createSlider(DIM)
app.stage.addChild(slider)
slider.on('pointerdown',onSliderStart)
slider.on('pointerup',onSliderEnd)
slider.on('pointermove',onSliderMove)
slider.x = adjustableContainer.x+adjustableContainer.width/2
slider.y = adjustableContainer.y-slider.height/2


let water = createWater()
app.stage.addChild(water)
water.y = adjustableContainer.y+adjustableContainer.height/2
water.x = adjustableContainer.x+adjustableContainer.width/2
water.height = adjustableContainer.height/2
water.width = adjustableContainer.width


let feedBackContainer = createContainer(3*DIM)
app.stage.addChild(feedBackContainer)
feedBackContainer.x = 3/4*WINDOW_WIDTH
feedBackContainer.y = 2/3*WINDOW_HEIGHT
feedBackContainer.alpha = 0

let actionButton = createActionButton("Go",submitAnswer)
app.stage.addChild(actionButton)
actionButton.x = GO_BUTTON_CENTER[0]
actionButton.y = GO_BUTTON_CENTER[1]
app.stage.addChild(adjustableContainer)

// FUNCTIONS


function submitAnswer(){
  if (actionButton.text.text == "Next"){
    reset()
  } else {
    animateAnswer(currentProblem.num,currentProblem.den)
  }
}

// FEEDBACK SHIT
function animateTo(obj,loc,callback){
    createjs.Tween.get(obj).to({x:loc[0],y:loc[1]}, 1000, createjs.Ease.getPowInOut(1)).call(callback)
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
  platformGraphic.moveTo(BRIDGE_END_CORDS()[0],correct_ans_y())
  platformGraphic.lineTo(WINDOW_WIDTH,correct_ans_y())
  platformGraphic.alpha = 0
  app.stage.addChild(platformGraphic)
  walkWayRef.push(platformGraphic)
  createjs.Tween.get(platformGraphic).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
}


function animateBridge(startTheBlock){
  let deltaBridge_X = BRIDGE_END_CORDS()[0] - BRIDGE_START_CORDS()[0]
  let deltaBridge = BRIDGE_END_CORDS()[1] - BRIDGE_START_CORDS()[1]
  let theta = Math.PI/2+Math.atan(deltaBridge/deltaBridge_X)



  let start = BRIDGE_START_CORDS()
  let end = BRIDGE_END_CORDS()
  console.log("check answer",CHECK_ANSWER())
  let bridgeGraphic = new PIXI.Graphics()
  let bridgeContainer = new PIXI.Container()
  bridgeContainer.x = BRIDGE_START_CORDS()[0]-2.5
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
    if (!CHECK_ANSWER()){
      theta = Math.PI
      bridgeGraphic.moveTo(0,0)
      bridgeGraphic.lineTo(0,-BRIDGE_LENGTH)
    } else {
      bridgeGraphic.moveTo(0,0)
      bridgeGraphic.lineTo(0,-BRIDGE_LENGTH)
    }
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
  containerGraphic.lineStyle(3,0x000000)
  containerGraphic.moveTo(0,0)
  containerGraphic.lineTo(0,width)
  containerGraphic.lineTo(width,width)
  containerGraphic.lineTo(width,0)
  containerGraphic.interactive = true
  containerGraphic.x = 1.5

  let containerTexture = app.renderer.generateTexture(containerGraphic)
  let containerSprite = new PIXI.Sprite(containerTexture)
  containerSprite.anchor.set(0.5)
  containerSprite.width = containerGraphic.width + 1.5
  containerSprite.height = containerGraphic.height + 1.5
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
  water.width = adjustableContainer.width
  water.y = adjustableContainer.y+adjustableContainer.height/2
  water.x = adjustableContainer.x+CONTAINER_WIDTH/2
}

function createSlider(width) {
  let height = 2/3*width
  let sliderGraphic = new PIXI.Graphics()
  sliderGraphic.lineStyle(0,0xFFFFFF)
  sliderGraphic.beginFill(COLORS.BLUE)
  sliderGraphic.moveTo(0,height/2)
  sliderGraphic.lineTo(width/3,0)
  sliderGraphic.lineTo(width,0)
  sliderGraphic.lineTo(width,height)
  sliderGraphic.lineTo(width/3,height)
  sliderGraphic.lineTo(0,height/2)
  sliderGraphic.endFill()
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

function createFeedBlock(h,w){
  let blockGraphic = new PIXI.Graphics();
  blockGraphic.lineStyle(2, 0x000000)
  blockGraphic.beginFill(COLORS.ORANGE);
  blockGraphic.drawRoundedRect(0,0,h,w,5);
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
    let b = createFeedBlock(CONTAINER_WIDTH,dy)
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
  currentProblem = PROBLEM_SET_ONE[problemIndex]
  frac.n.text = currentProblem.num
  frac.d.text = currentProblem.den

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

  createjs.Tween.get(adjustableContainer).to({x: CENTER_CONTAINER_X}, 1000, createjs.Ease.getPowInOut(4)).call(()=>{
      createjs.Tween.get(slider).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
      createjs.Tween.get(frac).to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4))
      slider.y = CONTAINER_CENTER_Y - slider.height/2
      slider.interactive = true
      actionButton.text.text = "Go"
  })
  createjs.Tween.get(water).to({x: CENTER_CONTAINER_X+CONTAINER_WIDTH/2}, 1000, createjs.Ease.getPowInOut(4))
  createjs.Tween.get(water).to({height: CONTAINER_WIDTH/2}, 1000, createjs.Ease.getPowInOut(4))
  createjs.Tween.get(feedBackContainer).to({alpha: 0}, 1000, createjs.Ease.getPowInOut(4))



}

function animateToleranceFeedBack(){

  createPlatformLeft()
  createPlatformRight()
  animateBridge(animateJiji)

  actionButton.text.text = "Next"
  createjs.Tween.get(actionButton).to({alpha: 1}, 500, createjs.Ease.getPowInOut(4))

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
    block.lineStyle(2,COLORS.DARK_GRAY,2)
    block.beginFill(0xFFFFFF);
    block.drawRoundedRect(1, 1, DIM, DIM,5);
    block.endFill();

    var blockTexture = app.renderer.generateTexture(block);
    let tile = new PIXI.Sprite(blockTexture)
    tile.anchor.set(1)

    return tile
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
    block.lineStyle(2,0x000000,2)
    block.beginFill(0xFFFFFF);
    block.drawRoundedRect(1, 1, w, h,5);
    block.endFill();

    var blockTexture = app.renderer.generateTexture(block);
    let tile = new PIXI.Sprite(blockTexture)
    tile.alpha = 0.5
    tile.anchor.set(0.5)


    // All or only some of these may exist depending on if we're using a "whole" or not.
    let mid;
    let num;
    let den;

    if (!whole) {
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

    //tileContainer.addChild(tile)
    tileContainer.addChild(num)
    tileContainer.hitSpot = tile

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
        adjustWaterLevel(adjustableContainer.y+adjustableContainer.height/2-pointerPosition.y)
      }
    }
}
