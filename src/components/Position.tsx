import { useMission } from '../contexts/missionContext'

export default function Position() {
  const { robot } = useMission()
  return (
    <div className="flex flex-col text-slate-800 dark:text-slate-200 w-full items-center">
      <div className="flex">
        <p>position X: </p>
        <p className="pl-2">{robot.pose_x.toFixed(2)}</p>
      </div>
      <div className="flex">
        <p>position Z: </p>
        <p className="pl-2">{robot.pose_z.toFixed(2)}</p>
      </div>
    </div>
  )
}
