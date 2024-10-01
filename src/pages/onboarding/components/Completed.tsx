import { Button, Center, Image, Stack, Text, rem } from '@mantine/core'
import backgroundImageCompleted from '../../../assets/images/finally.svg'
import { updateBusinessCompleted } from '../../../requests/_businessRequests';
import { BusinessModel } from '../../../requests/models/_business';
import { notify } from '../../../requests/general/toast';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AxiosError } from 'axios';


const ONBOARDING_STAGE = 'onboarding-stage';

const Completed = ({business,setBusiness,setCurrentStage}:{business: BusinessModel|undefined,
  setBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
  setCurrentStage: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

    const goToDashboard = async() => {

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
        const completed = await updateBusinessCompleted({id: business.id})

        if (completed.data.error) {
          notify({
            type:'error',
            message: completed.data.error,
            title: 'Something went wrong starting the business. Please try again'
          })
      
          setLoading(false)
          
        }
        else {
  
          notify({
            type:'success',
            message: "You can visit your Business profile to add additional information",
            title: 'Completed'
            })
  
          setBusiness(completed.data)
  
          setCurrentStage('finished')
            
          localStorage.removeItem(ONBOARDING_STAGE)
          navigate("/dashboard", {
            replace: true
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
        setLoading(false);
      }
    }

  return (
    <>
      <Text size={rem('30')} tt={"none"} lh={'xs'} fw={600}>
        Welcome {business?.name} 
      </Text>
      <Text tt={"none"} c={'dimmed'} lh={'xs'}>
        You can now start using {import.meta.env.VITE_APP_NAME} to manage your Business. 
        We are excited to help you move your business towards its goals.
      </Text>
      <Button visibleFrom='md' onClick={goToDashboard} variant='filled' loading={loading}>
            Go to My Dashboard
        </Button>
      <Center>
        <Stack hiddenFrom='md' pt={40} pb={50} maw={400}>
          <Image src={backgroundImageCompleted}/>

          <Button onClick={goToDashboard} variant='filled' loading={loading}>
              Go to My Dashboard
          </Button>
        </Stack>
      </Center>
    </>
  )
}

export default Completed
