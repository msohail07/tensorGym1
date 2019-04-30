import {playSound, poorFormFeedback, neutralFormFeedback, updateReps} from '../feedbackScripts.js'
import {primaryBodyPoint} from './exerciseUtils.js'

var initialHipPoint
var initialKneePoint
var repCount = 0

export function checkSquat(keypoints, isStartingPoint) {
    var currHipPoint = primaryBodyPoint(keypoints[11], keypoints[12])
    var currKneePoint = primaryBodyPoint(keypoints[13], keypoints[14])

    // THIS CODE WILL LOOP due to requestAnimationFrame(poseDetectionFrame) in function detectPoseInRealTime(video, net)
        // identify initial value of key points for this exercise
        // check (x, y) location of keypoint at the extension point of a rep
            // if (extension point is outside of good exercise range) then indicate bad exercise (play sound and flash red)
            // otherwise, start process again at the initalization point of next rep.

    document.getElementById("exerciseInfo").innerHTML =
        " <p>Exercise information: </p> \
        <ul> \
        <li>Stand sideways to the camera</li> \
        <li>Keep heels on the floor</li> \
        <li>Keep back straight</li> \
        <li><a href='https://www.youtube.com/watch?v=R1v152b72lo'>Tutorial Video</a></li> \
        </ul>"

    neutralFormFeedback()

    if (isStartingPoint) {
        initialHipPoint = primaryBodyPoint(keypoints[11], keypoints[12])
        initialKneePoint = primaryBodyPoint(keypoints[13], keypoints[14])
        // console.log(initialKneePoint)
    }

    // console.log(initialKneePoint.po.y)

    // hip way below knee
    // primaryHipPoint.y - primaryKneePoint.y > 100px

    // knees are dropping downwards
    if (currKneePoint.position.y - initialKneePoint.position.y > 50) {
        console.log("KNEES ARE DROPPING!!!")
        console.log(currKneePoint)
        console.log(initialHipPoint)
        playSound()
        poorFormFeedback()
        document.getElementById('feedbackDesc').innerHTML = 'Knees are dropping too low'
    }

    return false; //set isStartingPoint in tensorGym.js/poseDetectionFrame() to false
}




/**
 * QUESTIONS:
 *  1) how to determine a 'rep'... will call updateReps(repCount)
 */
// export function checkSquat(keypoints, isStartingPoint) {

//     // THIS CODE WILL LOOP due to requestAnimationFrame(poseDetectionFrame) in function detectPoseInRealTime(video, net)
//         // identify initial value of key points for this exercise
//         // check (x, y) location of keypoint at the extension point of a rep
//             // if (extension point is outside of good exercise range) then indicate bad exercise (play sound and flash red)
//             // otherwise, start process again at the initalization point of next rep.

//     document.getElementById("exerciseInfo").innerHTML =
//         " <p>Exercise information: </p> \
//         <ul> \
//         <li>Stand sideways to the camera</li> \
//         <li>Keep heels on the floor</li> \
//         <li>Keep back straight</li> \
//         <li><a href='https://www.youtube.com/watch?v=R1v152b72lo'>Tutorial Video</a></li> \
//         </ul>"

//     console.log("isStartingPoint")
//     console.log(isStartingPoint)
//     neutralFormFeedback()


//     if (isStartingPoint) {
//         initialPointX = keypoints[0].position.x;
//         initialPointY = keypoints[0].position.y;
//     }

//     console.log("TESTING CONSOLE>LOG: " + initialPointX + ", " + initialPointY)

//     if (keypoints[0].position.x - initialPointX > 200) {
//         console.log("INITIAL: " + initialPointX + ", " + initialPointY)
//         console.log("PLAYING SOUND: " + keypoints[0].position.x + ", " + keypoints[0].position.y)
//         playSound()
//         poorFormFeedback()
//         console.log("POOR FORM DETECTED!!!!!!!!!!!")
//     }

//     return false; //set isStartingPoint in tensorGym.js/poseDetectionFrame() to false
// }