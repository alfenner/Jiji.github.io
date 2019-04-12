
const DIM = WINDOW_WIDTH/12
const WINDOW_CENTER_X = WINDOW_WIDTH/2
const WINDOW_CENTER_Y = WINDOW_HEIGHT/2
const CONTAINER_WIDTH = 500
const CONTAINER_HEIGHT = 500
const CONTAINER_TOP = WINDOW_HEIGHT/2-CONTAINER_WIDTH/2
const CONTAINER_BOTTOM = WINDOW_HEIGHT/2+CONTAINER_WIDTH/2
const CONTAINER_LEFT = WINDOW_WIDTH/2-CONTAINER_WIDTH/2
const CONTAINER_RIGHT = WINDOW_WIDTH/2+CONTAINER_WIDTH/2

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
  blockSprite.anchor.set(0.5)
  blockSprite.alpha = 0.5

  console.log("vdim",h_part_dim())
  let pos = event.data.getLocalPosition(this.parent)
  console.log("hdim,vdim",hdim,vdim)
  let i = Math.floor((pos.x-CONTAINER_LEFT)/hdim)
  let j = Math.floor((pos.y-CONTAINER_TOP)/vdim)
  console.log("i,j",i,j)
  app.stage.addChild(blockSprite)
  blockSprite.x = CONTAINER_LEFT+i*hdim+hdim/2
  blockSprite.y = CONTAINER_TOP+j*vdim+vdim/2
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
    app.stage.addChild(g)
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

initVerticalLines(1)
initHorizontalLines(1)
animateVerticalLines(1)
animateHorizontalLines(1)


let vPlus = createCircleButton("+")
app.stage.addChild(vPlus)
vPlus.y = CONTAINER_TOP - DIM/4
vPlus.x = WINDOW_CENTER_X


let vMinus = createCircleButton("-")
app.stage.addChild(vMinus)
vMinus.y = CONTAINER_BOTTOM + DIM/4
vMinus.x = WINDOW_CENTER_X


let hPlus = createCircleButton("+")
app.stage.addChild(hPlus)
hPlus.x = CONTAINER_RIGHT + DIM/4
hPlus.y = WINDOW_CENTER_Y

let hMinus = createCircleButton("-")
app.stage.addChild(hMinus)
hMinus.x = CONTAINER_LEFT - DIM/4
hMinus.y = WINDOW_CENTER_Y

vPlus.on("pointerdown",() => animateHorizontalLines(1))
vMinus.on("pointerdown",() => animateHorizontalLines(-1))
hPlus.on("pointerdown",() => animateVerticalLines(1))
hMinus.on("pointerdown",() => animateVerticalLines(-1))


let cont = createContainer(500)
app.stage.addChild(cont)
cont.x = WINDOW_WIDTH/2
cont.y = WINDOW_HEIGHT/2
cont.interactive = true
cont.on('pointerdown',createSquare)


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
