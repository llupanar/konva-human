import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as dots from '../../../core/human.constants';
import Konva from 'konva';
import { Circle } from 'konva/lib/shapes/Circle';
import { Line } from 'konva/lib/shapes/Line';
import { animateGravity } from '../human/human.gravity';
import { dragControl, createLine, createJoint } from './human.position';
import { initAnimations } from './human.animation';
import { createNimb } from './human.nimb';

@Component({
  selector: 'app-human',
  standalone: true,
  imports: [],
  templateUrl: './human.component.html',
  styleUrl: './human.component.css',
})
export class HumanComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) containerRef!: ElementRef;

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  head!: Konva.Circle;
  body!: Konva.Line;
  leftArm!: Konva.Line;
  rightArm!: Konva.Line;
  leftLeg!: Konva.Line;
  rightLeg!: Konva.Line;
  leftElbow!: Konva.Circle;
  rightElbow!: Konva.Circle;
  leftHand!: Konva.Circle;
  rightHand!: Konva.Circle;
  leftKnee!: Konva.Circle;
  rightKnee!: Konva.Circle;
  leftFoot!: Konva.Circle;
  rightFoot!: Konva.Circle;
  hat!: Konva.Wedge;

  allElementsGroup!: Konva.Group;

  animTectonic!: Konva.Animation;
  animWave!: Konva.Animation;
  animNimb!: Konva.Animation;

  ngOnInit(): void {
    this.stage = new Konva.Stage({
      container: this.containerRef.nativeElement,
      width: 1900,
      height: 1900,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  ngAfterViewInit(): void {
    this.drawHuman();
    let animations = initAnimations(
      this.leftArm,
      this.rightArm,
      this.leftLeg,
      this.rightLeg,
      this.leftElbow,
      this.rightElbow,
      this.leftHand,
      this.rightHand,
      this.leftKnee,
      this.rightKnee,
      this.leftFoot,
      this.rightFoot
    );
    this.animTectonic = animations[0];
    this.animWave = animations[1];
    this.dragControlHuman();
    this.allElementsGroup = createNimb(this.allElementsGroup);
  }

  drawHuman(): void {
    this.head = new Konva.Circle({
      x: dots.HEAD_X,
      y: dots.HEAD_Y,
      radius: 30,
      fill: 'gray',
      stroke: 'black',
      strokeWidth: 5,
    });

    this.body = new Konva.Line({
      points: [
        dots.BODY_START_X,
        dots.BODY_START_Y,
        dots.BODY_END_X,
        dots.BODY_END_Y,
      ],
      stroke: 'black',
      strokeWidth: 5,
    });

    this.hat = new Konva.Wedge({
      x: dots.HAT_X,
      y: dots.HAT_Y,
      radius: 70,
      angle: 60,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
      rotation: 60,
    });

    this.leftElbow = createJoint(
      dots.LEFT_ELBOW_X,
      dots.LEFT_ELBOW_Y,
      this.stage
    );
    this.rightElbow = createJoint(
      dots.RIGHT_ELBOW_X,
      dots.RIGHT_ELBOW_Y,
      this.stage
    );
    this.leftHand = createJoint(dots.LEFT_HAND_X, dots.LEFT_HAND_Y, this.stage);
    this.rightHand = createJoint(
      dots.RIGHT_HAND_X,
      dots.RIGHT_HAND_Y,
      this.stage
    );
    this.leftKnee = createJoint(dots.LEFT_KNEE_X, dots.LEFT_KNEE_Y, this.stage);
    this.rightKnee = createJoint(
      dots.RIGHT_KNEE_X,
      dots.RIGHT_KNEE_Y,
      this.stage
    );
    this.leftFoot = createJoint(dots.LEFT_FOOT_X, dots.LEFT_FOOT_Y, this.stage);
    this.rightFoot = createJoint(
      dots.RIGHT_FOOT_X,
      dots.RIGHT_FOOT_Y,
      this.stage
    );

    this.leftArm = createLine(
      dots.LEFT_SHOULDER_X,
      dots.SHOULDER_Y,
      this.leftElbow,
      this.leftHand
    );
    this.rightArm = createLine(
      dots.RIGHT_SHOULDER_X,
      dots.SHOULDER_Y,
      this.rightElbow,
      this.rightHand
    );

    this.leftLeg = createLine(
      dots.LEFT_HIP_X,
      dots.HIP_Y,
      this.leftKnee,
      this.leftFoot
    );
    this.rightLeg = createLine(
      dots.RIGHT_HIP_X,
      dots.HIP_Y,
      this.rightKnee,
      this.rightFoot
    );

    this.layer.draw();

    dragControl(
      this.leftElbow,
      this.leftHand,
      this.leftArm,
      dots.LEFT_SHOULDER_X,
      dots.SHOULDER_Y,
      dots.ELBOW_DISTANCE,
      dots.HAND_DISTANCE
    );
    dragControl(
      this.rightElbow,
      this.rightHand,
      this.rightArm,
      dots.RIGHT_SHOULDER_X,
      dots.SHOULDER_Y,
      dots.ELBOW_DISTANCE,
      dots.HAND_DISTANCE
    );

    dragControl(
      this.leftKnee,
      this.leftFoot,
      this.leftLeg,
      dots.LEFT_HIP_X,
      dots.HIP_Y,
      dots.KNEE_DISTANCE,
      dots.FOOT_DISTANCE
    );
    dragControl(
      this.rightKnee,
      this.rightFoot,
      this.rightLeg,
      dots.RIGHT_HIP_X,
      dots.HIP_Y,
      dots.KNEE_DISTANCE,
      dots.FOOT_DISTANCE
    );
  }

  dragControlHuman() {
    this.allElementsGroup = new Konva.Group({
      x: 0,
      y: 0,
      draggable: true,
    });

    this.allElementsGroup.add(this.head);
    this.allElementsGroup.add(this.hat);
    this.allElementsGroup.add(this.body);
    this.allElementsGroup.add(this.leftArm);
    this.allElementsGroup.add(this.rightArm);
    this.allElementsGroup.add(this.leftLeg);
    this.allElementsGroup.add(this.rightLeg);
    this.allElementsGroup.add(this.leftElbow);
    this.allElementsGroup.add(this.rightElbow);
    this.allElementsGroup.add(this.leftHand);
    this.allElementsGroup.add(this.rightHand);
    this.allElementsGroup.add(this.leftKnee);
    this.allElementsGroup.add(this.rightKnee);
    this.allElementsGroup.add(this.leftFoot);
    this.allElementsGroup.add(this.rightFoot);

    this.layer.add(this.allElementsGroup);

    let previousGlobalPos = this.allElementsGroup.absolutePosition();

    this.allElementsGroup.on('dragmove', () => {
      const currentGlobalPos = this.allElementsGroup.absolutePosition();
      let deltaX = currentGlobalPos.x - previousGlobalPos.x;
      let deltaY = currentGlobalPos.y - previousGlobalPos.y;

      animateGravity(
        deltaX,
        deltaY,
        dots.RIGHT_SHOULDER_X,
        dots.SHOULDER_Y,
        this.rightElbow,
        this.rightHand,
        this.rightArm,
        dots.ELBOW_DISTANCE,
        dots.HAND_DISTANCE,
        true
      );
      animateGravity(
        deltaX,
        deltaY,
        dots.BODY_END_X,
        dots.BODY_END_Y,
        this.rightKnee,
        this.rightFoot,
        this.rightLeg,
        dots.KNEE_DISTANCE,
        dots.FOOT_DISTANCE,
        true
      );
      animateGravity(
        deltaX,
        deltaY,
        dots.LEFT_SHOULDER_X,
        dots.SHOULDER_Y,
        this.leftElbow,
        this.leftHand,
        this.leftArm,
        dots.ELBOW_DISTANCE,
        dots.HAND_DISTANCE,
        false
      );
      animateGravity(
        deltaX,
        deltaY,
        dots.BODY_END_X,
        dots.BODY_END_Y,
        this.leftKnee,
        this.leftFoot,
        this.leftLeg,
        dots.KNEE_DISTANCE,
        dots.FOOT_DISTANCE,
        false
      );

      previousGlobalPos = currentGlobalPos;
    });
    this.layer.batchDraw();
  }

  startAnimationW() {
    this.stopAnimationT();
    this.animWave.start();
  }

  stopAnimationW() {
    this.animWave.stop();
  }

  startAnimationT() {
    this.stopAnimationW();
    this.animTectonic.start();
  }

  stopAnimationT() {
    this.animTectonic.stop();
  }
}
