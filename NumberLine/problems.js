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

const DAY4_CLASSWORK_P1 = {
  prompt: "Space pins evenly and then label them",
  blocks: [HALF_BLOCK,FOURTH_BLOCK,EIGHTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,1,0],
  presetPinKeys: [1,0,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 4,
  max: 1,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 4,
  presetLabels: [[0,1],[1,1]],
  labels: [[1,2]],
  unique: true,
}

const DAY4_CLASSWORK_P2 = {
  prompt: "Go!",
  blocks: [THIRD_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,0],
  presetPinKeys: [1,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 3,
  max: 1,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 3,
  presetLabels: [[0,1],[1,1]],
  labels: [[2,3]],
  unique: true,
}

const DAY4_CLASSWORK_P3 = {
  prompt: "Go!",
  blocks: [WHOLE_BLOCK,HALF_BLOCK,FOURTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,1,1,1,1,1,0],
  presetPinKeys: [1,0,0,0,0,0,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 4,
  max: 2,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 8,
  presetLabels: [[0,1],[2,1]],
  labels: [[1,1],[3,2],[1,2]],
  unique: true,
}

const DAY4_CLASSWORK_P4 = {
  prompt: "Go!",
  blocks: [THIRD_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,1,1,1,0],
  presetPinKeys: [1,0,0,0,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 3,
  max: 2,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 6,
  presetLabels: [[0,1],[2,1]],
  labels: [[1,3],[4,3],[3,3]],
  unique: true,
}

const DAY4_CLASSWORK_P5 = {
  prompt: "Go!",
  blocks: [THIRD_BLOCK,EIGHTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,1,1,1,1,1,0],
  presetPinKeys: [1,0,0,0,0,0,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 3,
  max: 1,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 8,
  presetLabels: [[0,1],[1,1]],
  labels: [[1,3],[4,3],[3,3]],
  unique: true,
}


const DAY1_WARM_UP_P1 = {
  prompt: "Use the pin to make two equal parts",
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
  prompt: "Use the pins to make three equal parts",
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

const DAY1_2ND_WARM_UP_P1 = {
  prompt: "Create pins to make three equal parts",
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,0],
  presetPinKeys: [1,0,0,1],
  pinWidget: true,
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
  prompt: "Go!",
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
  prompt: "Go!",
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
  prompt: "Create pins to make six equal parts and set the labels",
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
  prompt: "Use the pins to create equal parts and then label them",
  blocks: [FOURTH_BLOCK,SIXTH_BLOCK,EIGHTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,1,1],
  presetPinKeys: [1,0,0,0,0],
  pinWidget: false,
  partitionsPerWhole: 2,
  max: 1,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  partitionsPerLine: 4,
  presetLabels: [[0,1]],
  labels: [[1,2],[2,2],[4,2]],
  unique: false,
  endPins: true,
}

const DAY3_CLASSWORK_P1 = {
  prompt: "Go!",
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
  prompt: "Go!",
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

const TEST_QUE = [DAY1_WARM_UP_P2,DAY1_2ND_WARM_UP_P1,DAY4_CLASSWORK_P1,DAY1_CLASSWORK_P5,DAY2_CLASSWORK_P1,DAY3_CLASSWORK_P1]

const DAY_ONE_WARM_UP_SEQ = [DAY1_WARM_UP_P1,DAY1_WARM_UP_P2,DAY1_WARM_UP_P2]

const DAY_ONE_CLASSWORK_SEQ = [DAY1_CLASSWORK_P1,DAY1_CLASSWORK_P5,DAY1_CLASSWORK_P1]

const DAY_TWO_CLASSWORK_SEQ = [DAY2_CLASSWORK_P1,DAY2_CLASSWORK_P1,DAY2_CLASSWORK_P1]

const DAY_THREE_CLASSWORK_SEQ = [DAY3_CLASSWORK_P1,DAY3_CLASSWORK_P1,DAY3_CLASSWORK_P1]

const DAY_FOUR_CLASSWORK_SEQ = [DAY4_CLASSWORK_P1,DAY4_CLASSWORK_P2,DAY4_CLASSWORK_P3,DAY4_CLASSWORK_P4,DAY4_CLASSWORK_P5]


const ACTIVITY_QUE = [TEST_QUE,DAY_ONE_WARM_UP_SEQ,DAY_ONE_CLASSWORK_SEQ,DAY_TWO_CLASSWORK_SEQ,DAY_THREE_CLASSWORK_SEQ,DAY_FOUR_CLASSWORK_SEQ]
