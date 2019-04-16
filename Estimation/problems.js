const SET_ONE_P1  = {
  num: 1,
  den: 2,
  multichoice: [[1,6],[1,2],[1,4],[1,5]],
  answer: [1,2],
}
const SET_ONE_P2  = {
  num: 1,
  den: 4,
  multichoice: [[1,2],[1,8],[1,7],[1,4]],
  answer: [1,4],
}
const SET_ONE_P3  = {
  num: 2,
  den: 4,
  multichoice: [[3,2],[1,2],[1,4],[1,5]],
  answer: [1,2],
}
const SET_ONE_P4  = {
  num: 1,
  den: 6,
  multichoice: [[3,2],[1,2],[1,4],[1,5]],
  answer: [1,2],
}
const SET_ONE_P5 = {
  num: 2,
  den: 6,
  multichoice: [[3,2],[1,2],[1,4],[1,5]],
  answer: [2,6],
}
const SET_ONE_P6 = {
  num: 4,
  den: 8,
  multichoice: [[3,2],[1,2],[1,4],[1,5]],
  answer: [1,2],
}
const SET_ONE_P7 = {
  num: 6,
  den: 7,
  multichoice: [[3,2],[1,2],[1,4],[1,5]],
  answer: [1,2],
}
const SET_ONE_P8 = {
  num: 2,
  den: 7,
  multichoice: [[3,2],[1,2],[1,4],[1,5]],
  answer: [1,2],
}
const SET_ONE_P9 = {
  num: 4,
  den: 5,
  multichoice: [[3,2],[1,2],[1,4],[1,5]],
  answer: [1,2],
}
const SET_ONE_P10 = {
  num: 3,
  den: 8,
  multichoice: [[3,2],[1,2],[1,4],[1,5]],
  answer: [1,2],
}




const SET_TWO_P1  = {
  num: 1,
  den: 4,
  multichoice: [],
}
const SET_TWO_P2  = {
  num: 4,
  den: 5,
  multichoice: [],
}
const SET_TWO_P3  = {
  num: 5,
  den: 8,
  multichoice: [],
}
const SET_TWO_P4  = {
    num: 5,
    den: 11,
    multichoice: [],
}


const SET_THREE_P1  = {
  num: 1,
  den: 3,
  multichoice: [],
}
const SET_THREE_P2  = {
  num: 2,
  den: 3,
  multichoice: [],
}
const SET_THREE_P3  = {
  num: 1,
  den: 5,
  multichoice: [],
}
const SET_THREE_P4  = {
  num: 4,
  den: 5,
  multichoice: [],
}
const SET_THREE_P5 = {
  num: 1,
  den: 7,
  multichoice: [],
}
const SET_THREE_P6 = {
  num: 5,
  den: 11,
  multichoice: [],
}


const MC_GAME_P1  = {
  num: 7,
  den: 11,
  multichoice: [[5,11],[3,5],[7,11],[8,9]],
}
const MC_GAME_P2  = {
  num: 3,
  den: 12,
  multichoice: [[3,12],[1,10],[1,2],[3,7]],
}
const MC_GAME_P3  = {
  num: 5,
  den: 7,
  multichoice: [[3,7],[8,9],[4,10],[5,7]],
}
const MC_GAME_P4  = {
  num: 2,
  den: 5,
  multichoice: [[5,9],[2,5],[1,3],[3,5]],
}
const MC_GAME_P5 = {
  num: 5,
  den: 9,
  multichoice: [[1,11],[2,5],[5,9],[11,12]],
}



const TEXT_TO_FRAC_KEY = {
  '1 Half': [1,2],
  '1 Fourth': [1,4],
  '1 Fifth': [1,5],
  '1 Sixth': [1,6],
  '1 Third': [1,3],
  '3 Halves': [3,2]
}

const WARM_UP = {
  prompt: null,
  discussion: null,
  problems: [SET_ONE_P1,SET_ONE_P2,SET_ONE_P3,SET_ONE_P4,SET_ONE_P5,SET_ONE_P6,SET_ONE_P7,SET_ONE_P8,SET_ONE_P9,SET_ONE_P10]
}

const CLASS_ESTIMATION = {
  prompt: "As a class, raise your hand when you \n think the slider is on the correct value.",
  discussion: "Are these fractions greater \n than one half? \n How do you know? \n \n On the back of your paper write \n three more fractions that are greater \n than one half.",
  problems: [SET_TWO_P1,SET_TWO_P2,SET_TWO_P3,SET_TWO_P4]
}

const MAIN_PROBLEM_SET = {
  prompt: null,
  discussion: null,
  problems: [SET_THREE_P1,SET_THREE_P2,SET_THREE_P3,SET_THREE_P4,SET_THREE_P5,SET_THREE_P6]
}

const MC_GAME = {
  prompt: "Answer the question as a class \n by raising your flag to show \n the answer you chose.",
  discussion: null,
  problems: [MC_GAME_P1,MC_GAME_P2,MC_GAME_P3,MC_GAME_P4]
}
const PROBLEM_SETS = [WARM_UP,CLASS_ESTIMATION,MC_GAME,MAIN_PROBLEM_SET,]
