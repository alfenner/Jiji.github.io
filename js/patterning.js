
function createPolygon(cords,x,y) {

  var graphics = new PIXI.Graphics();
      graphics.beginFill(0x4b0082);
      graphics.moveTo(cords[0][0],cords[0][1])

  for (let i  = 1;i<cords.length;i++){
      graphics.lineTo(cords[i][0],cords[i][1])
  }

  graphics.endFill();

    var texture = tiler.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    tile.anchor.set(0.5)

    let tileContainer = new PIXI.Container()

    tile.on('pointerdown', onDragStart)


    tileContainer.addChild(tile)

    tileContainer.active = false
    tileContainer.interactive = true;
    tileContainer.buttonMode = true;
    //tileContainer.anchor.set(0.5);

    tileContainer
        .on('pointerdown', onPolyTouched)
        .on('pointerup', onPolyMoveEnd)
        .on('pointermove', onPolyTouchMoved);

    // move the sprite to its designated position
    tileContainer.x = 100;
    tileContainer.y = 100;

    tiler.stage.addChild(tileContainer)
}


function onPolyTouched(event) {
    this.dragging = true;
    let touchedAtX = event.data.global.x
    let touchedAtY = event.data.global.y
    this.wasDragged = false
    this.deltaTouch = [this.x - touchedAtX,this.y-touchedAtY]
    this.dragStartedAt = this.y
    this.data = event.data;
    this.alpha = 0.5;
}


function onPolyMoveEnd() {
    this.alpha = 1;
    let newRotation = this.rotation + Math.PI/2
    this.dragging = false;
    this.data = null;
    this.deltaTouch = []
    if (!this.wasDragged) {
      createjs.Tween.get(this.scale).to({y: -1}, 1000, createjs.Ease.getPowInOut(4))
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


let cords = [[0,0],[0,100],[100,100],[100,0],[50,50],[0,0]]

createPolygon(cords,100,100)
