import { useRobots } from '../../contexts/RobotContext'

export default function RobotPosition({ id }: { id: number }) {
  const robot = useRobots().find((robot) => robot.id === id)

  return (
    <div className="flex flex-col">
      {robot && <p className="text-lime-600">Robot position X = {robot.pose_x.toFixed(2)}</p>}
      {robot && <p className="text-lime-600">Robot position Z = {robot.pose_z.toFixed(2)}</p>}
    </div>
  )
}
