document.getElementById('DAY_THREE_CLASSWORK').addEventListener("click", queActivity)

document.getElementById('DAY_THREE_TEACHER_CLASSWORK').addEventListener("click", queActivity)

function queActivity(){
    window.localStorage['activityIndex'] = this.id
}
