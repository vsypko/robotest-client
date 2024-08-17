import { useEffect, useState } from 'react'
import { getData } from '../utils/fetchdata'
import { useRobotDispatch } from '../contexts/RobotContext'

interface MissionType {
  id: number
  name: string
  description: string
  robot_id: number
  inAction: boolean
}

export interface RobotType {
  id: number
  name: string
  model_name: string
  pose_x: number
  pose_z: number
  angle: number
}
const initialRobotData: RobotType = {
  id: 0,
  name: '',
  model_name: '',
  pose_x: 0,
  pose_z: 0,
  angle: 0,
}

export function RobotsList() {
  const [missions, setMissions] = useState<MissionType[]>([])
  const [selectedMission, setSelectedMission] = useState<MissionType | undefined>(undefined)
  const [robots, setRobots] = useState<RobotType[]>([])
  const [selectedRobot, setSelectedRobot] = useState<RobotType>(initialRobotData)

  const dispatch = useRobotDispatch()

  useEffect(() => {
    const data = async () => {
      const result = await getData('/missions')
      if (result.length > 0) {
        const missionsArray = result.map((item: MissionType) => ({ ...item, inAction: false }))
        setMissions(missionsArray)
      }
      const res = await getData('/robots')
      setRobots(res)
    }
    data()
  }, [])

  function handleMissionSelect(mission: MissionType) {
    setSelectedMission(mission)
    const foundRobot = robots.find((item) => item.id === mission.robot_id)
    setSelectedRobot(foundRobot!)
  }

  function handleMissionActive(id: number) {
    if (selectedMission && id === selectedMission.id) {
      const robot = robots.find((robot) => robot.id === selectedMission.robot_id)
      if (robot) dispatch({ type: 'set', payload: robot })

      const status = selectedMission!.inAction
      if (status) {
        if (robot) dispatch({ type: 'set', payload: initialRobotData })
      }
      setSelectedMission({ ...selectedMission, inAction: !status })
    }
  }

  return (
    <div className="w-full text-lg text-slate-200 p-2">
      <h1 className="font-bold italic">MISSIONS:</h1>
      <ul className="space-y-1 min-h-32 md:min-h-64 overflow-y-auto snap-y rounded-2xl bg-slate-900 p-1 relative">
        {missions &&
          missions.length > 0 &&
          missions.map((mission) => (
            <li
              key={mission.id}
              className={`w-full snap-start cursor-pointer group text-slate-800 dark:text-slate-200`}
            >
              <div className="grid grid-cols-12 gap-1 px-1 rounded-full group:hover:bg-teal-400 dark:group-hover:bg-teal-800">
                <div className="grid col-span-1 place-items-center ">
                  <i
                    className={`transition-all ${
                      selectedMission?.id === mission.id ? 'text-teal-500 fas fa-circle-dot' : 'far fa-circle'
                    }`}
                  ></i>
                </div>
                <button
                  onClick={() => handleMissionSelect(mission)}
                  className={`grid col-span-11 place-items-start ${
                    selectedMission?.id === mission.id ? 'opacity-100' : 'opacity-75'
                  }`}
                >
                  {mission.name}
                </button>
              </div>

              <div className={`text-base ${selectedMission?.id === mission.id ? 'grid col-span-12' : 'hidden'}`}>
                <p>{mission.description}</p>
                <p>{'Mission selected robot: ' + selectedRobot.name}</p>
                <div className="flex justify-end text-xl">
                  <button
                    onClick={() => handleMissionActive(mission.id)}
                    className="px-2 mx-1rounded-full opacity-75 hover:opacity-100 active:scale-90"
                  >
                    <i
                      className={`fas ${
                        selectedMission?.inAction ? 'fa-pause text-orange-500' : 'fa-play text-emerald-500'
                      }`}
                    />
                  </button>

                  <button type="button" className="px-2 mx-1rounded-full opacity-75 hover:opacity-100 active:scale-90">
                    <i className="fas fa-pencil text-sky-500" />
                  </button>

                  <button type="button" className="px-2 mx-1 rounded-full opacity-75 hover:opacity-100 active:scale-90">
                    <i className="fas fa-trash-can text-red-500" />
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>
      <button className="w-full mt-1 px-2 rounded-full bg-teal-800 opacity-70 hover:opacity-100 active:scale-90">
        <i className="fas fa-plus mr-2" />
        <span>CREATE NEW MISSION</span>
      </button>
    </div>
  )
}
