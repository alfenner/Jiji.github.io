
document.getElementById("estLevelOne").addEventListener("click",queProblemSetOne)
document.getElementById("estLevelTwo").addEventListener("click",queProblemSetTwo)
document.getElementById("estLevelThree").addEventListener("click",queProblemSetThree)
document.getElementById("estLevelFour").addEventListener("click",queProblemSetFour)


function queProblemSetOne(){
    window.localStorage['estActivityIndex'] = 0
}

function queProblemSetTwo(){
    window.localStorage['estActivityIndex'] = 1
}

function queProblemSetThree(){
    window.localStorage['estActivityIndex'] = 2
}

function queProblemSetFour(){
    window.localStorage['estActivityIndex'] = 3
}


function queMCProblemSetOne(){
    window.localStorage['mc'] = true
    window.localStorage['estActivityIndex'] = 0
}

function queMCProblemSetTwo(){
    window.localStorage['mc'] = true
    window.localStorage['estActivityIndex'] = 1
}

function queMCProblemSetThree(){
    window.localStorage['mc'] = true
    window.localStorage['estActivityIndex'] = 2
}

function queMCProblemSetFour(){
    window.localStorage['mc'] = true
    window.localStorage['estActivityIndex'] = 3
}
