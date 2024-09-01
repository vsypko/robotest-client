import Court from './components/court/Court'
import Joystick from './components/controls/Joystick'
import { MissionsList } from './components/missions/MissionsList'
import MobileView from './components/missions/MobileView'
import { initialMissionData, MissionType } from './utils/types'
import { useState } from 'react'

function App() {
  const [selectedMission, setSelectedMission] = useState<MissionType>(initialMissionData)
  return (
    <div className="w-full h-screen md:overflow-hidden p-2 md:flex">
      <div className="hidden md:flex w-full h-full mb-2 md:mb-0 md:mr-2 md:w-1/5 rounded-2xl border-slate-800 dark:border-slate-200 border relative">
        <div className="flex flex-col w-full">
          <MissionsList selectedMission={selectedMission} setSelectedMission={setSelectedMission} />
        </div>
        <Joystick selectedMission={selectedMission} />
      </div>
      <div className="w-full md:w-4/5 h-full rounded-2xl border-slate-800 dark:border-slate-200 border relative">
        <div className="h-full overflow-visible">
          <Court />
        </div>

        <div className="md:hidden flex justify-center bg-none">
          <MobileView />
          <Joystick selectedMission={selectedMission} />
        </div>
      </div>
    </div>
  )
}

export default App
