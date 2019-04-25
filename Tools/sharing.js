
const DIM = WINDOW_WIDTH/12
const WINDOW_CENTER_X = WINDOW_WIDTH/2
const WINDOW_CENTER_Y = WINDOW_HEIGHT/2
const CONTAINER_WIDTH = DIM
const CONTAINER_HEIGHT = DIM
const CONTAINER_CENTER_X = DIM
const CONTAINER_CENTER_Y = 2.5*DIM
const CONTAINER_TOP = CONTAINER_CENTER_Y-CONTAINER_WIDTH/2
const CONTAINER_BOTTOM = CONTAINER_CENTER_Y+CONTAINER_WIDTH/2
const CONTAINER_LEFT = CONTAINER_CENTER_X-CONTAINER_WIDTH/2
const CONTAINER_RIGHT = CONTAINER_CENTER_X+CONTAINER_WIDTH/2


let constructorBlock;
let jijis = []
let plusJiji;
let minusJiji;
let cuttingTool;
let deleteTool;
let menuItems = []
let blocks = []
let activeBlock;
let cutterContainer = new PIXI.Container()
let fractions = []
let horizontalLines = []
let verticalLines = []
let vPartitions = 1
let hPartitions = 1
let colorIndex = 0
let colors = [COLORS.BLUE,COLORS.RED,COLORS.GREEN,COLORS.ORANGE,COLORS.PURPLE]
let colorLength = colors.length
let currentColor = () => {return colors[colorIndex%colorLength]}
let vPlus;
let vMinus;
let hPlus;
let hMinus;
let cont;
let cutting = false
let blockBeingCut;
let cutOperators = []

/*
BYC Yoga26
6935 Oakland Mills Rd suite l, Columbia, MD 21045
(410) 381-1866
*/


// ENUM
const OBJ_TYPE = {
  BLOCK: 0,
  CUT: 1,
  DELETE: 2
}

const v_part_dim = ()=> {
  return CONTAINER_HEIGHT/hPartitions
}

const h_part_dim = ()=> {
  return CONTAINER_WIDTH/vPartitions
}


// Init
createMenuButtons()
layoutMenu()
//initVerticalLines(1)
initHorizontalLines(1)
animateVerticalLines(0)
animateHorizontalLines(1)
createBlockConstructor()
drawPlusMinusButtons()
vPlus = createCircleButton("Ok",COLORS.GREEN)
hPlus = createCircleButton("+",COLORS.GREEN)
hMinus = createCircleButton("-",COLORS.GREEN)
cont = createContainer(CONTAINER_WIDTH)
createCutterContainer()
cutOperators = [vPlus,hPlus,hMinus]
vPlus.alpha = 0
hPlus.alpha = 0
hMinus.alpha = 0

// Rouge Init


deleteTool = createTextBox("Delete")
app.stage.addChild(deleteTool)
deleteTool.x = DIM
deleteTool.y = 3.5*DIM
console.log("delete tool h,w",deleteTool.height,deleteTool.width)


cont.x = CONTAINER_CENTER_X
cont.y = CONTAINER_CENTER_Y

vPlus.y = CONTAINER_TOP - DIM/4
vPlus.x = CONTAINER_CENTER_X

hPlus.x = CONTAINER_RIGHT + DIM/4
hPlus.y = CONTAINER_CENTER_Y

hMinus.x = CONTAINER_LEFT - DIM/4
hMinus.y = CONTAINER_CENTER_Y

hPlus.on("pointerdown",() => animateHorizontalLines(1))
hMinus.on("pointerdown",() => animateHorizontalLines(-1))
vPlus.on("pointerdown",()=>cutBlock(blockBeingCut,hPartitions))
//hPlus.on("pointerdown",() => animateVerticalLines(1))
//hMinus.on("pointerdown",() => animateVerticalLines(-1))



//dropNotification("How can two Jiji's share Three Blocks?")


// Factory Functions

function createJijiAsset() {

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

function newJiji(){
  let newJiji = createJijiAsset()
  app.stage.addChild(newJiji)
  jijis.push(newJiji)
}

function alignJijis(){
  for (let i = 0;i<jijis.length;i++){

  }
}

function drawPlusMinusButtons(){
  plusJiji = createCircleButton("+",0xFFFFFF)
  minusJiji = createCircleButton("-",0xFFFFFF)
  plusJiji.interactive = true
  minusJiji.interactive = true
  plusJiji.on('pointerdown')
  app.stage.addChild(plusJiji)
  app.stage.addChild(minusJiji)
  plusJiji.x = 3*DIM/2
  plusJiji.y = 4*DIM
  minusJiji.x = DIM/2
  minusJiji.y = 4*DIM
}

function createCutterContainer(){
  cutterContainer.interactive = true
  cutterContainer.TYPE = OBJ_TYPE.CUT
  for (l of horizontalLines){
    console.log("adding child")
    cutterContainer.addChild(l)
    console.log(l.y)
  }
  cutterContainer.addChild(hPlus)
  cutterContainer.addChild(vPlus)
  cutterContainer.addChild(hMinus)
  cutterContainer.addChild(cont)
  cutterContainer.on('pointerdown', onPolyTouched)
  cutterContainer.on('pointerup', onPolyMoveEnd)
  cutterContainer.on('pointermove', onPolyTouchMoved);
  cutterContainer.x = CONTAINER_LEFT
  cutterContainer.y = CONTAINER_TOP
  cutterContainer.pivot.x = cutterContainer.x
  cutterContainer.pivot.y = cutterContainer.y
  cutterContainer.start = [cutterContainer.x,cutterContainer.y]
  app.stage.addChild(cutterContainer)
  console.log("cutterCont ",cutterContainer.width,cutterContainer.height)
}


function cutBlock(block,pieces){

  let h = block.height/pieces
  let w = block.width
  console.log("w,y,x,y",h,w,block.x,block.y)
  for (let i = 0;i<pieces;i++){
    let newBlock = createBlock(w,h)
    newBlock.isFrac = true
    newBlock.type = OBJ_TYPE.BLOCK
    newBlock.x = block.x
    newBlock.y = block.y-block.height/2+h/2+h*(i)
    app.stage.addChild(newBlock)
  }
  let i = blocks.indexOf(block)
  blocks.splice(i,1)
  app.stage.removeChild(block)
  animateOperatorAlpha(0)
  hPartitions = 2
  animateHorizontalLines(0)
  createjs.Tween.get(cutterContainer).to({x: cutterContainer.start[0],y: cutterContainer.start[1]}, 500, createjs.Ease.getPowInOut(4))
  //return null
}


// Helpers

function bringLinesToFront(){
  let lines = [...verticalLines,...horizontalLines]
  //lines.forEach(l =>  app.stage.addChild(l))
}


// Constructors

function createTextBox(text) {

    let h = DIM/4
    let w = DIM/4

    var circle = new PIXI.Graphics();
    circle.drawRoundedRect(0,0,4*h,h,1);
    circle.endFill();

    let circleTexture = app.renderer.generateTexture(circle);
    let circleSprite = new PIXI.Sprite(circleTexture)
    circleSprite.alpha = 0.5
    circleSprite.anchor.set(0.5)

    let pinContainer = new PIXI.Container()
    pinContainer.addChild(circleSprite)

    let operator = new PIXI.Text(text,{fontFamily : 'Chalkboard SE', fontSize: dx/2, fill : 0x000000, align : 'center'});
    operator.anchor.set(0.5)
    operator.x = 0
    operator.y = 0
    pinContainer.addChild(operator)
    pinContainer.interactive = true

    return pinContainer
}


function createCircleButton(text,color) {

    let h = DIM/4
    let w = DIM/4

    var circle = new PIXI.Graphics();
    circle.beginFill(color);
    circle.drawCircle(DIM/5, DIM/5,DIM/5);
    circle.endFill();

    let circleTexture = app.renderer.generateTexture(circle);
    let circleSprite = new PIXI.Sprite(circleTexture)
    circleSprite.alpha = 0.5
    circleSprite.anchor.set(0.5)

    let pinContainer = new PIXI.Container()
    pinContainer.addChild(circleSprite)

    let operator = new PIXI.Text(text,{fontFamily : 'Chalkboard SE', fontSize: DIM/4, fill : 0x000000, align : 'center'});
    operator.anchor.set(0.5)
    operator.x = 0
    operator.y = 0
    pinContainer.addChild(operator)
    pinContainer.interactive = true

    return pinContainer
}


function createContainer(width){
  let containerGraphic = new PIXI.Graphics()
  containerGraphic.lineStyle(2,0x000000)
  containerGraphic.moveTo(0,0)
  containerGraphic.lineTo(0,width)
  containerGraphic.lineTo(width,width)
  containerGraphic.lineTo(width,0)
  containerGraphic.lineTo(0,0)
  containerGraphic.interactive = true
  containerGraphic.x = 1
  containerGraphic.y = 1

  let containerTexture = app.renderer.generateTexture(containerGraphic)
  let containerSprite = new PIXI.Sprite(containerTexture)
  containerSprite.anchor.set(0.5)
  containerSprite.width = containerGraphic.width
  containerSprite.height = containerGraphic.height
  return containerSprite
}

function initVerticalLines(partition){

  for (let i = 0;i<11;i++){
    let g = new PIXI.Graphics()
    g.lineStyle(2,0x000000)
    g.lineTo(0,CONTAINER_WIDTH)
    g.y = CONTAINER_TOP
    g.x = CONTAINER_LEFT
    verticalLines.push(g)
    app.stage.addChild(g)
  }

}

function initHorizontalLines(partition){
  for (let i = 0;i<11;i++){
    let g = new PIXI.Graphics()
    g.lineStyle(2,0x000000)
    g.lineTo(CONTAINER_WIDTH,0)
    g.y = CONTAINER_BOTTOM
    g.x = CONTAINER_LEFT
    horizontalLines.push(g)
  }
}

function animateVerticalLines(inc){

  console.log("animating verticalLines")
  vPartitions  += inc
  if (vPartitions != 0 && vPartitions != 11){
    colorIndex += 1

  console.log("color Index",colorIndex)


  let spacing = CONTAINER_WIDTH/vPartitions

  verticalLines.forEach((l,i) => {
    app.stage.addChild(l)
    if (i>vPartitions){
        createjs.Tween.get(l).to({x: CONTAINER_RIGHT}, 500, createjs.Ease.getPowInOut(4))
    } else {
        createjs.Tween.get(l).to({x: i*spacing+CONTAINER_LEFT}, 500, createjs.Ease.getPowInOut(4))
    }

    })
  } else {
    vPartitions -= inc
  }
}

function animateHorizontalLines(inc){

  hPartitions  += inc
  if (hPartitions != 0 && hPartitions != 11){

  colorIndex += 1

  let spacing = CONTAINER_WIDTH/hPartitions

  horizontalLines.forEach((l,i)=>{
    if (i>hPartitions){
      console.log("containerbottom",CONTAINER_BOTTOM)
      console.log("cutterContainerxy",cutterContainer.x,cutterContainer.y)
        createjs.Tween.get(l).to({y: CONTAINER_BOTTOM}, 500, createjs.Ease.getPowInOut(4))
    } else {
        createjs.Tween.get(l).to({y: i*spacing+CONTAINER_TOP}, 500, createjs.Ease.getPowInOut(4))
    }

  })
} else {
  hPartitions -= inc
}


}

function onFracStart(event){
    bringLinesToFront()
    let touchedAtX = event.data.global.x
    let touchedAtY = event.data.global.y
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    app.stage.addChild(this)
    this.data = event.data;
    this.dragging = true
}

function onFracEnd(){
    this.data = null;
    this.dragging = false
    if (this.x < CONTAINER_LEFT || this.y < CONTAINER_TOP){
      let i = fractions.indexOf(this)
      fractions.splice(i,1)
      app.stage.removeChild(this)
    }
}

function onFracMove(){
    if (this.dragging){
      let pointerPosition = this.data.getLocalPosition(this.parent);
        this.y = pointerPosition.y + this.deltaTouch[1]
        this.x = pointerPosition.x + this.deltaTouch[0]
    }
}


function layoutPolys() {
  for (let i=0;i<polys.length;i++) {
      createjs.Tween.get(polys[i]).to({x:  4*dx,y: 4*dx}, 500, createjs.Ease.getPowInOut(4))
  }
}



// This is silly
function createMenuButtons(){
  constructorBlock = createBlockConstructor()
  cuttingTool = createTextBox("Cut")
  menuItems = [constructorBlock]
}

function drawCompletedTileSpaces(n) {

  for (let i = 0; i<n; i++){
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(3, 0x000000,3)

    graphics.drawRoundedRect(3, 3, 2*dx, 2*dx,3);
    graphics.alpha = 0.2
    graphics.x = -1.5
    graphics.y = -1.5

    let texture = app.renderer.generateTexture(graphics);
    let emptyRectSprite = new PIXI.Sprite(texture)
    emptyRectSprite.x = windowWidth-3*dx
    emptyRectSprite.y = i*2.2*dx + dx/2
    emptyRectSprite.alpha = 0.5
    completedTileSpaces.push(emptyRectSprite)
    app.stage.addChild(emptyRectSprite)

  }
}

// Pass it the level and it will layout the buttons for that new level.
function createBlockConstructor() {
  var graphics = new PIXI.Graphics();
    graphics.beginFill(COLORS.BLUE);
    graphics.drawRoundedRect(0,0,DIM,DIM,2)
    graphics.endFill();
    graphics.color = COLORS.BLUE
    graphics.interactive = true
    console.log("graphics dims",graphics.width,graphics.height)
    graphics.on('pointerdown',() => newBlock(graphics.width,graphics.height,constructorBlock.x+constructorBlock.width/2,constructorBlock.y+constructorBlock.height/2))
    return graphics
}

function newBlock(w,h,x,y) {
    let newBlock = createBlock(w,h)
    app.stage.addChild(newBlock)
    newBlock.x = x
    newBlock.y = y
    createjs.Tween.get(newBlock).to({x: WINDOW_CENTER_X+blocks.length*10,y: CONTAINER_CENTER_Y+blocks.length*10}, 1000, createjs.Ease.getPowInOut(4))
    blocks.push(newBlock)
}


function layoutMenu(){
  let y = DIM/2
  console.log("these are the menu items",menuItems)
  for (i of menuItems){
    app.stage.addChild(i)
      i.x = DIM/2
      i.y = y
      i.start = [i.x,i.y]
      y = y+i.height+DIM/4
  }
}

function createBlock(w,h) {
  let graphics = new PIXI.Graphics();
      graphics.lineStyle(1,0xFFFFFF)
      graphics.beginFill(COLORS.BLUE);
      graphics.drawRoundedRect(0,0,w,h,3)
      graphics.endFill();
      graphics.x = 0.5
      graphics.y = 0.5
      let texture = app.renderer.generateTexture(graphics)
      let sprite = new PIXI.Sprite(texture)
      sprite.anchor.set(0.5)
      sprite.interactive = true
      sprite.TYPE = OBJ_TYPE.BLOCK
      sprite.on('pointerdown', onPolyTouched)
      sprite.on('pointerup', onPolyMoveEnd)
      sprite.on('pointermove', onPolyTouchMoved);
  return sprite
}



function animateOperatorAlpha(a){
  for (o of cutOperators){
      createjs.Tween.get(o).to({alpha: a}, 500, createjs.Ease.getPowInOut(4))
  }
}

function onPolyTouched(event) {
  console.log("poly touched!!!")
    activePoly = this
    let touchedAtX = event.data.global.x
    let touchedAtY = event.data.global.y

    app.stage.addChild(this)
    this.dragging = true;
    this.wasDragged = false
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    this.dragStartedAt = this.y
    this.data = event.data;
}

function onPolyMoveEnd() {
    this.dragging = false;
    this.data = null;
    this.deltaTouch = []

    switch (this.TYPE){
      case OBJ_TYPE.DELETE:
      createjs.Tween.get(this).to({x: this.start[0],y: this.start[1]}, 500, createjs.Ease.getPowInOut(4))
      console.log("blocks",blocks)
      let blocksInThis = blocks.filter(e=>{
        console.log("c.center?",e.center)
        let p = new PIXI.Point(this.x,this.y)
        console.log("isitinrect?",pointInRect(p,e))
        return pointInRect(p,e)
      })
      console.log("blocksInthis",blocksInThis)
      case OBJ_TYPE.CUT:
      let blocksInCutter = blocks.filter(e=>{
        console.log("c.center?",e.center)
        let p = new PIXI.Point(this.x+CONTAINER_HEIGHT/2,this.y+CONTAINER_HEIGHT/2)
        console.log("isitinrect?",pointInRect(p,e))
        return pointInRect(p,e) && !e.isFrac
      })
      if (blocksInCutter.length == 0){
          createjs.Tween.get(this).to({x: this.start[0],y: this.start[1]}, 500, createjs.Ease.getPowInOut(4))
      } else {
          blockBeingCut = blocksInCutter[0]
          animateOperatorAlpha(1)
          createjs.Tween.get(this).to({x: blocksInCutter[0].x-CONTAINER_WIDTH/2,y: blocksInCutter[0].y-CONTAINER_HEIGHT/2}, 500, createjs.Ease.getPowInOut(4))
      }
      case OBJ_TYPE.BLOCK:
      console.log("this is a block")
       let testPoint = new PIXI.Point(this.x,this.y)
       let inDelete = pointInRect(testPoint,deleteTool)
       if (inDelete){
         console.log("in delete?")
         let i = blocks.indexOf(this)
         blocks.splice(i,1)
         app.stage.removeChild(this)
       }
    }

}

function onPolyTouchMoved() {
    if (this.dragging) {
        this.wasDragged = true
        var newPosition = this.data.getLocalPosition(this.parent);
          this.x = newPosition.x + this.deltaTouch[0]
          this.y = newPosition.y + this.deltaTouch[1]
    }
}

// Helpers
function pointInRect(p,rect){
  // This is for a rect with anchor in center
  let top = rect.y - rect.height/2
  let bottom = rect.y + rect.height/2
  let left = rect.x - rect.width/2
  let right = rect.x + rect.width/2

  let c1 = p.x < right
  let c2 = p.x > left
  let c3 = p.y < bottom
  let c4 = p.y > top

  return c1 && c2 && c3 && c4
}


document.addEventListener('keydown', function(event) {
    if(event.keyCode == 39 && !activePoly.isWhole) {

    }

});
