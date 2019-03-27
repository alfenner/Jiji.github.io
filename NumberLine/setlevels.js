
document.getElementById("testButton").addEventListener("click",queTestProblems)
document.getElementById("dayOneWarmup").addEventListener("click", queWarmupDayOne)
document.getElementById("dayOneClasswork").addEventListener("click", queClassworkDayOne)
document.getElementById("dayTwoClasswork").addEventListener("click", queClassworkDayTwo)
document.getElementById("dayThreeClasswork").addEventListener("click", queClassworkDayThree)

function queTestProblems(){
    window.localStorage['activityIndex'] = 0
}

function queWarmupDayOne(){
    window.localStorage['activityIndex'] = 1
}

function queClassworkDayOne(){
    window.localStorage['activityIndex'] = 2
}

function queClassworkDayTwo(){
    window.localStorage['activityIndex'] = 3
}

function queClassworkDayThree(){
    window.localStorage['activityIndex'] = 4
}
