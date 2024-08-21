import { useState } from 'react'
import { MissionsList } from './MissionsList'

export default function MobileView() {
  const [isMissionOpened, setMissionsOpened] = useState(false)
  return (
    <div className="left-0 top-0 flex flex-col w-full absolute">
      <div className="sticky top-0 left-0">
        <button
          className=" md:hidden m-2 opacity-75 hover:opacity-100 active:scale-90 text-3xl "
          type="button"
          onClick={() => setMissionsOpened(!isMissionOpened)}
        >
          <i
            className={`fas ${
              isMissionOpened ? 'fa-xmark' : 'fa-bars'
            } text-slate-800 dark:text-slate-200 transition-all`}
          />
        </button>
      </div>

      {isMissionOpened && <MissionsList />}
    </div>
  )
}
