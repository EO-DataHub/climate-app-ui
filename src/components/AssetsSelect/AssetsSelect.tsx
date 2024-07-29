import { Select } from '@radix-ui/themes'
import { useContext } from 'react'

import { UNSAVED_PORTFOLIO_VALUE_FOR_SELECT_INPUT } from '../../configuration/constants'
import { UserAssetsContext } from '../../context/UserAssetsContext'
import assetsSelectStyles from './AssetsSelect.module.scss'
import { AuthenticationContext } from '../../context/AuthenticationContext'

export const AssetsSelect = ({
  onValueChange,
  showUnsaved = false,
}: {
  onValueChange?: (value: string) => void
  showUnsaved?: boolean
}) => {
  const { userAssets } = useContext(UserAssetsContext)
  const { isAuthenticated, login } = useContext(AuthenticationContext)

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isAuthenticated && isOpen) {
      void login()
      return
    }
  }
  return (
    <div className={assetsSelectStyles.assetsSelectWrapper}>
      <label>Portfolios</label>
      <Select.Root
        onValueChange={onValueChange}
        onOpenChange={handleOnOpenChange}
      >
        <Select.Trigger placeholder="Select Portfolio" />
        <Select.Content position="popper">
          <Select.Group>
            <Select.Label>My Portfolios</Select.Label>
            <Select.Item value="#" disabled>
              Portfolio 1
            </Select.Item>
            <Select.Item value="#" disabled>
              Portfolio 2
            </Select.Item>
            <Select.Item value="#" disabled>
              Portfolio 3
            </Select.Item>
          </Select.Group>
          <Select.Separator />
          {showUnsaved && userAssets ? (
            <>
              <Select.Group>
                <Select.Label>Private Portfolios (Unsaved)</Select.Label>
                <Select.Item value={UNSAVED_PORTFOLIO_VALUE_FOR_SELECT_INPUT}>
                  Portfolio 1
                </Select.Item>
              </Select.Group>
              <Select.Separator />
            </>
          ) : null}
          <Select.Group>
            <Select.Label>Sample Portfolios</Select.Label>
            <Select.Item value="#" disabled>
              Sample Portfolio 1
            </Select.Item>
            <Select.Item value="#" disabled>
              Sample Portfolio 2
            </Select.Item>
            <Select.Item value="#" disabled>
              Sample Portfolio 3
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  )
}
