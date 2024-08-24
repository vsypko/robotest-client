import { ReactElement, useCallback, useEffect, useState } from 'react'

export default function JoystickButton({ keypressed, icon }: { keypressed: string; icon: string }): ReactElement {
  const [isPointerDown, setIsPointerDown] = useState(false)

  //Keypad event simulator ----------------------------------
  const triggerKeyEvent = useCallback(
    (type: 'keydown' | 'keyup') => {
      const event = new KeyboardEvent(type, { key: keypressed })
      window.dispatchEvent(event)
    },
    [keypressed]
  )

  //Pointer (mouse button) down event handler ----------------------------
  function handlePointerDown() {
    setIsPointerDown(true)
    triggerKeyEvent('keydown')
  }

  //Pointer (mouse button) up event handler ----------------------------
  function handlePointerUp() {
    if (isPointerDown) {
      setIsPointerDown(false)
      triggerKeyEvent('keyup')
    }
  }
  //Set interval to keep firing keydown event --------------------
  useEffect(() => {
    let interval: number | undefined

    if (isPointerDown) {
      interval = setInterval(() => {
        triggerKeyEvent('keydown')
      }, 30)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPointerDown, keypressed, triggerKeyEvent])

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      className="text-5xl text-emerald-500 rounded-full active:scale-90 hover:text-emerald-400"
    >
      <i className={icon}></i>
    </button>
  )
}
