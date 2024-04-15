import { ReactNode } from 'react'
import pageWithMapStyles from './PageWithMapLayout.module.css'
import containerStyles from '../genericStyles/containers.module.css'
import { Button, Heading, Select } from '@radix-ui/themes'

export const PageWithMapLayout = ({
  map,
  pageName,
  sidebarContent,
}: {
  map: ReactNode
  pageName: string
  sidebarContent: ReactNode
}) => {
  return (
    <div className={pageWithMapStyles.layoutWrapper}>
      <div className={pageWithMapStyles.sidebar}>
        <div className={containerStyles.flexSpaceBetweenCenter}>
          <div>
            <Heading as="h2">{pageName}</Heading>
          </div>
          <div>
            <Button>Show Fullscreen Map</Button>
          </div>
        </div>
        <div className={containerStyles.flexSpaceBetweenCenter}>
          <div className={containerStyles.flexStartCenter}>
            <Select.Root defaultValue="apple">
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  <Select.Item value="orange">Orange</Select.Item>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="grape" disabled>
                    Grape
                  </Select.Item>
                </Select.Group>
                <Select.Separator />
                <Select.Group>
                  <Select.Label>Vegetables</Select.Label>
                  <Select.Item value="carrot">Carrot</Select.Item>
                  <Select.Item value="potato">Potato</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
            <Select.Root defaultValue="apple">
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  <Select.Item value="orange">Orange</Select.Item>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="grape" disabled>
                    Grape
                  </Select.Item>
                </Select.Group>
                <Select.Separator />
                <Select.Group>
                  <Select.Label>Vegetables</Select.Label>
                  <Select.Item value="carrot">Carrot</Select.Item>
                  <Select.Item value="potato">Potato</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
            <Select.Root defaultValue="apple">
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  <Select.Item value="orange">Orange</Select.Item>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="grape" disabled>
                    Grape
                  </Select.Item>
                </Select.Group>
                <Select.Separator />
                <Select.Group>
                  <Select.Label>Vegetables</Select.Label>
                  <Select.Item value="carrot">Carrot</Select.Item>
                  <Select.Item value="potato">Potato</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        {sidebarContent}
      </div>
      {map}
    </div>
  )
}
