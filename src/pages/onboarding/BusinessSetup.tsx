import {Center, Grid, Image, Stack, Text} from '@mantine/core'
import logoWhite from '../../assets/images/gauge-logo-white.png'
import backgroundImage from '../../assets/images/onboarding.svg'
import backgroundImageCompleted from '../../assets/images/finally.svg'
import ComponentsSetup from './components/ComponentsSetup';
import {  useEffect, useState } from 'react';
import DetailsSetup from './components/DetailsSetup';
import LocationSetup from './components/LocationSetup';
import Completed from './components/Completed';
import { defaultBusiness } from '../../requests/_businessRequests';
import { BusinessModel } from '../../requests/models/_business';
import useDocumentTitle from '../../hooks/use-document-title'
import LogoHeader from "../../components/LogoHeader.tsx";

const ONBOARDING_STAGE = 'onboarding-stage';
let onstage = 'details-setup';
const localStorageValue = localStorage.getItem(ONBOARDING_STAGE);
if (localStorageValue) {
  onstage = localStorageValue
}
else {
  localStorage.setItem(ONBOARDING_STAGE,onstage);
}
const onboarding_stage: string = onstage

const BusinessSetup = () => {

  const [currentStage, setCurrentStage] = useState(onboarding_stage);
  const [business, setBusiness] = useState<BusinessModel|undefined>();
  
  useDocumentTitle("On-Boarding")

  useEffect(() => {

    const getBusinessResponse = async()=> {
      const response = await defaultBusiness()
      setBusiness(response.data);
    }
    
    getBusinessResponse()

  },[])
  
  return (
    <>
      <Grid gutter="xs" style={{height:'100vh'}}>

        {/* Left Side */}
        <Grid.Col visibleFrom={'md'} p={40} span={{base: 12, md: 4, lg: 4}}  bg={"gauge-primary.8"}>
        {/* <Grid.Col p={40} span={{base: 12, md: 4, lg: 4}}  bg={"var(--mantine-color-blue-7)"}> */}

          <Stack
            h={"100%"}
            bg={"gauge-primary.8"}
            align="center"
            justify="space-between"
            gap="md"
          >

            <Stack style={{textAlign:'left'}}>
              <Image src={logoWhite} height={"50px"} />
            </Stack>

            <Stack visibleFrom='md'>
              {(currentStage === "business-complete")?(
                <>
                <Text style={{fontSize:"2em"}} c={"white"} tt={"none"} lh={'xs'} fw={600}>
                    CONGRATUALTIONS!
                  </Text>
                    
                  <Text c={"white"} tt={"none"} lh={'xs'}>
                    Your Business profile is ready. <br />We are excited to see your Business grow bigger.
                  </Text>
                </>
              ):(
                <>
                  <Text style={{fontSize:"2.5em"}} c={"white"} tt={"none"} lh={'xs'} fw={600}>
                    A few clicks more 
                  </Text>
                    
                  <Text c={"white"} tt={"none"} lh={'xs'}>
                    Create your business profile and get started with making your operations seamless.
                  </Text>
                </>
              )}
              
            </Stack>
            
            <Stack  visibleFrom='md'>
            {(currentStage === "business-complete")?
              <Image src={backgroundImageCompleted} /> :
              <Image src={backgroundImage} />
            }
            </Stack>

          </Stack>

        </Grid.Col>

        {/* Right Side */}
        <Grid.Col
        pl={{base: 30, xs: 30, sm: 60, md:80, lg: 120}} 
        pr={{base: 30, xs: 30, sm: 60, md:80, lg: 120}} 
        span={{base: 12, md: 8, lg: 8}} 
        style={{height:'100vh'}}
        >

          <Stack
          h={{base: '100vh', xs:'100vh', sm: '80vh', md:'100vh', lg: '100vh'}}
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="center"
            gap="md">
            <Center mb={30} hiddenFrom={'md'}>
              <LogoHeader  />
            </Center>

            {
              
              currentStage === 'details-setup' && (
                <DetailsSetup setCurrentStage={setCurrentStage} business={business} setBusiness={setBusiness}/>
              )
            }

            {
              currentStage === 'components' && (
                <ComponentsSetup setCurrentStage={setCurrentStage} business={business} setBusiness={setBusiness}/>
              )
            }

            {
              currentStage === 'location' && (
                <LocationSetup setCurrentStage={setCurrentStage} business={business} setBusiness={setBusiness}/>
              )
            }

            {
              currentStage === 'business-complete' && (
                <Completed setCurrentStage={setCurrentStage} business={business} setBusiness={setBusiness} />
              )
            }
            
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default BusinessSetup
