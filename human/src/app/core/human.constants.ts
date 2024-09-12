export const  HEAD_X = 450;
export const HEAD_Y = 100;

export const BODY_START_X = HEAD_X;
export const BODY_START_Y = HEAD_Y + 30; 
export const BODY_END_X = HEAD_X;
export const BODY_END_Y = 250;

export const HAT_X = HEAD_X;
export const HAT_Y = HEAD_Y-70;

export const LEFT_SHOULDER_X = BODY_START_X;
export const RIGHT_SHOULDER_X = BODY_START_X;
export const SHOULDER_Y = BODY_START_Y + 30;

export const LEFT_HIP_X = BODY_END_X;
export const RIGHT_HIP_X = BODY_END_X;
export const HIP_Y = BODY_END_Y;

export const ELBOW_DISTANCE = 60; 
export const HAND_DISTANCE = 60;  
export const KNEE_DISTANCE = 80;  
export const FOOT_DISTANCE = 80;  

export const LEFT_ELBOW_X = LEFT_SHOULDER_X - ELBOW_DISTANCE;
export const LEFT_ELBOW_Y = SHOULDER_Y;
export const RIGHT_ELBOW_X = RIGHT_SHOULDER_X + ELBOW_DISTANCE;
export const RIGHT_ELBOW_Y = SHOULDER_Y;

export const LEFT_HAND_X = LEFT_SHOULDER_X - (ELBOW_DISTANCE + HAND_DISTANCE);
export const LEFT_HAND_Y = SHOULDER_Y;
export const RIGHT_HAND_X = RIGHT_SHOULDER_X + (ELBOW_DISTANCE + HAND_DISTANCE);
export const RIGHT_HAND_Y = SHOULDER_Y;

export const LEFT_KNEE_X = LEFT_HIP_X - KNEE_DISTANCE;
export const LEFT_KNEE_Y = HIP_Y;
export const RIGHT_KNEE_X = RIGHT_HIP_X + KNEE_DISTANCE;
export const RIGHT_KNEE_Y = HIP_Y;

export const LEFT_FOOT_X= LEFT_HIP_X - (KNEE_DISTANCE + FOOT_DISTANCE);
export const LEFT_FOOT_Y= HIP_Y;
export const RIGHT_FOOT_X = RIGHT_HIP_X + (KNEE_DISTANCE + FOOT_DISTANCE);
export const RIGHT_FOOT_Y = HIP_Y;

export const NIMB_RADIUS_X = 60;  
export const NIMB_RADIUS_Y = 10;  
export const NUM_CIRCLES = 17;    