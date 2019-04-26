const PREANIM_SHAPES = [TYPES.HALF_RECT,TYPES.FOURTH_SQUARE,TYPES.FOURTH_SQUARE]
const PREANIM_LOCATIONS = [[2*dx,dx],[dx,3*dx],[3*dx,3*dx]]


function dumpPolys(polygons,origin) {
  for (let i = 0;i<polygons.length;i++){
    tiler.stage.addChild(polygons[i])
  }
    createjs.Tween.get(polygons[0]).to({x: origin[0]+PREANIM_LOCATIONS[0][0],y: origin[1]+PREANIM_LOCATIONS[0][1]}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
    createjs.Tween.get(polygons[1]).to({x: origin[0]+PREANIM_LOCATIONS[1][0],y: origin[1]+PREANIM_LOCATIONS[1][1]}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
    createjs.Tween.get(polygons[2]).to({x: origin[0]+PREANIM_LOCATIONS[2][0],y: origin[1]+PREANIM_LOCATIONS[2][1]}, 500, createjs.Ease.getPowInOut(4)).call(()=>{

      let c = createContainer(polygons,origin)
      tiler.stage.addChild(c)
      createjs.Tween.get(c).to({x: completedTileSpaces[0].x ,y: completedTileSpaces[0].y}, 500, createjs.Ease.getPowInOut(4))
      createjs.Tween.get(c.scale).to({x: 0.5 ,y: 0.5}, 500, createjs.Ease.getPowInOut(4)).call(()=>{
      createjs.Tween.get(c).to({alpha: 0}, 500, createjs.Ease.getPowInOut(4)).call(()=> {
      })
      })
    })
  })})
}


function initPolys(shapes,locations){
  let polygons = []

   for (let i = 0;i<shapes.length;i++){
      p = returnPolygon(shapes[i],COLORS[COLOR_KEYS[i]],tiler.renderer)
      p.x = -100
      p.y = -100

      polygons.push(p)
      //console.log("ADDING addChild")
      //tiler.stage.addChild(p)
   }
   return polygons
}

function animateContainer(container,start,end) {

}

function createContainer(polygons,pivot) {
  let newContainer = new PIXI.Container()
  for (p of polygons){
    newContainer.addChild(p)
  }

  newContainer.x = pivot[0]
  newContainer.y = pivot[1]
  newContainer.pivot.x = newContainer.x
  newContainer.pivot.y = newContainer.y

  return newContainer
}

//let cont = createContainer(polygons,[0,0])
//tiler.stage.addChild(cont)
  //createjs.Tween.get(cont).to({x: 200,y: 200}, 500, createjs.Ease.getPowInOut(4))
  //createjs.Tween.get(cont.scale).to({x: 0.5,y: 0.5}, 500, createjs.Ease.getPowInOut(4))
