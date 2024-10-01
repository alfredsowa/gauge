import { Group, Text } from '@mantine/core'
import { PrettyFigure } from '../requests/general/_numberHelper'

const TotalRecord = ({count}:{count: number}) => {
  return (
    <Group wrap="wrap" justify="space-between" mb={5} px={10}>
        <Text c={'dimmed'}>Records:
          <Text fw={600} component='span' mx={5}>
              <PrettyFigure figure={count}  />
          </Text>
        </Text>
    </Group>
  )
}

export default TotalRecord
