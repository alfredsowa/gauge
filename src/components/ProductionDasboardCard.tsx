import { Card, Divider, Group, Text } from '@mantine/core'
import PriorityDot from './PriorityDot'
import { Link } from 'react-router-dom'
// import { DefaultDate } from '../requests/general/_dates'
import StatusBadge from './StatusBadge'
import { ProductionBasicModel } from '../requests/models/_production'
import { PrettyFigure } from '../requests/general/_numberHelper'

const ProductionDasboardCard = ({production,last=false}:{
    production: ProductionBasicModel;
    cardAnalyticsLoading: boolean;
    last?:boolean
}) => {
    return (
        <>
          {/* <Skeleton visible={cardAnalyticsLoading} mb={5} > */}
            <Card py={10} bg={'transparent'} px={15} key={production.id} mb={0} style={{cursor: 'pointer'}} 
              component={Link} to={`/productions/${production.id}/view`} radius={'none'} withBorder={false} shadow='none'>
              <Text fw={600}>
              <PriorityDot priority={production.priority} /> {production.title} 
              </Text>
              <Group justify='space-between'>
                <Text c="dimmed" fw={400}>
                  Quantity: <PrettyFigure figure={production.quantity}  />
                </Text>
                <StatusBadge status={production.status}  />
              </Group>
            </Card>
            {!last && <Divider variant="dashed" mb={2} />}
          {/* </Skeleton> */}
        </>
    )
}

export default ProductionDasboardCard
