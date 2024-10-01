import { Card, Divider, Group, Skeleton, Text } from '@mantine/core'
import PriorityDot from './PriorityDot'
import { Link } from 'react-router-dom'
// import { DefaultDate } from '../requests/general/_dates'
import StatusBadge from './StatusBadge'
import { ProductionBasicModel } from '../requests/models/_production'
import { PrettyFigure } from '../requests/general/_numberHelper'

const ProductionDasboardCard = ({production,cardAnalyticsLoading}:{
    production: ProductionBasicModel;
    cardAnalyticsLoading: boolean;
}) => {
    return (
        <>
          <Skeleton visible={cardAnalyticsLoading} mb={5} >
            <Card py={10} bg={'transparent'} px={15} key={production.id} mb={0} style={{cursor: 'pointer'}} 
            component={Link} to={`/productions/${production.id}/view`} radius={'none'} withBorder={false} shadow='none'>
              <Group gap="sm" justify='space-between'>
                <div>
                  <Text fz="md" fw={600}>
                  <PriorityDot priority={production.priority} /> {production.title} 
                  </Text>
                  <Text fz="md" mx={15} c="dimmed" fw={400}>
                    Quantity: <PrettyFigure figure={production.quantity}  />
                  </Text>
                </div>
                <div>
                </div>
                <StatusBadge status={production.status}  />
              </Group>
            </Card>
            <Divider variant="dashed" mb={2} />
          </Skeleton>
        </>
    )
}

export default ProductionDasboardCard
