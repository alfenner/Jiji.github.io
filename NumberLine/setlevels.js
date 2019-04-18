document.getElementById("testButton").addEventListener("click",queTestProblems)


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

function queClassworkDayFour(){
    window.localStorage['activityIndex'] = 5
}

function quePostWarmupDayOne(){
    window.localStorage['activityIndex'] = 6
}
