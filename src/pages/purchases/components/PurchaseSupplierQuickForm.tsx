import React, {RefObject, useState} from 'react'
import { IconPlus } from '@tabler/icons-react';
import { Anchor, LoadingOverlay, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import SupplierForm from './SupplierForm';
import { saveSupplier } from '../../../requests/_purchaseRequests';
import { notify } from '../../../requests/general/toast';
import { SupplierBasic } from '../../../requests/models/_business';
import { AxiosError } from 'axios';

const PurchaseSupplierQuickForm = ({suppliersList,setSuppliersList,hiddenNewSupplier}:{suppliersList: SupplierBasic[]|null,
    setSuppliersList: React.Dispatch<React.SetStateAction<SupplierBasic[]|null>>,
    hiddenNewSupplier: RefObject<HTMLAnchorElement>
}) => {

    const [loading, setLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    const generalInformation = useForm({
        initialValues: {
          contact_person: '',
          company_name: '',
          contact_detail: '',
          location: '',
          note: '',
        },
        validate: {
          contact_person: (value) => (value.length < 2 ? 'Name is too small' : null),
          company_name: (value) => (value.length < 2 ? 'Company name is too small' : null),
          contact_detail: (value) => (value.length < 7 ? 'Must be 7 or more characters' : null),
          location: (value) => value.length > 0 ?(value.length < 2 ? 'Location is too small' : null): null,
          note: (value) => value.length > 1 ? (value.length < 5 ? 'Must be 5 or more characters' : null): null,
        },
    });

    const addNewSupplier = () => {
        open()
    }

    const handleSubmit = async(values: typeof generalInformation.values) => {
    
        const data = {
            contact_person: values.contact_person,
            company_name: values.company_name,
            contact_detail: values.contact_detail,
            location: values.location,
            note: values.note,
        }

        setLoading(true);

        try{

            const response = await saveSupplier(data)
            
            if(response.data.saved) {

                notify({
                type:'success',
                message: response.data.message,
                title: 'Great'
                })
                setLoading(false);

                generalInformation.reset()

                if(suppliersList) {
                  setSuppliersList([...suppliersList,response.data.supplier])
                }
                else {
                  setSuppliersList(response.data.supplier)
                }
               

                close();

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
            setLoading(false);
        }
        
        setLoading(false);
    }
    
  return (
    <>
    <Modal opened={opened} size="xl" padding={'xl'} onClose={close} 
    title={<Text fw={600} fz={17}>Add New Supplier</Text>} overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

        <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
            <SupplierForm generalInformation={generalInformation} close={close}/>
        </form>
    </Modal>
        <Anchor variant='filled' fw={500} display={'none'} fz={'sm'} ref={hiddenNewSupplier} onClick={addNewSupplier}>
        <IconPlus size={10} /> Add New Supplier
        </Anchor>
    </>
  )
}

export default PurchaseSupplierQuickForm
