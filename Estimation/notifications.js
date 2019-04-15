

function createNotification(messege){
  let note = new PIXI.Container()
  var graphics = new PIXI.Graphics();
  graphics.lineStyle(1, 0x000000, 3)
  graphics.beginFill(0xFFFFFF);
  graphics.drawRoundedRect(0, 0,15*dx,dx ,5);
  graphics.endFill();

    var texture = app.renderer.generateTexture(graphics);
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
    createjs.Tween.get(this).to({x: windowWidth/2,y: -2*dx}, 500, createjs.Ease.getPowInOut(4)).call(()=> {app.stage.removeChild(this)})
}

function dropNotification(messege){
  let note = createNotification(messege)
  app.stage.addChild(note)
  note.on('pointerdown',hideNotification)
      createjs.Tween.get(note).to({x: windowWidth/2,y: dx}, 500, createjs.Ease.getPowInOut(4))
}


function createCircleButton(text) {

    let h = DIM/4
    let w = DIM/4

    var circle = new PIXI.Graphics();
    circle.drawCircle(DIM/5, DIM/5,DIM/5);

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


function createDiscussionModal(prompt,action){

    var graphics = new PIXI.Graphics();
    graphics.lineStyle(4, 0x000000, 3)
    graphics.beginFill(0xFFFFFF);
    graphics.drawRoundedRect(2, 2,0.8*window.innerWidth,0.8*window.innerHeight,5);
    graphics.endFill();

    var texture = app.renderer.generateTexture(graphics);
    let tile = new PIXI.Sprite(texture)
    tile.anchor.set(0.5)
    let fontDim = graphics.width/20

    let den = new PIXI.Text(prompt,{fontFamily : 'Chalkboard SE', fontSize: fontDim, fill : 0x000000, align : 'center'});
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

    let circleButton = createCircleButton("X")
    circleButton.x = -graphics.width/2+circleButton.width
    circleButton.y = -graphics.height/2+circleButton.height
    tileContainer.addChild(circleButton)

    circleButton.on('pointerdown',()=>{createjs.Tween.get(tileContainer).to({x: windowWidth/2,y: -windowHeight/2}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
      app.stage.removeChild(tileContainer)})
      action()
    })

    return tileContainer
}


function dropDiscussionModal(prompt,action){
  let discussionModal = createDiscussionModal(prompt,action)
  app.stage.addChild(discussionModal)
  createjs.Tween.get(discussionModal).to({x: windowWidth/2,y: windowHeight/2}, 500, createjs.Ease.getPowInOut(4))
}
