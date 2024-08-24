import { useRobot } from '../../contexts/RobotContext'
import { RobotType } from '../../utils/types'

export default function RobotPosition({ pose }: { pose: keyof RobotType }) {
  const robot = useRobot()
  return (
    <div className="flex">
      <p className="text-lime-600">{`Robot position ${pose === ('pose_x' as keyof RobotType) ? 'X' : 'Z'} = `}</p>
      <p className="pl-2">{robot[pose] ? (robot[pose] as number).toFixed(2) : 0}</p>
    </div>
  )
}
