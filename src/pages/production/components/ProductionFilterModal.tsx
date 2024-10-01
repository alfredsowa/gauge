import { Button, Group, Modal, MultiSelect, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { productionTypeOptions, productionStatusOptions, priorityOptions } from '../../../requests/general/options';
import { toHeadline } from '../../../requests/general/_stringHelper';

const ProductionFilterModal = ({searchParams, setSearchParams}:{setSearchParams:(params: { 
    status: string, type: string, priority: string
}) => void,searchParams:URLSearchParams}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [status, setStatus] = useState<string[]>([]);
    const [type, setType] = useState<string[]>([]);
    const [priority, setPriority] = useState<string[]>([]);
    const navigate = useNavigate()

    useEffect(()=>{

        const status = searchParams.get('status')
        if(status) setStatus(status?.split(','))

        const type = searchParams.get('type')
        if(type) setType(type?.split(','))

        const priority = searchParams.get('priority')
        if(priority) setPriority(priority?.split(','))

    },[searchParams])

    const openFilter = () => {
        open()
    }

    const runFilter = () => {
        setSearchParams({ status: status.toString(), type: type.toString(), priority: priority.toString()});
        close()
    }

    const singleOptionList = (options: string[]) => {
        return options.map((option) => ({
            value: option,
            label: toHeadline(option),
        }));
    }

    const clearFilter = () => {
        setStatus([])
        setType([])
        setPriority([])
        navigate('/productions')
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
        label="Status"
        placeholder="Choose"
        value={status} onChange={setStatus}
        data={singleOptionList(productionStatusOptions)}
        maxDropdownHeight={200}
        checkIconPosition="right"
        clearable
        mb={10}
        />      

        <MultiSelect
        label="Type"
        placeholder="Choose"
        value={type} onChange={setType}
        data={singleOptionList(productionTypeOptions)}
        maxDropdownHeight={200}
        checkIconPosition="right"
        clearable
        mb={10}
        />      

        <MultiSelect
        label="Priority"
        placeholder="Choose"
        value={priority} onChange={setPriority}
        data={singleOptionList(priorityOptions)}
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
    <Button variant="light" title='Filter' color="gauge-primary" onClick={openFilter} 
       aria-label="Filter" ml={10}>
        <IconAdjustmentsHorizontal size={20} />
    </Button>
    </>
  )
}

export default ProductionFilterModal
