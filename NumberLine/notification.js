


function createNotification(messege){
  let note = new PIXI.Container()
  var graphics = new PIXI.Graphics();
  graphics.lineStyle(1, 0x000000, 3)
  graphics.beginFill(0xFFFFFF);
  graphics.drawRoundedRect(0, 0,8*dx,dx ,5);
  graphics.endFill();

    var texture = numberline.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    tile.anchor.set(0.5)

    let den = new PIXI.Text(messege,{fontFamily : 'Chalkboard SE', fontSize: dx/2, fill : 0x000000, align : 'center'});
    den.anchor.set(0.5)

    let tileContainer = new PIXI.Container()

    tileContainer.addChild(tile)
    tileContainer.addChild(den)

    tileContainer.active = false
    tileContainer.interactive = true;
    tileContainer.buttonMode = true;
    tileContainer.x = windowWidth/2
    tileContainer.y = -2*dx

    tileContainer.tile = tile


    return tileContainer
}

function hideNotification() {
    createjs.Tween.get(this).to({x: windowWidth/2,y: -2*dx}, 500, createjs.Ease.getPowInOut(4)).call(()=> {numberline.stage.removeChild(this)})
}

function dropNotification(messege){
  let note = createNotification(messege)
  numberline.stage.addChild(note)
  note.on('pointerdown',hideNotification)
      createjs.Tween.get(note).to({x: windowWidth/2,y: dx}, 500, createjs.Ease.getPowInOut(4))
}
