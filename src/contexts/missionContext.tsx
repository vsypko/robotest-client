import { useContext, createContext, ReactNode, useState } from 'react'

const initialMissionData = {
  mission: {
    id: 0,
    name: '',
    description: '',
  },
  robot: {
    id: 0,
    name: '',
    model_name: '',
    pose_x: 0,
    pose_z: 0,
    angle: 0,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatePosition: (_id: number, _pose_x: number, _pose_z: number, _angle: number) => {},
}

const MissionContext = createContext(initialMissionData)

// eslint-disable-next-line react-refresh/only-export-components
export const useMission = () => useContext(MissionContext)

export const MissionContextProvider = ({ children }: { children: ReactNode }) => {
  const [mission, setMission] = useState({
    mission: {
      id: 0,
      name: '',
      description: '',
    },
    robot: {
      id: 0,
      name: '',
      model_name: '',
      pose_x: 0,
      pose_z: 0,
      angle: 0,
    },
    updatePosition: (id: number, pose_x: number, pose_z: number, angle: number) =>
      setMission((prev) => ({
        ...prev,
        robot: { ...prev.robot, id, pose_x, pose_z, angle },
      })),
  })

  return <MissionContext.Provider value={mission}>{children}</MissionContext.Provider>
}
