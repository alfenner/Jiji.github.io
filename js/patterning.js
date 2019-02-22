
let dots = [[]]
let colors = {'orange':0xffaa32,'red': 0xff5121,'purple':0x9966FF,'blue':0x216ae0,'pink':0xf721ff}
let cordsFromGrid = []
let polys = []
let dx = 35
let dy = 35

const types = {
  'whole': [[4*dx,4*dx],[8*dx,4*dx],[8*dx,8*dx],[4*dx,8*dx]],
  'fourthRect': [[0,0],[0,4*dx],[dx,4*dx],[dx,0]],
  'fourthRightTriangle': [[0,0],[0,4*dx],[2*dx,4*dx]],
  'fourthIsoceles': [[0,0],[2*dx,2*dx],[4*dx,0]],
  'halfRect': [[0,0],[0,4*dx],[2*dx,4*dx],[2*dx,0]],
  'fourthSquare': [[0,0],[0,2*dx],[2*dx,2*dx],[2*dx,0]],
  'halfTriangle':[[0,0],[0,4*dx],[4*dx,0]]
}

let whole = [[4*dx,4*dx],[8*dx,4*dx],[8*dx,8*dx],[4*dx,8*dx]]
let fourthRect = [[0,0],[0,4*dx],[dx,4*dx],[dx,0]]
let fourthRightTriangle = [[0,0],[0,4*dx],[2*dx,4*dx]]
let fourthIsoceles = [[0,0],[2*dx,2*dx],[4*dx,0]]
let halfRect = [[0,0],[0,4*dx],[2*dx,4*dx],[2*dx,0]]
let fourthSquare = [[0,0],[0,2*dx],[2*dx,2*dx],[2*dx,0]]

let activePoly;

function layoutPolys() {
for (let i=0;i<polys.length;i++) {
  console.log("tweening")
    createjs.Tween.get(polys[i]).to({x: dx+3*dx*i,y: 4*dx}, 500, createjs.Ease.getPowInOut(4))
}
}

function drawWhole(){
  let c = new PIXI.Container()
  var graphics = new PIXI.Graphics();
  graphics.moveTo(4*dx,4*dx)
  graphics.lineStyle(3, 0x000000);
  for (let i = 0;i <= whole.length;i++){
      graphics.lineTo(whole[i%4][0],whole[i%4][1])
  }
  var grabber= new PIXI.Graphics();
  grabber.beginFill(0xFFFFFF)
  grabber.moveTo(4*dx,4*dx)
  grabber.alpha = 0.5
  for (let i = 0;i <= whole.length;i++){
      grabber.lineTo(whole[i%4][0],whole[i%4][1])
  }
  grabber.endFill()
  c.addChild(graphics)
  c.addChild(grabber)

  c.interactive = true
  c.isWhole = true
  c.on('pointerdown', onPolyTouched)
  c.on('pointerup', onPolyMoveEnd)
  c.on('pointermove', onPolyTouchMoved);
  c.polyCords = whole
  c.actualWidth = c.width
  c.actualHeight = c.height


  tiler.stage.addChild(c)
}

function createPolygon(type,color) {
  cords = types[type]
  console.log("incoming cords",cords)
  var graphics = new PIXI.Graphics();
      graphics.lineStyle(2,0x000000)
      graphics.beginFill(color);
      //graphics.moveTo(cords[0][0],cords[0][1])

  for (let i  = 0;i<=cords.length;i++){
      graphics.lineTo(cords[i%cords.length][0],cords[i%cords.length][1])
  }

  graphics.endFill();
  console.log("graphics X Y",graphics.x,graphics.y)

    var texture = tiler.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    let tileContainer = new PIXI.Container()
    tile.polyCords = offset(cords,[tile.width/2,tile.height/2])
    tile.anchor.set(0.5)
    tile.alpha = 0.5
    tile.type = type

    tile.actualWidth = tile.width
    tile.actualHeight = tile.height
    tile.color = color
    //tileContainer.addChild(tile)

    //tileContainer.interactive = true;
    //graphics.anchor.set(0.5);

    tile.interactive = true
    tile.active = false
    tile.buttonMode = true
    tile.on('pointerdown', onPolyTouched)
    tile.on('pointerup', onPolyMoveEnd)
    tile.on('pointermove', onPolyTouchMoved);
    tiler.stage.addChild(tile)
    polys.push(tile)
    activePoly = tile


    console.log("tile H W",tile.width,tile.height)
    console.log("tile X Y",tile.x,tile.y)
    tile.x = 0
    tile.y = 0
}


function drawGrid(n){
  let gridCont = new PIXI.Container()
  for (let i = 0;i<2*n;i++){
    let dotRow = []
    for (let j = 0;j<n;j++){
      let c = new PIXI.Graphics()
      c.beginFill(0x4d5259);
      c.drawCircle(3, 3, 3);
      c.endFill();
      let cT = tiler.renderer.generateTexture(c)
      let cS = new PIXI.Sprite(cT)
      cS.on('pointerdown',onNodeClicked)
      cS.x = 35*i
      cS.y = 35*j
      cS.interactive = true
      cS.anchor.set(0.5)
      dotRow.push(cS)
      tiler.stage.addChild(cS);
    }
    dots.push(dotRow)
  }
}

drawGrid(20)

function onNodeClicked() {
  cordsFromGrid.push([this.x,this.y])
  if (false){
    console.log("drawing!!")
    cordsFromGrid.push(cordsFromGrid[0])
    createPolygon(cordsFromGrid)
  }
}


function onPolyTouched(event) {
  activePoly = this
  let touchedAtX = event.data.global.x
  let touchedAtY = event.data.global.y
  console.log("touchedAtX,touchedAtY",touchedAtX,touchedAtY)
  console.log("delta touch",[this.x-touchedAtX,this.y-touchedAtY])
  console.log("this.polyCords",this.polyCords)


if (isPointInPoly([touchedAtX-this.x,touchedAtY-this.y],this.polyCords)){
    tiler.stage.addChild(this)
    this.dragging = true;
    this.wasDragged = false
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    this.dragStartedAt = this.y
    this.data = event.data;
    this.alpha = 0.5;
} else if (!isPointInPoly([touchedAtX-this.x,touchedAtY-this.y],this.polyCords)){
      let point = new PIXI.Point(touchedAtX,touchedAtY)
      for (let p of polys) {
        if (p.containsPoint(point) && p != this){
          tiler.stage.addChild(p)
          p.dragging = true;
          p.wasDragged = false
          p.deltaTouch = [p.x-touchedAtX,p.y-touchedAtY]
          p.dragStartedAt = this.y
          p.data = event.data;
          p.alpha = 0.5;
        }
    }
}
}


function onPolyMoveEnd() {

    console.log("my Sprie:",this)
    console.log("my sprites width",this.width)

    let dI = (this.x-this.actualWidth/2)/dx
    let dJ = (this.y-this.actualHeight/2)/dy
    let deltaI = Math.round(dI) - dI
    let deltaJ = Math.round(dJ) - dJ
    this.dragging = false;
    this.data = null;
    this.deltaTouch = []
    if (!this.wasDragged) {
      //reatejs.Tween.get(this.scale).to({y: -1}, 1000, createjs.Ease.getPowInOut(4))
    }
    if (this.isWhole){
      this.zIndex = 20
      createjs.Tween.get(this).to({x: this.x+deltaI*dx-2,y: this.y+deltaJ*dx-2}, 500, createjs.Ease.getPowInOut(4))
    }

    if (!this.isWhole) {
        createjs.Tween.get(this).to({x: this.x+deltaI*dx,y: this.y+deltaJ*dx}, 500, createjs.Ease.getPowInOut(4))
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

createPolygon('fourthRect',colors['orange'])
createPolygon('fourthRightTriangle',colors['purple'])
createPolygon('fourthSquare',colors['pink'])
createPolygon('fourthIsoceles',colors['red'])
createPolygon('halfRect',colors['blue'])
createPolygon('halfTriangle',colors['pink'])
drawWhole()
layoutPolys()

console.log(polys.length)

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 39 && !activePoly.isWhole) {
        createjs.Tween.get(activePoly).to({rotation: activePoly.rotation + Math.PI/2}, 500, createjs.Ease.getPowInOut(4))
        activePoly.polyCords = rotate(activePoly.polyCords)
        let w = activePoly.actualWidth
        let h = activePoly.actualHeight
        activePoly.actualWidth = h
        activePoly.actualHeight = w
      }
    if (event.keyCode == 68){
      if (activePoly.isWhole){
        drawWhole()
      } else {
        let x = activePoly.x
        let y = activePoly.y
        createPolygon(activePoly.type,activePoly.color)
        createjs.Tween.get(activePoly).to({x: x,y: y}, 500, createjs.Ease.getPowInOut(4))
      }
    }
    if (event.keyCode == 8){
      tiler.stage.removeChild(activePoly)
    }
});
