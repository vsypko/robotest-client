import { useEffect, useState } from 'react'
import { getData } from '../utils/fetchdata'

interface Mission {
  id: number
  name: string
  description: string
}

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([])

  useEffect(() => {
    const data = async () => {
      const res = await getData('/missions')
      setMissions(res.missions)
    }
    data()
  }, [])

  return (
    <div className="w-full flex justify-center">
      <ul>
        {missions.length > 0 &&
          missions.map((mission) => (
            <li key={mission.id}>
              <div className="text-slate-200 text-lg">
                <span>{mission.name}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}
