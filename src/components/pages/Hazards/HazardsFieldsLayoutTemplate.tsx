import { ObjectFieldTemplateProps } from '@rjsf/utils'
import { Box, Grid } from '@radix-ui/themes'

export const CustomObjectFieldTemplate = ({
  properties,
}: ObjectFieldTemplateProps) => {
  const gridFields = ['climate_model', 'scenario', 'year']

  return (
    <Grid gap="5">
        <Grid columns="2" gap="5">
        {properties
          .filter((element) => !gridFields.includes(element.name))
          .map((element, index) => (
            <Box key={index}>{element.content}</Box>
          ))}
        </Grid>
        <Grid columns="3" gap="5">
          {properties
            .filter((element) => gridFields.includes(element.name))
            .map((element, index) => (
              <Box key={index}>
                {element.content}
              </Box>
            ))}
        </Grid>

    </Grid>
  )
}
