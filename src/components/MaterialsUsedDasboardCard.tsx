import { Avatar, Card, Divider, Group, Indicator, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { MostUsedMaterial } from '../requests/models/_dashboard'
import { GetWithUnit } from '../requests/general/_numberHelper'

const MaterialsUsedDasboardCard = ({material,last=false}:{material: MostUsedMaterial,last?:boolean}) => {
    return (
        <>
          <Card py={10} px={15} bg={'transparent'} key={material.id} mb={0} style={{cursor: 'pointer'}} 
          component={Link} to={`/materials/${material.id}/view`} radius={'none'} withBorder={false} shadow='none'>
            <Group wrap='nowrap'>
              <Indicator disabled={material.current_stock_level <= material.minimum_stock_level ? false:true}
              position="bottom-center" size={14}  withBorder processing color='red' inline label="Low">
                  <Avatar
                  size={40}
                  radius="md"
                  src={material.image}
                  />
              </Indicator>
              {/* <div> */}
                <Text fz="md" fw={500}>
                  {material.material_name} <br />
                  <Group justify='space-between'>
                  <Text c="dimmed">
                    
                    <GetWithUnit figure={Number(material.quantity_used)} unit={material.unit}  /> <Text  component='span' c="red">used</Text>
                  </Text>
                  
                  {/* <Text  component='span' c="dimmed" fw={400}>
                    Left:  {material.current_stock_level} {material.unit}
                  </Text> */}
                  </Group>
                </Text>
                {/* <Group gap="sm" wrap='nowrap' justify='space-between'>
                  
                  
                </Group> */}
              {/* </div> */}
            </Group>
            
          </Card>
          {!last && <Divider variant="dashed" mb={2} />}
        </>
    )
}

export default MaterialsUsedDasboardCard
