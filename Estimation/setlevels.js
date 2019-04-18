document.getElementById("estWarmup").addEventListener("click",queProblems)
document.getElementById("estHands").addEventListener("click",queProblems)
document.getElementById("estMultichoice").addEventListener("click",queProblems)

function queProblems(){
  window.localStorage['activity'] = this.id
}
