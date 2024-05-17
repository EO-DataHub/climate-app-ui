import { ReactNode } from 'react'
import containerStyles from '../../library/genericStyles/containers.module.css'
import inputLabelContainerStyles from './InputLabelContainer.module.css'

export const InputLabelContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`${containerStyles.flexColumnStartStart} ${inputLabelContainerStyles.container}`}
    >
      {children}
    </div>
  )
}
