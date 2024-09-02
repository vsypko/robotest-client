import { useContext, createContext, useReducer, Dispatch, ReactElement } from 'react'
import { RobotPositionType, RobotType } from '../utils/types'

interface RobotAction {
  type: 'add' | 'update' | 'remove'
  payload: RobotType | RobotPositionType
}

type RobotState = RobotType[]

function robotReducer(state: RobotState, action: RobotAction): RobotState {
  switch (action.type) {
    case 'add': {
      const robot = action.payload as RobotType
      return [...state, robot]
    }

    case 'update': {
      const { id, x, z, angle } = action.payload as RobotPositionType
      return state.map((robot) => (robot.id === id ? { ...robot, pose_x: x, pose_z: z, angle: angle } : robot))
    }

    case 'remove': {
      const { id } = action.payload as RobotType
      return state.filter((robot) => robot.id !== id)
    }

    default: {
      throw new Error('Unknown action: ' + action.type)
    }
  }
}

const RobotContext = createContext<RobotState>([])
const RobotDispatchContext = createContext<Dispatch<RobotAction> | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useRobots() {
  const context = useContext(RobotContext)
  if (context === undefined) {
    throw new Error('useRobotsMap must be used within a RobotProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRobotsDispatch() {
  const context = useContext(RobotDispatchContext)
  if (context === undefined) {
    throw new Error('useRobotsMapDispatch must be used within a RobotProvider')
  }
  return context
}

export function RobotProvider({ children }: { children: ReactElement }) {
  const [activeRobots, dispatch] = useReducer(robotReducer, [])

  return (
    <RobotContext.Provider value={activeRobots}>
      <RobotDispatchContext.Provider value={dispatch}>{children}</RobotDispatchContext.Provider>
    </RobotContext.Provider>
  )
}
