import React, { useState } from 'react'
import { IconTruckDelivery } from '@tabler/icons-react';
import { LoadingOverlay, Menu, rem, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import SupplierForm from './SupplierForm';
import { notify } from '../../../requests/general/toast';
// import { useNavigate } from 'react-router-dom';
import { SupplierBasic } from '../../../requests/models/_business';
import { modals } from '@mantine/modals';
import { saveSupplier } from '../../../requests/_purchaseRequests';
import { AxiosError } from 'axios';

const EditSupplierModal = ({setSupplierList, row}:{ 
    setSupplierList: React.Dispatch<React.SetStateAction<SupplierBasic[]|undefined>>,
    row: SupplierBasic
}) => {

    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate()

    const editInformation = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: row.id,
            contact_person: row.contact_person,
            company_name: row.company_name,
            contact_detail: row.contact_detail,
            location: row.location,
            note: row.note?row.note:'',
        },
        validate: {
          contact_person: (value) => (value.length < 2 ? 'Name is too small' : null),
          company_name: (value) => value.length > 0 ?(value.length < 2 ? 'Company name is too small' : null):null,
          contact_detail: (value) => (value.length < 7 ? 'Must be 7 or more characters' : null),
          location: (value) => value ?(value.length < 2 ? 'Location is too small' : null): null,
          note: (value) => value.length > 0 ? (value.length < 5 ? 'Must be 5 or more characters' : null): null,
        },
    });

    const close = () => {
        modals.closeAll()
    }

    const editSupplier = () => {
        modals.open({
            title: <Text fw={600} fz={17}>Edit Supplier Information</Text>,
            size: 'xl',
            padding:'xl',
            overlayProps:{
                backgroundOpacity: 0.55,
                blur: 3,
            },
            children: (
              <>
                <LoadingOverlay
                    visible={loading}
                    zIndex={1000}
                    overlayProps={{ radius: 'sm', blur: 1 }}
                    loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
                />
                <form method='POST' onSubmit={editInformation.onSubmit(handleSubmit)}>
                    <SupplierForm generalInformation={editInformation} close={close}/>
                </form>
              </>
            ),
        });
    }

    const handleSubmit = async(values: typeof editInformation.values) => {
    
        const data = {
            id: row.id,
            contact_person: values.contact_person,
            company_name: values.company_name,
            contact_detail: values.contact_detail,
            location: values.location,
            note: values.note,
        }

        setLoading(true);

        try{

            const response = await saveSupplier(data)
            
            console.log(response);
            if(response.data.saved) {

                notify({
                type:'success',
                message: response.data.message,
                title: 'Great'
                })
                setLoading(false);

                editInformation.reset()

                // const newSortedData: SupplierBasic[]|undefined = sortedData?.map((supplier) => {
                //     if (supplier.id === values.id) {
                //         return data;
                //     }
                //     return supplier;
                // });

                setSupplierList(response.data.suppliers)

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
    
        <Menu.Item onClick={editSupplier}
            leftSection={<IconTruckDelivery style={{ width: rem(14), height: rem(14) }} />}>
            Edit
        </Menu.Item>

    </>
  )
}

export default EditSupplierModal
