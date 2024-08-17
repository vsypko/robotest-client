import { useRobot } from '../contexts/RobotContext'

export default function Position() {
  const robot = useRobot()
  return (
    <div className="flex flex-col text-slate-800 dark:text-slate-200 w-full items-center absolute">
      <div className="flex">
        <p>position X: </p>
        <p className="pl-2">{robot.pose_x ? robot.pose_x.toFixed(2) : 0}</p>
      </div>
      <div className="flex">
        <p>position Z: </p>
        <p className="pl-2">{robot.pose_z ? robot.pose_z.toFixed(2) : 0}</p>
      </div>
    </div>
  )
}
