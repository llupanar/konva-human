import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  body!: Konva.Line
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
    
  }

  ngAfterViewInit(): void {
    
  }
}
