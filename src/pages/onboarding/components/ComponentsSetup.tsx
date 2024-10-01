import { Button, Select, Skeleton, Stack, Text, rem } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';
import { defaultBusiness, updateBusinessComponents } from '../../../requests/_businessRequests';
import { notify } from '../../../requests/general/toast';
import { BusinessModel } from '../../../requests/models/_business';
import { AxiosError } from 'axios';
const API_URL = import.meta.env.VITE_APP_API_URL;
const ONBOARDING_STAGE = 'onboarding-stage';

const GET_OPTIONS_URL = `${API_URL}/get-options?option_type=`;

const ComponentsSetup = ({setCurrentStage, business, setBusiness}:
  {setCurrentStage: React.Dispatch<React.SetStateAction<string>>, 
    business: BusinessModel|undefined, 
    setBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
  }) => {
  const [businessTypes, setBusinessTypes] = useState<string[]|undefined>([])
  const [businessSizes, setBusinessSizes] = useState<string[]|undefined>([])
  const [businessIndustries, setBusinessIndustries] = useState<string[]|undefined>([])
  const [loading, setLoading] = useState(false)
  const [preparingData, setPreparingData] = useState(false)


  useEffect(() => {

    setPreparingData(true)

    const getBusinessOptions = async() => {
      const response = await fetch(`${GET_OPTIONS_URL}business_type`)
      const businessType = await response.json()


      const responseSize = await fetch(`${GET_OPTIONS_URL}business_size`)
      const businessSize = await responseSize.json()

      const responseIndustry = await fetch(`${GET_OPTIONS_URL}business_industry`)
      const businessIndustry = await responseIndustry.json()

      setBusinessTypes(businessType)
      setBusinessSizes(businessSize)
      setBusinessIndustries(businessIndustry)
    }

    getBusinessOptions()

    setPreparingData(false)
    
  },[])

  const businessComponentForm = useForm({
    mode: 'controlled',
    initialValues: {
      business_type: business?.business_type,
      business_industry: business?.industry,
      business_size: business?.business_size,
    },
    validate: {
      business_type: (value) => {
        if (value === undefined) {
          return 'Invalid Business Type'
        }
        else if (businessTypes) {
          return businessTypes.includes(value)? null : 'Invalid Business Type';
        }
      },
      business_industry: (value) => {
        if (value === undefined) {
          return 'Invalid Business Type'
        }
        else if (businessIndustries) {
          return businessIndustries.includes(value)? null : 'Invalid Business Industry';
        }
      },
      business_size: (value) => {
        if (value === undefined) {
          return 'Invalid Business Size'
        }
        else if (businessSizes) {
          return businessSizes.includes(value)? null : 'Invalid Business Size';
        }
      }
    },
  });

  const businessComponentFormSubmit = async (values: typeof businessComponentForm.values) => {
    
    setLoading(true)
    
    if(!business) {
      notify({
        type:'error',
        message: "Failed to load business details",
        title: 'Error creating business'
      })
      setLoading(false)
      return
    }
    
    try {
      const sendData = await updateBusinessComponents({
        business_type: values.business_type,
        business_size: values.business_size,
        industry: values.business_industry,
        id: business.id,
      })
      if (sendData.data.error) {
        notify({
          type:'error',
          message: sendData.data.error,
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

        setCurrentStage('location')
        localStorage.setItem(ONBOARDING_STAGE,'location')
        window.location.href = "/business-setup";
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

    setLoading(false)
    
  }
  
  return (
    <>
      <Text size={rem('30')} tt={"none"} lh={'xs'} fw={600}>
        Choose Industry, Type & Size of your Business 
      </Text>
      <Text tt={"none"} c={'dimmed'} lh={'xs'}>
        Let us know the components of your business to help you unlock 
        future functionalities and modules tailored for you.
      </Text>
      <Stack mt={rem(15)}>

        {preparingData?(
          <>
            <Skeleton height={45} mt={10} radius="md" />
            <Skeleton height={45} mt={10} radius="md" />
            <Skeleton height={45} mt={10} radius="md" />
            <Stack align="flex-end">
              <Skeleton height={45} width="100px" mt={10} radius="md" />
            </Stack>
          </>
        ):(
          <form onSubmit={businessComponentForm.onSubmit(businessComponentFormSubmit)}>
          <Stack>
            <Select mb={10} 
              {...businessComponentForm.getInputProps('business_industry')}
              required
              withAsterisk
              checkIconPosition="right"
              variant="filled"
              label="Which Industry is your business?"
              placeholder="Select Industry"
              // value={business?.industry}
              data={businessIndustries}
            />

            <Select mb={10}
              {...businessComponentForm.getInputProps('business_type')}
              required
              withAsterisk
              checkIconPosition="right"
              variant="filled"
              label="Which Type of business do you operate?"
              placeholder="Select Type"
              // value={business?.business_type}
              data={businessTypes}
            />

            <Select mb={10}
              {...businessComponentForm.getInputProps('business_size')} 
              required
              withAsterisk
              checkIconPosition="right"
              variant="filled"
              label="What is the size of your business?"
              placeholder="Select Size"
              // value={business?.business_size}
              data={businessSizes}
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

export default ComponentsSetup
