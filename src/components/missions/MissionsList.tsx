import { Dispatch, SetStateAction, useState } from 'react'
import { query } from '../../utils/fetchdata'
import { useRobots, useRobotsDispatch } from '../../contexts/RobotContext'
import MissionForm from './MissionForm'
import { initialMissionData, MissionType, RobotType } from '../../utils/types'

export function MissionsList({
  missions,
  robots,
  setMissions,
  selectedMission,
  setSelectedMission,
}: {
  missions: MissionType[]
  robots: RobotType[]
  setMissions: Dispatch<SetStateAction<MissionType[]>>
  selectedMission: MissionType
  setSelectedMission: Dispatch<SetStateAction<MissionType>>
}) {
  const [selectedRobot, setSelectedRobot] = useState<RobotType | undefined>(
    robots.find((robot) => robot.id === missions.find((mission) => mission.selected)?.robot_id)
  )

  const [formIsOpen, setFormIsOpen] = useState(false)
  const [isInZero, setIsInZero] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const activeRobots = useRobots()
  const dispatch = useRobotsDispatch()

  //Select mission function ----------------------------------------------------------

  function handleMissionSelect(mission: MissionType) {
    setIsInZero(false)
    setIsBusy(false)
    setMissions(missions.map((item) => ({ ...item, selected: mission.id === item.id ? true : false })))
    setSelectedMission(missions.find((item) => mission.id === item.id) ?? initialMissionData)
    setSelectedRobot(robots.find((robot) => robot.id === missions.find((item) => mission.id === item.id)?.robot_id))
  }

  //Starting o closing mission: loading mission's Robot, or remove it. -----------------------

  function handleMissionActive(mission: MissionType) {
    const status = mission.active

    const isRobotOnZero = activeRobots.some((robot) => Math.abs(robot.pose_x) <= 3 && Math.abs(robot.pose_z) <= 3)
    const isRobotBusy = activeRobots.some((robot) => robot.id === selectedRobot!.id)
    const robot = activeRobots.find((robot) => robot.id === mission.robot_id)

    if (status && robot) {
      dispatch({ type: 'remove', payload: robot })
    } else {
      if (isRobotOnZero) {
        setIsInZero(true)
        return
      }
      if (isRobotBusy) {
        setIsBusy(true)
        return
      }

      dispatch({ type: 'add', payload: selectedRobot! })
    }
    setMissions(missions.map((item) => ({ ...item, active: item.id === mission.id ? !status : item.active })))
    setSelectedMission({ ...selectedMission!, active: !status })
  }

  function handleNewMission() {
    setFormIsOpen(true)
    setSelectedMission(initialMissionData)
    setSelectedRobot(undefined)
  }

  //Inserting new or updating existing mission ---------------------------------------------

  async function onSave() {
    if (!selectedMission || !selectedMission.name || !selectedMission.description || !selectedMission.robot_id) return
    setFormIsOpen(false)
    if (!selectedMission.id) {
      const res = await query('/mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedMission.name,
          description: selectedMission.description,
          robot_id: selectedMission.robot_id,
        }),
      })
      console.log(res.msg)
    } else {
      const res = await query(`/mission/${selectedMission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedMission.name,
          description: selectedMission.description,
          robot_id: selectedMission.robot_id,
        }),
      })
      console.log(res.msg)
    }

    //Getting renewed lists of robots and missions --------------------------------
    const result = await query('/missions', { method: 'GET' })
    if (result.length > 0) {
      const newMissionsList = result.map((item: MissionType) => {
        console.log(item)
        return {
          ...item,
          active: activeRobots.some((rob) => rob.id === item.id) ? true : false,
        }
      })

      setMissions(newMissionsList)
    }

    setSelectedMission(initialMissionData)
    setSelectedRobot(undefined)
  }

  // Delete mission function --------------------------------------------
  async function handleDeleteMission() {
    const res = await query(`/mission/${selectedMission?.id}`, { method: 'DELETE' })
    console.log(res.msg)

    setSelectedMission(initialMissionData)
    setSelectedRobot(undefined)
    const result = await query('/missions', { method: 'GET' })
    if (result.length > 0) {
      const newMissionsList = result.map((item: MissionType) => ({ ...item, inAction: false, selected: false }))
      setMissions(newMissionsList)
    }
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
                    selectedMission?.id === mission.id ? 'text-teal-500 fas fa-circle-dot' : 'far fa-circle'
                  }`}
                ></i>

                <button
                  onClick={() => handleMissionSelect(mission)}
                  className={`w-full text-start ${selectedMission?.id === mission.id ? 'opacity-100' : 'opacity-75'}`}
                >
                  {mission.name}
                </button>
              </div>

              <div
                className={`text-base text-justify ${selectedMission?.id === mission.id ? 'flex flex-col' : 'hidden'}`}
              >
                <p>{mission.description}</p>

                <p>
                  Mission selected robot:
                  <span className="font-bold italic text-lime-500">
                    {' ' + selectedRobot?.name + ' model.' + selectedRobot?.model}
                  </span>
                </p>

                <div className="flex justify-end text-2xl">
                  {/* Play/pause mission button ------------------------------------------------*/}
                  <button
                    onClick={() => handleMissionActive(mission)}
                    className="px-3 opacity-75 hover:opacity-100 active:scale-90"
                  >
                    <i className={`fas ${mission.active ? 'fa-pause text-orange-400' : 'fa-play text-emerald-500'}`} />
                  </button>

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

                  <button
                    onClick={handleDeleteMission}
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
          mission={selectedMission}
          setMission={setSelectedMission}
          robots={robots}
          setOpen={setFormIsOpen}
          onSave={onSave}
        />
      )}
    </div>
  )
}
