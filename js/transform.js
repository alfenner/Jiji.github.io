function rotate(cords){
  return cords.map(e => [-e[1],e[0]])
}

function offset(cords,delta) {
  console.log("calling offset")
  return cords.map(e => {
    console.log("mapping cords",[e[0]-delta[0],e[1]-delta[1]])
    return [e[0]-delta[0],e[1]-delta[1]]
  })
}


function flipX(cords,x){

}

function flipY(cords,y) {

}

function maxX(cords){

}

function maxY(cords){

}
