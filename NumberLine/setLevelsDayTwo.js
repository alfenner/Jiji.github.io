document.getElementById("dayTwoClasswork").addEventListener("click", queDayTwoClasswork)
document.getElementById("dayTwoClassworkTeacher").addEventListener("click", queDayTwoClassworkTeacher)


function queDayTwoClasswork(){
  console.log("queing day two classwork bitch!!!")
    window.localStorage['activityIndex'] = 4
    window.localStorage['teacherMode'] = 'false'
}


function queDayTwoClassworkTeacher(){
  console.log("queing day two classwork bitch!!!")
    window.localStorage['activityIndex'] = 4
    window.localStorage['teacherMode'] = 'true'
}
