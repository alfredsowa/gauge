import { Button, Skeleton, Stack, Text, TextInput, rem } from '@mantine/core'
import { useState } from 'react'
import * as yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';
import { createBusiness, defaultBusiness } from '../../../requests/_businessRequests';
import { notify } from '../../../requests/general/toast';
import { BusinessModel } from '../../../requests/models/_business';
import { AxiosError } from 'axios';

const ONBOARDING_STAGE = 'onboarding-stage';

const DetailsSetup = ({setCurrentStage, business, setBusiness}:
  {setCurrentStage: React.Dispatch<React.SetStateAction<string>>, 
    business: BusinessModel|undefined, 
    setBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
  }) => {

  const [loading, setLoading] = useState(false)
  const preparingData = false 

  const schema = yup.object().shape({
    name: yup.string()
      .required('Name is required')
      .min(2, 'Name should have at least 2 letters'),
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email'),
  });

  const businessComponentForm = useForm({
    mode: "controlled",
    initialValues: {
      // id: business?.id,
      name: "",
      email: "",
    },
    validate: yupResolver(schema)
  });

  const businessComponentFormSubmit = async (values: typeof businessComponentForm.values) => {
    
    setLoading(true)

    try {
      const sendData = await createBusiness({
        name: values.name,
        email: values.email,
        id: business?.id,
      })
      if (sendData.data.error) {
        notify({
          type:'error',
          message: sendData.data.error+" Please reload the page and try again.",
          title: 'Error creating business'
        })
    
        setLoading(false)
      }else {

        notify({
          type:'success',
          message: "Business details have been saved successfully",
          title: 'Successful'
        })

        const response = await defaultBusiness()            
        setBusiness(response.data)

        setCurrentStage('components')
        localStorage.setItem(ONBOARDING_STAGE,'components')
      }
    } catch(error) {
      if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
        notify({
          type:'error',
          message: error.response?.data.error+" Please reload the page and try again.", // Use optional chaining to access data property
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
  
    setLoading(false)

  }
  
  return (
    <>
      <Text size={rem('30')} tt={"none"} lh={'xs'} fw={600}>
        Welcome to your Business Setup 
      </Text>
      <Text tt={"none"} c={'dimmed'} lh={'xs'}>
        Information provided here must be accurate in accordance to your business certificate. 
        <br />With time, all information provided are verified to maintain the integrity on the platform.
      </Text>
      <Stack mt={rem(15)}>

        {preparingData?(
          <>
            <Skeleton height={45} mt={10} radius="md" />
            <Skeleton height={45} mt={10} radius="md" />
            <Stack align="flex-end">
              <Skeleton height={45} width="100px" mt={10} radius="md" />
            </Stack>
          </>
        ):(
          <form onSubmit={businessComponentForm.onSubmit(businessComponentFormSubmit)} method='POST'>
          <Stack>
            {/* <TextInput 
              {...businessComponentForm.getInputProps('id')}
              key={businessComponentForm.key('id')}
              type='hidden' 
              defaultValue={business?.id} 
              /> */}
            <TextInput 
              {...businessComponentForm.getInputProps('name')}
              key={businessComponentForm.key('name')}
              // defaultValue={business?.name}
              mb={10}
              required
              withAsterisk
              variant="filled"
              label="What is the name of your business?"
              placeholder="Business Name"
            />

            <TextInput mb={10}
              {...businessComponentForm.getInputProps('email')}
              key={businessComponentForm.key('email')}
              type='email'
              // defaultValue={business?.email}
              required
              withAsterisk
              variant="filled"
              label="What is your business email?"
              placeholder="Business Email"
            />

            <div style={{textAlign:'right', marginTop:'30px'}}>
              <Button
                loading={loading}
                type='submit'
                variant="filled"
                rightSection={<IconArrowRight size={14} />}
              >
                Go to Next
              </Button>
            </div>
          </Stack>
        </form>
        )}
        
      </Stack>
    </>
  )
}

export default DetailsSetup
