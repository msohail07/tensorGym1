
/**
 * QUESTIONS:
 *  1) how to determine a 'rep'...
 */
export function checkSquat(keypoints) {

    // THIS CODE WILL LOOP due to requestAnimationFrame(poseDetectionFrame) in function detectPoseInRealTime(video, net)
        // identify initial value of key points for this exercise
        // check (x, y) location of keypoint at the extension point of a rep
            // if (extension point is outside of good exercise range) then indicate bad exercise (play sound and flash red)
            // otherwise, start process again at the initalization point of next rep.
}