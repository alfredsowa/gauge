import { useState } from 'react'
import {IconArrowRight, IconPlus, IconX} from '@tabler/icons-react';
import {Button, LoadingOverlay, Modal, Radio, Stack, Text, TextInput} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notify } from '../../../requests/general/toast.tsx';
import { AxiosError } from 'axios';
import {useNavigate} from "react-router-dom";
import { isStringInArray, toHeadline } from '../../../requests/general/_stringHelper.ts';
import { productionCategoryList, productionCategoryOptions } from '../../../requests/general/options.ts';
import { newProduction } from '../../../requests/_productionRequests.ts';

const AddProductionModal = () => {

    const [loading, setLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const navigate  = useNavigate()

    const generalInformation = useForm({
        initialValues: {
          title: '',
          category: '',
        },
        validate: {
          title: (value) => (value.length < 2 ? 'Title is too short' : null),
          category: (value) => (!isStringInArray(value,productionCategoryOptions) ? 'Invalid category' : null),
        },
    });

    const addNewProduction = () => {
        open()
    }

    const handleSubmit = async(values: typeof generalInformation.values) => {

        setLoading(true);
    
        const data = {
            title: values.title,
            category: values.category,
        }

        try{

            const response = await newProduction(data)

            if(response.data.saved) {

                notify({
                    type:'success',
                    message: response.data.message,
                    title: 'Great'
                })
                setLoading(false);

                return navigate(`/productions/${response.data.data.id}/edit`)

            }

        } catch(error) {
            console.log(error);

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

    const description = productionCategoryList.map((item) => (
        //   <Group wrap="nowrap" align="flex-start" mb={10}>
        //     <div>
        //       <Text fw={500}>{toHeadline(item.name)}</Text>
        //       <Text fz={'sm'} c={'dimmed'}>{item.label}</Text>
        //     </div>
        //   </Group>
          <Radio key={item.name}
          value={item.name}
          description={item.label}
          label={toHeadline(item.name)} 
          />
      ));
    
  return (
    <>
    <Modal opened={opened} size="xl" padding='xl' onClose={close} 
    title={<Text fw={600} fz={17}>Create New Production</Text>}
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
            <TextInput
                {...generalInformation.getInputProps('title')}
                key={generalInformation.key('title')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                label="Title"
                withAsterisk
                required
                mb={20}
                placeholder="Summer complete local soap for men"
            />

            <Radio.Group
            {...generalInformation.getInputProps('category')}
            key={generalInformation.key('category')}
            name="category"
            label="Select production category"
            description="This is anonymous"
            withAsterisk
            mb={30}
            >
            <Stack mt="xs">
                {description}
            </Stack>
            </Radio.Group>
            
            <Button
                mr={10}
                mb={10}
                disabled={loading}
                type="submit"
                px={40}
                variant="filled"
                rightSection={<IconArrowRight size={14} />}>
                Save
            </Button>
            <Button
                mb={10}
                onClick={close}
                type="reset"
                px={40}
                variant="light"
                rightSection={<IconX size={14} />}>
                Close
            </Button>
        </form>
    </Modal>
        <Button variant='filled' onClick={addNewProduction} leftSection={<IconPlus size={16} />}>Start New</Button>
    </>
  )
}

export default AddProductionModal
