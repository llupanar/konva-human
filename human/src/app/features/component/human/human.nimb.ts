import Konva from 'konva';
import * as dots from '../../../core/human.constants';

export function createNimb(allElementsGroup: Konva.Group): Konva.Group {
  let nimbGroupBack = new Konva.Group({
    x: dots.HEAD_X,
    y: dots.HEAD_Y - 10,
  });

  let nimbGroupFront = new Konva.Group({
    x: dots.HEAD_X,
    y: dots.HEAD_Y - 10,
  });

  let nimbCircles: Konva.Circle[] = [];

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
      zIndex: 1,
    });

    nimbCircles.push(circle);
    nimbGroupFront.add(circle);
  }
  allElementsGroup.add(nimbGroupFront);
  allElementsGroup.add(nimbGroupBack);
  animationNimb(nimbGroupBack, nimbGroupFront, nimbCircles);
  return allElementsGroup;
}

function animationNimb(
  nimbGroupBack: Konva.Group,
  nimbGroupFront: Konva.Group,
  nimbCircles: Konva.Circle[]
) {
  const animNimb = new Konva.Animation((frame: any) => {
    const angleSpeed = frame.timeDiff / 100;
    nimbCircles.forEach((circle, index) => {
      const angle =
        (index / dots.NUM_CIRCLES) * Math.PI * 2 + frame.time * 0.002;
      const x = dots.NIMB_RADIUS_X * Math.cos(angle);
      const y = dots.NIMB_RADIUS_Y * Math.sin(angle);
      circle.x(x);
      circle.y(y);
      if (y > 0) {
        nimbGroupBack.removeName(circle);
        circle.fill('yellow');
        nimbGroupFront.add(circle);
      } else {
        nimbGroupFront.removeName(circle);
        circle.fill('orange');
        nimbGroupBack.add(circle);
      }
    });
    nimbGroupBack.zIndex(0);
    nimbGroupFront.zIndex(13);
  });
  animNimb.start();
}
