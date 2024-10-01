import { Button, Select, Skeleton, Stack, Text, TextInput, rem } from '@mantine/core'
import { IconCircleCheckFilled } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { updateBusinessLocation } from '../../../requests/_businessRequests';
import { notify } from '../../../requests/general/toast';
import { BusinessModel } from '../../../requests/models/_business';
import { AxiosError } from 'axios';
const ONBOARDING_STAGE = 'onboarding-stage';
const GET_OPTIONS_URL = `${import.meta.env.VITE_APP_API_URL}/get-options?option_type=`;

const LocationSetup = ({setCurrentStage, business, setBusiness}:
  {setCurrentStage: React.Dispatch<React.SetStateAction<string>>, 
    business: BusinessModel|undefined, 
    setBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
  }) => {
    const [loading, setLoading] = useState(false)
    const [businessCountries, setBusinessCountries] = useState()
    const [businessCurrencies, setBusinessCurrencies] = useState()
    const [preparingData, setPreparingData] = useState(false)
    
    useEffect(() => {

        setPreparingData(true)
    
        const getBusinessOptions = async() => {

            const responseCurrency = await fetch(`${GET_OPTIONS_URL}currency`)
            const businessCurrency = await responseCurrency.json()

            const responseCountry = await fetch(`${GET_OPTIONS_URL}country`)
            const businessCountry = await responseCountry.json()

            setBusinessCountries(businessCountry)
            setBusinessCurrencies(businessCurrency)

        }

        getBusinessOptions()

        setPreparingData(false)

    },[])

    const schema = yup.object().shape({
        city: yup.string().required().min(2, 'City should have at least 2 letters'),
        country: yup.string().required().min(2, 'Country should have at least 2 letters'),
        currency: yup.string().required().min(2, 'Currency should have at least 2 letters'),
      });
    
      const businessComponentForm = useForm({
        mode: "uncontrolled",
        initialValues: {
          city: "",
          country: "",
          currency: "",
        },
        validate: yupResolver(schema)
      });

    const businessLocationFormSubmit = async (values: typeof businessComponentForm.values) => {
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
            const sendData = await updateBusinessLocation({
                country: values.country,
                city: values.city,
                currency: values.currency,
                id: business.id,
            })

          if (sendData.data.error) {
              notify({
              type:'error',
              message: sendData.data.error,
              title: 'Error updating'
              })
          
              setLoading(false)
              
          }else {

              notify({
              type:'success',
              message: "Business details have been saved successfully",
              title: 'Successful'
              })

              setBusiness(sendData.data)

              setCurrentStage('business-complete')
              localStorage.setItem(ONBOARDING_STAGE,'business-complete')
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
        Tell us where your business is located or operating from
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
          <form onSubmit={businessComponentForm.onSubmit(businessLocationFormSubmit)} method='POST'>
          <Stack>

            <Select mb={10} required
                data={businessCountries}
                {...businessComponentForm.getInputProps('country')}
                withAsterisk
                checkIconPosition="right"
                variant="filled"
                label="Which Country is your business located?"
                placeholder="Select Country"
            />
            <TextInput 
              {...businessComponentForm.getInputProps('city')}
              key={businessComponentForm.key('city')}
              mb={10}
              required
              withAsterisk
              variant="filled"
              label="What City is your business located?"
              placeholder="City"
            />

            <Select mb={10} required
                data={businessCurrencies}
                {...businessComponentForm.getInputProps('currency')}
                withAsterisk
                checkIconPosition="right"
                variant="filled"
                label="What is your primary Currency?"
                placeholder="Select Currency"
            />

            <div style={{textAlign:'right', marginTop:'30px'}}>
              <Button
                loading={loading}
                type='submit'
                variant="filled"
                rightSection={<IconCircleCheckFilled size={14} />}
              >
                Finish
              </Button>
            </div>
          </Stack>
        </form>
        )}
        
      </Stack>
    </>
  )
}

export default LocationSetup
