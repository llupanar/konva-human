import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as dots from '../../../core/human.constants'
import Konva from 'konva'

@Component({
  selector: 'app-human',
  standalone: true,
  imports: [],
  templateUrl: './human.component.html',
  styleUrl: './human.component.css'
})
export class HumanComponent implements OnInit, AfterViewInit{

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

  ngOnInit(): void {
    this.stage = new Konva.Stage({
      container: this.containerRef.nativeElement,
      width:800,
      height:800
    })
    this.layer = new Konva.Layer();
    this.stage.add(this.layer)
  }

  ngAfterViewInit(): void {
    this.drawHuman()
  }

  drawHuman(){
    this.head = new Konva.Circle({
      x: dots.HEAD_X,
      y: dots.HEAD_Y,
      radius: 30,
      fill: 'gray',
      stroke: 'black',
      strokeWidth:5
    })

    this.body = new Konva.Line({
      points:[dots.BODY_START_X, dots.BODY_START_Y, dots.BODY_END_X, dots.BODY_END_Y],
      stroke: 'black',
      strokeWidth:5
    })

    this.leftElbow = this.createJoint(dots.LEFT_ELBOW_X,dots.LEFT_ELBOW_Y);
    this.rightElbow = this.createJoint(dots.RIGHT_ELBOW_X,dots.RIGHT_ELBOW_Y);
    this.leftHand = this.createJoint(dots.LEFT_HAND_X, dots.LEFT_HAND_Y);
    this.rightHand = this.createJoint(dots.RIGHT_HAND_X, dots.RIGHT_HAND_Y);
    this.leftKnee = this.createJoint(dots.LEFT_KNEE_X, dots.LEFT_KNEE_Y);
    this.rightKnee = this.createJoint(dots.RIGHT_KNEE_X, dots.RIGHT_KNEE_Y);
    this.leftFoot = this.createJoint(dots.LEFT_FOOT_X, dots.LEFT_FOOT_Y);
    this.rightFoot = this.createJoint(dots.RIGHT_FOOT_X, dots.RIGHT_FOOT_Y);

    this.leftArm = this.createArm(dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, this.leftElbow, this.leftHand);
    this.rightArm = this.createArm(dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, this.rightElbow, this.rightHand);
  
    this.leftLeg = this.createLeg(dots.LEFT_HIP_X, dots.HIP_Y, this.leftKnee, this.leftFoot);
    this.rightLeg = this.createLeg(dots.RIGHT_HIP_X, dots.HIP_Y, this.rightKnee, this.rightFoot);
  
    this.layer.add(this.head);
    this.layer.add(this.body);
    this.layer.add(this.leftElbow);
    this.layer.add(this.rightElbow);
    this.layer.add(this.leftHand);
    this.layer.add(this.rightHand);
    this.layer.add(this.leftKnee);
    this.layer.add(this.rightKnee);
    this.layer.add(this.leftFoot);
    this.layer.add(this.rightFoot);
    this.layer.add(this.leftArm);
    this.layer.add(this.rightArm);
    this.layer.add(this.leftLeg);
    this.layer.add(this.rightLeg);
    
    this.layer.draw();
    this.dragControl(this.leftElbow, this.leftHand, this.leftArm, dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE, dots.HAND_DISTANCE);
    this.dragControl(this.rightElbow, this.rightHand, this.rightArm, dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE, dots.HAND_DISTANCE);
  
    this.dragControl(this.leftKnee, this.leftFoot, this.leftLeg, dots.LEFT_HIP_X, dots.HIP_Y, dots.KNEE_DISTANCE, dots.FOOT_DISTANCE);
    this.dragControl(this.rightKnee, this.rightFoot, this.rightLeg, dots.RIGHT_HIP_X, dots.HIP_Y, dots.KNEE_DISTANCE, dots.FOOT_DISTANCE);

  }

  createJoint(x:number, y: number){
    let circle =  new Konva.Circle({
      x: x,
      y: y,
      radius: 12,
      fill: 'black',
      draggable: true
    })
    return this.mouseControl(circle)
  }

  createArm(shoulderX: number, shoulderY: number, elbow: Konva.Circle, hand: Konva.Circle){
    return new Konva.Line({
      points: [shoulderX, shoulderY, elbow.x(), elbow.y(), hand.x(), hand.y()],
      stroke: 'black',
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'bevel',
    });
  }

  createLeg(hipX: number, hipY: number, knee: Konva.Circle, foot: Konva.Circle){
    return new Konva.Line({
      points: [hipX, hipY, knee.x(), knee.y(), foot.x(), foot.y()],
      stroke: 'black',
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
    });
  }

  dragControl(joint1: Konva.Circle, joint2: Konva.Circle, limb: Konva.Line, baseX: number, baseY: number, distance1: number, distance2: number){
    joint1.on('dragmove', () => {
      this.updateJointPosition(joint1, baseX, baseY, distance1);
      this.updateJointPosition(joint2, joint1.x(), joint1.y(), distance2);
      limb.points([baseX, baseY, joint1.x(), joint1.y(), joint2.x(), joint2.y()]);
      this.layer.draw();
    });

    joint2.on('dragmove', () => {
      this.updateJointPosition(joint2, joint1.x(), joint1.y(), distance2);
      limb.points([baseX, baseY, joint1.x(), joint1.y(), joint2.x(), joint2.y()]);
      this.layer.draw();
    });

    joint1.on('dragend', () => {
      this.updateJointPosition(joint1, baseX, baseY, distance1);
      this.layer.draw();
    });

    joint2.on('dragend', () => {
      this.updateJointPosition(joint2, joint1.x(), joint1.y(), distance2);
      this.layer.draw();
    });
  }

  updateJointPosition(joint: Konva.Circle, baseX: number, baseY: number, reqDistance: number){
    const dx = joint.x() - baseX;
    const dy = joint.y() - baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > reqDistance || distance<reqDistance) {
      const angle = Math.atan2(dy, dx);
      joint.x(baseX + reqDistance * Math.cos(angle));
      joint.y(baseY + reqDistance * Math.sin(angle));
    }
  }  

  mouseControl( joint: Konva.Circle){
      joint.on('mouseenter', ()=>{
        this.stage.container().style.cursor = 'pointer'
      })
      joint.on('mouseleave', ()=>{
        this.stage.container().style.cursor = 'default'
      })
      return joint;
  }

}
