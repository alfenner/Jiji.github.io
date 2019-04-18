document.getElementById("estWarmupTwo").addEventListener("click",queProblems)
document.getElementById("estHandsTwo").addEventListener("click",queProblems)
document.getElementById("estMultichoiceTwo").addEventListener("click",queProblems)


function queProblems(){
  window.localStorage['activity'] = this.id
}
