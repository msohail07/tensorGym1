// import * as utils from './utils.js'
import {drawKeypoints, drawSkeleton, getUrlParam, getExerciseFunction} from './utils.js'
import {playSound} from './feedbackScripts.js'
import {getRadioVal} from './utils.js'
import {checkSquat} from './exercise/squat.js'

var imageScaleFactor = 0.5; // A number between 0.2 and 1.0. Defaults to 0.50. What to scale the image by before feeding it through the network. Set this number lower to scale down the image and increase the speed when feeding through the network at the cost of accuracy.
var outputStride = 16; //  the desired stride for the outputs when feeding the image through the model. Must be 32, 16, 8. Defaults to 16. The higher the number, the faster the performance but slower the accuracy, and visa versa.
var flipHorizontal = false; // Defaults to false. If the poses should be flipped/mirrored horizontally. This should be set to true for videos where the video is by default flipped horizontally (i.e. a webcam), and you want the poses to be returned in the proper orientation.
var isStartingPoint = true;

const videoWidth = 800;
const videoHeight = 700;

// console.log(getUrlParam('exercise', null))

var bb = document.getElementById("buzzerButton")
bb.addEventListener('click', playSound)

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

// poorFormFeedback()
// neutralFormFeedback()

/**
 * Loads camera to be used in the demo
 *
 */
async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = videoWidth;
  video.height = videoHeight;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: mobile ? undefined : videoWidth,
      height: mobile ? undefined : videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();

  return video;
}

const guiState = {
  input: {
    mobileNetArchitecture: isMobile() ? '0.50' : '0.75',
    outputStride: 16,
    imageScaleFactor: 0.5,
  },
  singlePoseDetection: {
    minPoseConfidence: 0.1, // entire pose confidence score
    minPartConfidence: 0.7, // keypoint confidence score
  },
  output: {
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
    showBoundingBox: false,
  },
};

// function countDownTimer(time, countDownID) {
//   var countDownElem = document.getElementById(countDownID)
//   var countdown = setInterval(function () {
//     countDownElem.style.display = countDownElem.style.display === 'none' ? '' : 'none';
//     countDownElem.innerHTML = time
//     if (--time == 0) {
//       resolve()
//     }
//   }, 1000);
// }

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');
  // since images are being fed from a webcam
  const flipHorizontal = true;
  // var isStartingPoint = true;


  canvas.width = videoWidth;
  canvas.height = videoHeight;

  console.log("IN detectPoseInRealTime --> isStartingPoint value => " + isStartingPoint)

  async function poseDetectionFrame() {

    // var isStartingPoint = true;
    var ex = getRadioVal(document.getElementById('exerciseForm'), 'exercise')
    // var exFunc = getExerciseFunction(ex)

    // Scale an image down to a certain factor. Too large of an image will slow
    // down the GPU
    const imageScaleFactor = guiState.input.imageScaleFactor;
    const outputStride = +guiState.input.outputStride;

    let minPoseConfidence;
    let minPartConfidence;
    const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
    // pose now consists of a pose confidence score and array of keypoints with (x, y, keypoint score)

    // pass this pose into exercise/__exercise__.js

    minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence;
    minPartConfidence = +guiState.singlePoseDetection.minPartConfidence;

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (guiState.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    let score = pose.score
    let keypoints = pose.keypoints

    for (let i=0; i < keypoints.length; i++) {
      let i_str = i.toString()
      let x = i_str + "_x"
      let y = i_str + "_y"
      let s = i_str + "_score"
      document.getElementById(x).innerHTML = Number.parseFloat(keypoints[i].position.x).toFixed(2)
      document.getElementById(y).innerHTML = Number.parseFloat(keypoints[i].position.y).toFixed(2)
      document.getElementById(s).innerHTML = Number.parseFloat(keypoints[i].score).toFixed(4)
    }

    if (score >= minPoseConfidence) {
      // console.log("IN async function poseDetectionFrame()    --> isStartingPoint value => " + isStartingPoint)
      var exercise = getExerciseFunction(getUrlParam('exercise', null))
      if (exercise) {
        // countdown timer
        if (isStartingPoint) {
          var countdown = new Promise((resolve) => {
            var countDownElem = document.getElementById('timer')
            var time = 5
            countDownElem.style.display = countDownElem.style.display === 'none' ? '' : 'none';
            var interval = setInterval(function () {
              document.getElementById('countdown').innerHTML = time
              if (time-- == 0) {
                clearInterval(interval)
                resolve()
              }
            }, 1000);
          })

          countdown.then(() => {
            isStartingPoint = exercise(keypoints, isStartingPoint)
          })
        } else {
          isStartingPoint = exercise(keypoints, isStartingPoint)

        }
        // isStartingPoint = exercise(keypoints, isStartingPoint)
      }
      if (guiState.output.showPoints) {
        drawKeypoints(keypoints, minPartConfidence, ctx);
      }
      if (guiState.output.showSkeleton) {
        drawSkeleton(keypoints, minPartConfidence, ctx);
      }
    }

    // isStartingPoint = false;
    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}


/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
async function bindPage() {
  // Load the PoseNet model weights with architecture 0.75
  const net = await posenet.load(0.75);

  // var timer = setInterval(() => {
  //   let ex = getRadioVal(document.getElementById('exerciseForm'), 'exercise') != null
  //   if (ex) {clearInterval(timer)}
  // }, 200)

  document.getElementById('loading').style.display = 'none';
  document.getElementById('main').style.display = 'block';

  let video;

  try {
    video = await loadVideo();
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
        'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }


  detectPoseInRealTime(video, net);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo
bindPage();