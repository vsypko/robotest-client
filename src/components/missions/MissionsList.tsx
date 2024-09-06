import { Dispatch, SetStateAction, useState } from 'react'
import { deleteMission, getRobots, savePosition } from '../../utils/fetchdata'
import { useRobots, useRobotsDispatch } from '../../contexts/RobotContext'
import MissionForm from './MissionForm'
import { initialMissionData, MissionType, RobotType } from '../../utils/types'

export function MissionsList({
  missions,
  setMissions,
  robots,
  setRobots,
}: {
  missions: MissionType[]
  setMissions: Dispatch<SetStateAction<MissionType[]>>
  robots: RobotType[]
  setRobots: Dispatch<React.SetStateAction<RobotType[]>>
}) {
  const [formIsOpen, setFormIsOpen] = useState(false)
  const [isInZero, setIsInZero] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const activeRobots = useRobots()
  const dispatch = useRobotsDispatch()

  function getMissionRobot(mission: MissionType) {
    return robots.find((robot) => robot.id === mission.robot_id)
  }

  //Select mission function ----------------------------------------------------------

  function handleMissionSelect(mission: MissionType) {
    setIsInZero(false)
    setIsBusy(false)
    setMissions(missions.map((item) => ({ ...item, selected: mission.id === item.id ? true : false })))
  }

  async function handleMissionStop(mission: MissionType) {
    const activeRobot = activeRobots.find((robot) => robot.id === mission.robot_id)
    if (activeRobot) {
      await savePosition({ id: activeRobot.id, pose_x: 0, pose_z: 0, angle: 0 })
      dispatch({ type: 'remove', payload: activeRobot })
    }
    setMissions(missions.map((item) => ({ ...item, active: item.id === mission.id ? false : item.active })))
    setRobots(await getRobots())
  }

  // Starting or pausing mission: loading the mission's Robot, or removing it from render.

  async function handleMissionActive(mission: MissionType) {
    const status = mission.active

    const isRobotOnZero = activeRobots.some((robot) => Math.abs(robot.pose_x) <= 1 && Math.abs(robot.pose_z) <= 1)
    const activeRobot = activeRobots.find((robot) => robot.id === mission.robot_id)
    const robot = getMissionRobot(mission)

    if (status && activeRobot) {
      dispatch({ type: 'remove', payload: activeRobot })
      const { id, pose_x, pose_z, angle } = activeRobot
      await savePosition({ id, pose_x, pose_z, angle })
      setRobots(await getRobots())
      setMissions(missions.map((item) => ({ ...item, active: item.id === mission.id ? !status : item.active })))
      return
    }
    if (!status && activeRobot) return setIsBusy(true)
    if (!status && !activeRobot && isRobotOnZero) return setIsInZero(true)
    if (robot) dispatch({ type: 'add', payload: robot })
    setMissions(missions.map((item) => ({ ...item, active: item.id === mission.id ? !status : item.active })))
  }

  function handleNewMission() {
    setFormIsOpen(true)
    setMissions(missions.map((mission) => ({ ...mission, selected: false })))
  }

  // Delete mission function --------------------------------------------
  async function handleDeleteMission(mission: MissionType) {
    setMissions(await deleteMission(mission.id, activeRobots))
  }

  //--------------------------------------------------------------------

  return (
    <div className="w-full text-lg dark:text-slate-200 text-slate-800 md:p-2 p-1 z-20">
      <h1 className="font-bold italic">MISSIONS:</h1>
      <ul className="space-y-1 min-h-40 overflow-y-auto snap-y rounded-2xl bg-slate-300 dark:bg-slate-900 p-1 relative">
        {missions &&
          missions.length > 0 &&
          missions.map((mission) => (
            <li key={mission.id} className={`w-full cursor-pointer group text-slate-800 dark:text-slate-200`}>
              <div className="flex w-full items-center place-items-start px-1 rounded-full group:hover:bg-teal-400 dark:group-hover:bg-teal-800">
                <i
                  className={`transition-all mr-2 ${
                    mission.selected ? 'text-teal-500 fas fa-circle-dot' : 'far fa-circle'
                  }`}
                ></i>
                <button
                  onClick={() => handleMissionSelect(mission)}
                  className={`w-full text-start ${mission.selected ? 'opacity-100' : 'opacity-75'}`}
                >
                  {mission.name}
                </button>
              </div>

              <div className={`text-base text-justify ${mission.selected ? 'flex flex-col' : 'hidden'}`}>
                <p>{mission.description}</p>

                <p>
                  Mission selected robot:
                  <span className="font-bold italic text-lime-500">
                    {' ' + getMissionRobot(mission)?.name + ' model.' + getMissionRobot(mission)?.model}
                  </span>
                </p>

                <div className="flex justify-end text-2xl">
                  {/* Stop/reset mission button ------------------------------------------------*/}
                  <button
                    onClick={() => handleMissionStop(mission)}
                    className="px-3 opacity-75 hover:opacity-100 active:scale-90"
                  >
                    <i className="fas fa-stop text-emerald-500" />
                  </button>
                  {/* Play/pause mission button ------------------------------------------------*/}
                  <button
                    onClick={() => handleMissionActive(mission)}
                    className="px-3 opacity-75 hover:opacity-100 active:scale-90"
                  >
                    <i className={`fas ${mission.active ? 'fa-pause text-orange-400' : 'fa-play text-emerald-500'}`} />
                  </button>
                  {/* Edit mission button ------------------------------------------------*/}
                  <button
                    onClick={() => {
                      setFormIsOpen(true)
                    }}
                    type="button"
                    className="px-3 opacity-75 hover:opacity-100 active:scale-90 text-blue-400 disabled:text-slate-400 disabled:opacity-75 disabled:scale-100"
                    disabled={formIsOpen}
                  >
                    <i className="fas fa-pencil" />
                  </button>
                  {/* Delete mission button ------------------------------------------------*/}
                  <button
                    onClick={() => handleDeleteMission(mission)}
                    type="button"
                    className="px-3 opacity-75 hover:opacity-100 active:scale-90"
                  >
                    <i className="fas fa-trash-can text-red-500" />
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>
      {isInZero && <span className="text-orange-500">The zero position for robot initiation is occupied</span>}
      {isBusy && <span className="text-orange-500">The robot is involved in another mission</span>}
      {!formIsOpen && (
        <button
          onClick={handleNewMission}
          className="w-full mt-1 px-2 rounded-full dark:bg-teal-800 bg-teal-500 opacity-70 hover:opacity-100 active:scale-90"
        >
          <i className="fas fa-plus mr-2" />
          <span>CREATE NEW MISSION</span>
        </button>
      )}
      {formIsOpen && (
        <MissionForm
          mission={missions.find((mission) => mission.selected) ?? initialMissionData}
          setMissions={setMissions}
          robots={robots}
          setOpen={setFormIsOpen}
        />
      )}
    </div>
  )
}
