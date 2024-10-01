import { ActionIcon, Button, Divider, Drawer, Grid, Group, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react'
import { MaterialCategory } from '../../../requests/models/_business';
import { IconEdit } from '@tabler/icons-react';
import { getMaterialCategories, saveCategory } from '../../../requests/_materialsRequests';
import { notify } from '../../../requests/general/toast';
import { AxiosError } from 'axios';

const Categories = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [categoryFormloading, setCategoryFormLoading] = useState(false);
    const [categories, setCategories] = useState<MaterialCategory[]>([]);
    const [enableClear, setEnableClear] = useState(true);

    useEffect(()=>{
      const categoriesResponse = async() => {
        const response = await getMaterialCategories();
        const data = response.data.data;
        setCategories(data);
      }
      categoriesResponse()
      },[]);
    

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

      const editCategory = (categoryid: string) => {
        const getCategory = categories?.find(c => c.id === categoryid)
        categoryForm.setValues({ 
            title: getCategory?.title, 
            description: getCategory?.description, 
            id: categoryid});
      
        const editFormElement = document.getElementById('editForm');
        if (editFormElement) {
          editFormElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
          })
        }
        setEnableClear(false)
      }

      const resetForm = () => {
        categoryForm.reset()
        setEnableClear(true)
      }

  return (
    <>
    <Button onClick={open} variant='light'> Categories </Button>
      
      <Drawer
        position="right"
        size="sm"
        opened={opened}
        onClose={close}
        title={<Text fw={600} fz={17}>Categories</Text>}
        fs={'lg'}
        pb={30}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {/* <Card radius={'md'} mb={'lg'} id='editForm'> */}
            <form  method='POST' onSubmit={categoryForm.onSubmit(handleSubmit)}>

            <Grid>
                {/* Code */}
                <Grid.Col pt={10} pb={10} span={12}>
                    <TextInput
                    {...categoryForm.getInputProps('title')}
                    key={categoryForm.key('title')}
                    radius={"md"}
                    variant="filled"
                    // c={'dimmed'}
                    // size="sm"
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
        {/* </Card> */}
        
        <Stack mt={20} style={{overflow:'scroll'}}>
          {
            categories?.map((category) => (
              <div key={category.id}>
              <Divider my={3} />
              <Group wrap="nowrap" justify="space-between" color='#efefe'>
                  <div>
                      <Text>{category.title}</Text>
                      <Text size="sm" c={'dimmed'}>{category.description}</Text>
                  </div>

                  <ActionIcon variant="light" aria-label="Save" onClick={()=>editCategory(category.id)}>
                      <IconEdit style={{ width: '70%', height: '70%' }} stroke={2} />
                  </ActionIcon>
              
              </Group>
              </div>
              )
            )
          }
        </Stack>
      </Drawer>
    </>
  )
}

export default Categories
