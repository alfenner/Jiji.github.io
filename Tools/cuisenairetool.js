const DIM = WINDOW_WIDTH/12
const WHOLE_WIDTH = 5*DIM
const JIJI_CONT_LEFT = 3*DIM
const JIJI_CONT_TOP = DIM
const TWELFTH_WIDTH = WHOLE_WIDTH/12
const WINDOW_CENTER_X = WINDOW_WIDTH/2
const WINDOW_CENTER_Y = WINDOW_HEIGHT/2
const CONTAINER_ORIGIN_X = TWELFTH_WIDTH
const CONTAINER_ORIGIN_Y = 2*DIM
const CONTAINER_WIDTH = DIM
const CONTAINER_HEIGHT = DIM
const CONTAINER_CENTER_X = DIM
const CONTAINER_CENTER_Y = 2.5*DIM
const CONTAINER_TOP = CONTAINER_CENTER_Y-CONTAINER_WIDTH/2
const CONTAINER_BOTTOM = CONTAINER_CENTER_Y+CONTAINER_WIDTH/2
const CONTAINER_LEFT = CONTAINER_CENTER_X-CONTAINER_WIDTH/2
const CONTAINER_RIGHT = CONTAINER_CENTER_X+CONTAINER_WIDTH/2


let backGround = new PIXI.Sprite.from('../images/blue-gradient.png')
backGround.width = WINDOW_WIDTH
backGround.height = WINDOW_HEIGHT
backGround.x = 0
backGround.y = 0
backGround.alpha = 0
app.stage.addChild(backGround)
createjs.Tween.get(backGround).to({alpha: 1}, 500, createjs.Ease.getPowInOut(4))


let mostRecentRow = 0
let rows = [[],[],[],[],[],[],[],[]]
let constructorBlock;
let jijis = []
let plusJiji;
let minusJiji;
let jijiDIM;
let cuttingTool;
let deleteTool;
let resetTool;
let blocks = []
let jijiIcon;
let activeBlock;
let cutterContainer = new PIXI.Container()
let fractions = []
let horizontalLines = []
let verticalLines = []
let vPartitions = 1
let hPartitions = 1
let colorIndex = 0
let vPlus;
let vMinus;
let hPlus;
let hMinus;
let cont;
let cutting = false
let blockBeingCut;
let cutOperators = []

// ENUM
const OBJ_TYPE = {
  BLOCK: 0,
  CUT: 1,
  DELETE: 2
}

// Init
//createMenuButtons()
//layoutMenu()
//initVerticalLines(1)


// Rouge Init

resetTool = createReset()
resetTool.interactive = true
resetTool.on('pointerdown',reset)
app.stage.addChild(resetTool)
resetTool.x = WINDOW_WIDTH - DIM/2
resetTool.y = DIM/2

trashCan = createTrashCan()
app.stage.addChild(trashCan)
trashCan.x = WINDOW_WIDTH - DIM/2
trashCan.y = 1.5*DIM

// Factory Functions

function createReset(){
  let reset = new PIXI.Sprite.from('../images/reset.png')
  reset.width = DIM/2
  reset.height = DIM/2
  reset.anchor.set(0.5)
  return reset
}

function createTrashCan(){
  let trashCan = new PIXI.Sprite.from('../images/trash-can.png')
  trashCan.width = DIM/2
  trashCan.height = DIM/2
  trashCan.anchor.set(0.5)
  return trashCan
}

function createJijiAsset() {
    let blockSprite = new PIXI.Sprite.from('../images/jiji.png')
    let w = jiji_width()
    blockSprite.width = w
    blockSprite.height = w
    blockSprite.anchor.set(0.5)
    return blockSprite
}


function reset(){
  console.log("reset")
  for (b of blocks){
    app.stage.removeChild(b)
  }

  blocks = []
  fractions = []
}



//
function drawPlusMinusButtons(){
  plusJiji = createCircleButton("+",0xFFFFFF)
  minusJiji = createCircleButton("-",0xFFFFFF)
  jijiIcon = createJijiAsset()
  jijiIcon.width = DIM/3
  jijiIcon.height = DIM/3
  plusJiji.interactive = true
  minusJiji.interactive = true
  plusJiji.on('pointerdown',()=>{incJiji(1)})
  minusJiji.on('pointerdown',()=>{incJiji(-1)})
  app.stage.addChild(plusJiji)
  app.stage.addChild(minusJiji)
  app.stage.addChild(jijiIcon)
  plusJiji.x = 3*DIM/2
  plusJiji.y = 3.5*DIM
  jijiIcon.y = 3.5*DIM
  jijiIcon.x = DIM
  minusJiji.x = DIM/2
  minusJiji.y = 3.5*DIM

}

function createCutterContainer(){
  cutterContainer.interactive = true
  cutterContainer.TYPE = OBJ_TYPE.CUT
  for (l of horizontalLines){
    cutterContainer.addChild(l)
  }
  hPlus.alpha = 0
  vPlus.alpha = 0
  hMinus.alpha = 0
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
  return cutterContainer
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


function createContainer(w,h){
  let containerGraphic = new PIXI.Graphics()
  containerGraphic.lineStyle(2,0x000000)
  containerGraphic.moveTo(0,0)
  containerGraphic.lineTo(0,h)
  containerGraphic.lineTo(w,h)
  containerGraphic.lineTo(w,0)
  containerGraphic.lineTo(0,0)
  containerGraphic.interactive = true
  containerGraphic.x = 1
  containerGraphic.y = 1

  let containerTexture = app.renderer.generateTexture(containerGraphic)
  let containerSprite = new PIXI.Sprite(containerTexture)
  containerSprite.width = containerGraphic.width
  containerSprite.height = containerGraphic.height
  console.log("container anchor",containerSprite.anchor)
  return containerSprite
}

let container = createContainer(2*WHOLE_WIDTH,8*TWELFTH_WIDTH)
app.stage.addChild(container)
container.x = CONTAINER_ORIGIN_X
container.y = CONTAINER_ORIGIN_Y

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

  vPartitions  += inc
  if (vPartitions != 0 && vPartitions != 11){
    colorIndex += 1

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


// Pass it the level and it will layout the buttons for that new level.
function createBlockConstructor(w,h,i) {
  let blockContainer = new PIXI.Container()
  var graphics = new PIXI.Graphics();
   let color = COLORS[COLOR_KEYS[i%9]]
   graphics.lineStyle(1,0xFFFFFF)
    graphics.beginFill(COLORS[COLOR_KEYS[i%9]]);
    graphics.drawRoundedRect(0,0,w,h,2)
    graphics.endFill();
    graphics.color = color
    console.log("graphics dims",graphics.width,graphics.height)
    let graphicsTexture = app.renderer.generateTexture(graphics)
    let graphicsSprite = new PIXI.Sprite(graphicsTexture)
    blockContainer.addChild(graphicsSprite)
    blockContainer.interactive = true
    blockContainer.color = color
    blockContainer.den = i
    let fracText = i == 1 ? "1" : "1/"+i
    let frac = new PIXI.Text(fracText,{fontFamily : 'Chalkboard SE', fontSize: graphicsSprite.height/3, fill : 0x000000, align : 'center'});

    frac.anchor.set(0.5)
    frac.x = graphicsSprite.width/2
    frac.y = graphicsSprite.height/2
    blockContainer.on('pointerdown',() => {
      setTimeout(()=>{
        newBlock(blockContainer)},100)
    })

    blockContainer.addChild(graphicsSprite)
    blockContainer.addChild(frac)

    return blockContainer
}

function newBlock(g,frac) {
    let newBlock = createBlock(g.width,g.height,g.color,g.den)
    app.stage.addChild(newBlock)
    newBlock.x = g.x
    newBlock.y = g.y
    let rowMax = getRowMax(rows[mostRecentRow])
    rows[mostRecentRow].push(newBlock)
    newBlock.currentRow = mostRecentRow
    createjs.Tween.get(newBlock).to({x: TWELFTH_WIDTH+rowMax,y: CONTAINER_ORIGIN_Y+mostRecentRow*TWELFTH_WIDTH}, 700, createjs.Ease.getPowInOut(4))
}

function createCuisenaireMenu(){
  let cumSum = 0
  let j = 0
  let h = WHOLE_WIDTH/12
  for (let i = 1;i<13;i++){
    let w = 1/i*WHOLE_WIDTH
    let newConstructor = createBlockConstructor(w,h,i)
    newConstructor.x = TWELFTH_WIDTH+cumSum
    newConstructor.y = TWELFTH_WIDTH+1.2*j*h
    cumSum = cumSum + w + 10
    if (cumSum > 1.6*WHOLE_WIDTH){
      j += 1
      cumSum = 0
    }
    app.stage.addChild(newConstructor)
  }
}

createCuisenaireMenu()

function condenseAfter(row,k,width){
  console.log("row,k,width",row,k,width)
  for (let i = 0;i<row.length;i++){
    if (i >= k){
      createjs.Tween.get(row[i]).to({x: row[i].x-width}, 500, createjs.Ease.getPowInOut(4))
    }
  }
}

function createBlock(w,h,color,i) {
  let blockContainer = new PIXI.Container()
  var graphics = new PIXI.Graphics();
   graphics.lineStyle(1,0xFFFFFF)
    graphics.beginFill(color);
    graphics.drawRoundedRect(0,0,w-2,h-2,2)
    graphics.endFill();
    graphics.color = color
    console.log("graphics dims",graphics.width,graphics.height)
    let graphicsTexture = app.renderer.generateTexture(graphics)
    let graphicsSprite = new PIXI.Sprite(graphicsTexture)
    blockContainer.addChild(graphicsSprite)
    blockContainer.interactive = true
    blockContainer.color = color
    let fracText = i == 1 ? "1" : "1/"+i
    let frac = new PIXI.Text(fracText,{fontFamily : 'Chalkboard SE', fontSize: graphicsSprite.height/3, fill : 0x000000, align : 'center'});

    frac.anchor.set(0.5)
    frac.x = graphicsSprite.width/2
    frac.y = graphicsSprite.height/2
    blockContainer.addChild(graphicsSprite)
    blockContainer.addChild(frac)

    blockContainer.on('pointerdown', onPolyTouched)
    blockContainer.on('pointerup', onPolyMoveEnd)
    blockContainer.on('pointermove', onPolyTouchMoved);
  return blockContainer
}



function onPolyTouched(event) {

  if (this.TYPE == OBJ_TYPE.CUT){
    cutting = true
  }
    activePoly = this
    let touchedAtX = event.data.global.x
    let touchedAtY = event.data.global.y

    app.stage.addChild(this)
    this.dragging = true;
    this.wasDragged = false
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    this.dragStartedAt = [this.x,this.y]
    this.data = event.data;
}

function onPolyMoveEnd() {
    this.dragging = false;
    this.data = null;
    this.deltaTouch = []

    let newXVal;
    let p = new PIXI.Point(this.x+this.width/2,this.y+this.height/2)
    let inContainer = pointInRect(p,container)
    let inTrash = false

    console.log("in container",inContainer)
    //console.log("in trash",inTrash)


    if (inContainer){
    let y = roundY(this.y)
    let x = roundX(this.x)
    let r = getRow(this.y)
    let i = rows[this.currentRow].indexOf(this)
    rows[this.currentRow].splice(i,1)
    condenseAfter(rows[this.currentRow],i,this.width)
    mostRecentRow = r
    if (r != this.currentRow){
      newXVal = CONTAINER_ORIGIN_X+getRowMax(rows[r])
      rows[r].push(this)
      this.currentRow = r
    } else {
      rows[this.currentRow].push(this)
      newXVal = CONTAINER_ORIGIN_X+getRowMax(rows[r]) - this.width
    }
      createjs.Tween.get(this).to({x: newXVal,y: y}, 500, createjs.Ease.getPowInOut(4))
  } else {
      let i = rows[this.currentRow].indexOf(this)
      rows[this.currentRow].splice(i,1)
      app.stage.removeChild(this)
  }
}

function getRowMax(row){
  let sum = 0
  row.forEach(r => {sum = sum + r.width})
  return sum
}

function getRow(yVal){
  return Math.round((yVal-CONTAINER_ORIGIN_Y)/(WHOLE_WIDTH/12))
}

function roundY(val){
  let i = Math.round((val-CONTAINER_ORIGIN_Y)/(WHOLE_WIDTH/12))
  return CONTAINER_ORIGIN_Y+TWELFTH_WIDTH*i
}

function roundX(val){
  let i = Math.round((val-CONTAINER_ORIGIN_X)/(WHOLE_WIDTH/12))
  return TWELFTH_WIDTH*i
}

function onPolyTouchMoved() {
    if (this.dragging) {
        this.wasDragged = true
        var newPosition = this.data.getLocalPosition(this.parent);
          this.x = newPosition.x + this.deltaTouch[0]
          this.y = newPosition.y + this.deltaTouch[1]
    }
}

function pointInRect(p,rect){
  // This is for a rect with anchor in center
  let top;
  let bottom;
  let left;
  let right;

  if (rect.anchor._x == 0.5){
    top = rect.y - rect.height/2
    bottom = rect.y + rect.height/2
    left = rect.x - rect.width/2
    right = rect.x + rect.width/2
 } else {
   top = rect.y
   bottom = rect.y + rect.height
   left = rect.x
   right = rect.x + rect.width
 }
  console.log("top,bottom,left,right",top,bottom,left,right)

  let c1 = p.x < right
  let c2 = p.x > left
  let c3 = p.y < bottom
  let c4 = p.y > top

  return c1 && c2 && c3 && c4
}
