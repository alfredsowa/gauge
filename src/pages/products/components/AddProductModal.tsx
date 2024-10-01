import { useState } from 'react'
import {IconArrowRight, IconPlus, IconX} from '@tabler/icons-react';
import {Button, LoadingOverlay, Modal, Text, TextInput} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notify } from '../../../requests/general/toast';
import { AxiosError } from 'axios';
import {createProduct} from "../../../requests/_productRequests.ts";
import {useNavigate} from "react-router-dom";

const AddProductModal = () => {

    const [loading, setLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const navigate  = useNavigate()

    const generalInformation = useForm({
        initialValues: {
          name: '',
        },
        validate: {
          name: (value) => (value.length < 2 ? 'Name is too small' : null),
        },
    });

    const addNewProduct = () => {
        open()
    }

    const handleSubmit = async(values: typeof generalInformation.values) => {

        setLoading(true);
    
        const data = {
            name: values.name,
            price: 0,
            wholesale_price: 0,
            discount_price: 0,
            stock_quantity: 0,
            min_stock_quantity: 1,
        }

        try{

            const response = await createProduct(data)

            if(response.data.saved) {

                notify({
                    type:'success',
                    message: response.data.message,
                    title: 'Great'
                })
                setLoading(false);

                return navigate(`/products/${response.data.product_slug}/edit`)

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
    
  return (
    <>
    <Modal opened={opened} size="xl" padding='xl' onClose={close} 
    title={<Text fw={600} fz={17}>Add New Product</Text>}
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
        <Button variant='filled' onClick={addNewProduct} leftSection={<IconPlus size={16} />}>Add New</Button>
    </>
  )
}

export default AddProductModal
