
let dots = []

let cordsFromGrid = []
let polys = []
let snapX = dx/3
let snapY = dx/3
let density = 4
let dB = dx*2/3
let wholeOrigin = []


let lastBlockXY = []
let completedTiles = []
let completedTileSpaces = []
let currentTileIndex = 0
let currentLevelIndex = -1
let currentType;
let nextButton = {}
let constructorBlock;
let cuttingTool;
let deleteTool;
let menuItems = []
let blocks = []


let activePoly;
let theWhole;

// ENUM
const OBJ_TYPE = {
  BLOCK: 0,
  CUT: 1,
  DELETE: 2
}

const DIM = WINDOW_WIDTH/12
const WINDOW_CENTER_X = WINDOW_WIDTH/2
const WINDOW_CENTER_Y = WINDOW_HEIGHT/2
const CONTAINER_WIDTH = DIM
const CONTAINER_HEIGHT = DIM
const CONTAINER_CENTER_X = 2.5*DIM
const CONTAINER_CENTER_Y = DIM
const CONTAINER_TOP = CONTAINER_CENTER_Y-CONTAINER_WIDTH/2
const CONTAINER_BOTTOM = CONTAINER_CENTER_Y+CONTAINER_WIDTH/2
const CONTAINER_LEFT = CONTAINER_CENTER_X-CONTAINER_WIDTH/2
const CONTAINER_RIGHT = CONTAINER_CENTER_X+CONTAINER_WIDTH/2

const v_part_dim = ()=> {
  return CONTAINER_HEIGHT/hPartitions
}

const h_part_dim = ()=> {
  return CONTAINER_WIDTH/vPartitions
}

let fractions = []
let horizontalLines = []
let verticalLines = []
let vPartitions = 1
let hPartitions = 1
let colorIndex = 0
let colors = [COLORS.BLUE,COLORS.RED,COLORS.GREEN,COLORS.ORANGE,COLORS.PURPLE]
let colorLength = colors.length
let currentColor = () => {return colors[colorIndex%colorLength]}


// Init
createMenuButtons()
layoutMenu()
//initVerticalLines(1)
initHorizontalLines(1)
animateVerticalLines(0)
animateHorizontalLines(1)
createBlockConstructor()



function cutBlock(block,pieces){

}


// Helpers

function hideGrid(){
  let toHide = [...verticalLines,...horizontalLines]
  toHide.forEach(h => h.alpha = 0)
}

function bringLinesToFront(){
  let lines = [...verticalLines,...horizontalLines]
  lines.forEach(l =>  app.stage.addChild(l))
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


function createCircleButton(text) {

    let h = DIM/4
    let w = DIM/4

    var circle = new PIXI.Graphics();
    circle.beginFill(COLORS.GREEN);
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
  containerGraphic.x = 1.5
  containerGraphic.y = 1.5

  let containerTexture = app.renderer.generateTexture(containerGraphic)
  let containerSprite = new PIXI.Sprite(containerTexture)
  containerSprite.anchor.set(0.5)
  containerSprite.width = containerGraphic.width + 1.5
  containerSprite.height = containerGraphic.height + 1.5
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
    g.y = CONTAINER_TOP
    g.x = CONTAINER_LEFT
    horizontalLines.push(g)
    app.stage.addChild(g)
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
    app.stage.addChild(l)
    if (i>hPartitions){
        createjs.Tween.get(l).to({y: CONTAINER_BOTTOM}, 500, createjs.Ease.getPowInOut(4))
    } else {
        createjs.Tween.get(l).to({y: i*spacing+CONTAINER_TOP}, 500, createjs.Ease.getPowInOut(4))
    }

  })
} else {
  hPartitions -= inc
}


}

let vPlus = createCircleButton("Ok")
app.stage.addChild(vPlus)
vPlus.y = CONTAINER_TOP - DIM/4
vPlus.x = CONTAINER_CENTER_X


let vMinus = createCircleButton("-")
//app.stage.addChild(vMinus)
vMinus.y = CONTAINER_BOTTOM + DIM/4
vMinus.x = WINDOW_CENTER_X


let hPlus = createCircleButton("+")
app.stage.addChild(hPlus)
hPlus.x = CONTAINER_RIGHT + DIM/4
hPlus.y = CONTAINER_CENTER_Y

let hMinus = createCircleButton("-")
app.stage.addChild(hMinus)
hMinus.x = CONTAINER_LEFT - DIM/4
hMinus.y = CONTAINER_CENTER_Y

hPlus.on("pointerdown",() => animateHorizontalLines(1))
hMinus.on("pointerdown",() => animateHorizontalLines(-1))
//hPlus.on("pointerdown",() => animateVerticalLines(1))
//hMinus.on("pointerdown",() => animateVerticalLines(-1))


let cont = createContainer(CONTAINER_WIDTH)
app.stage.addChild(cont)
cont.x = CONTAINER_CENTER_X
cont.y = CONTAINER_CENTER_Y

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


function createMenuButtons(){
  constructorBlock = createBlockConstructor()
  cuttingTool = createTextBox("Cut")
  deleteTool = createTextBox("Delete")

  deleteTool.TYPE = OBJ_TYPE.DELETE
  deleteTool.start = [deleteTool.x,deleteTool.y]
  deleteTool.on('pointerdown',onPolyTouched)
  deleteTool.on('pointerup',onPolyMoveEnd)
  deleteTool.on('pointermove',onPolyTouchMoved)

  cuttingTool.TYPE = OBJ_TYPE.CUT
  cuttingTool.on('pointerdown',onPolyTouched)
  cuttingTool.on('pointerup',onPolyMoveEnd)
  cuttingTool.on('pointermove',onPolyTouchMoved)
  menuItems = [constructorBlock,cuttingTool,deleteTool]
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
    graphics.on('pointerdown',newBlock)
    return graphics

}

function newBlock() {
    let newBlock = createBlock(this.type,this.color)
    app.stage.addChild(newBlock)
    newBlock.x = this.x + this.width/2
    newBlock.y = this.y + this.width/2
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
  cuttingTool.x = cuttingTool.x + constructorBlock.width/2
  cuttingTool.start = [cuttingTool.x,cuttingTool.y]
  deleteTool.x = deleteTool.x + constructorBlock.width/2
  deleteTool.start = [deleteTool.x,deleteTool.y]
}

function createBlock(size) {
  let graphics = new PIXI.Graphics();
      graphics.lineStyle(1,0xFFFFFF)
      graphics.beginFill(COLORS.BLUE);
      graphics.drawRoundedRect(0,0,DIM,DIM,3)
      graphics.endFill();
      graphics.x = 0.5
      graphics.y = 0.5

      let texture = app.renderer.generateTexture(graphics)
      let sprite = new PIXI.Sprite(texture)
      sprite.anchor.set(0.5)
      sprite.interactive = true
      sprite.on('pointerdown', onPolyTouched)
      sprite.on('pointerup', onPolyMoveEnd)
      sprite.on('pointermove', onPolyTouchMoved);
  return sprite
}

function resizeGrid(n){
  let newDx = density/n*dx
  dx = newDx
  //console.log(dots)
  for (let i = 0;i<dots.length;i++){
    for (let j = 0;j<dots[0].length;j++){
       createjs.Tween.get(dots[i][j]).to({x: i*newDx,y: j*newDx}, 1000, createjs.Ease.getPowInOut(4))
    }
  }
}


function drawGrid(n){
  //console.log("windowWidth",windowWidth)
  let gridCont = new PIXI.Container()
  for (let i = 0;i<2*n;i++){
    let dotRow = []
    for (let j = 0;j<n;j++){
      let c = new PIXI.Graphics()
      c.beginFill(0x4d5259);
      c.drawCircle(3, 3, 3);
      c.endFill();
      let cT = app.renderer.generateTexture(c)
      let cS = new PIXI.Sprite(cT)
      cS.on('pointerdown',onNodeClicked)
      cS.x = dx*i
      cS.y = dx*j
      cS.interactive = true
      cS.anchor.set(0.5)
      dotRow.push(cS)
      app.stage.addChild(cS);
    }
    dots.push(dotRow)
  }
}

function createActionButton(text,action) {

  var graphics = new PIXI.Graphics();
  graphics.lineStyle(0, 0xb7b7b7, 1)
  graphics.beginFill(COLORS.ORANGE);
  graphics.drawRoundedRect(0, 0,4*dx,dx ,5);
  graphics.endFill();

    var texture = app.renderer.generateTexture(graphics);
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
    tileContainer.x = wholeOrigin[0]+2*dx
    tileContainer.y = dx


    tileContainer.tile = tile
    app.stage.addChild(tileContainer)
    return tileContainer
}

function onPolyTouched(event) {
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
      createjs.Tween.get(this).to({x: this.start[0],y: this.start[1]}, 500, createjs.Ease.getPowInOut(4))
      case OBJ_TYPE.BLOCK:
      console.log("this is the delete block")
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
