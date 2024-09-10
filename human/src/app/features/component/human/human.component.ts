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
      fill: 'black',
      stroke: 'gray',
      strokeWidth: 2
    })

    this.body = new Konva.Line({
      points:[dots.BODY_START_X, dots.BODY_START_Y, dots.BODY_END_X, dots.BODY_END_Y],
      stroke: 'black',
      strokeWidth:5
    })

    this.layer.add(this.head)
    this.layer.add(this.body)
    
    this.layer.draw();
  }
}
