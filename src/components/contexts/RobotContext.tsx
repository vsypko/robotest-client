import { useContext, createContext, useReducer, Dispatch, ReactElement } from 'react'
import { RobotType } from '../utils/types'

interface RobotAction {
  type: 'set' | 'update'
  payload: RobotType | { id: number; pose_x: number; pose_z: number; angle: number }
}

const initialRobotData: RobotType = {
  id: 0,
  name: '',
  model_name: '',
  pose_x: 0,
  pose_z: 0,
  angle: 0,
}

function robotReducer(robot: RobotType, action: RobotAction): RobotType {
  switch (action.type) {
    case 'set': {
      return action.payload as RobotType
    }

    case 'update': {
      return {
        ...robot,
        id: action.payload.id,
        pose_x: action.payload.pose_x,
        pose_z: action.payload.pose_z,
        angle: action.payload.angle,
      }
    }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

const RobotContext = createContext<RobotType>(initialRobotData)
const RobotDispatchContext = createContext<Dispatch<RobotAction>>(() => {})

// eslint-disable-next-line react-refresh/only-export-components
export function useRobot() {
  return useContext(RobotContext)
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRobotDispatch() {
  return useContext(RobotDispatchContext)
}

export function RobotProvider({ children }: { children: ReactElement }) {
  const [robot, dispatch] = useReducer(robotReducer, initialRobotData)

  return (
    <RobotContext.Provider value={robot}>
      <RobotDispatchContext.Provider value={dispatch}>{children}</RobotDispatchContext.Provider>
    </RobotContext.Provider>
  )
}
