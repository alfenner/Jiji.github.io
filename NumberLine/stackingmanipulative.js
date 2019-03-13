



function createFrame(n,w,h){
  let dx = w/n
  let boxes = []
  let frame = new PIXI.Container()
  for (let i = 0;i<n;i++){
    let g = new PIXI.Graphics()
        g.drawRoundedRect(1,1,)
        g.lineStyle(2, 0x000000, 2)
        g.beginFill(0xFFFFFF);
        g.drawRoundedRect(i*dx, 0, dx, h,1);
        g.endFill();
        let tg = stacking.renderer.generateTexture(g)
        let s = new PIXI.Sprite(tg)
        boxes.push(s)
        frame.addChild(s)
  }

  frame.pivot.x = 0
  frame.pivot.y = 0
  frame.interactive = true
  frame.on('pointerdown',onDragStart)
  frame.on('pointermove',onDragMove)
  frame.on('pointerup',onDragEnd)

  console.log("frame",frame.width,frame.height)

  boxes.map((c,i) => {
      //b.on('pointerdown',onDragStart)
      //b.on('pointermove',onDragMove)
      //b.on('pointerup',onDragEnd)})
    })

  return frame
}


/*
function makeNumberLine(den) {
  let line = new PIXI.Graphics();
  line.lineStyle(4, 0xb7b7b7, 1);
  line.moveTo(dim, 3*dim);
  line.lineTo(dim+10*dim, 3*dim);
  return line
}

*/

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    console.log("DRAGGING START")
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    console.log("WERE DRAGGING")
    if (this.dragging)
    {

        var newPosition = this.data.getLocalPosition(this.parent);
        if (true){
          //this.dragging = false
          //this.alpha = 1
        }
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

//let f = createFrame(7,100,20)
//stacking.stage.addChild(f)

document.addEventListener('keydown', function(event) {

    if (event.keyCode == 40 && activeChip.scale.y == 1) {
      event.preventDefault()

    }

    if (event.keyCode == 38 && activeChip.scale.y == -1) {
      event.preventDefault()

    }
})

// Denominator of the row that's currently place on the number line.
let activeRow = 12

// Numerator of Active Row (this is the fraction that will be shaded)
let activeNum = 0

// Is the program currently swapping rows?
let swapping = false

var graphics = new PIXI.Graphics();
graphics.lineStyle(4, 0xc0ffee, 1)
graphics.beginFill(0xFE6F61);
graphics.drawRect(0, 0, 50, 100);
graphics.endFill();

var activeTexture = stacking.renderer.generateTexture(graphics);


const labels = {
  1: "One Whole",
  2: "One Half",
  3: "One Third",
  4: "Fourth",
  5: "5th",
  6: "6th",
  7: "7th",
  8: "8th",
  9: "9th",
  10: "10th",
  11: "11th",
  12: "12th",
}

// Constructors


function distance(a,b){
  let x1 = a[0]
  let y1 = a[1]
  let x2 = b[0]
  let y2 = b[1]
  let dX = x2-x1
  let dY = y2-y1
  return Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2))
}

const wallObj = {
  1:[],
  2:[],
  3:[],
  4:[],
  5:[],
  6:[],
  7:[],
  8:[],
  9:[],
  10:[],
  11:[],
  12:[],
}


for (var i = 1; i <= 12; i++) {
    let w = wallWidth/(i)
  for (var j = 0; j < i; j++) {
    let h = height
    let x = j*w + w/2 + wallWidth/4
    let y = i*h
    let tile = createTile(x,y,w,h,i);
    wallObj[i].push(tile)
    stacking.stage.addChild(tile);
  }
}

function newTexture(self,color) {
  var graphics = new PIXI.Graphics();
  graphics.lineStyle(3, 0xb7b7b7, 1)
  graphics.beginFill(color);
  graphics.drawRoundedRect(0, 0, self.width-3, self.height-3,3);
  graphics.endFill();
  return stacking.renderer.generateTexture(graphics);
}

function swapCompleted(){
  swapping = false
}

function moveRowUp(row){
    row.forEach((t)=>createjs.Tween.get(t).to({y: t.y-height}, 1000, createjs.Ease.getPowInOut(4)))
}


function moveRowDown(row){
    row.forEach((t)=>createjs.Tween.get(t).to({y: t.y+height}, 1000, createjs.Ease.getPowInOut(4)))
}

function sendRowToBottom(row1,row2,start){
  let y1 = row1[0].y
  let y2 = row2[0].y
  swapping = true
  for (var row in wallObj) {
    if (wallObj[row][0].y > start) {
      moveRowUp(wallObj[row])
    }
  }
  row1.forEach(t => createjs.Tween.get(t).to({y: 12*height}, 1000, createjs.Ease.getPowInOut(4)).call(swapCompleted))
}


let tickArray = []

function initTickArray(d) {
  for (var i = 0;i<=12;i++){
    let tick = new PIXI.Graphics();
    tick.lineStyle(6, 0xb7b7b7, 1);
    tick.moveTo(0,0);
    tick.lineTo(0, 1*height);
    let t = stacking.renderer.generateTexture(tick)
    let tickSprite = new PIXI.Sprite(t)
    tickSprite.anchor.set(0.5)
    tickSprite.y = 13*height
    tickSprite.x = 0
    stacking.stage.addChild(tickSprite);
    tickArray.push(tickSprite)
    createjs.Tween.get(tickSprite).to({x: wallWidth/d*i+wallX}, 1000, createjs.Ease.getPowInOut(4))
  }
}


function drawNumberLine(den) {
  let line = new PIXI.Graphics();
  line.lineStyle(4, 0xb7b7b7, 1);
  line.moveTo(wallX, 13*height);
  line.lineTo(wallX+wallWidth, 13*height);
  stacking.stage.addChild(line);
}

drawNumberLine()
initTickArray(12)

function animateTicks(den) {
    tickArray.forEach((t,i) => {
      if (i > den){
        createjs.Tween.get(t).to({x: wallWidth+wallX}, 1000, createjs.Ease.getPowInOut(4))
      } else {
        createjs.Tween.get(t).to({x: wallWidth/den*i+wallX}, 1000, createjs.Ease.getPowInOut(4))
      }
    })
  }

function swapRow(row,start,end) {

  if (Math.abs(start - end) < 30) {
        row.forEach(t => createjs.Tween.get(t).to({y: start}, 1000, createjs.Ease.getPowInOut(4)).call(swapCompleted))
  }
  // Moved up
  else if (start > end) {
    for (var r in wallObj) {
      if (wallObj[r][0].y < start && wallObj[r][0].y > end ) {
        moveRowDown(wallObj[r])
      }
    }
    let roundedEnd = Math.ceil(end/height)*height
    row.forEach(t => createjs.Tween.get(t).to({y: roundedEnd}, 1000, createjs.Ease.getPowInOut(4)).call(swapCompleted))
  }
  // Moved down
  else if (start < end) {
    for (var r in wallObj) {
      if (wallObj[r][0].y > start && wallObj[r][0].y < end ) {
        moveRowUp(wallObj[r])
      }
    }
    let roundedEnd = Math.floor(end/height)*height
    row.forEach(t => createjs.Tween.get(t).to({y: roundedEnd}, 1000, createjs.Ease.getPowInOut(4)).call(swapCompleted))
  }
}



function createTile(x,y,w,h,d) {

  var graphics = new PIXI.Graphics();
  graphics.lineStyle(3, 0xb7b7b7, 1)
  graphics.beginFill(0xFFFFFF);
  graphics.drawRoundedRect(0, 0, w, h,3);
  graphics.endFill();

    var texture = stacking.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    tile.anchor.set(0.5)

    let den = new PIXI.Text(labels[d],{fontFamily : 'Arial', fontSize: 12, fill : 0xFFFFFF, align : 'center'});
    den.anchor.set(0.5)

    let tileContainer = new PIXI.Container()

    tile.on('pointerdown', onDragStart)


    tileContainer.addChild(tile)
    tileContainer.addChild(den)

    tileContainer.active = false
    tileContainer.interactive = true;
    tileContainer.den = d
    tileContainer.buttonMode = true;
    //tileContainer.anchor.set(0.5);



    tileContainer
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    // move the sprite to its designated position
    tileContainer.x = x;
    tileContainer.y = y;


    tileContainer.tile = tile
    return tileContainer
}

function onDragStart(event) {

if (!swapping) {
    console.log("setting dragging to true")
    this.dragging = true;
    this.dragStartedAt = this.y
    this.data = event.data;
    this.alpha = 0.5;
}

}

function onDragEnd() {

 if (this.wasDragged) {
    this.wasDragged = false
    let row = wallObj[this.den]
    activeRow = this.den
    swapRow(row,this.dragStartedAt,this.y)
    if (this.y > 12*height) {animateTicks(activeRow)}
  } else {
    this.active = !this.active
    this.tile.texture = this.active ? newTexture(this,0xFE6F61) : newTexture(this,0xFFFFFF)
  }
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        this.wasDragged = true
        var newPosition = this.data.getLocalPosition(this.parent);
        wallObj[this.den].forEach(t=>{
          t.parent.addChild(t)
          t.y = newPosition.y;
        })
    }
}
