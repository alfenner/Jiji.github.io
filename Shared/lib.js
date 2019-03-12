/* For generating textures - there should be a better way to do this.
const tempApp = new PIXI.Application(0,0)

// Transition - How are we going to do this?
// It seems that every new environment needs to be a brand new HTML file
// What about games that vary only slightly?
// Would react help this?
function segueWithMessage(app,prompt){



}

<div class="carousel">
  <a class="carousel-item" href="#one!"><img src="images/tiler-carousel.png"></a>
  <a class="carousel-item" href="#two!"><img src="images/tiler-carousel.png"></a>
</div>



// MC Plan?

// Quiz: [QUESTIONS] -> [[imgs,prompt,ans]]


const QUESTION_ONE_HOW_MUCH_MORE = [imgs,prompt,ans]


// HELPER: "Create Container? createContainer(children,locations)"

// Useage: let obj = createChoicesObject(img) -> app.stage.addChild(obj) -> animate?
function createChoicesObject(images) {
  let choices = new PIXI.Container()


  // Example: layout.on("pointerdown???") -> What?

  // choices.A.



  // - These have to be in containers with....

  // ...containers called "Cards"

  // A.count
  // B = new PIXI.Sprite(image)
  // C = new PIXI.Sprite(image)
  // D = new PIXI.Sprite(image)


  // A = new PIXI.Sprite(image)
  // CARD_A.addChild(background)
  // CARD_A.addChild(A)
  // CARD_A.addChild(A_lbl)
  // CARD_B.addChild(B)

  // CARD_A.on('pointerdown',incCount)
  //


  // returns... the "choices" container.


}

// EVERY TIME YOU ROTATE THE PIECE YOU CHANGE THE AXIS THAT"S GETTING FLIPPED


// Usage?

//







// DEPRACATED

/* Creates a sprite from coordinates
function createPolySprite(cords,fill,lineColor,lineWidth,renderer){
  var g = new PIXI.Graphics();
      g.lineStyle(lineWidth,lineColor)
      g.beginFill(fill);
      //graphics.moveTo(cords[0][0],cords[0][1])

  for (let i  = 0;i<=cords.length;i++){
    console.log("drawing")
      g.lineTo(cords[i%cords.length][0],cords[i%cords.length][1])
  }
  g.endFill();
  let t = tiler.renderer.generateTexture(g)
  let newSprite = new PIXI.Sprite(t)
  console.log("new Sprite",newSprite)
  tiler.stage.addChild(newSprite)
  return newSprite
}
*/
