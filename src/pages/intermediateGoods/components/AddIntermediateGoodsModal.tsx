import {IconArrowRight, IconPlus, IconX} from '@tabler/icons-react';
import {Button, LoadingOverlay, Modal, Text, TextInput} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notify } from '../../../requests/general/toast';
import { AxiosError } from 'axios';
import {createIntermediateGood} from "../../../requests/_intermediateGoodsRequests.ts";
import {useNavigate} from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddIntermediateGoodsModal = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const navigate  = useNavigate()
    const queryClient = useQueryClient();

    const {mutate: addIntermediateGood,isPending} = useMutation({
        mutationKey: ['intermediateGoodsNew'],
        mutationFn: (good: {name: string,stock_quantity: number,min_stock_quantity: number}) => {
            return createIntermediateGood(good)
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({queryKey:['intermediateGoods']})
            notify({
                type:'success',
                message: response.data.message,
                title: 'Created'
            })
            return navigate(`/intermediate-goods/${response.data.intermediate_good_slug}/edit`)
        },
        onError: (error) => {
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
        }
    })

    const generalInformation = useForm({
        initialValues: {
          name: '',
        },
        validate: {
          name: (value) => (value.length < 2 ? 'Name is too small' : null),
        },
    });

    const addNewIntermediateGood = () => {
        open()
    }

    const handleSubmit = async(values: typeof generalInformation.values) => {

        addIntermediateGood({
            name: values.name,
            stock_quantity: 0,
            min_stock_quantity: 1,
        })
    }
    
  return (
    <>
    <Modal opened={opened} size="xl" padding='xl' onClose={close} 
    title={<Text fw={600} fz={17}>Add New Intermediate Good</Text>}
    overlayProps={{
        backgroundOpacity: 0.55,
        blur: 1,
      }}>
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

        <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
            <TextInput
                {...generalInformation.getInputProps('name')}
                key={generalInformation.key('name')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                label="Name"
                withAsterisk
                required
                mb={20}
                placeholder="Name"
            />
            <Button
                mr={10}
                mb={10}
                disabled={isPending}
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
        <Button variant='filled' onClick={addNewIntermediateGood} leftSection={<IconPlus size={16} />}>Add New</Button>
    </>
  )
}

export default AddIntermediateGoodsModal
