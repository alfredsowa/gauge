import {Anchor, Button, Grid, Modal, Text, Textarea, TextInput} from '@mantine/core'
import { useForm } from '@mantine/form';
import { RefObject, useState } from 'react'
import { notify } from '../../../requests/general/toast';
import { saveCategory } from '../../../requests/_materialsRequests';
import { AxiosError } from 'axios';
import { MaterialCategory } from '../../../requests/models/_business';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';

const MaterialCategoryForm = ({setCategories,hiddenNewCategory}:{
  setCategories:React.Dispatch<React.SetStateAction<MaterialCategory[]|undefined>>,
  hiddenNewCategory: RefObject<HTMLAnchorElement> }) => {

    const [categoryFormloading, setCategoryFormLoading] = useState(false);
    const [enableClear, setEnableClear] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    const categoryForm = useForm({
      mode:'uncontrolled',
      initialValues: {
        id: '',
        title: '',
        description: '',
      },
      validate: {
        title: (value) => {
          if (value!== undefined) {
            return value.length < 2? 'Title is too small' : null;
          }
          return null;
        },
        description: (value) => {
          if (value!== undefined) {
            return value.length > 0 && value.length < 2?'Description is too small' : null;
          }
          return null;
        },
      },
    });
    
    const handleSubmit = async(values: typeof categoryForm.values) => {
      setCategoryFormLoading(true)
      const data = {
        title: values.title,
        description: values?.description,
        id: Number(values?.id),
      }

      try {
        const saveForm = await saveCategory(data)
          if(saveForm.data.saved) {
              notify({
              type:'success',
              message: saveForm.data.message,
              title: 'Done!'
              })
              resetForm()
              setCategoryFormLoading(false)
              setCategories(saveForm.data.categories);
              close()
          }
          else {
              setCategoryFormLoading(false)
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
          setCategoryFormLoading(false)
      }
      
      setCategoryFormLoading(false)
    }

    const resetForm = () => {
      categoryForm.reset()
      setEnableClear(true)
    }
    const addNewCategory = () => {
      open()
  }

  return (
    <>
      <Modal opened={opened} size="lg" padding={'xl'} onClose={close} 
             title={<Text fz={'md'} fw={600}>Add New Category</Text>} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>

        <form  method='POST' onSubmit={categoryForm.onSubmit(handleSubmit)}>

          <Grid>
            {/* Title */}
            <Grid.Col pt={10} pb={10} span={12}>
                <TextInput
                {...categoryForm.getInputProps('title')}
                key={categoryForm.key('title')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Title"
                required
                withAsterisk
                placeholder="Title"
                />
            </Grid.Col>

            {/* Description */}
            <Grid.Col pt={10} span={12}>
                <Textarea
                {...categoryForm.getInputProps('description')}
                key={categoryForm.key('description')}
                radius={"md"}
                variant="filled"
                placeholder="Describe what the category means..."
                label="Description"
                autosize
                minRows={3}
                />
            </Grid.Col>

            <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                <Button  
                type="submit"
                loading={categoryFormloading}
                px={30}
                variant="filled">
                Save
                </Button>

                <Button  
                ml={4}
                type="button"
                onClick={resetForm}
                disabled={enableClear}
                px={30}
                color={'red'}
                variant="light">
                Reset
                </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Modal>
        <Anchor variant='filled' display={'none'} fw={500} fz={'sm'} ref={hiddenNewCategory} onClick={addNewCategory}>
            <IconPlus size={10} /> Add new category
        </Anchor>
    </>
  )
}

export default MaterialCategoryForm
