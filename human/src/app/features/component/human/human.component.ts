import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as dots from '../../../core/human.constants'
import Konva from 'konva'
import { Circle } from 'konva/lib/shapes/Circle';
import { Line } from 'konva/lib/shapes/Line';
import {animateGravity} from '../human/human.gravity'
import { updateJointPosition, dragControl } from './human.position';

@Component({
  selector: 'app-human',
  standalone: true,
  imports: [],
  templateUrl: './human.component.html',
  styleUrl: './human.component.css'
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

  nimbCircles: Konva.Circle[] = [];
  nimbGroupFront!: Konva.Group;      
  nimbGroupBack!: Konva.Group;       

  allElementsGroup!: Konva.Group;

  animTectonic!: Konva.Animation;
  animWave!: Konva.Animation;
  animNimb!: Konva.Animation;

  ngOnInit(): void {
    this.stage = new Konva.Stage({
      container: this.containerRef.nativeElement,
      width: 1900,
      height: 1900
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.initAnimations();
  }

  ngAfterViewInit(): void {
    this.drawHuman();
    this.dragControlHuman();
   // this.createNimb();
  }

  dragControlHuman(){
    this.allElementsGroup = new Konva.Group({
      x: 0,
      y: 0,
      draggable: true
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
    
    this.layer.add(this.allElementsGroup)

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
      )

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
      ) 

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
      )

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
      )
      previousGlobalPos = currentGlobalPos;
    });
    this.layer.batchDraw()
  }
   
  drawHuman(): void{
    this.head = new Konva.Circle({
      x: dots.HEAD_X,
      y: dots.HEAD_Y,
      radius: 30,
      fill: 'gray',
      stroke: 'black',
      strokeWidth:5,
    })

    this.nimbGroupBack = new Konva.Group({
      x: dots.HEAD_X,
      y: dots.HEAD_Y -10,
    });

    this.nimbGroupFront = new Konva.Group({
      x: dots.HEAD_X,
      y: dots.HEAD_Y -10,
    });

    this.body = new Konva.Line({
      points:[dots.BODY_START_X, dots.BODY_START_Y, dots.BODY_END_X, dots.BODY_END_Y],
      stroke: 'black',
      strokeWidth:5
    })

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

    this.leftElbow = this.createJoint(dots.LEFT_ELBOW_X,dots.LEFT_ELBOW_Y);
    this.rightElbow = this.createJoint(dots.RIGHT_ELBOW_X,dots.RIGHT_ELBOW_Y);
    this.leftHand = this.createJoint(dots.LEFT_HAND_X, dots.LEFT_HAND_Y);
    this.rightHand = this.createJoint(dots.RIGHT_HAND_X, dots.RIGHT_HAND_Y);
    this.leftKnee = this.createJoint(dots.LEFT_KNEE_X, dots.LEFT_KNEE_Y);
    this.rightKnee = this.createJoint(dots.RIGHT_KNEE_X, dots.RIGHT_KNEE_Y);
    this.leftFoot = this.createJoint(dots.LEFT_FOOT_X, dots.LEFT_FOOT_Y);
    this.rightFoot = this.createJoint(dots.RIGHT_FOOT_X, dots.RIGHT_FOOT_Y);

    this.leftArm = this.createLine(dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, this.leftElbow, this.leftHand);
    this.rightArm = this.createLine(dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, this.rightElbow, this.rightHand);
  
    this.leftLeg = this.createLine(dots.LEFT_HIP_X, dots.HIP_Y, this.leftKnee, this.leftFoot);
    this.rightLeg = this.createLine(dots.RIGHT_HIP_X, dots.HIP_Y, this.rightKnee, this.rightFoot);

    this.layer.draw();

    dragControl(this.leftElbow, this.leftHand, this.leftArm, dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE, dots.HAND_DISTANCE);
    dragControl(this.rightElbow, this.rightHand, this.rightArm, dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE, dots.HAND_DISTANCE);
  
    dragControl(this.leftKnee, this.leftFoot, this.leftLeg, dots.LEFT_HIP_X, dots.HIP_Y, dots.KNEE_DISTANCE, dots.FOOT_DISTANCE);
    dragControl(this.rightKnee, this.rightFoot, this.rightLeg, dots.RIGHT_HIP_X, dots.HIP_Y, dots.KNEE_DISTANCE, dots.FOOT_DISTANCE);
  }

  createJoint(x:number, y: number): Circle{
    let circle =  new Konva.Circle({
      x: x,
      y: y,
      radius: 12,
      fill: 'black',
      draggable: true
    })
    return this.mouseControl(circle)
  }

  createLine(baseX: number, baseY: number, first: Konva.Circle, second: Konva.Circle): Line{
    return new Konva.Line({
      points: [baseX, baseY, first.x(), first.y(), second.x(), second.y()],
      stroke: 'black',
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'bevel',
    })
  }

  mouseControl( joint: Konva.Circle): Circle{
      joint.on('mouseenter', () => {
        this.stage.container().style.cursor = 'pointer'
      })
      joint.on('mouseleave', () => {
        this.stage.container().style.cursor = 'default'
      })
      return joint;
  }

  createNimb(): void {
    for (let i = 0; i < dots.NUM_CIRCLES; i++) {
      const angle = (i / dots.NUM_CIRCLES) * Math.PI * 2;
      const x = dots.NIMB_RADIUS_X * Math.cos(angle);
      const y = dots.NIMB_RADIUS_Y * Math.sin(angle);

      const circle = new Konva.Circle({
        x: x,
        y: y,
        radius: 10,
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 2,
        zIndex: 1 
      });

      this.nimbCircles.push(circle);
      this.nimbGroupFront.add(circle)
    }
    this.allElementsGroup.add(this.nimbGroupFront);
    this.allElementsGroup.add(this.nimbGroupBack);
    this.animationNimb()
  }

  initAnimations() {
    this.animTectonic = new Konva.Animation((frame: any) => {
      const time = frame.time;

      const elbowYMovement = 50 * Math.sin((time * 2 * Math.PI) / 1000) + dots.SHOULDER_Y;
      
      this.leftElbow.y(elbowYMovement);
      this.rightElbow.y(elbowYMovement);
    
      updateJointPosition(this.leftElbow, dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE);
      updateJointPosition(this.rightElbow, dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE);
    
      const handAngle = time * 5 * Math.PI / 1000;

      this.leftHand.x(this.leftElbow.x() + dots.HAND_DISTANCE * Math.cos(handAngle));
      this.leftHand.y(this.leftElbow.y() + dots.HAND_DISTANCE * Math.sin(handAngle));

      this.rightHand.x(this.rightElbow.x() + dots.HAND_DISTANCE * Math.cos(-handAngle + Math.PI));
      this.rightHand.y(this.rightElbow.y() + dots.HAND_DISTANCE * Math.sin(-handAngle + Math.PI));

      this.leftArm.points([dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, this.leftElbow.x(), this.leftElbow.y(), this.leftHand.x(), this.leftHand.y()]);
      this.rightArm.points([dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, this.rightElbow.x(), this.rightElbow.y(), this.rightHand.x(), this.rightHand.y()]);

      const kneesMovement = 80 * Math.sin((time * 1 * Math.PI) / 1000) + dots.BODY_END_Y;
      this.leftKnee.y(kneesMovement);
      this.rightKnee.y(kneesMovement);
    
      updateJointPosition(this.leftKnee, dots.BODY_END_X, dots.BODY_END_Y, dots.KNEE_DISTANCE);
      updateJointPosition(this.rightKnee, dots.BODY_END_X, dots.BODY_END_Y, dots.KNEE_DISTANCE);

      this.leftFoot.x(this.leftKnee.x());
      this.leftFoot.y(this.leftKnee.y() + dots.FOOT_DISTANCE);

      this.rightFoot.x(this.rightKnee.x());
      this.rightFoot.y(this.rightKnee.y() + dots.FOOT_DISTANCE);

      this.leftLeg.points([dots.BODY_END_X, dots.BODY_END_Y, this.leftKnee.x(), this.leftKnee.y(), this.leftFoot.x(), this.leftFoot.y()]);
      this.rightLeg.points([dots.BODY_END_X, dots.BODY_END_Y, this.rightKnee.x(), this.rightKnee.y(), this.rightFoot.x(), this.rightFoot.y()]);
    });

    this.animWave = new Konva.Animation((frame: any) => {
      this.leftElbow.y(
        10 * Math.sin((frame.time * 2 * Math.PI) / 2000) + dots.SHOULDER_Y
      );
      
      this.rightElbow.y(
        10 * Math.cos((frame.time * 2 * Math.PI) / 2000) + dots.SHOULDER_Y
      );

      this.leftHand.y(
        10 * Math.cos((frame.time * 2 * Math.PI) / 2000) + dots.SHOULDER_Y
      );
      this.rightHand.y(
        10 * Math.sin((frame.time * 2 * Math.PI) / 2000) + dots.SHOULDER_Y
      );

      this.leftArm.points([dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, this.leftElbow.x(), this.leftElbow.y(), this.leftHand.x(), this.leftHand.y()]);
      this.rightArm.points([dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, this.rightElbow.x(), this.rightElbow.y(), this.rightHand.x(), this.rightHand.y()]);
    });

  }

  animationNimb(){
    this.animNimb = new Konva.Animation((frame:any) => {
      const angleSpeed = frame.timeDiff/100;  
      this.nimbCircles.forEach((circle, index) => {
        const angle = (index / dots.NUM_CIRCLES) * Math.PI * 2 + frame.time * 0.002;
        const x = dots.NIMB_RADIUS_X * Math.cos(angle);
        const y = dots.NIMB_RADIUS_Y * Math.sin(angle);

        circle.x(x);
        circle.y(y);

        if (y > 0) {
          this.nimbGroupBack.removeName(circle);
          circle.fill('yellow'); 
          this.nimbGroupFront.add(circle);
        } else {
          this.nimbGroupFront.removeName(circle);
          circle.fill('orange'); 
          this.nimbGroupBack.add(circle); 
        }
      });
      this.nimbGroupBack.zIndex(0);
      this.nimbGroupFront.zIndex(13)
    });

    this.animNimb.start();
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
