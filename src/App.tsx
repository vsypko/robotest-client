import Ground from './components/ground/Ground'
import Joystick from './components/controls/Joystick'
import Position from './components/Position'
import Missions from './components/Missions'

function App() {
  return (
    <div className="w-full h-screen md:overflow-hidden p-2 md:flex">
      <div className="hidden md:flex w-full h-full mb-2 md:mb-0 md:mr-2 md:w-1/5 rounded-2xl border-slate-800 dark:border-slate-200 border relative">
        <div className="flex flex-col w-full">
          <Missions />
          <Position />
        </div>
        <Joystick />
      </div>
      <div className="w-full md:w-4/5 h-full rounded-2xl border-slate-800 dark:border-slate-200 border relative">
        <div className="h-full overflow-visible">
          <Ground />
        </div>

        <div className="md:hidden flex justify-center bg-none z-10">
          <Joystick />
        </div>
      </div>
    </div>
  )
}

export default App
