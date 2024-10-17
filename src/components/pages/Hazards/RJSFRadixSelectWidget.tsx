import { Select } from '@radix-ui/themes'
import { InputLabelContainer } from '../../Form/InputLabelContainer.tsx'
import formStyles from '../../../library/genericStyles/forms.module.scss'
import { InfoPopover } from '../../InfoPopover/InfoPopover.tsx'
import { WidgetProps } from '@rjsf/utils'

export const RJSFRadixSelectWidget = ({
  id,
  options,
  onChange,
  label,
}: WidgetProps) => {
  const { enumOptions } = options

  return (
    <InputLabelContainer>
      <div className={formStyles.labelWithInfoPopoverRow}>
        <label htmlFor={id}>{label}</label>
        <InfoPopover>{options.description}</InfoPopover>
      </div>
      <Select.Root onValueChange={(val) => onChange(val)}>
        <Select.Trigger placeholder="Select" />

        <Select.Content id={id}>
          {enumOptions?.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </InputLabelContainer>
  )
}
