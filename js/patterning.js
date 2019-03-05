
let dots = []

let cordsFromGrid = []
let polys = []
let snapX = dx/3
let snapY = dx/3
let density = 4
let dB = dx*2/3
let wholeOrigin = []

let completedTiles = []
let completedTileSpaces = []
let buttons = []
let currentTileIndex = 0
let currentLevelIndex = -1

const types = {
  'whole': [[0,0],[4*dx,0],[4*dx,4*dx],[0,4*dx]],
  'fourthRect': [[0,0],[0,4*dx],[dx,4*dx],[dx,0]],
  'thirdRect': [[0,0],[0,4*dx],[4/3*dx,4*dx],[4/3*dx,0]],
  'fourthRightTriangle': [[0,0],[0,4*dx],[2*dx,4*dx]],
  'fourthIsoceles': [[0,0],[2*dx,2*dx],[4*dx,0]],
  'halfRect': [[0,0],[0,4*dx],[2*dx,4*dx],[2*dx,0]],
  'fourthSquare': [[0,0],[0,2*dx],[2*dx,2*dx],[2*dx,0]],
  'halfTriangle':[[0,0],[0,4*dx],[4*dx,0]],
  'eighthTriangle': [[0,0],[0,2*dx],[2*dx,0]]
}


let activePoly;
let theWhole;

function layoutPolys() {
for (let i=0;i<polys.length;i++) {
    createjs.Tween.get(polys[i]).to({x:  4*dx,y: 4*dx}, 500, createjs.Ease.getPowInOut(4))
}
}


function drawCompletedTileSpaces(n) {

  for (let i = 0; i<n; i++){
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(5, 0x000000,3)

    graphics.drawRoundedRect(3, 3, 2*dx, 2*dx,3);
    graphics.alpha = 0.2

    let texture = tiler.renderer.generateTexture(graphics);
    let emptyRectSprite = new PIXI.Sprite(texture)
    emptyRectSprite.x = windowWidth-2.2*dx
    emptyRectSprite.y = i*2.2*dx
    emptyRectSprite.alpha = 0.5
    completedTileSpaces.push(emptyRectSprite)
    tiler.stage.addChild(emptyRectSprite)

  }

}

drawCompletedTileSpaces(4)

// Takes the level index and loads new level.
function loadLevel(){
  for (p of polys){
    tiler.stage.removeChild(p)
  }
  for (b of buttons){
    tiler.stage.removeChild(b)
  }
  for (t of completedTiles) {
    tiler.stage.removeChild(t)
  }
  currentLevelIndex += 1
  currentTileIndex = 0
  buttons = []
  polys = []
  drawWhole()
  createButtons(LEVELS[currentLevelIndex])
  layoutButtons()
}

loadLevel()


// Pass it the level and it will layout the buttons for that new level.
function createButtons(level) {
  let colorIndex = 0
  for (s of level.shapes ) {
    let polyPoints = []
    s.forEach((e) => {
      polyPoints.push(e[0])
      polyPoints.push(e[1])
    })
    var graphics = new PIXI.Graphics();
    graphics.beginFill(COLORS[COLOR_KEYS[colorIndex]]);
    graphics.drawPolygon(polyPoints);
    graphics.endFill();
    graphics.type = s
    graphics.color = COLORS[COLOR_KEYS[colorIndex]]
    graphics.interactive = true
    graphics.on('pointerdown',newPoly)
    colorIndex += 1
    buttons.push(graphics)
  }

}

function newPoly() {
    createPolygon(this.type,this.color)
    createjs.Tween.get(activePoly).to({x: wholeOrigin[0]+theWhole.width/2,y: wholeOrigin[1]-theWhole.height/2}, 1000, createjs.Ease.getPowInOut(4))
}


function layoutButtons(){
  let y = dx/2
  for (b of buttons){
    tiler.stage.addChild(b)
    b.x = dx
    b.y = y
    y = y+b.height+dx/4
  }
}



function drawWhole(){
  let whole = types['whole']
  let c = new PIXI.Container()

  var graphics = new PIXI.Graphics();
  //graphics.moveTo(0,0)
  graphics.lineStyle(3, 0x000000);
  for (let i = 0;i <= whole.length;i++){
      graphics.lineTo(whole[i%4][0],whole[i%4][1])
  }
  graphics.x = 1.5
  graphics.y = 1.5

  var texture = tiler.renderer.generateTexture(graphics);
  theWhole = new PIXI.Sprite(texture)

  theWhole.anchor.set(0.5)

  var grabber= new PIXI.Graphics();
  grabber.beginFill(0xFFFFFF)
  grabber.moveTo(4*dx,4*dx)
  grabber.alpha = 0.5
  for (let i = 0;i <= whole.length;i++){
      grabber.lineTo(whole[i%4][0],whole[i%4][1])
  }
  grabber.endFill()
  //c.addChild(graphics)
  c.addChild(grabber)

  c.interactive = true
  c.isWhole = true
  //c.on('pointerdown', onPolyTouched)
  //c.on('pointerup', onPolyMoveEnd)
  //c.on('pointermove', onPolyTouchMoved);
  c.polyCords = whole
  c.actualWidth = c.width
  c.actualHeight = c.height
  //polys.push(c)
  //wholeSprite.x = 0
  //wholeSprite.y = 0

  tiler.stage.addChild(theWhole)

  let i = Math.floor(windowWidth/2/dx)
  let j = Math.floor(windowHeight/2/dx)

  theWhole.x = i*dx
  theWhole.y = j*dy

  wholeOrigin[0] = theWhole.x - theWhole.height/2
  wholeOrigin[1] = theWhole.y - theWhole.height/2

  //console.log("theWhole.width",theWhole.width)
  //console.log("thewhole.height",theWhole.height)
  //console.log("theWhole.x",theWhole.x)
  //console.log("theWhole.y",theWhole.y)
  //console.log("wholeOrigin[0]",wholeOrigin[0])
  //console.log("wholeOrigin[1]",wholeOrigin[1])

}

function createPolygon(type,color) {
  cords = type
  //console.log("incoming cords",cords)
  var graphics = new PIXI.Graphics();
      graphics.lineStyle(1,0x000000)
      graphics.beginFill(color);
      //graphics.moveTo(cords[0][0],cords[0][1])

  for (let i  = 0;i<=cords.length;i++){
      graphics.lineTo(cords[i%cords.length][0],cords[i%cords.length][1])
  }

  graphics.endFill();

    var texture = tiler.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    tile.polyCords = offset(cords,[tile.width/2,tile.height/2])
    tile.anchor.set(0.5)
    tile.alpha = 0.5
    tile.type = type

    tile.actualWidth = tile.width
    tile.actualHeight = tile.height
    tile.color = color
    tile.interactive = true
    tile.active = false
    tile.buttonMode = true
    tile.on('pointerdown', onPolyTouched)
    tile.on('pointerup', onPolyMoveEnd)
    tile.on('pointermove', onPolyTouchMoved);
    tiler.stage.addChild(tile)
    polys.push(tile)
    tile.x = 0
    tile.y = 0
    activePoly = tile
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
      let cT = tiler.renderer.generateTexture(c)
      let cS = new PIXI.Sprite(cT)
      cS.on('pointerdown',onNodeClicked)
      cS.x = dx*i
      cS.y = dx*j
      cS.interactive = true
      cS.anchor.set(0.5)
      dotRow.push(cS)
      //tiler.stage.addChild(cS);
    }
    dots.push(dotRow)
  }
}

//drawGrid(20)

function onNodeClicked() {
  cordsFromGrid.push([this.x,this.y])
  if (false){
    //console.log("drawing!!")
    cordsFromGrid.push(cordsFromGrid[0])
    createPolygon(cordsFromGrid)
  }
}


function onPolyTouched(event) {
  activePoly = this
  let touchedAtX = event.data.global.x
  let touchedAtY = event.data.global.y


if (isPointInPoly([touchedAtX-this.x,touchedAtY-this.y],this.polyCords)){
    tiler.stage.addChild(this)
    this.dragging = true;
    this.wasDragged = false
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    this.dragStartedAt = this.y
    this.data = event.data;
    this.alpha = 0.5;
} else if (!isPointInPoly([touchedAtX-this.x,touchedAtY-this.y],this.polyCords)) {
      for (let p of polys) {
        if (isPointInPoly([touchedAtX-p.x,touchedAtY-p.y],p.polyCords) && p != this){
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

    let dI = (this.x-this.actualWidth/2)/snapX
    let dJ = (this.y-this.actualHeight/2)/snapY
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
      createjs.Tween.get(this).to({x: this.x+deltaI*snapX-2,y: this.y+deltaJ*snapY-2}, 500, createjs.Ease.getPowInOut(4))
    }

    if (!this.isWhole) {
        createjs.Tween.get(this).to({x: this.x+deltaI*snapX,y: this.y+deltaJ*snapY}, 500, createjs.Ease.getPowInOut(4)).call(() => {
          let filteredPolys = polysInRect(polys,theWhole)
          if (isTiled(theWhole,filteredPolys)) {
            let container = new PIXI.Container()
            for (p of polys){
              if (inRect(p,theWhole)){
                container.addChild(p)
              }
              else {
                tiler.stage.removeChild(p)
              }
            }

            polys = []

            completedTiles.push(container)
            container.x = wholeOrigin[0]
            container.y = wholeOrigin[1]
            container.pivot.x = wholeOrigin[0]
            container.pivot.y = wholeOrigin[1]

            tiler.stage.addChild(container)

            createjs.Tween.get(container.scale).to({x: 0.5,y: 0.5}, 500, createjs.Ease.getPowInOut(4))
            createjs.Tween.get(container).to({x: completedTileSpaces[currentTileIndex].x,y: completedTileSpaces[currentTileIndex].y}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
              currentTileIndex += 1
              if (currentTileIndex > 3){
                console.log("trying to load next level")
                loadLevel()
              }
            })
          }
        })
    }
    console.log("In rect?",inRect(activePoly,theWhole))
    console.log("polysInRect",polysInRect(polys,theWhole))
}

function onPolyTouchMoved() {
    if (this.dragging) {
        this.wasDragged = true
        var newPosition = this.data.getLocalPosition(this.parent);
          this.x = newPosition.x + this.deltaTouch[0]
          this.y = newPosition.y + this.deltaTouch[1]
    }
}

//createPolygon('fourthRect',colors['orange'])
//createPolygon('fourthRightTriangle',colors['purple'])
//createPolygon(TYPES.FOURTH_RIGHT_TRIANGLE,COLORS.PINK)
//createPolygon('fourthIsoceles',colors['red'])
//createPolygon(TYPES.HALF_RECT,COLORS.BLUE)
//createPolygon('halfTriangle',colors['pink'])
//createPolygon('thirdRect',colors['orange'])
drawWhole()
layoutPolys()



document.addEventListener('keydown', function(event) {
    if(event.keyCode == 39 && !activePoly.isWhole) {
        createjs.Tween.get(activePoly).to({rotation: activePoly.rotation + Math.PI/2}, 500, createjs.Ease.getPowInOut(4))
        activePoly.polyCords = rotate(activePoly.polyCords)
        let w = activePoly.actualWidth
        let h = activePoly.actualHeight
        activePoly.actualWidth = h
        activePoly.actualHeight = w
      }

      // Lets have this be a vertical flip.
      if(event.keyCode == 38 && !activePoly.isWhole) {
          createjs.Tween.get(activePoly.scale).to({y: activePoly.scale.y*(-1)}, 500, createjs.Ease.getPowInOut(4))
          activePoly.polyCords = flipX(activePoly.polyCords)
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
      let i = polys.indexOf(activePoly)
      console.log("active Poly index",i)
      polys.splice(i,0)
      if (polys.length == 0){
        activePoly = polys[0]
      }
    }
    if (event.keyCode == 13){
        loadLevel()
    }
});
