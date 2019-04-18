document.getElementById("estWarmup").addEventListener("click",queProblems)
document.getElementById("estHands").addEventListener("click",queProblems)
document.getElementById("estMultichoice").addEventListener("click",queProblems)


function queProblems(){
  console.log("this id",this.id)
  window.localStorage['activity'] = this.id
}

/*

function queProblemSetOne(){
    //window.location.href = "https://www.google.com"
    window.localStorage['mc'] = 'false'
    window.localStorage['estActivityIndex'] = 0
}


function queProblemSetOne(){
    //window.location.href = "https://www.google.com"
    window.localStorage['mc'] = 'false'
    window.localStorage['estActivityIndex'] = 0
}

function queProblemSetTwo(){
    window.localStorage['mc'] = 'false'
    window.localStorage['estActivityIndex'] = 1
}

function queProblemSetThree(){
      window.localStorage['mc'] = 'true'
    window.localStorage['estActivityIndex'] = 2
}

function queProblemSetFour(){
      window.localStorage['mc'] = 'false'
    window.localStorage['estActivityIndex'] = 3
}
*/
