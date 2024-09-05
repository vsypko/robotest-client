import { ChangeEvent, SetStateAction, Dispatch, ReactElement, useState } from 'react'
import { MissionType, RobotType } from '../../utils/types'
import { saveMission } from '../../utils/fetchdata'
import { useRobots } from '../../contexts/RobotContext'

interface PropsType {
  setMissions: Dispatch<SetStateAction<MissionType[]>>
  robots: RobotType[]
  setOpen: Dispatch<SetStateAction<boolean>>
  mission: MissionType
}

export default function MissionForm({ setMissions, robots, setOpen, mission }: PropsType): ReactElement {
  const activeRobots = useRobots()
  const [editMission, setEditMission] = useState<MissionType>(mission)

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = event.target.value
    setEditMission({ ...editMission, [event.target.name]: value })
  }

  async function handleSaveMission() {
    const { id, name, description, robot_id } = editMission
    setMissions(await saveMission(name, description, robot_id, id, activeRobots))
    setOpen(false)
  }

  return (
    <div className="w-full flex flex-col bg-slate-300 dark:bg-slate-900 rounded-2xl p-1 relative">
      <button
        type="button"
        onClick={() => {
          setOpen(false)
        }}
        className="absolute right-2 top-1 opacity-75 hover:opacity-100 active:scale-90"
      >
        <i className="fas fa-xmark text-2xl" />
      </button>
      <div className="flex w-full relative mt-6 mb-2 px-1">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          onChange={onChange}
          value={editMission.name}
          className={`ml-2 w-4/5 bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 peer`}
        />
        <div className="absolute w-0 left-16 transition-all duration-300 ease-in-out border-slate-500 bottom-0 peer-focus:w-4/5 peer-focus:border-b" />
      </div>

      <div className="w-full relative px-1 mb-2">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          onChange={onChange}
          value={editMission.description}
          className={`w-full dark:bg-slate-800 bg-slate-400 text-base rounded-xl p-1 opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 overflow-auto peer`}
        />
        <div className="absolute w-0 transition-all duration-300 ease-in-out border-slate-500 bottom-0 peer-focus:w-auto peer-focus:border-b right-1 left-1" />
      </div>
      <div className="flex relative w-full">
        <label htmlFor="robot">Robot:</label>
        <select
          id="robot_id"
          name="robot_id"
          className="rounded-full  cursor-pointer bg-slate-300 dark:bg-slate-800 px-2 ml-2 opacity-90 hover:opacity-100 active:scale-90 shadow-sm shadow-slate-600 active:shadow-none transition-all"
          onChange={onChange}
          value={editMission.robot_id}
        >
          <option value={0}>⤵ select robot</option>
          {robots &&
            robots.map((robot: RobotType) => (
              <option key={robot.id} value={robot.id}>
                {robot.name + ' model: ' + robot.model}
              </option>
            ))}
        </select>
      </div>
      <button
        onClick={handleSaveMission}
        className="w-full mt-4 px-2 rounded-full bg-teal-500 dark:bg-teal-800 opacity-70 hover:opacity-100 active:scale-90"
      >
        <i className="fas fa-floppy-disk mr-4" />
        <span>SAVE MISSION</span>
      </button>
    </div>
  )
}
