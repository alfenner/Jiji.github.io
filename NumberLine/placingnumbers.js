


const PROBLEM_ONE_PINS = [1,1,1,1,1,1,1,1,1]
const PROBLEM_ONE = [[1,1],[3,2],[2,1],[0,1],[1,2]]

const dim = window.innerWidth/12

let blocksOnLine = []


var pinkCircle = new PIXI.Graphics();
pinkCircle.lineStyle(2, 0x000000, 2)
pinkCircle.beginFill(COLORS.GRAY);
pinkCircle.drawCircle(dim/5+1, dim/5+1,dim/5);
pinkCircle.endFill();
let pinkCircleTexture = numberline.renderer.generateTexture(pinkCircle)

function createSubmitButton() {

}

let WHOLE_BLOCK = {
  num: 1,
  den: 1
}

let HALF_BLOCK = {
  num: 1,
  den: 2
}

let THIRD_BLOCK = {
  num: 1,
  den: 3
}

let FOURTH_BLOCK = {
  num: 1,
  den: 4
}

let SIXTH_BLOCK = {
  num: 1,
  den: 6
}






function createBlockWidget(blocks,linewidth){
  console.log("blocks",blocks)
  for (let i = 0;i<blocks.length;i++){
    let block = new PIXI.Graphics();
    block.beginFill(COLORS.BLUE);
    block.drawRoundedRect(dim, dim/8+i*3*dim/8,linewidth/blocks[i].den*blocks[i].num, dim/4,5);
    block.endFill();
    block.num = blocks[i].num
    block.den = blocks[i].den
    block.interactive = true
    block.on('pointerdown',onBlockWidgetSelected)
    numberline.stage.addChild(block)
  }
}

createBlockWidget([HALF_BLOCK,THIRD_BLOCK,FOURTH_BLOCK],10*dim)


function createMeasureBlock(width,num,den,label) {
  console.log("num,den",num,den)

  let blockContainer = new PIXI.Container()
  var block = new PIXI.Graphics();
  block.beginFill(COLORS.BLUE);
  block.drawRoundedRect(0, 0, width, dim/4,5);
  block.endFill();
  let blockTexture = numberline.renderer.generateTexture(block)
  let blockSprite = new PIXI.Sprite(blockTexture)
  blockSprite.alpha = 0.7
  blockContainer.addChild(blockSprite)
  blockContainer.hitSpot = blockSprite

  let text = new PIXI.Text(num+'/'+den,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
  text.anchor.set(0.5)
  text.x = width/2
  text.y = dim/8
  text.style.fill = 0xFFFFFF
  if (label){
      blockContainer.addChild(text)
  }

  blockContainer.text = text
  blockContainer.interactive = true
  blockContainer.on('pointerdown',onBlockDragStart)
    .on('pointermove',onBlockDragMove)
    .on('pointerup',onBlockDragEnd)

  blocksOnLine.push(blockContainer)
  return blockContainer
}

function createPin() {

    let h = 1/2*dim
    let w = dim/4

    var circle = new PIXI.Graphics();
    circle.lineStyle(2, 0x000000, 2)
    circle.beginFill(0xFFFFFF);
    circle.drawCircle(dim/5+1, dim/5+1,dim/5);
    circle.endFill();

    var circleTexture = numberline.renderer.generateTexture(circle);
    let circleSprite = new PIXI.Sprite(circleTexture)
    circleSprite.alpha = 0.5
    circleSprite.anchor.set(0.5)
    circleSprite.texture = pinkCircleTexture

    var stem = new PIXI.Graphics();
    stem.lineStyle(2, 0x000000, 10)
    stem.moveTo(0,dim/5)
    stem.lineTo(0,dim/2)

    let pinContainer = new PIXI.Container()
    pinContainer.addChild(circleSprite)
    pinContainer.addChild(stem)

    pinContainer.active = false
    pinContainer.interactive = true;

    pinContainer.x = 0
    pinContainer.y = 0
    pinContainer.draggable = true

    return pinContainer
}

function createFractionLbl(frac) {

    let tileContainer = new PIXI.Container()

    let n = frac[0]
    let d = frac[1]

    let whole = d == 1 ? true : false

    let h = d == 1 ? dim/4 : 1/2*dim
    let w = dim/4

    var block = new PIXI.Graphics();
    block.lineStyle(2,0x000000,2)
    block.beginFill(0xFFFFFF);
    block.drawRoundedRect(1, 1, w, h,5);
    block.endFill();

    var blockTexture = numberline.renderer.generateTexture(block);
    let tile = new PIXI.Sprite(blockTexture)
    tile.alpha = 0.5
    tile.anchor.set(0.5)


    // All or only some of these may exist depending on if we're using a "whole" or not.
    let mid;
    let num;
    let den;
    let l;

    if (!whole) {
      l = new PIXI.Graphics();
      l.lineStyle(2, 0x000000, 2)
      l.moveTo(0,dim/4)
      l.lineTo(0,dim/2)
      mid = new PIXI.Graphics()
      mid.lineStyle(2, 0x000000, 2)
      mid.moveTo(-dim/10,0)
      mid.lineTo(dim/10,0)
      num = new PIXI.Text(n,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
      num.anchor.set(0.5)
      num.y = -h/6
      den = new PIXI.Text(d,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
      den.anchor.set(0.5)
      den.y = h/6
    } else {
      l = new PIXI.Graphics();
      l.lineStyle(2, 0x000000, 2)
      l.moveTo(0,dim/8)
      l.lineTo(0,dim/2)
      num = new PIXI.Text(n,{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
      num.anchor.set(0.5)
      num.y = 0
    }

    tileContainer.addChild(tile)
    tileContainer.addChild(num)
    tileContainer.addChild(l)
    tileContainer.hitSpot = tile

    // Line style appears grey unless we add this after the prefious if block - not sure why.
    if (mid){tileContainer.addChild(mid)
          tileContainer.addChild(den)}

    tileContainer.active = false
    tileContainer.interactive = true;

    tileContainer.x = dim
    tileContainer.y = 0
    tileContainer.d = den
    tileContainer.n = num
    tileContainer.pivot.x = 0
    tileContainer.pivot.y = dim/2

    return tileContainer
}


// INIT TTTTTTTTTTTTT

let activeChip;

let pins = PROBLEM_ONE_PINS.map((e,i)=>{

    let p = createPin()
    p.on('pointerdown',onPinDragStart)
      .on('pointermove',onPinDragMove)
      .on('pointerup',onPinDragEnd)
      p.x = dim*(i+1)
      p.y = 2.5*dim

  numberline.stage.addChild(p)
})

let chips = PROBLEM_ONE.map((e) => {return createFractionLbl(e)})

chips.map((c,i) => {
  c.on('pointerdown',onLblDragStart)
    .on('pointermove',onLblDragMove)
    .on('pointerup',onLblDragEnd)

  numberline.stage.addChild(c)
  flipLbl(c)

  c.x = dim*(i+1)
  c.y = 3*dim
})

let line = makeNumberLine()
numberline.stage.addChild(line)

function makeNumberLine(den) {
  let line = new PIXI.Graphics();
  line.lineStyle(4, 0xb7b7b7, 1);
  line.moveTo(dim, 3*dim);
  line.lineTo(dim+10*dim, 3*dim);
  return line
}

function onBlockWidgetSelected() {
    let b = createMeasureBlock(this.width,this.num,this.den)
    numberline.stage.addChild(b)
    b.x = dim
    b.y = 3*dim - b.height
}


// Label Actions

function onLblDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    activeChip = this
    this.parent.addChild(this)
    // Should be "active Label"
}


function onLblDragEnd()
{
    this.alpha = 1;

    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onLblDragMove()
{

    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        //let position = new PIXI.Point(newPosition.x,newPosition.y)
        if (newPosition.y < 3*dim || newPosition.y > 4*dim){
          this.dragging = false
          this.alpha = 1
        }

        this.position.x = newPosition.x;
        this.position.y = 3*dim
    }
}

// Block Actions

// Label Actions

function onBlockDragStart(event)
{
    let touchedAtX = event.data.global.x
    let touchedAtY = event.data.global.y
    this.deltaTouch = [this.x-touchedAtX,this.y-touchedAtY]
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    activeChip = this
    this.parent.addChild(this)
}


function onBlockDragEnd()
{
    this.alpha = 1;
    if (this.x+this.width/2 < dim){
      let i = blocksOnLine.indexOf(this)
      blocksOnLine.splice(i,1)
      numberline.stage.removeChild(this)
    }

    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onBlockDragMove(){

    if (this.dragging){
        var newPosition = this.data.getLocalPosition(this.parent);
        //let position = new PIXI.Point(newPosition.x,newPosition.y)
        if (newPosition.y < 2.75*dim || newPosition.y > 3*dim){
          this.dragging = false
          this.alpha = 1
        }
        //this.position.x = newPosition.x-this.width/2;
        this.x = newPosition.x + this.deltaTouch[0]

    }
}




// Pin Actions

function onPinDragStart(event)
{
    // store a reference to the data
    if (this.draggable) {
      this.data = event.data;
      this.alpha = 0.5;
      this.dragging = true;
      activeChip = this
      this.parent.addChild(this)
    }
}


function onPinDragEnd()
{
    this.alpha = 1;

    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onPinDragMove()
{

    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        if (newPosition.y < 2*dim || newPosition.y > 3*dim){
          this.dragging = false
          this.alpha = 1
        }
        this.position.x = newPosition.x;
        this.position.y = 2.5*dim
    }
}





function flipLbl(lbl){
  if (lbl.d) {
    console.log("There's a denominator here?")
    lbl.scale.y = lbl.scale.y*(-1)
    lbl.d.scale.y = lbl.d.scale.y*(-1)
    lbl.n.scale.y = lbl.n.scale.y*(-1)
    let numY = lbl.n.y
    lbl.n.y = lbl.d.y
    lbl.d.y = numY
  } else {
    lbl.scale.y = lbl.scale.y*(-1)
    lbl.n.scale.y = lbl.n.scale.y*(-1)
  }
}



document.addEventListener('keydown', function(event) {

    if (event.keyCode == 40 && activeChip.scale.y == 1) {
      event.preventDefault()
      flipLbl(activeChip)
    }

    if (event.keyCode == 38 && activeChip.scale.y == -1) {
      event.preventDefault()
      flipLbl(activeChip)
    }
})
