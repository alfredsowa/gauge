import { Avatar, Card, Divider, Group, Indicator, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { MostUsedMaterial } from '../requests/models/_dashboard'

const MaterialsUsedDasboardCard = ({material}:{material: MostUsedMaterial}) => {
    return (
        <>
          <Card py={10} px={15} bg={'transparent'} key={material.id} mb={0} style={{cursor: 'pointer'}} 
          component={Link} to={`/materials/${material.id}/view`} radius={'none'} withBorder={false} shadow='none'>
            <Group gap="sm" wrap='nowrap'>
              <Indicator disabled={material.current_stock_level <= material.minimum_stock_level ? false:true}
              position="bottom-center" size={14}  withBorder processing color='red' inline label="Low">
                  <Avatar
                  size={40}
                  radius="md"
                  src={material.image}
                  />
              </Indicator>
              {/* <div> */}
                <Text fz="md" fw={600}>
                  {material.material_name} <br />
                  <Text fz="sm" component='span' c="dimmed" fw={600}>
                    
                  Used: <Text fz="sm" component='span' c="dimmed" fw={400}>
                    {material.quantity_used} {material.unit}
                  </Text>
                  <Text fz="sm" mx={10} component='span' c="dimmed" fw={400}>
                    -
                  </Text>
                  Left: <Text fz="sm" component='span' c="dimmed" fw={400}>
                    {material.current_stock_level} {material.unit}
                  </Text>
                  </Text>
                </Text>
                <Group gap="sm" wrap='nowrap' justify='space-between'>
                  
                  
                </Group>
              {/* </div> */}
            </Group>
            
          </Card>
          <Divider variant="dashed" mb={2} />
        </>
    )
}

export default MaterialsUsedDasboardCard
