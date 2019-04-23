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

// My Stuff

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
  dontReset: true
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
  dontScorePins: true,
}

// Active Stuff

const DAY1_WARM_UP_P1 = {
  prompt: "Divide the line segment into equal lengths",
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
  //discussionQuestion: true
}

const DAY1_WARM_UP_P2 = {
  prompt: "Divide the line segment into equal lengths",
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
  prompt: "Divide the line segment into equal lengths",
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,1,1,1,0],
  presetPinKeys: [1,0,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 4,
  max: 1,
  min: 0,
  tolerance: 0.2,
  partitionsPerLine: 4,
  presetLabels: [],
  labels: [],
  unique: true,
  endPins: true,
}


const DAY1_POSTWARMUP_P1 = {
  prompt: "",
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0],
  pinWidget: false,
  numberOfTicks: 5,
  partitionsPerWhole: 4,
  max: 1,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  presetPinKeys: [],
  partitionsPerLine: 4,
  presetLabels: [[0,1],[1,1]],
  labels: [[3,4],[2,4]],
  unique: true,
  endPins: true,
}

const DAY1_POSTWARMUP_P2 = {
  prompt: "Go!",
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0],
  pinWidget: false,
  numberOfTicks: 7,
  partitionsPerWhole: 6,
  max: 1,
  min: 0,
  ticksEvery: null,
  tolerance: 0.1,
  presetPinKeys: [],
  partitionsPerLine: 6,
  presetLabels: [[0,1],[1,1]],
  labels: [[2,6],[5,6],[4,6]],
  unique: true,
  endPins: true,
  discussionQuestion: true
}

const DAY1_CLASSWORK_P1 = {
  prompt: "Place the markers to represent one half, then label the tick-mark with a fraction.",
  blocks: [HALF_BLOCK,FOURTH_BLOCK,EIGHTH_BLOCK],
  indexOfMarkedBlock: null, // DON'T KNOW THAT THIS IS OR WAS SUPPOSED TO BE FOR
  pinKeys: [0,1,0],
  presetPinKeys: [1,0,1],
  pinWidget: false,
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

const DAY1_CLASSWORK_P2 = {
  prompt: "Place the markers to represent one half, then label the tick-mark with a fraction.",
  blocks: [HALF_BLOCK,FOURTH_BLOCK,EIGHTH_BLOCK],
  indexOfMarkedBlock: null, // DON'T KNOW THAT THIS IS OR WAS SUPPOSED TO BE FOR
  pinKeys: [0,1,1,1,0],
  presetPinKeys: [1,0,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 4,
  max: 1,
  min: 0,
  ticks: null,
  tolerance: 0.3,
  partitionsPerLine: 4,
  presetLabels: [[0,1],[1,1]],
  labels: [[3,4],[2,4],[1,4]],
  unique: true,
  endPins: true,
  discussionQuestion: true
}

const DAY1_CLASSWORK_P3 = {
  prompt: "Place the markers to represent thirds, then label the tick-marks with a fraction.",
  blocks: [THIRD_BLOCK,FOURTH_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null, // DON'T KNOW THAT THIS IS OR WAS SUPPOSED TO BE FOR
  pinKeys: [0,1,1,0],
  presetPinKeys: [1,0,0,1],
  pinWidget: true,
  partitionsPerWhole: 3,
  max: 1,
  min: 0,
  ticks: null,
  tolerance: 0.2,
  partitionsPerLine: 3,
  presetLabels: [[0,1],[1,1]],
  labels: [[2,3]],
  unique: true,
  endPins: true,
  //dontScorePins: true, // If there is a pin widget we don't score the pins by default
}

const DAY1_CLASSWORK_P4 = {
  prompt: "Place the markers to represent one half, then label the tick-mark with a fraction.",
  blocks: [HALF_BLOCK,FOURTH_BLOCK,EIGHTH_BLOCK],
  indexOfMarkedBlock: null, // DON'T KNOW THAT THIS IS OR WAS SUPPOSED TO BE FOR
  pinKeys: [0,1,1,1,0],
  presetPinKeys: [1,0,0,0,1],
  pinWidget: false,
  partitionsPerWhole: 4,
  max: 1,
  min: 0,
  ticks: null,
  tolerance: 0.3,
  partitionsPerLine: 4,
  presetLabels: [[0,1],[1,1]],
  labels: [[3,4],[2,4],[1,4]],
  unique: true,
  endPins: true,
}


const DAY1_CLASSWORK_P5 = {
  prompt: "Place the markers to represent sixths, then label the tick-marks with a fraction.",
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
  dontScorePins: true,
  discussionQuestion: true
}

const DAY2_CLASSWORK_P1 = {
  prompt: "Use the pins to create equal parts and then label them",
  blocks: [HALF_BLOCK,THIRD_BLOCK,FOURTH_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0],
  presetPinKeys: [0,0,0,0,0],
  pinWidget: false,
  partitionsPerWhole: 2,
  max: 2,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  partitionsPerLine: 4,
  presetLabels: [[0,1]],
  labels: [[1,2],[2,2],[4,2]],
  unique: false,
  endPins: true,
  dontScorePins: true
}

const DAY2_CLASSWORK_P2 = {
  prompt: "Use the pins to create equal parts and then label them",
  blocks: [HALF_BLOCK,THIRD_BLOCK,FOURTH_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0],
  presetPinKeys: [0,0,0,0,0],
  pinWidget: false,
  partitionsPerWhole: 2,
  max: 2,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  partitionsPerLine: 4,
  presetLabels: [[0,1]],
  labels: [[1,2],[1,1],[3,2],[2,1]],
  unique: false,
  endPins: true,
  dontScorePins: true
}

const DAY2_CLASSWORK_P3 = {
  prompt: "Use the pins to create equal parts and then label them",
  blocks: [HALF_BLOCK,THIRD_BLOCK,FOURTH_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0,0],
  presetPinKeys: [0,0,0,0,0,0,0,0],
  pinWidget: false,
  partitionsPerWhole: 4,
  max: 7/4,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  partitionsPerLine: 7,
  presetLabels: [[0,1]],
  labels: [[5,4],[6,4],[3,4],[7,4],[2,4]],
  unique: false,
  endPins: true,
  dontScorePins: true,
  discussionQuestion: true,
}

const DAY2_CLASSWORK_P4 = {
  prompt: "Use the pins to create equal parts and then label them",
  blocks: [HALF_BLOCK,THIRD_BLOCK,FOURTH_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0],
  presetPinKeys: [0,0,0,0,0,0,0],
  pinWidget: false,
  partitionsPerWhole: 3,
  max: 2,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  partitionsPerLine: 6,
  presetLabels: [[0,1]],
  labels: [[2,1],[2,3],[4,3],[5,3]],
  unique: false,
  endPins: true,
  dontScorePins: true
}

const DAY2_CLASSWORK_P5 = {
  prompt: "Use the pins to create equal parts and then label them",
  blocks: [HALF_BLOCK,THIRD_BLOCK,FOURTH_BLOCK,SIXTH_BLOCK],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0,0,0,0],
  presetPinKeys: [0,0,0,0,0],
  pinWidget: false,
  partitionsPerWhole: 6,
  max: 9/6,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  partitionsPerLine: 9,
  presetLabels: [[0,1]],
  labels: [[9,6],[2,6],[4,6],[5,6],[7,6]],
  unique: false,
  endPins: true,
  dontScorePins: true,
  discussionQuestion: true,
}



const DAY3_CLASSWORK_P1 = {
  prompt: "Go!",
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0],
  pinWidget: false,
  numberOfTicks: 3,
  partitionsPerWhole: 2,
  max: 2,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  presetPinKeys: [],
  partitionsPerLine: 4,
  presetLabels: [[0,1],[1,1],[2,1]],
  labels: [[3,2],[1,2]],
  unique: true,
  endPins: true,
}

const DAY3_CLASSWORK_P2 = {
  prompt: "Go!",
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0,0,0],
  pinWidget: false,
  numberOfTicks: 5,
  partitionsPerWhole: 4,
  max: 2,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  presetPinKeys: [],
  partitionsPerLine: 8,
  presetLabels: [[0,1],[1,1],[2,1]],
  labels: [[3,4],[1,4],[6,4],[5,4]],
  unique: true,
  endPins: true,
  discussionQuestion: true
}

const DAY3_CLASSWORK_P3 = {
  prompt: "Go!",
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  pinWidget: false,
  numberOfTicks: 9,
  partitionsPerWhole: 8,
  max: 2,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  presetPinKeys: [],
  partitionsPerLine: 16,
  presetLabels: [[0,1],[1,1],[2,1]],
  labels: [[1,8],[7,8],[15,8],[9,8]],
  unique: true,
  endPins: true,
}


const DAY3_CLASSWORK_P4 = {
  prompt: "Go!",
  blocks: [],
  indexOfMarkedBlock: null,
  pinKeys: [0,0,0,0,0,0,0],
  pinWidget: false,
  numberOfTicks: 3,
  partitionsPerWhole: 3,
  max: 2,
  min: 0,
  ticksEvery: null,
  tolerance: 0.2,
  presetPinKeys: [],
  partitionsPerLine: 6,
  presetLabels: [[0,1],[1,1],[2,1]],
  labels: [[4,3],[2,3],[1,3],[5,3]],
  unique: true,
  endPins: true,
}

const DAY3_CLASSWORK_P5 = {
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
  discussionQuestion: true
}


const DAY_ONE_WARM_UP_SEQ = [DAY1_WARM_UP_P1,DAY1_WARM_UP_P2,DAY1_WARM_UP_P3]

const DAY_ONE_CLASSWORK_SEQ = [DAY1_POSTWARMUP_P1,DAY1_POSTWARMUP_P2,DAY1_CLASSWORK_P3,DAY1_CLASSWORK_P2,DAY1_CLASSWORK_P3,DAY1_CLASSWORK_P4,DAY1_CLASSWORK_P5]

const DAY_ONE_POSTWARMUP_SEQ = [DAY1_POSTWARMUP_P1,DAY1_POSTWARMUP_P2]

const DAY_TWO_CLASSWORK_SEQ = [DAY2_CLASSWORK_P1,DAY2_CLASSWORK_P2,DAY2_CLASSWORK_P3,DAY2_CLASSWORK_P4,DAY2_CLASSWORK_P5]

const DAY_THREE_CLASSWORK_SEQ = [DAY3_CLASSWORK_P1,DAY3_CLASSWORK_P2,DAY3_CLASSWORK_P3,DAY3_CLASSWORK_P4,DAY3_CLASSWORK_P5]

const DAY_FOUR_CLASSWORK_SEQ = [DAY4_CLASSWORK_P3,DAY4_CLASSWORK_P2,DAY4_CLASSWORK_P3,DAY4_CLASSWORK_P4,DAY4_CLASSWORK_P5]

const TEST_QUE = DAY_FOUR_CLASSWORK_SEQ

const ACTIVITY_QUE = [TEST_QUE,DAY_ONE_WARM_UP_SEQ,DAY_ONE_POSTWARMUP_SEQ,DAY_ONE_CLASSWORK_SEQ,DAY_TWO_CLASSWORK_SEQ,DAY_THREE_CLASSWORK_SEQ,DAY_FOUR_CLASSWORK_SEQ]

const NUMBERLINE_ACTIVITIES = {
  'DAY_ONE_PARTITIONING_WARMUP': DAY_ONE_WARM_UP_SEQ,
  'DAY_ONE_TEACHER_LABELING': DAY_ONE_WARM_UP_SEQ,

}
