export function poorFormFeedback() {
    var canvas = document.getElementById("feedback");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 80, 80);
}

export function neutralFormFeedback() {
    var canvas = document.getElementById("feedback");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 80, 80);
}

export function playSound() {
    document.getElementById('buzzer').play()
}

export function updateReps(i) {
    document.getElementById("reps").innerHTML = i
}