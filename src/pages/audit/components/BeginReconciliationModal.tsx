import { useState, useMemo, useEffect } from 'react'
// import { notify } from '../../../requests/general/toast';
import { IconCalendar } from '@tabler/icons-react';
import { Button, Grid, LoadingOverlay, Modal, MultiSelect, rem, Select, Text, TextInput } from '@mantine/core';
// import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notify } from '../../../requests/general/toast';
import { MaterialCategory } from "../../../requests/models/_business";
import { getMaterialCategories } from "../../../requests/_materialsRequests";
import { AxiosError } from 'axios';
import { isStringInArray } from '../../../requests/general/_stringHelper';
import { saveReconciliation } from '../../../requests/_auditRequest';
import { useNavigate } from 'react-router-dom';
import { reconciliationTypes } from '../../../requests/general/options';
import { MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';

const BeginReconciliationModal = () => {

  const [categories, setCategories] = useState<MaterialCategory[]|undefined>();
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const navigate = useNavigate()

    useEffect(()=>{
      const categoriesResponse = async() => {
        const response = await getMaterialCategories();
        const data = response.data.data;
        setCategories(data);
      }
  
      categoriesResponse()
    },[])

    const materialCatogories = useMemo(
      () => {
        
        // categoriesResponse()
        return categories?.map((category) => ({
          value: `${category.id}`,
          label: category.title,
        }));
      },
      [categories]
    );

    const generalInformation = useForm({
        initialValues: {
          title: '',
          type: '',
          period: '',
          categories: [],
        },
        validate: {
          title: (value) => value.length < 3?'Title is too short':null,
          type: (value) => (!isStringInArray(value,['materials','sales']) && 'Invalid type'),
        },
    });

    const addNewSupplier = () => {
        open()
    }

    const handleSubmit = async(values: typeof generalInformation.values) => {
    
        const data = {
          title: values.title,
          type: values.type,
          period: values.period,
          categories: values.categories,
        }

        setLoading(true);

        try{

            const response = await saveReconciliation(data)
            
            if(response.data.saved) {

                notify({
                type:'success',
                message: 'Reconciliation started. ',
                title: 'Great'
                })
                setLoading(false);

                generalInformation.reset()

                close();

                const id = response.data.id

                navigate(`/reconciliations/${id}/view`)

            }

        } catch(error) {
          console.log(error)
          
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.message, // Use optional chaining to access data property
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
    title={<Text fw={600} fz={17}>New Reconciliation</Text>} overlayProps={{
        backgroundOpacity: 0.55,
        blur: 1,
      }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />

      <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
        <Grid>

          <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
            <TextInput
            {...generalInformation.getInputProps('title')}
            key={generalInformation.key('title')}
            radius={"md"}
            variant="filled"
            
            label="Title"
            withAsterisk
            required
            placeholder="July 2024"
            />
          </Grid.Col>

          {/* Type */}
          <Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <Select
              {...generalInformation.getInputProps('type')}
              key={generalInformation.key('type')}
              radius={"md"}
              variant="filled"
              checkIconPosition="right"
              required
              withAsterisk
              
              label="Type"
              placeholder="Choose one"
              data={reconciliationTypes}
              />
          </Grid.Col>

          {/* Period */}
          <Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <MonthPickerInput
              {...generalInformation.getInputProps('period')}
              key={generalInformation.key('period')}
              radius={"md"}
              leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}
              variant="filled"
              clearable
              maxDate={dayjs(new Date()).toDate()}
              
              label="Period"
              required
              withAsterisk
              />
          </Grid.Col>

          {/* Categories */}
          <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
              <MultiSelect
              {...generalInformation.getInputProps('categories')}
              key={generalInformation.key('categories')}
              radius={"md"}
              variant="filled"
              checkIconPosition="right"
              
              label="Type"
              placeholder="Choose categories"
              data={materialCatogories}
              />
              <Text c={'blue'} fz={'sm'}>NB: Leave the field empty to select all</Text>
          </Grid.Col>

          <Grid.Col pt={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
            <Button type="submit">Start</Button>
          </Grid.Col>

          </Grid>
      </form>
    </Modal>
      <Button variant='filled' onClick={addNewSupplier}>Perform Reconciliation</Button>
    </>
  )
}

export default BeginReconciliationModal
