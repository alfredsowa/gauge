import { Alert, Button, Grid, LoadingOverlay, Select, Text, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';
import { IconArrowRight, IconInfoCircle, IconPencil, IconPencilCancel } from '@tabler/icons-react';
import { defaultBusiness, updateBusinessLocation } from '../../../requests/_businessRequests';
import { notify } from '../../../requests/general/toast';
import { BusinessModel } from '../../../requests/models/_business';
import { AxiosError } from 'axios';
import PaperCard from '../../../components/PaperCard';
import PaperCardHeader from '../../../components/PaperCardHeader';
import PaperCardBody from '../../../components/PaperCardBody';
const API_URL = import.meta.env.VITE_APP_API_URL;

const GET_OPTIONS_URL = `${API_URL}/get-options?option_type=`;

const BusinessLocation = ({currentBusiness, setCurrentBusiness}:
  {
    currentBusiness: BusinessModel, 
    setCurrentBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
  }) => {
  const [businessCountries, setBusinessCountries] = useState()
  const [businessCurrencies, setBusinessCurrencies] = useState()
  const [formloading, setFormloading] = useState(false)
  const [enableDetails, setEnableDetails] = useState(true);

  useEffect(() => {

    const getBusinessOptions = async() => {
      const responseCurrency = await fetch(`${GET_OPTIONS_URL}currency`)
      const businessCurrency = await responseCurrency.json()

      const responseCountry = await fetch(`${GET_OPTIONS_URL}country`)
      const businessCountry = await responseCountry.json()

      setBusinessCountries(businessCountry)
      setBusinessCurrencies(businessCurrency)
    }

    getBusinessOptions()
    
  },[])

  const enableLocationForm = () => {
    setEnableDetails((p) => { return !p})
    businessLocationForm.reset();
    
  }
  const schema = yup.object().shape({
    city: yup.string().required().min(2, 'City should have at least 2 letters'),
    country: yup.string().required().min(2, 'Country should have at least 2 letters'),
    currency: yup.string().required().min(2, 'Currency should have at least 2 letters'),
  });

  const businessLocationForm = useForm({
    initialValues: {
      city: currentBusiness?.city,
      country: currentBusiness?.country,
      currency: currentBusiness?.currency,
    },
    validate: yupResolver(schema)
  });

  const businessLocationFormSubmit = async (values: typeof businessLocationForm.values) => {
    
    setFormloading(true)
    
    try {
      const sendData = await updateBusinessLocation({
        country: values.country,
        city: values.city,
        currency: values.currency,
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
          message: error.response?.data.error+" Please reload the page and try again.", // Use optional chaining to access data property
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
          <Text>Location and Currency </Text>
          {(enableDetails)?(
            <Button variant="filled" size="sm" onClick={enableLocationForm}
            leftSection={<IconPencil size={14} />}>Edit</Button>
          ):(
            <Button variant="light" color="red" size="sm" onClick={enableLocationForm}
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
    
          <form onSubmit={businessLocationForm.onSubmit(businessLocationFormSubmit)} method='POST'>

            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

              {/* Surname */}
              <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                  {...businessLocationForm.getInputProps('country')}
                  key={businessLocationForm.key('country')}
                  radius={"md"}
                  // leftSection={<IconGlobe style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  checkIconPosition="right"
                  //c={'dimmed'}
                  required
                  disabled={enableDetails}
                  withAsterisk
                  defaultValue={currentBusiness?.country}
                  label="Country"
                  placeholder="Pick one"
                  data={businessCountries}
                  searchable
                />
              </Grid.Col>

              {/* City Name */}
              <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <TextInput 
                  {...businessLocationForm.getInputProps('city')}
                  key={businessLocationForm.key('city')}
                  radius={"md"}
                  // leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  //c={'dimmed'}
                  disabled={enableDetails}
                  label="City"
                  required
                  withAsterisk
                  // description="Input description"
                  placeholder="City"
                />
              </Grid.Col>

              {/* Country */}
              <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                  {...businessLocationForm.getInputProps('currency')}
                  key={businessLocationForm.key('currency')}
                  radius={"md"}
                  // leftSection={<IconGlobe style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  checkIconPosition="right"
                  //c={'dimmed'}
                  required
                  disabled={enableDetails}
                  withAsterisk
                  defaultValue={currentBusiness?.currency}
                  label="Currency"
                  placeholder="Pick one"
                  data={businessCurrencies}
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

export default BusinessLocation
