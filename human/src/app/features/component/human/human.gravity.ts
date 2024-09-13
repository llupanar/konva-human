import Konva from "konva";
import { updateJointPosition } from "./human.position";

export function   animateGravity(
    deltaX: number, 
    deltaY: number, 
    baseX: number, 
    baseY:number,
    joint1: Konva.Circle,
    joint2: Konva.Circle,
    limb: Konva.Line,
    reqDistance1: number,
    reqDistance2: number,
    isRightSide: boolean
  ){
    let joint1TargetX = null;  
    let joint1TargetY = baseY + 50;  
  
    let joint2TargetX = null; 
    let joint2TargetY = joint1TargetY + 60; 
  
    if(isRightSide){
       joint1TargetX = baseX + 20; 
       joint2TargetX = joint1TargetX + 40; 
    }else{
       joint1TargetX = baseX - 20;  
       joint2TargetX = joint1TargetX - 40; 
    }

    const limbInitialPosition = {
      x: joint1.x(),
      y: joint1.y(),
    };
  
    const joint2InitialPosition = {
      x: joint2.x(),
      y: joint2.y(),
    };
  
    const forceFactor = 20.5;
  
    const targetX = limbInitialPosition.x + deltaX * forceFactor;
    const targetY = limbInitialPosition.y + deltaY * forceFactor;

    const handTargetXOpposite = joint2InitialPosition.x - deltaX * forceFactor * 1.2;
    const handTargetYOpposite = joint2InitialPosition.y - deltaY * forceFactor * 1.2;

    new Konva.Tween({
      node: joint1,
      x: targetX,
      y: targetY,
      duration: .3,
      easing: Konva.Easings.Linear,
      onUpdate: () => {    
        drawLine(baseX,baseY,joint1,joint2,limb,reqDistance1,reqDistance2)
      },
      onFinish: () => {
        new Konva.Tween({
          node: joint1,
          x: joint1TargetX, 
          y: joint1TargetY,
          duration: 0.3,
          easing: Konva.Easings.EaseOut,
          onUpdate: () => {    
            drawLine(baseX,baseY,joint1,joint2,limb,reqDistance1,reqDistance2)
          },
        }).play();
      },
    }).play();

    new Konva.Tween({
      node: joint2,
      x: handTargetXOpposite,
      y: handTargetYOpposite,
      duration: .3,
      easing: Konva.Easings.Linear,
      onUpdate: () => {    
        drawLine(baseX,baseY,joint1,joint2,limb,reqDistance1,reqDistance2)
      },
      onFinish: () => {
        new Konva.Tween({
          node: joint2,
          x: joint2TargetX, 
          y: joint2TargetY,
          duration: .3,
          easing: Konva.Easings.EaseOut,
          onUpdate: () => {    
            drawLine(baseX,baseY,joint1,joint2,limb,reqDistance1,reqDistance2)
          }
        }).play();
      },
    }).play();
  }

function drawLine(
    baseX: number, 
    baseY:number,
    joint1: Konva.Circle,
    joint2: Konva.Circle,
    limb: Konva.Line,
    reqDistance1: number,
    reqDistance2: number,
){
  updateJointPosition(joint1, baseX, baseY, reqDistance1);
  updateJointPosition(joint2, joint1.x(), joint1.y(), reqDistance2);
  limb.points([
  baseX, baseY, 
    joint1.x(), joint1.y(), 
    joint2.x(), joint2.y(), 
  ]);
}