document.getElementById("DAY_TWO_CLASSWORK").addEventListener("click", queActivity)
document.getElementById("DAY_TWO_TEACHER_CLASSWORK").addEventListener("click", queActivity)


function queActivity(){
    window.localStorage['activityIndex'] = this.id
}
