document.getElementById("dayThreeClasswork").addEventListener("click", queDayThreeClasswork)

function queDayThreeClasswork(){
    window.localStorage['activityIndex'] = 5
    window.localStorage['teacherMode'] = 'false'
}

document.getElementById("dayThreeClassworkTeacher").addEventListener("click", queDayThreeClassworkTeacher)

function queDayThreeClassworkTeacher(){
    window.localStorage['activityIndex'] = 5
    window.localStorage['teacherMode'] = 'true'
}
