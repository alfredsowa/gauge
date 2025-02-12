import { ChangeEvent, useState } from 'react'
import { IconCircleDashedCheck } from '@tabler/icons-react';
import {Button, Group, LoadingOverlay, Modal, ScrollArea, Stack, Table, Text, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notify } from '../../../requests/general/toast.tsx';
import { AxiosError } from 'axios';
import { History } from '../../../requests/models/_production.tsx';
import { changeProductionStatus } from '../../../requests/_productionRequests.ts';
import { useForm } from '@mantine/form';

const CompleteProductionModal = ({id,setNextStatus,setPreviousStatus,setHistory}:
    {
        id: number,
        setNextStatus: React.Dispatch<React.SetStateAction<string | null>>,
        setPreviousStatus: React.Dispatch<React.SetStateAction<string|null>>,
        setHistory:  React.Dispatch<React.SetStateAction<History[]>>}
    ) => {

    const [nextStatusNote, setNextStatusNote] = useState('')
    const [formLoading, setFormLoading] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);
    
    // const form_fields = JSON.parse(reconciliation.data)
    
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            // selected_materials: form_fields,
        }
    });

    // const fields = form.getValues().selected_materials.map((item: ReconciliationData, index: number) => (
    //     <Table.Tr key={item.key}>
    //         <Table.Td>
    //             <Text fw={600}>
    //                 {item.name}<br/>
    //                 <Text component={'span'} fw={400} c={'dimmed'}>
    //                     {item.category}
    //                 </Text>
    //             </Text>
    //         </Table.Td>

    //         <Table.Td>
    //             <Text fw={500}>
    //                 <GetWithUnit figure={item.current_stock} unit={item.unit}  />
    //             </Text>
    //         </Table.Td>

    //         <Table.Td>
    //             <NumberInput
    //             placeholder="100"
    //             required={checked}
    //             withAsterisk
    //             min={0}
    //             step={0.01}
    //             key={form.key(`selected_materials.${index}.actual_stock`)}
    //             {...form.getInputProps(`selected_materials.${index}.actual_stock`)}
    //             />
    //         </Table.Td>

    //         <Table.Td>
    //             <Textarea
    //             placeholder="Comment"
    //             withAsterisk
    //             style={{ flex: 1 }}
    //             key={form.key(`selected_materials.${index}.note`)}
    //             {...form.getInputProps(`selected_materials.${index}.note`)}
    //             />
    //         </Table.Td>
    //     </Table.Tr>
    // ));

    const completeProduction = () => {
        open()
    }

    const handleSubmit = () => {
        console.log('Submit');
        
    }

    const getNote = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNextStatusNote(event.currentTarget.value);
    };

    const complete = async() => {

        setFormLoading(true);

        setNextStatus(a => {
            if(a !== 'completed') return 'completed';
            else return 'completed';
        });
        
        try {
            
            const response = await changeProductionStatus({id,status:'completed',note:nextStatusNote});
            const result = response.data

            if(result.saved) {
                setFormLoading(false);
                
                setHistory(result.data)
                setNextStatusNote('')
                setPreviousStatus('completed')

                notify({
                    type:'success',
                    message: result.message,
                    title: 'Successful'
                })
                
                close()
                window.location.reload()
            }
        }
        catch(error) {
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.error, // Use optional chaining to access data property
                title: 'Something went wrong'
              })
            } else {
              notify({
                type:'error',
                message: 'An unexpected error occurred',
                title: 'Something went wrong'
              })
            }

            setFormLoading(false);
        }
    }

    return (
        <>
            <Modal opened={opened} size="xxl" padding='xl' onClose={close} 
            title={<Text fw={600} fz={17}>Completing Production Run</Text>}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 1,
            }}>
                <LoadingOverlay
                    visible={formLoading}
                    zIndex={1000}
                    overlayProps={{ radius: 'sm', blur: 1 }}
                    loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
                />
                <Stack>

                <Text>
                    Perform your manual item count and provide the results in the corresponding fields.
                    You should provide a reason in the note field if necessary.
                </Text>

                <form method='POST' onSubmit={form.onSubmit(handleSubmit)}>
            
                    <ScrollArea my={10}>
                        <Table withRowBorders={false} highlightOnHover withColumnBorders={false} 
                        horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" mb={20}>
                            <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ width: '200px' }}>
                                    Material
                                </Table.Th>
                                
                                <Table.Th style={{ width: '140px' }}>
                                    Used
                                </Table.Th>
                                
                                <Table.Th style={{ width: '140px' }}>
                                    Actual
                                </Table.Th>
                                
                                <Table.Th style={{ width: '140px' }}>
                                    Damaged
                                </Table.Th>
                            </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                
                            </Table.Tbody>
                        </Table>

                    </ScrollArea>

                <Textarea
                        key={'description'}
                        radius={"md"}
                        onChange={getNote}
                        variant="filled"
                        placeholder="Provide any information about this status"
                        autosize
                        value={nextStatusNote}
                        minRows={3}
                    />
                    
                        <Group justify='space-between'>
                            <Button mt={15} variant='filled' color='green' loading={formLoading} onClick={complete}>Complete Production</Button>
                            <Button mt={15} variant='filled' color='red' onClick={close}>Cancel</Button>
                        </Group>
                    </form>
                </Stack>
            </Modal>
            <Button onClick={completeProduction} leftSection={<IconCircleDashedCheck size={17} />}>Complete</Button>
        </>
    )
    
  
}

export default CompleteProductionModal
