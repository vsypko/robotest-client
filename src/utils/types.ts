export interface MissionType {
  id: number
  name: string
  description: string
  robot_id: number
  selected?: boolean
  active?: boolean
}

export interface RobotType {
  id: number
  name: string
  model: string
  pose_x: number
  pose_z: number
  angle: number
}

export interface RobotPositionType {
  id: number
  pose_x: number
  pose_z: number
  angle: number
}

export const initialMissionData: MissionType = {
  id: 0,
  name: '',
  description: '',
  robot_id: 0,
  active: false,
  selected: false,
}

export const initialRobotData: RobotType = {
  id: 0,
  name: '',
  model: '',
  pose_x: 0,
  pose_z: 0,
  angle: 0,
}
