import { Alert, Button, Grid, LoadingOverlay, Select, Text, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';
import { IconArrowRight, IconInfoCircle, IconPencil, IconPencilCancel } from '@tabler/icons-react';
import { defaultBusiness, updateBusinessOtherInformation } from '../../../requests/_businessRequests';
import { notify } from '../../../requests/general/toast';
import { BusinessModel } from '../../../requests/models/_business';
import { AxiosError } from 'axios';
import PaperCard from '../../../components/PaperCard';
import PaperCardHeader from '../../../components/PaperCardHeader';
import PaperCardBody from '../../../components/PaperCardBody';
const API_URL = import.meta.env.VITE_APP_API_URL;

const GET_OPTIONS_URL = `${API_URL}/get-options?option_type=`;

const BusinessOthersInfo = ({currentBusiness, setCurrentBusiness}:
  {
    currentBusiness: BusinessModel, 
    setCurrentBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
  }) => {
  const [businessLanguages, setBusinessLanguages] = useState()
  const [formloading, setFormloading] = useState(false)
  const [enableDetails, setEnableDetails] = useState(true);

  useEffect(() => {

    const getBusinessOptions = async() => {
      const responseLanguage = await fetch(`${GET_OPTIONS_URL}language`)
      const businessLanguage = await responseLanguage.json()

      setBusinessLanguages(businessLanguage)
    }

    getBusinessOptions()
    
  },[])

  const enableLocationForm = () => {
    setEnableDetails((p) => { return !p})
    // businessLocationForm.reset();
    
  }
  const schema = yup.object().shape({
    website: yup.string().nullable().transform((curr,orig)=>(orig === ""?null:curr)).min(5, 'Website should have at least 5 letters'),
    contact: yup.string().nullable().transform((curr,orig)=>(orig === ""?null:curr)).min(10, 'Contact should have at least 10 characters'),
    language: yup.string().required().min(3, 'Language should have at least 3 letters'),
    tax_identification_number: yup.string().nullable().transform((curr,orig)=>(orig === ""?null:curr)).min(5, 'Tax should have at least 5 letters'),
    address: yup.string().nullable().transform((curr,orig)=>(orig === ""?null:curr)).min(5, 'Address should have at least 5 letters'),
  });

  const businessLocationForm = useForm({
    initialValues: {
      language: currentBusiness?.language?currentBusiness.language:'',
      contact: currentBusiness?.contact?currentBusiness.contact:'',
      website: currentBusiness?.website?currentBusiness.website:'',
      address: currentBusiness?.address?currentBusiness.address:'',
      tax_identification_number: currentBusiness?.tax_identification_number?currentBusiness.tax_identification_number:'',
    },
    validate: yupResolver(schema)
  });

  const businessOthersFormSubmit = async (values: typeof businessLocationForm.values) => {
    
    setFormloading(true)
    
    try {
      const sendData = await updateBusinessOtherInformation({
        language: values.language,
        website: values.website,
        address: values.address,
        contact: values.contact,
        tax_identification_number: values.tax_identification_number,
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
          <Text>Other Business Information </Text>
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
    
          <form onSubmit={businessLocationForm.onSubmit(businessOthersFormSubmit)} method='POST'>

            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

              {/* Language */}
              <Grid.Col pt={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
                <Select
                  {...businessLocationForm.getInputProps('language')}
                  key={businessLocationForm.key('language')}
                  radius={"md"}
                  // leftSection={<IconGlobe style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  checkIconPosition="right"
                  //c={'dimmed'}
                  required
                  disabled={enableDetails}
                  withAsterisk
                  // defaultValue={currentBusiness?.language?currentBusiness.language:''}
                  label="Language"
                  placeholder="Pick one"
                  data={businessLanguages}
                  searchable
                />
              </Grid.Col>

              {/* Contact */}
              <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
                <TextInput 
                  {...businessLocationForm.getInputProps('contact')}
                  key={businessLocationForm.key('contact')}
                  radius={"md"}
                  type={'number'}
                  // leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  //c={'dimmed'}
                  disabled={enableDetails}
                  label="Contact Number"
                  // required
                  // withAsterisk
                  // description="Input description"
                  placeholder="+2332000000"
                />
              </Grid.Col>

              {/* Tax*/}
              <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
              <TextInput 
                  {...businessLocationForm.getInputProps('tax_identification_number')}
                  key={businessLocationForm.key('tax_identification_number')}
                  radius={"md"}
                  // leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  //c={'dimmed'}
                  disabled={enableDetails}
                  label="Tax ID No."
                  // required
                  // withAsterisk
                  // description="Input description"
                  placeholder="Tax ID No."
                />
              </Grid.Col>

              {/* Website*/}
              <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
              <TextInput 
                  {...businessLocationForm.getInputProps('website')}
                  key={businessLocationForm.key('website')}
                  radius={"md"}
                  // leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  //c={'dimmed'}
                  disabled={enableDetails}
                  label="Website"
                  // required
                  // withAsterisk
                  // description="Input description"
                  placeholder="Website"
                />
              </Grid.Col>


              {/* Address*/}
              <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 8, lg: 8 }}>
              <TextInput 
                  {...businessLocationForm.getInputProps('address')}
                  key={businessLocationForm.key('address')}
                  radius={"md"}
                  // leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  //c={'dimmed'}
                  disabled={enableDetails}
                  label="Address"
                  // required
                  // withAsterisk
                  // description="Input description"
                  placeholder="Address"
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

export default BusinessOthersInfo
