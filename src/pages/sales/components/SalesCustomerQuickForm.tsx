import { Anchor, Button, Grid, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form';
import {RefObject, useState} from 'react'
import { notify } from '../../../requests/general/toast';
import { AxiosError } from 'axios';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { CustomerBasicModel } from '../../../requests/models/_sales';
import { saveCustomers } from '../../../requests/_saleRequests';

const SalesCustomerQuickForm = ({setBuyers,buyers,hiddenNewCustomer}:
  {
      setBuyers:React.Dispatch<React.SetStateAction<CustomerBasicModel[]|null>>,
      buyers: CustomerBasicModel[]|null,
      hiddenNewCustomer: RefObject<HTMLAnchorElement>
  }) => {

    const [formLoading, setFormLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    const customerForm = useForm({
      mode:'uncontrolled',
      initialValues: {
        id: '',
        first_name: '',
        last_name: '',
        phone: '',
        city: '',
      },
      validate: {
        first_name: (value) => (value.length < 2? 'First name is too small' : null),
        last_name: (value) => (value.length < 2? 'Last name is too small' : null),
        city: (value) => (value.length < 2? 'City name is too small' : null),
        phone: (value) => (value.length < 10?'Phone is too small' : null),
      },
    });
    
    const handleSubmit = async(values: typeof customerForm.values) => {
      setFormLoading(true)
      const data = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        city: values.city
      }

      try {
        const saveForm = await saveCustomers(data)
          if(saveForm.data.saved) {
              notify({
              type:'success',
              message: saveForm.data.message,
              title: 'Done!'
              })
              resetForm()
              setFormLoading(false)
              if (buyers) { // Add this null check before spreading the array
                setBuyers([...buyers,saveForm.data.customer]);
              } else {
                setBuyers([saveForm.data.customer]);
              }
              close()
          }
          else {
              setFormLoading(false)
              notify({
              type:'error',
              message: saveForm.data.message,
              title: 'Error!'
              })
          }
      } catch(error) {
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
          setFormLoading(false)
      }
      
      setFormLoading(false)
    }

    const resetForm = () => {
      customerForm.reset()
    }
    const addNewCustomer = () => {
      open()
  }

  return (
    <>
      <Modal opened={opened} size="xl" padding={'xl'} onClose={close} 
        title={'Add New Customer'} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>

        <form  method='POST' onSubmit={customerForm.onSubmit(handleSubmit)}>

          <Grid>
            {/* First name */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                {...customerForm.getInputProps('first_name')}
                key={customerForm.key('first_name')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                size="sm"
                label="First name"
                required
                withAsterisk
                placeholder="John"
                />
            </Grid.Col>

            {/* Last name */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                {...customerForm.getInputProps('last_name')}
                key={customerForm.key('last_name')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                size="sm"
                label="Last name"
                required
                withAsterisk
                placeholder="Doe"
                />
            </Grid.Col>

            {/* Phone */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                {...customerForm.getInputProps('phone')}
                key={customerForm.key('phone')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                size="sm"
                label="Phone"
                required
                withAsterisk
                placeholder="05000000001"
                />
            </Grid.Col>

            {/* City */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                {...customerForm.getInputProps('city')}
                key={customerForm.key('city')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                size="sm"
                label="City"
                required
                withAsterisk
                placeholder="Accra"
                />
            </Grid.Col>


            <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                <Button  
                type="submit"
                loading={formLoading}
                px={30}
                variant="filled">
                Save
                </Button>

                <Button  
                ml={4}
                type="button"
                onClick={resetForm}
                px={30}
                color={'red'}
                variant="light">
                Reset
                </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Modal>
      <Anchor variant='filled' display={'none'} fw={500} fz={'sm'} ref={hiddenNewCustomer} onClick={addNewCustomer}>
        <IconPlus size={10} /> Add New Customer
        </Anchor>
    </>
  )
}

export default SalesCustomerQuickForm
