function rotate(cords){
  return cords.map(e => [-e[1],e[0]])
}

function offset(cords,delta) {
  return cords.map(e => {
    return [e[0]-delta[0],e[1]-delta[1]]
  })
}

function checkSumToOne(polys){
  let acc = 0
  for (p of polys){
    let v = getValFromType(p.type)
    acc = acc + v
  }

  return 0.95 < acc && acc < 1.05
}

function flipX(cords){
  return cords.map(e => {
    return [e[0],-e[1]]
  })
}

function flipY(cords){
  return cords.map(e => {
    return [-e[0],e[1]]
  })
}


function drawDots() {
  let c = new PIXI.Graphics()
  c.beginFill(0x4d5259);
  c.drawCircle(3, 3, 3);
  c.endFill();
  let cT = tiler.renderer.generateTexture(c)
  let cS = new PIXI.Sprite(cT)
  cS.on('pointerdown',onNodeClicked)
  cS.x = dx*i
  cS.y = dx*j
}


function isTiled(container,polygons) {

  if (polygons.length == 0){
    return false
  }

  let countOutside = 0

  let isTiled = true
  let dx = container.width/12
  let dy = container.height/12

  console.log("dx,dy",dx,dy)
  console.log("polygoncords1",polygons[0].polyCords)
  console.log("polygons.count",polygons.length)
  console.log("container top left",[container.x-container.width,container.y-container.height])

  // CAREFUL! this assumes that the container is anchored at the center
  let oX = container.x - container.width/2
  let oY = container.y - container.height/2

  console.log("oX,oY",container.width,container.height)

  let testPoints =[]

  for (p of polygons){
    if (!inRect(p,container)){
      console.log("NOT In CONTAINER")
    }
  }


  for (let i = 0;i<12;i++) {
    for (let j = 0;j<12;j++) {
      let testPoint = [oX+dx/2+i*dx,oY+dy/2+j*dy]
        testPoints.push(testPoint)
        let c = new PIXI.Graphics()
        c.beginFill(0x4d5259);
        c.drawCircle(3, 3, 3);
        c.endFill();
        let cT = tiler.renderer.generateTexture(c)
        let cS = new PIXI.Sprite(cT)
        cS.on('pointerdown',onNodeClicked)
        cS.x = oX+dx/2+i*dx-3
        cS.y = oY+dy/2+j*dy-3
        tiler.stage.addChild(cS)
    }
  }
  let recentered = []
  testPoints.forEach(e => {
    let inAPoly = false
    for (let p of polygons){
      recentered = [e[0]-p.x,e[1]-p.y]
      if (isPointInPoly(recentered,p.polyCords)) {
        inAPoly = true
      }
    }

   if (!inAPoly){
     countOutside += 1
   }
})
  console.log("countOutside,rectsOutside",countOutside)
  return countOutside < 3
}

function inRect(r,isIn){
  let c1 = (r.x-r.actualWidth/2) >= (isIn.x - isIn.width/2)-dx/4
  let c2 = (r.x+r.actualWidth/2) <= (isIn.x + isIn.width/2)+dx/4
  let c3 = (r.y-r.actualHeight/2) >= (isIn.y - isIn.height/2)-dx/4
  let c4 = (r.y+r.actualHeight/2) <= (isIn.y + isIn.height/2)+dx/4
  return c1 && c2 && c3 && c4
}

function polysInRect(polys,rect){
  return polys.filter(p => rect.containsPoint(new PIXI.Point(p.x,p.y)))
}


function flipY(cords,y) {

}
