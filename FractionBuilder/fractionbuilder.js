
let backGround = new PIXI.Sprite.from('../images/blue-gradient.png')
backGround.width = WINDOW_WIDTH
backGround.height = WINDOW_HEIGHT
backGround.x = 0
backGround.y = 0
backGround.alpha = 0
app.stage.addChild(backGround)
createjs.Tween.get(backGround).to({alpha: 1}, 500, createjs.Ease.getPowInOut(4))


const DIM = WINDOW_WIDTH/12
const LEFT_X = 3/4*WINDOW_WIDTH
const RIGHT_X = 1/4*WINDOW_WIDTH
const WINDOW_CENTER_X = WINDOW_WIDTH/2
const WINDOW_CENTER_Y = WINDOW_HEIGHT/2
const CONTAINER_WIDTH = WINDOW_HEIGHT*0.3
const CONTAINER_HEIGHT = CONTAINER_WIDTH*2
const CONTAINER_TOP = 0
const CONTAINER_BOTTOM = CONTAINER_HEIGHT
const CONTAINER_LEFT = 0
const CONTAINER_RIGHT = CONTAINER_WIDTH
const TWELFTH_WIDTH = CONTAINER_WIDTH/12

const containers = []

let toggleButton;

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

function createGridTool(){

  let grid = new PIXI.Container()

  let currBlock = {}
  currBlock.k == -1

  let vPlus = createCircleButton("+")
  grid.addChild(vPlus)
  vPlus.y = CONTAINER_BOTTOM + DIM/4
  vPlus.x = 3*CONTAINER_WIDTH/4

  let vMinus = createCircleButton("-")
  vMinus.y = CONTAINER_BOTTOM + DIM/4
  vMinus.x = CONTAINER_WIDTH/4
  grid.addChild(vMinus)

  let hPlus = createCircleButton("+")
  hPlus.x = CONTAINER_RIGHT + DIM/4
  hPlus.y = CONTAINER_HEIGHT/2
  //grid.addChild(hPlus)


  let hMinus = createCircleButton("-")
  hMinus.x = CONTAINER_LEFT - DIM/4
  hMinus.y = CONTAINER_HEIGHT/2
  //grid.addChild(hMinus)

  let frac = createFraction(0,1)
  frac.x = CONTAINER_LEFT
  frac.y = CONTAINER_TOP - DIM/4
  grid.addChild(frac)



  let cont = createContainer(CONTAINER_WIDTH,CONTAINER_HEIGHT)
  grid.addChild(cont)
  cont.x = CONTAINER_WIDTH/2
  cont.y = CONTAINER_HEIGHT/2
  cont.interactive = true
  cont.on('pointerdown',createStack)


  let fractions = []
  let horizontalLines = []
  let verticalLines = []
  let vPartitions = 0
  let hPartitions = 1
  let colorIndex = 0
  let colors = [COLORS.BLUE,COLORS.RED,COLORS.GREEN,COLORS.ORANGE,COLORS.PURPLE]
  let colorLength = colors.length
  let currentColor = () => {return colors[colorIndex%colorLength]}
  let currFrac = [0,1]

  const v_part_dim = ()=> {
    return CONTAINER_HEIGHT/hPartitions
  }

  const h_part_dim = ()=> {
    return CONTAINER_WIDTH/vPartitions
  }

  const total_parts = ()=> {hPartitions*vPartitions}



  //initVerticalLines(1)
  initHorizontalLines(1)
  animateVerticalLines(1)
  animateHorizontalLines(1)

  vPlus.on("pointerdown",() => animateHorizontalLines(1))
  vMinus.on("pointerdown",() => animateHorizontalLines(-1))
  hPlus.on("pointerdown",() => animateVerticalLines(1))
  hMinus.on("pointerdown",() => animateVerticalLines(-1))

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


function createStack(event){

  bringLinesToFront()



  let hdim = h_part_dim()
  let vdim = v_part_dim()
  let pos = event.data.getLocalPosition(this.parent)
  let i = Math.floor((pos.x-CONTAINER_LEFT)/hdim)
  let j = Math.floor((pos.y-CONTAINER_TOP)/vdim)
  let k = hPartitions - j
  console.log("vPartitions",vPartitions)
  console.log("hPartitions",hPartitions)
  console.log("k",k)
  if (false){
    // do nothing
  }
  else {

    var block = new PIXI.Graphics();
    block.beginFill(COLORS.BLUE);
    block.drawRoundedRect(0, 0, hdim,CONTAINER_HEIGHT*k/hPartitions,5);
    currFrac = [k,hPartitions]
    block.endFill();
    block.x = 1
    block.y = 1

    let blockTexture = app.renderer.generateTexture(block)
    let blockSprite = new PIXI.Sprite(blockTexture)
    blockSprite.alpha = 0.5


    blockSprite.x = CONTAINER_WIDTH
    blockSprite.y = CONTAINER_HEIGHT
    blockSprite.anchor.set(1)
    grid.removeChild(currBlock)

    if (k == 1 && currBlock.k == 1){
      currBlock.k = 0
    } else {
      grid.addChild(blockSprite)
      blockSprite.k = k
      currBlock = blockSprite
   }

   }
}


function createContainer(width,height){
  let containerGraphic = new PIXI.Graphics()
  containerGraphic.lineStyle(3,0x000000)
  containerGraphic.moveTo(0,0)
  containerGraphic.lineTo(0,height)
  containerGraphic.lineTo(width,height)
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
    g.lineTo(0,CONTAINER_HEIGHT)
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

  vPartitions  += inc
  if (vPartitions != 0 && vPartitions != 11){
    colorIndex += 1

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

  console.log("ANIMATING horizontalLines")
  hPartitions  += inc
  if (hPartitions != 0 && hPartitions != 11){

  currFrac[1] = hPartitions
  if (currFrac[0] > hPartitions){
    currFrac[0] = hPartitions
  }

  let dim = h_part_dim()
  createjs.Tween.get(currBlock).to({height: CONTAINER_HEIGHT*currFrac[0]/currFrac[1]}, 500, createjs.Ease.getPowInOut(4))

  colorIndex += 1

  let spacing = CONTAINER_HEIGHT/hPartitions

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
    let touchedAtX = event.data.getLocalPosition(this.parent).x
    let touchedAtY = event.data.getLocalPosition(this.parent).y
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    grid.addChild(this)
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

    let x = round(this.x,grid.x)
    let y = round(this.y,grid.y)

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




function createFraction(n,d) {


    let sf = 0.3

    let tileContainer = new PIXI.Container()

    let whole = d == 1 ? true : false

    let h = 2*DIM
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

    tileContainer.addChild(tile)
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
    tileContainer.alpha = 0.9

    tileContainer.write = (n,d) => {
      num.text = n
      den.text = d
    }
    return tileContainer
}


function toggleMode(){

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
