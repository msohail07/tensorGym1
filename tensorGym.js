var imageScaleFactor = 0.5;
var outputStride = 16;
var flipHorizontal = false;

posenet.load().then((net) => console.log(net))

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





  // <script>
  //   var imageScaleFactor = 0.5;
  //   var outputStride = 16;
  //   var flipHorizontal = false;

  //   var imageElement = document.getElementById('cat');

  //   posenet.load().then(function(net){
  //     return net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride)
  //   }).then(function(pose){
  //     console.log(pose);
  //   })
  // </script>