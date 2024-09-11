import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as dots from '../../../core/human.constants'
import Konva from 'konva'
import { Circle } from 'konva/lib/shapes/Circle';
import { Line } from 'konva/lib/shapes/Line';

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
  hat!: Konva.Wedge;
  animT!: Konva.Animation;
  animW!: Konva.Animation;
  animM!: Konva.Animation;
  nimb!: Konva.Circle;
  flagTemp!: boolean;


  ngOnInit(): void {
    this.stage = new Konva.Stage({
      container: this.containerRef.nativeElement,
      width:800,
      height:800
    })
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.flagTemp = false;
    this.initAnimations()
  }

  ngAfterViewInit(): void {
    this.drawHuman()
  }

  drawHuman(): void{
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

    this.nimb = new Konva.Circle({
      x: dots.HEAD_X,
      y: dots.HEAD_Y-30,
      fill:'#f2aa00',
      radius:10
    })

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

    this.layer.add(this.head);
    this.layer.add(this.body);
    this.layer.add(this.hat);
    this.layer.add(this.nimb)
    this.layer.add(this.leftArm);
    this.layer.add(this.rightArm);
    this.layer.add(this.leftLeg);
    this.layer.add(this.rightLeg);
    this.layer.add(this.leftElbow);
    this.layer.add(this.rightElbow);
    this.layer.add(this.leftHand);
    this.layer.add(this.rightHand);
    this.layer.add(this.leftKnee);
    this.layer.add(this.rightKnee);
    this.layer.add(this.leftFoot);
    this.layer.add(this.rightFoot);
    this.layer.draw();

    this.dragControl(this.leftElbow, this.leftHand, this.leftArm, dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE, dots.HAND_DISTANCE);
    this.dragControl(this.rightElbow, this.rightHand, this.rightArm, dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE, dots.HAND_DISTANCE);
  
    this.dragControl(this.leftKnee, this.leftFoot, this.leftLeg, dots.LEFT_HIP_X, dots.HIP_Y, dots.KNEE_DISTANCE, dots.FOOT_DISTANCE);
    this.dragControl(this.rightKnee, this.rightFoot, this.rightLeg, dots.RIGHT_HIP_X, dots.HIP_Y, dots.KNEE_DISTANCE, dots.FOOT_DISTANCE);
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

  dragControl(joint1: Konva.Circle, joint2: Konva.Circle, limb: Konva.Line, baseX: number, baseY: number, distance1: number, distance2: number): void{
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
  }

  updateJointPosition(joint: Konva.Circle, baseX: number, baseY: number, reqDistance: number): void{
    const dx = joint.x() - baseX;
    const dy = joint.y() - baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > reqDistance || distance<reqDistance) {
      const angle = Math.atan2(dy, dx);
      joint.x(baseX + reqDistance * Math.cos(angle));
      joint.y(baseY + reqDistance * Math.sin(angle));
    }
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

  initAnimations() {
    this.animT = new Konva.Animation((frame: any)=>{
    const time = frame.time;

    const elbowYMovement = 50 * Math.sin((time * 2 * Math.PI) / 1000) + dots.SHOULDER_Y;
    
    this.leftElbow.y(elbowYMovement);
    this.rightElbow.y(elbowYMovement);
  
    this.updateJointPosition(this.leftElbow, dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE);
    this.updateJointPosition(this.rightElbow, dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, dots.ELBOW_DISTANCE);
  
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
  
    this.updateJointPosition(this.leftKnee, dots.BODY_END_X, dots.BODY_END_Y, dots.KNEE_DISTANCE);
    this.updateJointPosition(this.rightKnee, dots.BODY_END_X, dots.BODY_END_Y, dots.KNEE_DISTANCE);

    this.leftFoot.x(this.leftKnee.x());
    this.leftFoot.y(this.leftKnee.y()+dots.FOOT_DISTANCE);

    this.rightFoot.x(this.rightKnee.x());
    this.rightFoot.y(this.rightKnee.y() +dots.FOOT_DISTANCE);


    this.leftLeg.points([dots.BODY_END_X, dots.BODY_END_Y, this.leftKnee.x(), this.leftKnee.y(), this.leftFoot.x(), this.leftFoot.y()]);
    this.rightLeg.points([dots.BODY_END_X, dots.BODY_END_Y, this.rightKnee.x(), this.rightKnee.y(), this.rightFoot.x(), this.rightFoot.y()]);
  });

  this.animW = new Konva.Animation((frame:any)=>{
    this.leftElbow.y(
      10*Math.sin((frame.time*2*Math.PI)/2000)+dots.SHOULDER_Y
    )
    
    this.rightElbow.y(
      10*Math.cos((frame.time*2*Math.PI)/2000)+dots.SHOULDER_Y
    )

    this.leftHand.y(
      10*Math.cos((frame.time*2*Math.PI)/2000)+dots.SHOULDER_Y
    )
    this.rightHand.y(
      10*Math.sin((frame.time*2*Math.PI)/2000)+dots.SHOULDER_Y
    )

    this.leftArm.points([dots.LEFT_SHOULDER_X, dots.SHOULDER_Y, this.leftElbow.x(), this.leftElbow.y(), this.leftHand.x(), this.leftHand.y()]);
    this.rightArm.points([dots.RIGHT_SHOULDER_X, dots.SHOULDER_Y, this.rightElbow.x(), this.rightElbow.y(), this.rightHand.x(), this.rightHand.y()]);
  })

  this.animM = new Konva.Animation((frame:any)=>{
    const time = frame.time;
    const angle = 50* Math.sin((time * 2 * Math.PI) / 2000) + dots.HEAD_X   

    if(angle<405 && !this.flagTemp){
      this.nimb.moveToBottom()
      this.flagTemp=!this.flagTemp
      this.nimb._setAttr('fill','#9e7228')
    } 
    if(angle>490 && this.flagTemp){
     this.nimb.moveToTop()
     this.flagTemp=!this.flagTemp
     this.nimb._setAttr('fill','#f2aa00')
    }
    this.nimb.x( angle )
  })

  this.animM.start()
}
    
  startAnimationW(){
    this.stopAnimationT()
    this.animW.start()
  }

  stopAnimationW(){
    this.animW.stop()
  }  

  startAnimationT(){
    this.stopAnimationW()
    this.animT.start()
  }

  stopAnimationT(){
    this.animT.stop()
  }
}