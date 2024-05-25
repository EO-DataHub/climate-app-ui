import { IconButton, IconButtonProps } from '@radix-ui/themes'

import buttonStyles from '../../library/genericStyles/buttons.module.scss'

export const IconButtonOverride = (props: IconButtonProps) => {
  // this is an override of the IconButton component from the radix-ui library so taht we can add MUI icons and they use the appropriate color
  return <IconButton {...props} className={buttonStyles.iconButton} />
}
