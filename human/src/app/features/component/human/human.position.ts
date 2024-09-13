import Konva from 'konva';

export function dragControl(
  joint1: Konva.Circle,
  joint2: Konva.Circle,
  limb: Konva.Line,
  baseX: number,
  baseY: number,
  distance1: number,
  distance2: number
): void {
  joint1.on('dragmove', () => {
    updateJointPosition(joint1, baseX, baseY, distance1);
    updateJointPosition(joint2, joint1.x(), joint1.y(), distance2);
    limb.points([baseX, baseY, joint1.x(), joint1.y(), joint2.x(), joint2.y()]);
  });

  joint2.on('dragmove', () => {
    updateJointPosition(joint2, joint1.x(), joint1.y(), distance2);
    limb.points([baseX, baseY, joint1.x(), joint1.y(), joint2.x(), joint2.y()]);
  });
}

export function updateJointPosition(
  joint: Konva.Circle,
  baseX: number,
  baseY: number,
  reqDistance: number
): void {
  const dx = joint.x() - baseX;
  const dy = joint.y() - baseY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance > reqDistance || distance < reqDistance) {
    const angle = Math.atan2(dy, dx);
    joint.x(baseX + reqDistance * Math.cos(angle));
    joint.y(baseY + reqDistance * Math.sin(angle));
  }
}

export function createLine(
  baseX: number,
  baseY: number,
  first: Konva.Circle,
  second: Konva.Circle
): Konva.Line {
  return new Konva.Line({
    points: [baseX, baseY, first.x(), first.y(), second.x(), second.y()],
    stroke: 'black',
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'bevel',
  });
}

export function createJoint(
  x: number,
  y: number,
  stage: Konva.Stage
): Konva.Circle {
  let circle = new Konva.Circle({
    x: x,
    y: y,
    radius: 12,
    fill: 'black',
    draggable: true,
  });
  return mouseControl(circle, stage);
}

function mouseControl(joint: Konva.Circle, stage: Konva.Stage): Konva.Circle {
  joint.on('mouseenter', () => {
    stage.container().style.cursor = 'pointer';
  });
  joint.on('mouseleave', () => {
    stage.container().style.cursor = 'default';
  });
  return joint;
}
