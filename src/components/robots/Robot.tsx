import { lazy } from 'react'
import { useRobot } from '../../contexts/RobotContext'

const R2D2 = lazy(() => import('./R2D2'))
const BB8 = lazy(() => import('./BB8'))
const BB9 = lazy(() => import('./BB9'))

export default function SelectedRobot() {
  const robot = useRobot()

  let SelectedRobot: JSX.Element | null = null
  switch (robot.name) {
    case 'R2D2':
      SelectedRobot = <R2D2 />
      break
    case 'BB8':
      SelectedRobot = <BB8 />
      break
    case 'BB9':
      SelectedRobot = <BB9 />
      break
    default:
      SelectedRobot = null
      break
  }

  return SelectedRobot
}
