document.getElementById("DAY_ONE_WARM_UP").addEventListener("click", queActivity)
document.getElementById("DAY_ONE_TEACHER_WARM_UP").addEventListener("click", queActivity)
document.getElementById("DAY_ONE_CLASSWORK").addEventListener("click", queActivity)
document.getElementById("DAY_ONE_TEACHER_CLASSWORK").addEventListener("click", queActivity)

function queActivity(){
    window.localStorage['activityIndex'] = this.id
}
