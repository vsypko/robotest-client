import { MissionType, RobotPositionType, RobotType } from './types'

//define query function ---------------------------------
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

//get all existing robots -------------------------------
export async function getRobots() {
  const res: RobotType[] = await query('/robots', { method: 'GET' })
  return res
}
//save current robot position --------------------------
export async function savePosition(position: RobotPositionType) {
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

//get all existing missions ----------------------------------

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

//save new mission or update existing --------------------------

export async function saveMission(
  name: string,
  description: string,
  robot_id: number,
  id?: number,
  activeRobots?: RobotType[]
) {
  //define body data----------------------------------------------------

  const body = JSON.stringify({
    name,
    description,
    robot_id,
  })

  //new mission saving if no id ------------------------------------------

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
    //or update mission if id exists -----------------------------------

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

//delete existing mission -----------------------------

export async function deleteMission(id: number, activeRobots?: RobotType[]) {
  const res = await query(`/mission/${id}`, { method: 'DELETE' })
  console.log(res.msg)
  return getMissions(activeRobots)
}
