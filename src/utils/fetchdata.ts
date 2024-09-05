import { MissionType, RobotPositionType, RobotType } from './types'

export async function query(
  api_url: string,
  { method, headers, body }: { method: string; headers?: HeadersInit; body?: string }
) {
  const url = import.meta.env.VITE_API_URL
  try {
    const response = await fetch(`${url}${api_url}`, { method, headers, body })
    const result = await response.json()
    return result
  } catch (e) {
    console.log(e)
  }
}
export async function getRobots() {
  const res: RobotType[] = await query('/robots', { method: 'GET' })
  return res
}

export async function getMissions(activeRobots?: RobotType[]) {
  const res: MissionType[] = await query('/missions', { method: 'GET' })

  if (activeRobots && activeRobots.length > 0) {
    const missionsList = res.map((mission: MissionType) => ({
      ...mission,
      active: activeRobots.some((robot) => robot.id === mission.robot_id) ? true : false,
      selected: false,
    }))
    return missionsList
  }
  const missionsList = res.map((mission: MissionType) => ({ ...mission, active: false, selected: false }))
  return missionsList
}

export async function storeRobotPosition(position: RobotPositionType) {
  const { id, x, z, angle } = position
  const res = await query(`/robot/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      x,
      z,
      angle,
    }),
  })
  console.log(res.msg)
}

export async function saveMission(
  name: string,
  description: string,
  robot_id: number,
  id?: number,
  activeRobots?: RobotType[]
) {
  const body = JSON.stringify({
    name,
    description,
    robot_id,
  })

  if (!id) {
    const res = await query('/mission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    console.log(res.msg)
  } else {
    const res = await query(`/mission/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    console.log(res.msg)
  }
  return getMissions(activeRobots)
}

export async function deleteMission(id: number, activeRobots?: RobotType[]) {
  const res = await query(`/mission/${id}`, { method: 'DELETE' })
  console.log(res.msg)
  return getMissions(activeRobots)
}
