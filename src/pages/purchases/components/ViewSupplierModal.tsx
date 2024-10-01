import { useEffect, useState } from 'react'
import { IconEye } from '@tabler/icons-react';
import { Menu, rem, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { getSupplierFull } from '../../../requests/_purchaseRequests';
import { SupplierFull } from '../../../requests/models/_purchase';
import ViewSupplier from './ViewSupplier';

const ViewSupplierModal = ({id}:{id: number}) => {

    const [supplier, setSupplier] = useState<SupplierFull>();

    useEffect(() => {
        const getSupplier = async() => {
            const response = await getSupplierFull(id)
            setSupplier(response.data)
        }

        getSupplier()
    },[id])

    const viewSupplier = () => {
        modals.open({
            title: <Text fw={600} fz={17}>View Supplier</Text>,
            size: 'xl',
            padding: 'xl',
            overlayProps:{
                backgroundOpacity: 0.55,
                blur: 3,
            },
            children: (
              <>
                <ViewSupplier supplier={supplier}  />
              </>
            ),
        });
    }
    
  return (
    <>
        <Menu.Item onClick={viewSupplier}
            leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
            View
        </Menu.Item>
    </>
  )
}

export default ViewSupplierModal
