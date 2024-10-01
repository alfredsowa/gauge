import { useState } from 'react'
import {Anchor, Button, Group, LoadingOverlay, Modal, Select, Text, Textarea} from '@mantine/core';
// import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notify } from '../../requests/general/toast';
import { AxiosError } from 'axios';
import {isStringInArray} from "../../requests/general/_stringHelper.ts";
import {sendFeedback} from "../../requests/_dashboardRequests.ts";

const FeedbackModal = () => {

    const [loading, setLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    const generalInformation = useForm({
        initialValues: {
            type: '',
            feedback: '',
        },
        validate: {
            type: (value) => !isStringInArray(value,['Issue', 'Suggestion', 'New Feature']) ? 'Invalid feedback type selected' : null,
            feedback: (value) => value.length > 1 ? (value.length < 5 ? 'Must be 5 or more characters' : null): null,
        },
    });

    const addFeedback = () => {
        open()
    }

    const handleSubmit = async(values: typeof generalInformation.values) => {

        setLoading(true);
    
        const data = {
            feedback: values.feedback,
            type: values.type,
        }

        try{

            const response = await sendFeedback(data)

            if(response.data.saved) {

                notify({
                type:'success',
                message: response.data.message,
                title: 'Thank you!'
                })
                setLoading(false);

                generalInformation.reset()

                close();

            }

        } catch(error) {
            console.log(error)
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
            setLoading(false);
        }
        
        setLoading(false);
    }
    
  return (
    <>
        <Modal opened={opened} size="xl" padding='xl' onClose={close}
        title={<Text fw={600} fz={17}>General Feedback & Suggestions</Text>}
        overlayProps={{
            backgroundOpacity: 0.55,
            blur: 1,
          }}>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
          />

            <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
                <Select
                    {...generalInformation.getInputProps('type')}
                    key={generalInformation.key('type')}
                    required
                    withAsterisk
                    label="Choose feedback type"
                    placeholder="Select One"
                    data={['Issue', 'Suggestion', 'New Feature']}
                />
                <Textarea
                    {...generalInformation.getInputProps('feedback')}
                    key={generalInformation.key('feedback')}
                    mt={20} mb={10}
                    required
                    withAsterisk
                    label={'Submit all your issues and suggestions that can help you maximise the use of the application and grow your business.'} rows={6} />
                <Button onClick={close} variant={"transparent"} mt={10} me={3}>Cancel</Button>
                <Button title={'Send Feedback'} type={'submit'} mt={10}>Submit</Button>
            </form>
        </Modal>
        <Group bg={'orange'} px="xl" justify="center">
            <Text fw={500} c={'white'}>
                We will appreciate any feedback.
                <Anchor onClick={addFeedback} c={'gauge-primary.8'} fw={600}> Click here!</Anchor>
            </Text>
        </Group>
    </>
  )
}

export default FeedbackModal
