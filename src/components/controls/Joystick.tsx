import { useEffect, useState } from 'react'
import { useEventContext } from '../../contexts/eventContext'

export default function Joystick() {
  const { triggerKeyEvent } = useEventContext()
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [keypressed, setKeypressed] = useState<string>('')

  function handlePointerDown(key: string) {
    setIsPointerDown(true)
    setKeypressed(key)
    triggerKeyEvent(key, 'keydown')
  }
  function handlePointerUp(key: string) {
    setIsPointerDown(false)
    triggerKeyEvent(key, 'keyup')
  }

  useEffect(() => {
    let interval: number | undefined

    if (isPointerDown) {
      interval = setInterval(() => {
        triggerKeyEvent(keypressed, 'keydown')
      }, 50)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPointerDown, keypressed, triggerKeyEvent])

  return (
    <div className="absolute w-full flex justify-center bottom-4 text-slate-200 text-4xl">
      <div className="block">
        <div className="flex w-full justify-center">
          <button
            onPointerDown={() => handlePointerDown('ArrowUp')}
            onPointerUp={() => handlePointerUp('ArrowUp')}
            onMouseLeave={() => {
              if (isPointerDown) handlePointerUp('ArrowUp')
            }}
            className="text-5xl text-emerald-500 rounded-full active:scale-90 active:text-emerald-400"
          >
            <i className="fas fa-circle-up"></i>
          </button>
        </div>
        <div className="flex w-full justify-center items-center">
          <button
            onPointerDown={() => handlePointerDown('ArrowLeft')}
            onPointerUp={() => handlePointerUp('ArrowLeft')}
            onMouseLeave={() => {
              if (isPointerDown) handlePointerUp('ArrowLeft')
            }}
            className="text-5xl text-emerald-500 rounded-full active:scale-90 active:text-emerald-400"
          >
            <i className="fas fa-circle-left"></i>
          </button>

          <button className="text-5xl m-4 text-emerald-500 rounded-full active:scale-90 active:text-emerald-400">
            <i className="fas fa-power-off"></i>
          </button>
          <button
            onPointerDown={() => handlePointerDown('ArrowRight')}
            onPointerUp={() => handlePointerUp('ArrowRight')}
            onMouseLeave={() => {
              if (isPointerDown) handlePointerUp('ArrowRight')
            }}
            className="text-5xl text-emerald-500 rounded-full active:scale-90 active:text-emerald-400"
          >
            <i className="fas fa-circle-right"></i>
          </button>
        </div>
        <div className="flex w-full justify-center">
          <button
            onPointerDown={() => handlePointerDown('ArrowDown')}
            onPointerUp={() => handlePointerUp('ArrowDown')}
            onMouseLeave={() => {
              if (isPointerDown) handlePointerUp('ArrowDown')
            }}
            className="text-5xl text-emerald-500 rounded-full active:scale-90 active:text-emerald-400"
          >
            <i className="fas fa-circle-down"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
