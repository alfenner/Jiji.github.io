

const PROBLEM_ONE = [[4,5],[1,5],[0,5],[3,5]]

const dim = window.innerWidth/12

function createNumberChip(frac) {

    let h = 1/2*dim
    let w = dim/4

    var block = new PIXI.Graphics();
    block.beginFill(COLORS.PINK);
    block.drawRoundedRect(0, 0, w, h,5);
    block.endFill();

    var blockTexture = numberline.renderer.generateTexture(block);
    let tile = new PIXI.Sprite(blockTexture)
    tile.alpha = 0.5
    tile.anchor.set(0.5)


    var l = new PIXI.Graphics();
    l.lineStyle(2, 0x000000, 2)
    l.moveTo(0,dim/4)
    l.lineTo(0,dim/2)

    var mid = new PIXI.Graphics();
    mid.lineStyle(2, 0x000000, 2)
    mid.moveTo(-dim/10,0)
    mid.lineTo(dim/10,0)



    let num = new PIXI.Text(frac[0],{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
    num.anchor.set(0.5)
    num.y = -h/6
    let den = new PIXI.Text(frac[1],{fontFamily : 'Chalkboard SE', fontSize: 12, fill : 0x000000, align : 'center'});
    den.anchor.set(0.5)
    den.y = h/6


    let tileContainer = new PIXI.Container()
    tileContainer.addChild(tile)
    tileContainer.addChild(num)
    tileContainer.addChild(den)
    tileContainer.addChild(l)
    tileContainer.addChild(mid)


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

let activeChip;

let chips = PROBLEM_ONE.map((e) => {return createNumberChip(e)})

chips.map((c,i) => {
  c.on('pointerdown',onDragStart)
    .on('pointermove',onDragMove)
    .on('pointerup',onDragEnd)

  numberline.stage.addChild(c)

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

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    activeChip = this
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

    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        if (newPosition.y < 2*dim || newPosition.y > 4*dim){
          this.dragging = false
          this.alpha = 1
        }
        this.position.x = newPosition.x;
        this.position.y = 3*dim
    }
}






document.addEventListener('keydown', function(event) {

    if (event.keyCode == 40 && activeChip.scale.y == 1) {
      event.preventDefault()
      activeChip.scale.y = activeChip.scale.y*(-1)
      activeChip.d.scale.y = activeChip.d.scale.y*(-1)
      activeChip.n.scale.y = activeChip.n.scale.y*(-1)
      let numY = activeChip.n.y
      activeChip.n.y = activeChip.d.y
      activeChip.d.y = numY
    }

    if (event.keyCode == 38 && activeChip.scale.y == -1) {
      event.preventDefault()
      activeChip.scale.y = activeChip.scale.y*(-1)
      activeChip.d.scale.y = activeChip.d.scale.y*(-1)
      activeChip.n.scale.y = activeChip.n.scale.y*(-1)
      let numY = activeChip.n.y
      activeChip.n.y = activeChip.d.y
      activeChip.d.y = numY
    }
})
