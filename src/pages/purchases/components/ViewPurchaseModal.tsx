import { IconEye} from '@tabler/icons-react';
import {  Menu, rem, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { PurchaseBasicModel } from '../../../requests/models/_purchase';
import ViewPurchase from './ViewPurchase';

const ViewPurchaseModal = ({purchase}:{purchase: PurchaseBasicModel}) => {

    const viewPurchase = () => {
        modals.open({
            title: <Text fw={600} fz={17}>View Purchase</Text>,
            size: 'xl',
            padding: 'xl',
            overlayProps:{backgroundOpacity: 0.55,
            blur: 3,},
            children: (
              <>
                <ViewPurchase purchase={purchase}  />
              </>
            ),
          });
    }
    
  return (
    <>
        <Menu.Item onClick={viewPurchase}
            leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
            View
        </Menu.Item>
    </>
  )
}

export default ViewPurchaseModal
