import { Alert, Button, Grid, LoadingOverlay, Select, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form';
import { IconArrowRight, IconInfoCircle, IconPencil, IconPencilCancel } from '@tabler/icons-react';
import { defaultBusiness, updateBusinessComponents } from '../../../requests/_businessRequests';
import { notify } from '../../../requests/general/toast';
import { BusinessModel } from '../../../requests/models/_business';
import { AxiosError } from 'axios';
import PaperCard from '../../../components/PaperCard';
import PaperCardHeader from '../../../components/PaperCardHeader';
import PaperCardBody from '../../../components/PaperCardBody';
const API_URL = import.meta.env.VITE_APP_API_URL;

const GET_OPTIONS_URL = `${API_URL}/get-options?option_type=`;

const BusinessIdentity = ({currentBusiness, setCurrentBusiness}:
  {
    currentBusiness: BusinessModel, 
    setCurrentBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
  }) => {
  const [businessTypes, setBusinessTypes] = useState<string[]|undefined>([])
  const [businessSizes, setBusinessSizes] = useState<string[]|undefined>([])
  const [businessIndustries, setBusinessIndustries] = useState<string[]|undefined>([])
  const [formloading, setFormloading] = useState(false)
  const [enableDetails, setEnableDetails] = useState(true);

  useEffect(() => {

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
    
  },[])

  const enableDetailsForm = () => {
    setEnableDetails((p) => { return !p})
    businessComponentForm.reset();
    
  }

  const businessComponentForm = useForm({
    initialValues: {
      business_type: currentBusiness?.business_type,
      business_industry: currentBusiness?.industry,
      business_size: currentBusiness?.business_size,
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
    
    setFormloading(true)
    
    try {
      const sendData = await updateBusinessComponents({
        business_type: values.business_type,
        business_size: values.business_size,
        industry: values.business_industry,
        id: currentBusiness.id,
      })
      if (sendData.data.error) {
        notify({
          type:'error',
          message: sendData.data.error,
          title: 'Error updating details'
        })
    
        setFormloading(false)
        
      }else {

        notify({
          type:'success',
          message: "Business details have been saved successfully",
          title: 'Successful'
        })

        const response = await defaultBusiness() 
             
        setCurrentBusiness(response.data)
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
          message: 'Please reload the page and try again.',
          title: 'Something went wrong'
        })
      }
    
      setFormloading(false)
    }

    setFormloading(false)
    
  }
  
  return (
    <>
      <PaperCard>
        <PaperCardHeader>
          <Text>Industry, Type and Size Information </Text>
                {(enableDetails)?(
                  <Button variant="filled" size="sm" onClick={enableDetailsForm}
                  leftSection={<IconPencil size={14} />}>Edit</Button>
                ):(
                  <Button variant="light" color="red" size="sm" onClick={enableDetailsForm}
                 leftSection={<IconPencilCancel size={14} />}>Cancel</Button>
                )}
        </PaperCardHeader>
        <PaperCardBody>
        <LoadingOverlay
                visible={formloading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 1 }}
                loaderProps={{ color: 'blue', type: 'bars' }}
            />
            <Alert variant="light" mb={30} radius="md" 
            title="Click on the edit button above to enable the form below" icon={(<IconInfoCircle />)} />
      
            <form onSubmit={businessComponentForm.onSubmit(businessComponentFormSubmit)} method='POST'>

              <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

                {/* Surname */}
                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                  <Select
                    {...businessComponentForm.getInputProps('business_industry')}
                    key={businessComponentForm.key('business_industry')}
                    radius={"md"}
                    // leftSection={<IconGlobe style={{ width: rem(16), height: rem(16) }} />}
                    variant="filled"
                    checkIconPosition="right"
                    //c={'dimmed'}
                    required
                    disabled={enableDetails}
                    withAsterisk
                    defaultValue={currentBusiness?.industry}
                    label="Industry"
                    placeholder="Pick one"
                    data={businessIndustries}
                    searchable
                  />
                </Grid.Col>

                {/* First Name */}
                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                    {...businessComponentForm.getInputProps('business_type')}
                    key={businessComponentForm.key('business_type')}
                    radius={"md"}
                    // leftSection={<IconGlobe style={{ width: rem(16), height: rem(16) }} />}
                    variant="filled"
                    checkIconPosition="right"
                    //c={'dimmed'}
                    required
                    disabled={enableDetails}
                    withAsterisk
                    defaultValue={currentBusiness?.business_type}
                    label="Business Type"
                    placeholder="Pick one"
                    data={businessTypes}
                    searchable
                  />
                </Grid.Col>

                {/* Country */}
                <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                  <Select
                    {...businessComponentForm.getInputProps('business_size')}
                    key={businessComponentForm.key('business_size')}
                    radius={"md"}
                    // leftSection={<IconGlobe style={{ width: rem(16), height: rem(16) }} />}
                    variant="filled"
                    checkIconPosition="right"
                    //c={'dimmed'}
                    required
                    disabled={enableDetails}
                    withAsterisk
                    defaultValue={currentBusiness?.business_size}
                    label="Business Size"
                    placeholder="Pick one"
                    data={businessSizes}
                    searchable
                  />
                </Grid.Col>
                  
                <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                  <Button  type="submit"
                    disabled={enableDetails}
                    px={40}
                    variant="filled"
                    rightSection={<IconArrowRight size={14} />}>
                    Save
                  </Button>
                </Grid.Col>
              </Grid>

            </form>
        </PaperCardBody>
      </PaperCard>
    </>
  )
}

export default BusinessIdentity
