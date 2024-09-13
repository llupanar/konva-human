import Konva from 'konva';
import { updateJointPosition } from './human.position';
import * as dots from '../../../core/human.constants';

export function initAnimations(
  leftArm: Konva.Line,
  rightArm: Konva.Line,
  leftLeg: Konva.Line,
  rightLeg: Konva.Line,
  leftElbow: Konva.Circle,
  rightElbow: Konva.Circle,
  leftHand: Konva.Circle,
  rightHand: Konva.Circle,
  leftKnee: Konva.Circle,
  rightKnee: Konva.Circle,
  leftFoot: Konva.Circle,
  rightFoot: Konva.Circle
) {
  const animTectonic = new Konva.Animation((frame: any) => {
    const time = frame.time;

    const elbowYMovement =
      50 * Math.sin((time * 2 * Math.PI) / 1000) + dots.SHOULDER_Y;

    leftElbow.y(elbowYMovement);
    rightElbow.y(elbowYMovement);

    updateJointPosition(
      leftElbow,
      dots.LEFT_SHOULDER_X,
      dots.SHOULDER_Y,
      dots.ELBOW_DISTANCE
    );
    updateJointPosition(
      rightElbow,
      dots.RIGHT_SHOULDER_X,
      dots.SHOULDER_Y,
      dots.ELBOW_DISTANCE
    );

    const handAngle = (time * 5 * Math.PI) / 1000;

    leftHand.x(leftElbow.x() + dots.HAND_DISTANCE * Math.cos(handAngle));
    leftHand.y(leftElbow.y() + dots.HAND_DISTANCE * Math.sin(handAngle));

    rightHand.x(
      rightElbow.x() + dots.HAND_DISTANCE * Math.cos(-handAngle + Math.PI)
    );
    rightHand.y(
      rightElbow.y() + dots.HAND_DISTANCE * Math.sin(-handAngle + Math.PI)
    );

    leftArm.points([
      dots.LEFT_SHOULDER_X,
      dots.SHOULDER_Y,
      leftElbow.x(),
      leftElbow.y(),
      leftHand.x(),
      leftHand.y(),
    ]);
    rightArm.points([
      dots.RIGHT_SHOULDER_X,
      dots.SHOULDER_Y,
      rightElbow.x(),
      rightElbow.y(),
      rightHand.x(),
      rightHand.y(),
    ]);

    const kneesMovement =
      80 * Math.sin((time * 1 * Math.PI) / 1000) + dots.BODY_END_Y;
    leftKnee.y(kneesMovement);
    rightKnee.y(kneesMovement);

    updateJointPosition(
      leftKnee,
      dots.BODY_END_X,
      dots.BODY_END_Y,
      dots.KNEE_DISTANCE
    );
    updateJointPosition(
      rightKnee,
      dots.BODY_END_X,
      dots.BODY_END_Y,
      dots.KNEE_DISTANCE
    );

    leftFoot.x(leftKnee.x());
    leftFoot.y(leftKnee.y() + dots.FOOT_DISTANCE);

    rightFoot.x(rightKnee.x());
    rightFoot.y(rightKnee.y() + dots.FOOT_DISTANCE);

    leftLeg.points([
      dots.BODY_END_X,
      dots.BODY_END_Y,
      leftKnee.x(),
      leftKnee.y(),
      leftFoot.x(),
      leftFoot.y(),
    ]);
    rightLeg.points([
      dots.BODY_END_X,
      dots.BODY_END_Y,
      rightKnee.x(),
      rightKnee.y(),
      rightFoot.x(),
      rightFoot.y(),
    ]);
  });

  const animWave = new Konva.Animation((frame: any) => {
    leftElbow.y(
      10 * Math.sin((frame.time * 2 * Math.PI) / 2000) + dots.SHOULDER_Y
    );

    rightElbow.y(
      10 * Math.cos((frame.time * 2 * Math.PI) / 2000) + dots.SHOULDER_Y
    );

    leftHand.y(
      10 * Math.cos((frame.time * 2 * Math.PI) / 2000) + dots.SHOULDER_Y
    );
    rightHand.y(
      10 * Math.sin((frame.time * 2 * Math.PI) / 2000) + dots.SHOULDER_Y
    );

    leftArm.points([
      dots.LEFT_SHOULDER_X,
      dots.SHOULDER_Y,
      leftElbow.x(),
      leftElbow.y(),
      leftHand.x(),
      leftHand.y(),
    ]);
    rightArm.points([
      dots.RIGHT_SHOULDER_X,
      dots.SHOULDER_Y,
      rightElbow.x(),
      rightElbow.y(),
      rightHand.x(),
      rightHand.y(),
    ]);
  });

  return [animTectonic, animWave];
}
