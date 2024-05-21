import demoPlaceholderSrc from '../../../localAssets/AssetsAnalysisPlaceholder.png'

import analyseAssetsStyles from './AssetsAnalyse.module.scss'

export const AssetsAnalyse = () => {
  return (
    <img
      src={demoPlaceholderSrc}
      alt="Demo Placeholder for Assets Analysis"
      className={analyseAssetsStyles.placeholder}
    />
  )
}
