import { ChangeEvent, useState } from 'react'
import { IconInfoCircle } from '@tabler/icons-react';
import {Alert, Button, Group, LoadingOverlay, Modal, Radio, Stack, Text, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notify } from '../../../requests/general/toast.tsx';
import { AxiosError } from 'axios';
import { isStringInArray, toHeadline } from '../../../requests/general/_stringHelper.ts';
import { productionStatusList, productionStatusOptions } from '../../../requests/general/options.ts';
import { History } from '../../../requests/models/_production.tsx';
import { changeProductionStatus, startThisProduction } from '../../../requests/_productionRequests.ts';

const StatusProductionModal = ({nextStatus,previousStatus,id,setNextStatus,setPreviousStatus,setHistory}:
    {
        nextStatus: string | null,
        previousStatus: string | null,
        id: number,
        setNextStatus: React.Dispatch<React.SetStateAction<string | null>>,
        setPreviousStatus: React.Dispatch<React.SetStateAction<string|null>>,
        setHistory:  React.Dispatch<React.SetStateAction<History[]>>}
    ) => {

    const [nextStatusNote, setNextStatusNote] = useState('')
    const [formLoading, setFormLoading] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);

    const updateStatus = () => {
        open()
    }

    const getNote = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNextStatusNote(event.currentTarget.value);
    };

    const descriptionList = productionStatusList.map((item) => (
        <Radio key={item.name}
        value={item.name}
        description={item.label}
        label={toHeadline(item.name)} 
        />
    ));

    const startProduction = async () => {
        try {
            // const response = await changeProductionStatus({id,status:'in_progress',note:nextStatusNote});
            const response = await startThisProduction({production_id:id, note:nextStatusNote});
            const result = response.data

            if(result.saved) {
                setFormLoading(false);
                
                setHistory(result.data)
                setNextStatusNote('')
                setPreviousStatus('in_progress')
                setNextStatus('in_progress')

                notify({
                    type:'success',
                    message: result.message,
                    title: 'Let\'s go!'
                })

                close()
                window.location.reload();
                
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

    const changeStatus = async () => {

        setFormLoading(true);
        
        if(!nextStatus || !isStringInArray(nextStatus,productionStatusOptions)) {
            
            setFormLoading(false);
            notify({
                type:'error',
                message: 'Invalid status',
                title: 'Error'
            })
            return;
        }

        if(nextStatus === previousStatus ) {
            
            setFormLoading(false);
            notify({
                type:'warning',
                message: 'Production is already in this status',
                title: 'Notice'
            })
            return;
        }

        try {
            const response = await changeProductionStatus({id,status:nextStatus,note:nextStatusNote});
            const result = response.data

            if(result.saved) {
                setFormLoading(false);
                
                setHistory(result.data)
                setNextStatusNote('')
                setPreviousStatus(nextStatus)

                notify({
                    type:'success',
                    message: result.message,
                    title: 'Successful'
                })
                close()
                window.location.reload();
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
            <Modal opened={opened} size="xl" padding='xl' onClose={close} 
            title={<Text fw={600} fz={17}>{(previousStatus === 'backlog')? 'Start Production' : 'Update Production Status'}</Text>}
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
                    {
                        (previousStatus === 'backlog')?(
                            <>
                                <Alert variant="light" color="blue" title="Important Notice" icon={<IconInfoCircle />}>
                                    All the materials for this production will be automatically deducted from the materials inventory.
                                </Alert>
                            </>
                        ) : (
                            <>
                            <Radio.Group
                                onChange={setNextStatus}
                                value={nextStatus}
                                key={'status'}
                                name="category"
                                label="Select Next Status"
                                withAsterisk
                                required
                                mb={20}
                                >
                                <Stack mt="xs">
                                    {descriptionList}
                                </Stack>
                                </Radio.Group>
                            </>
                            
                        )
                    }
                    
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
                    {
                        (previousStatus === 'backlog')?(
                            <Button mt={15} variant='filled' loading={formLoading} onClick={startProduction}>Start</Button>
                        ): (
                            <Group justify='space-between'>
                                <Button mt={15} variant='filled' loading={formLoading} onClick={changeStatus}>Update Status</Button>
                                <Button mt={15} variant='filled' color='green' loading={formLoading} onClick={complete}>Complete Production</Button>
                            </Group>
                        )
                    }
                </Stack>
            </Modal>
            <Button variant='filled' onClick={updateStatus}>
                {
                    (previousStatus === 'backlog')?'Start': 'Update Status'
                }
            </Button>
        </>
    )
    
  
}

export default StatusProductionModal
