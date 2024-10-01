import { Button, Group, Text } from '@mantine/core'
import { BusinessModel } from '../../requests/models/_business'

const DefaultBusiness = ({business}:{business: BusinessModel|undefined}) => {
  return (
    <div>
      <Group justify="space-between" style={{width: "100%"}} >
          <Text mt={5} fw={500} size="md">
            Business Name <br />
            <Text component="span" mt={7} fw={500} c={"dimmed"} size="sm">
              {business?.name}
            </Text>
          </Text>
          <Button variant="light">Edit Details</Button>
      </Group>
    </div>
  )
}

export default DefaultBusiness
