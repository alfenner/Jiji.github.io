
let backGround = new PIXI.Sprite.from('../images/blue-gradient.png')
backGround.width = WINDOW_WIDTH
backGround.height = WINDOW_HEIGHT
backGround.x = 0
backGround.y = 0
backGround.alpha = 0
app.stage.addChild(backGround)
createjs.Tween.get(backGround).to({alpha: 1}, 500, createjs.Ease.getPowInOut(4))


const DIM = WINDOW_WIDTH/12
const WINDOW_CENTER_X = WINDOW_WIDTH/2
const WINDOW_CENTER_Y = WINDOW_HEIGHT/2
const CONTAINER_WIDTH = WINDOW_HEIGHT*0.6
const CONTAINER_HEIGHT = CONTAINER_WIDTH
const CONTAINER_TOP = 0
const CONTAINER_BOTTOM = CONTAINER_HEIGHT
const CONTAINER_LEFT = 0
const CONTAINER_RIGHT = CONTAINER_WIDTH
const TWELFTH_WIDTH = CONTAINER_WIDTH/12

const containers = []

let gridToolLeft = createGridTool()
app.stage.addChild(gridToolLeft)
gridToolLeft.x = 3/4*WINDOW_WIDTH - CONTAINER_WIDTH/2
gridToolLeft.y = WINDOW_CENTER_Y-CONTAINER_HEIGHT/2
containers.push(gridToolLeft)

let gridToolRight = createGridTool()
app.stage.addChild(gridToolRight)
gridToolRight.x = WINDOW_WIDTH/4 - CONTAINER_WIDTH/2
gridToolRight.y = WINDOW_CENTER_Y-CONTAINER_HEIGHT/2
containers.push(gridToolRight)


function testFunction(){
  console.log("Calling my test fucntion")
}

function createGridTool(){


  let grid = new PIXI.Container()

  let vPlus = createCircleButton("+")
  grid.addChild(vPlus)
  vPlus.y = CONTAINER_TOP - DIM/4
  vPlus.x = CONTAINER_WIDTH/2

  let vMinus = createCircleButton("-")
  vMinus.y = CONTAINER_BOTTOM + DIM/4
  vMinus.x = CONTAINER_WIDTH/2
  grid.addChild(vMinus)

  let hPlus = createCircleButton("+")
  hPlus.x = CONTAINER_RIGHT + DIM/4
  hPlus.y = CONTAINER_HEIGHT/2
  grid.addChild(hPlus)


  let hMinus = createCircleButton("-")
  hMinus.x = CONTAINER_LEFT - DIM/4
  hMinus.y = CONTAINER_HEIGHT/2
  grid.addChild(hMinus)


  vPlus.on("pointerdown",() => animateHorizontalLines(1))
  vMinus.on("pointerdown",() => animateHorizontalLines(-1))
  hPlus.on("pointerdown",() => animateVerticalLines(1))
  hMinus.on("pointerdown",() => animateVerticalLines(-1))


  let cont = createContainer(CONTAINER_WIDTH)
  grid.addChild(cont)
  cont.x = CONTAINER_WIDTH/2
  cont.y = CONTAINER_HEIGHT/2
  cont.interactive = true
  cont.on('pointerdown',createSquare)
  grid.addChild(vPlus)


  let fractions = []
  let horizontalLines = []
  let verticalLines = []
  let vPartitions = 1
  let hPartitions = 1
  let colorIndex = 0
  let colors = [COLORS.BLUE,COLORS.RED,COLORS.GREEN,COLORS.ORANGE,COLORS.PURPLE]
  let colorLength = colors.length
  let currentColor = () => {return colors[colorIndex%colorLength]}


  initVerticalLines(1)
  initHorizontalLines(1)
  animateVerticalLines(1)
  animateHorizontalLines(1)


  const v_part_dim = ()=> {
    return CONTAINER_HEIGHT/hPartitions
  }

  const h_part_dim = ()=> {
    return CONTAINER_WIDTH/vPartitions
  }

  const total_parts = ()=> {hPartitions*vPartitions}

  //grid.addChild()

// Helpers

function hideGrid(){
  let toHide = [...verticalLines,...horizontalLines]
  toHide.forEach(h => h.alpha = 0)
}

function bringLinesToFront(){
  let lines = [...verticalLines,...horizontalLines]
  lines.forEach(l =>  grid.addChild(l))
}

// Constructors
function createCircleButton(text) {

    let h = DIM/4
    let w = DIM/4

    var circle = new PIXI.Graphics();
    circle.lineStyle(2,0xb7b7b7)
    circle.beginFill(0xFFFFFF);
    circle.drawCircle(DIM/5, DIM/5,DIM/5);
    circle.endFill();
    circle.x = 1
    circle.y = 1

    let circleTexture = app.renderer.generateTexture(circle);
    let circleSprite = new PIXI.Sprite(circleTexture)
    circleSprite.alpha = 0.8
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

function createSquare(event){

  bringLinesToFront()
  let hdim = h_part_dim()
  let vdim = v_part_dim()
  var block = new PIXI.Graphics();
  block.lineStyle(2,0xFFFFFF)
  block.beginFill(currentColor());
  block.drawRoundedRect(0, 0, hdim, vdim,5);
  block.endFill();
  block.x = 1
  block.y = 1

  let blockTexture = app.renderer.generateTexture(block)
  let blockSprite = new PIXI.Sprite(blockTexture)
  blockSprite.alpha = 0.5

  let pos = event.data.getLocalPosition(this.parent)

  let i = Math.floor((pos.x-CONTAINER_LEFT)/hdim)
  let j = Math.floor((pos.y-CONTAINER_TOP)/vdim)

  app.stage.addChild(blockSprite)
  blockSprite.x = grid.x + i*hdim
  blockSprite.y = grid.y + j*vdim
  blockSprite.interactive = true
  blockSprite.on('pointerdown',onFracStart)
  blockSprite.on('pointerup',onFracEnd)
  blockSprite.on('pointermove',onFracMove)
}


function createContainer(width){
  let containerGraphic = new PIXI.Graphics()
  containerGraphic.lineStyle(3,0x000000)
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
    g.lineStyle(3,0x000000)
    g.lineTo(0,CONTAINER_WIDTH)
    g.y = CONTAINER_TOP
    g.x = CONTAINER_LEFT
    verticalLines.push(g)
    grid.addChild(g)
  }
}

function initHorizontalLines(partition){
  for (let i = 0;i<11;i++){
    let g = new PIXI.Graphics()
    g.lineStyle(3,0x000000)
    g.lineTo(CONTAINER_WIDTH,0)
    g.y = CONTAINER_TOP
    g.x = CONTAINER_LEFT
    horizontalLines.push(g)
    grid.addChild(g)
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
    grid.addChild(l)
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
    grid.addChild(l)
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

function onFracStart(event){
    bringLinesToFront()
    let touchedAtX = event.data.global.x
    let touchedAtY = event.data.global.y
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    app.stage.addChild(this)
    this.data = event.data;
    this.dragging = true
}

function round(val,origin){
  let i = Math.round(Math.abs(val-origin)/(CONTAINER_WIDTH/12))
  return origin+i*CONTAINER_WIDTH/12
}

function onFracEnd(){
    this.data = null;
    this.dragging = false
    if (this.y+this.height > WINDOW_HEIGHT){
      let i = fractions.indexOf(this)
      fractions.splice(i,1)
      app.stage.removeChild(this)
    }

    console.log("GridXY",grid.x,grid.y)

    let x = round(this.x,grid.x)
    let y = round(this.y,grid.y)

    //createjs.Tween.get(this).to({x: x,y: y}, 500, createjs.Ease.getPowInOut(4))
}

function onFracMove(){
    if (this.dragging){
      let pointerPosition = this.data.getLocalPosition(this.parent);
        this.y = pointerPosition.y + this.deltaTouch[1]
        this.x = pointerPosition.x + this.deltaTouch[0]
    }
}

return grid

}

// Helpers
function pointInRect(p,rect){
  // This is for a rect with anchor in center

    let top = rect.y - rect.height*rect.anchor
    let bottom = rect.y + rect.height*rect.anchor
    let left = rect.x - rect.width*rect.anchor
    let right = rect.x + rect.width*rect.anchor

  let c1 = p.x < right
  let c2 = p.x > left
  let c3 = p.y < bottom
  let c4 = p.y > top

  return c1 && c2 && c3 && c4
}
