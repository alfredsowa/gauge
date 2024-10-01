import { Button, Group, Modal, MultiSelect, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { paymentStatusOptions, saleStatusOptions } from '../../../requests/general/options';
import { singleOptionList } from '../../../requests/general/_stringHelper';

const SalesFilterModal = ({searchParams, setSearchParams}:{setSearchParams:(params: { 
    status: string, payment: string
}) => void,searchParams:URLSearchParams}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [status, setStatus] = useState<string[]>([]);
    const [payment, setPayment] = useState<string[]>([]);
    const navigate = useNavigate()

    useEffect(()=>{
        const status = searchParams.get('status')
        if(status) setStatus(status?.split(','))
        const payment = searchParams.get('payment')
        if(payment) setPayment(payment?.split(','))
    },[searchParams])

    const openFilter = () => {
        open()
    }

    const runFilter = () => {
        setSearchParams({ status: status.toString(), payment: payment.toString()});
        close()
    }

    const clearFilter = () => {
        setStatus([])
        setPayment([])
        navigate('/sales')
        close()
    }

  return (
    <>

    <Modal opened={opened} size="md" padding='xl' onClose={close} 
        // centered
        title={<Text fw={600} fz={17}>Filter Sales</Text>} overlayProps={{
        backgroundOpacity: 0.55,
        blur: 1,
      }}>

        <MultiSelect
        label="Sale Status"
        placeholder="Choose"
        value={status} onChange={setStatus}
        data={singleOptionList(saleStatusOptions)}
        maxDropdownHeight={200}
        checkIconPosition="right"
        clearable
        mb={10}
        />      

        <MultiSelect
        label="Payment Status"
        placeholder="Choose"
        value={payment} onChange={setPayment}
        data={singleOptionList(paymentStatusOptions)}
        maxDropdownHeight={200}
        checkIconPosition="right"
        clearable
        mb={10}
        />      

        <Group justify='space-between'>
        <Button variant="filled" mt={20} mr={5} color="gauge-primary" onClick={runFilter}>
            Apply
        </Button>

        <Button variant="light" mt={20} ml={5} color="red" onClick={clearFilter}>
            Clear
        </Button>
        </Group>
        
    </Modal>
    <Button variant="light" color="gauge-primary" onClick={openFilter} 
       aria-label="Filter" ml={10}>
        <IconAdjustmentsHorizontal size={20} />
    </Button>
    </>
  )
}

export default SalesFilterModal
