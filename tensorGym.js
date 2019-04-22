var video = document.querySelector("#video");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.log("Something went wrong!");
    });
}

function playSound() {
  document.getElementById('buzzer').play()
}

var bb = document.getElementById("buzzerButton")

bb.addEventListener('click', playSound)