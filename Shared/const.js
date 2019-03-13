const windowWidth = window.innerWidth
const windowHeight = window.innerHeight
const wallWidth = windowWidth/1.5
const wallX = (windowWidth-wallWidth)/2
const height = window.innerHeight/18
let dx = window.innerHeight/15
let dy = dx


const AXIS  = {
  NORMAL: -1,
  SIDE: 1
}

const TYPES = {
  WHOLE: [[0,0],[4*dx,0],[4*dx,4*dx],[0,4*dx]],
  FOURTH_RECT: [[0,0],[4*dx,0],[4*dx,dx],[0,dx]],
  THIRD_RECT: [[0,0],[4*dx,0],[4*dx,4/3*dx],[0,4/3*dx]],
  FOURTH_RIGHT_TRIANGLE: [[0,0],[0,2*dx],[4*dx,2*dx]],
  FOURTH_ISOCELES: [[0,0],[2*dx,2*dx],[4*dx,0]],
  HALF_RECT: [[0,0],[4*dx,0],[4*dx,2*dx],[0,2*dx]],
  FOURTH_SQUARE: [[0,0],[0,2*dx],[2*dx,2*dx],[2*dx,0]],
  HALF_TRIANGLE: [[0,0],[0,4*dx],[4*dx,0]],
  EIGHTH_TRIANGLE: [[0,0],[0,2*dx],[2*dx,0]],
  EIGHTH_RECT: [[0,0],[2*dx,0],[2*dx,dx],[0,dx]],
  SIXTH_RECT: [[0,0],[2*dx,0],[2*dx,4/3*dx],[0,4/3*dx]],
  SIXTEENTH_TRIANGLE: [[0,0],[0,dx],[2*dx,dx]],
  PARALLELOGRAM: [[0,0],[2*dx,0],[4*dx,2*dx],[2*dx,2*dx]],
  SIXTH_TRIANGLE: [[0,0],[0,4/3*dx],[4*dx,4/3*dx]],
  THIRD_TRIANGLE: [[0,0],[0,8/3*dx],[4*dx,4/3*dx]],
  EIGHTH_ISOCELES: [[0,0],[4*dx,0],[2*dx,dx]],
  EIGHTH_RIGHT_TRIANGLE: [[0,0],[4*dx,dx],[0,dx]],
  EIGHTH_ISOCELES_TWO: [[0,0],[2*dx,dx],[0,2*dx]]
}

function getValFromType(type) {
  switch (type) {
    case TYPES.FOURTH_RECT:
    return 1/4
    break
    case TYPES.THIRD_RECT:
    return 1/3
    break
    case TYPES.FOURTH_RIGHT_TRIANGLE:
    return 1/4
    break
    case TYPES.FOURTH_ISOCELES:
    return 1/4
    break
    case TYPES.HALF_RECT:
    return 1/2
    break
    case TYPES.FOURTH_SQUARE:
    return 1/4
    break
    case TYPES.HALF_TRIANGLE:
    return 1/2
    break
    case TYPES.EIGHTH_TRIANGLE:
    return 1/8
    break
    case TYPES.EIGHTH_RECT:
    return 1/8
    break
    case TYPES.SIXTH_RECT:
    return 1/6
    break
    case TYPES.SIXTEENTH_TRIANGLE:
    return 1/16
    break
    case TYPES.PARALLELOGRAM:
    return 1/4
    break
    case TYPES.SIXTH_TRIANGLE:
    return 1/6
    break
    case TYPES.THIRD_TRIANGLE:
    return 1/3
    break
    case TYPES.EIGHTH_ISOCELES:
    return 1/8
    break
    case TYPES.EIGHTH_RIGHT_TRIANGLE:
    return 1/8
    break
    case TYPES.EIGHTH_ISOCELES_TWO:
    return 1/8
    break
    default:
    console.log("balls")
  }
}


const COLORS = {
ORANGE: 0xffaa32,
RED: 0xff5121,
PURPLE: 0x9966FF,
BLUE: 0x216ae0,
PINK: 0xf721ff,
ORANGE: 0xffaa49,
BROWN: 0x82521b}

const COLOR_KEYS = Object.keys(COLORS)
