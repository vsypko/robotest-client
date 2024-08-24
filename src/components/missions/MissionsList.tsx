import { useEffect, useState } from 'react'
import { query } from '../../utils/fetchdata'
import { useRobotDispatch } from '../../contexts/RobotContext'
import MissionForm from './MissionForm'
import { initialMissionData, initialRobotData, MissionType, RobotType } from '../../utils/types'

export function MissionsList() {
  const [missions, setMissions] = useState<MissionType[]>([])
  const [selectedMission, setSelectedMission] = useState<MissionType>(initialMissionData)
  const [robots, setRobots] = useState<RobotType[]>([])
  const [selectedRobot, setSelectedRobot] = useState<RobotType>(initialRobotData)
  const [formIsOpen, setFormIsOpen] = useState(false)

  const dispatch = useRobotDispatch()

  //Getting all lists of missions and robots from DB ----------------------------------------------

  useEffect(() => {
    const data = async () => {
      const res = await query('/robots', { method: 'GET' })
      setRobots(res)
      const result = await query('/missions', { method: 'GET' })
      if (result.length > 0) {
        setMissions(result)
      }
    }
    data()
  }, [])

  //Select mission function ----------------------------------------------------------

  function handleMissionSelect(mission: MissionType) {
    if (selectedMission.id === mission.id) return
    setSelectedMission({ ...mission, inAction: false })
    const robot = robots.find((item) => item.id === mission.robot_id)
    if (robot) setSelectedRobot(robot)
    dispatch({ type: 'set', payload: initialRobotData })
  }

  //Starting o closing mission: loading mission's Robot, or remove it. -----------------------

  function handleMissionActive(id: number) {
    if (selectedMission && id === selectedMission.id) {
      const robot = robots.find((robot) => robot.id === selectedMission.robot_id)
      if (robot) dispatch({ type: 'set', payload: robot })
      const status = selectedMission.inAction
      if (status) {
        dispatch({ type: 'set', payload: initialRobotData })
      }
      setSelectedMission({ ...selectedMission, inAction: !status })
    }
  }

  function handleNewMission() {
    setSelectedMission(initialMissionData)
    setFormIsOpen(true)
  }

  //Inserting new or updating existing mission ---------------------------------------------

  const onSave = async () => {
    if (!selectedMission.name || !selectedMission.description || !selectedMission.robot_id) return
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
      const newMissionsList = result.map((item: MissionType) => ({ ...item, inAction: false }))
      setMissions(newMissionsList)
    }
    setSelectedMission(initialMissionData)
    setSelectedRobot(initialRobotData)
  }

  // Delete mission function --------------------------------------------
  async function handleDeleteMission() {
    const res = await query(`/mission/${selectedMission?.id}`, { method: 'DELETE' })
    console.log(res)

    setSelectedMission(initialMissionData)
    const result = await query('/missions', { method: 'GET' })
    if (result.length > 0) {
      const newMissionsList = result.map((item: MissionType) => ({ ...item, inAction: false }))
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
                  Mission selected robot:{' '}
                  <span className="font-bold italic text-lime-500">
                    {selectedRobot.name + ' model: ' + selectedRobot.model_name}
                  </span>
                </p>

                <div className="flex justify-end text-2xl">
                  {/* Play/pause mission button ------------------------------------------------*/}
                  <button
                    onClick={() => handleMissionActive(mission.id)}
                    className="px-3 opacity-75 hover:opacity-100 active:scale-90"
                  >
                    <i
                      className={`fas ${
                        selectedMission?.inAction ? 'fa-pause text-orange-400' : 'fa-play text-emerald-500'
                      }`}
                    />
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
