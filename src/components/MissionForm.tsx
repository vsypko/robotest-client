import { ChangeEvent, SetStateAction, Dispatch } from 'react'
import { MissionType, RobotType } from './MissionsList'

interface PropsType {
  mission: MissionType
  setMission: Dispatch<SetStateAction<MissionType>>
  robots: RobotType[]
  setOpen: Dispatch<React.SetStateAction<boolean>>
  onSave: () => Promise<void>
}

export default function MissionForm({ mission, setMission, robots, setOpen, onSave }: PropsType): JSX.Element {
  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.value
    setMission({ ...mission, [event.target.name]: value })
  }

  return (
    <div className="w-full flex flex-col bg-slate-900 rounded-2xl p-1 relative">
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
          value={mission!.name}
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
          value={mission!.description}
          className={`w-full bg-slate-800 text-base rounded-xl p-1 opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 overflow-auto peer`}
        />
        <div className="absolute w-0 transition-all duration-300 ease-in-out border-slate-500 bottom-0 peer-focus:w-auto peer-focus:border-b right-1 left-1" />
      </div>
      <div className="flex w-full relative px-1">
        <label htmlFor="robot">Robot:</label>
        <select
          id="robot_id"
          name="robot_id"
          className="rounded-full cuconsole.log(name)rsor-pointer bg-slate-300 dark:bg-slate-800 px-2 ml-4 opacity-90 hover:opacity-100 active:scale-90 shadow-sm shadow-slate-600 active:shadow-none transition-all"
          onChange={onChange}
        >
          <option value={0}>--no robot selecteed--</option>
          {robots &&
            robots.map((robot: RobotType) => (
              <option key={robot.id} value={robot.id} selected={robot.id === mission.robot_id}>
                {robot.name + ' model: ' + robot.model_name}
              </option>
            ))}
        </select>
      </div>
      <button
        onClick={onSave}
        className="w-full mt-4 px-2 rounded-full bg-teal-800 opacity-70 hover:opacity-100 active:scale-90"
      >
        <i className="fas fa-floppy-disk mr-4" />
        <span>SAVE MISSION</span>
      </button>
    </div>
  )
}
