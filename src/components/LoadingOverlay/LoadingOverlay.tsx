import loadingOverlayStyles from './LoadingOverlay.module.css'
import { Spinner } from '@radix-ui/themes'

export const LoadingOverlay = ({
  isVisible = false,
}: {
  isVisible: boolean
}) => {
  return isVisible ? (
    <div className={loadingOverlayStyles.overlay}>
      <Spinner className={loadingOverlayStyles.spinner} />
    </div>
  ) : null
}
