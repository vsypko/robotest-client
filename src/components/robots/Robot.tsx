import { lazy } from 'react'

const R2D2 = lazy(() => import('./R2D2'))
const BB8 = lazy(() => import('./BB8'))
const BB9 = lazy(() => import('./BB9'))

export default function Robot({ robot }: { robot: string }) {
  switch (robot) {
    case 'R2D2':
      return <R2D2 />

    case 'BB8':
      return <BB8 />

    case 'BB9':
      return <BB9 />

    default:
      return null
  }
}
