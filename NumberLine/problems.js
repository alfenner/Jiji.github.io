const WHOLE_BLOCK = {
  num: 1,
  den: 1
}

const HALF_BLOCK = {
  num: 1,
  den: 2
}

const THIRD_BLOCK = {
  num: 1,
  den: 3
}

const FOURTH_BLOCK = {
  num: 1,
  den: 4
}

const SIXTH_BLOCK = {
  num: 1,
  den: 6
}

const EIGHTH_BLOCK = {
  num: 1,
  den: 8
}

const PROBLEM_1 = {
  blocks: [WHOLE_BLOCK,HALF_BLOCK,FOURTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,1,0],
  presetPinKeys: [1,0,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 2,
  max: 2,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 4,
  presetLabels: [[0,1],[2,1]],
  labels: [[2,1],[1,1],[3,2],[0,1]],
  presetPins: []
}

const DAY1_WARM_UP_P1 = {
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,0],
  presetPinKeys: [1,0,1],
  pinWidget: false,
  partitionsPerWhole: 2,
  max: 1,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 2,
  presetLabels: [],
  labels: [],
  unique: true,
  endPins: true,
}

const DAY1_WARM_UP_P2 = {
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,0],
  presetPinKeys: [1,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 3,
  max: 1,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 3,
  presetLabels: [],
  labels: [],
  unique: true,
  endPins: true,
}

const DAY1_WARM_UP_P3 = {
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [1,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 3,
  max: 1,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  partitionsPerLine: 3,
  presetLabels: [],
  labels: [],
  unique: true,
  endPins: true,
}

const DAY1_CLASSWORK_P1 = {
  blocks: [HALF_BLOCK,FOURTH_BLOCK,EIGHTH_BLOCK],
  indexOfMarkedBlock: null, // DON'T KNOW THAT THIS IS OR WAS SUPPOSED TO BE FOR
  pinKeys: [0,0,0],
  presetPinKeys: [1,0,1],
  pinWidget: true,
  partitionsPerWhole: 2,
  max: 1,
  min: 0,
  ticks: null,
  tolerance: 0.3,
  partitionsPerLine: 2,
  presetLabels: [[0,1],[1,1]],
  labels: [[1,2]],
  unique: true,
  endPins: true,
}

const DAY1_CLASSWORK_P5 = {
  blocks: [HALF_BLOCK,THIRD_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null, // DON'T KNOW THAT THIS IS OR WAS SUPPOSED TO BE FOR
  pinKeys: [0,0,0,0,0,0,0],
  presetPinKeys: [1,0,0,0,0,0,1],
  pinWidget: true,
  partitionsPerWhole: 6,
  max: 1,
  min: 0,
  ticks: null,
  tolerance: 0.3,
  partitionsPerLine: 6,
  presetLabels: [[0,1],[1,1]],
  labels: [[4,6],[2,6],[5,6]],
  unique: true,
  endPins: true,
}

const DAY2_CLASSWORK_P1 = {
  blocks: [HALF_BLOCK,THIRD_BLOCK,FOURTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [1,0,0,0,0],
  presetPinKeys: [1,0,0,0,0],
  pinWidget: true,
  partitionsPerWhole: 2,
  max: 1,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  partitionsPerLine: 4,
  presetLabels: [[0,1]],
  labels: [[1,2],[2,2],[3,2],[4,2]],
  unique: false,
  endPins: true,
}

const DAY3_CLASSWORK_P1 = {
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  pinWidget: false,
  numberOfTicks: 8,
  partitionsPerWhole: 6,
  max: 7/3,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  presetPinKeys: [],
  partitionsPerLine: 14,
  presetLabels: [[0,1],[1,1],[2,1]],
  labels: [[1,6],[5,6],[11,6]],
  unique: true,
  endPins: true,
}

const DAY3_CLASSWORK_P2 = {
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  pinWidget: false,
  numberOfTicks: 8,
  partitionsPerWhole: 6,
  max: 7/3,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  presetPinKeys: [],
  partitionsPerLine: 14,
  presetLabels: [[0,1],[1,1],[2,1]],
  labels: [[1,6],[5,6],[11,6]],
  unique: true,
  endPins: true,
}

const TEST_QUE = [DAY1_WARM_UP_P2,DAY1_CLASSWORK_P5,DAY1_CLASSWORK_P1,DAY2_CLASSWORK_P1,DAY3_CLASSWORK_P1]

const DAY_ONE_WARM_UP_SEQ = [DAY1_WARM_UP_P1,DAY1_WARM_UP_P2,DAY1_WARM_UP_P2]

const DAY_ONE_CLASSWORK_SEQ = [DAY1_CLASSWORK_P1,DAY1_CLASSWORK_P5,DAY1_CLASSWORK_P1]

const DAY_TWO_CLASSWORK_SEQ = [DAY2_CLASSWORK_P1,DAY2_CLASSWORK_P1,DAY2_CLASSWORK_P1]

const DAY_THREE_CLASSWORK_SEQ = [DAY3_CLASSWORK_P1,DAY3_CLASSWORK_P1,DAY3_CLASSWORK_P1]


const ACTIVITY_QUE = [TEST_QUE,DAY_ONE_WARM_UP_SEQ,DAY_ONE_CLASSWORK_SEQ,DAY_TWO_CLASSWORK_SEQ,DAY_THREE_CLASSWORK_SEQ]
