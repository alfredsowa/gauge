import { useForm } from "@mantine/form";
import { useState } from "react";
import { api_token, personalDetails } from "../../../requests/profile/_requests";
import { getUserByToken } from "../../../auth/core/_requests";

import { IconArrowRight, IconGlobe, IconInfoCircle, IconPencil, IconPencilCancel, IconPhoneCall, IconUser} from "@tabler/icons-react";
import { Alert, Button, Grid, LoadingOverlay, Select, Text, TextInput, rem } from "@mantine/core";
import { UserModel } from "../../../auth/core/_models";
import {notify} from "../../../requests/general/toast.tsx";
import PaperCard from "../../../components/PaperCard.tsx";
import PaperCardHeader from "../../../components/PaperCardHeader.tsx";
import PaperCardBody from "../../../components/PaperCardBody.tsx";

const PersonalDetails = ({currentUser,setCurrentUser}:{currentUser:UserModel,setCurrentUser: React.Dispatch<React.SetStateAction<UserModel | undefined>>}) => {

  const [personalFormloading, setPersonalFormLoading] = useState(false);
  const [enablePersonal, setEnablePersonal] = useState(true);

    const personal = useForm({
        initialValues: {
          name: currentUser.name,
          firstname: currentUser.firstname,
          phone: currentUser.phone?currentUser.phone:'',
          country: currentUser.country?currentUser.country:'',
        },
        validate: {
          name: (value) => (value.length < 2 ? 'Surname is too small' : null),
          firstname: (value) => (value.length < 2 ? 'First name is too small' : null),
        },
      });
    
      const enablePersonalForm = () => {
        setEnablePersonal((p) => { return !p})
        personal.reset();
        
      }
    
      const handlePersonalSubmit = async(values: typeof personal.values) => {
    
        setPersonalFormLoading(true);
        try{
          const response = await personalDetails(values)
          
          if(response.data.saved) {
            const user = await getUserByToken(api_token)            
            setCurrentUser(user)
            notify({
              type:'success',
              message: 'Information updated',
              title: 'Successful'
            })
          }
    
        } catch(error) {
          console.log(error)
        }
        
        setPersonalFormLoading(false);
      }

  return (
      <PaperCard>
        <PaperCardHeader>
          <Text>Personal Details</Text>
          {(enablePersonal)?(
            <Button variant="light" size="sm" onClick={enablePersonalForm}
            leftSection={<IconPencil size={14} />}>Edit</Button>
          ):(
            <Button variant="light" color="red" size="sm" onClick={enablePersonalForm}
            leftSection={<IconPencilCancel size={14} />}>Cancel</Button>
          )}
        </PaperCardHeader>
        <PaperCardBody>
          <LoadingOverlay
            visible={personalFormloading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: 'blue', type: 'bars' }}
          />
          <Alert variant="light" mb={30} radius="md" 
          title="Click on the edit button above to enable the form below" icon={(<IconInfoCircle />)} />
    
          <form onSubmit={personal.onSubmit(handlePersonalSubmit)} method='POST'>

            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

              {/* Surname */}
              <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                <TextInput
                  {...personal.getInputProps('name')}
                  key={personal.key('name')}
                  radius={"md"}
                  leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  // c={'dimmed'}
                  disabled={enablePersonal}
                  label="Surname"
                  withAsterisk
                  required
                  placeholder="Surname"
                />
              </Grid.Col>

              {/* First Name */}
              <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                <TextInput
                  {...personal.getInputProps('firstname')}
                  key={personal.key('firstname')}
                  radius={"md"}
                  leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  // c={'dimmed'}
                  disabled={enablePersonal}
                  label="First Name"
                  required
                  withAsterisk
                  // description="Input description"
                  placeholder="Surname"
                />
              </Grid.Col>

              {/* Phone */}
              <Grid.Col pt={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                <TextInput
                  {...personal.getInputProps('phone')}
                  key={personal.key('phone')}
                  radius={"md"}
                  type="number"
                  variant="filled"
                  leftSection={<IconPhoneCall style={{ width: rem(16), height: rem(16) }} />}
                  // c={'dimmed'}
                  disabled={enablePersonal}
                  withAsterisk
                  required
                  label="Phone Number"
                  placeholder=""
                />
              </Grid.Col>

              {/* Country */}
              <Grid.Col pt={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                <Select
                  {...personal.getInputProps('country')}
                  key={personal.key('country')}
                  radius={"md"}
                  leftSection={<IconGlobe style={{ width: rem(16), height: rem(16) }} />}
                  variant="filled"
                  checkIconPosition="right"
                  // c={'dimmed'}
                  required
                  disabled={enablePersonal}
                  withAsterisk
                  defaultValue={currentUser.country}
                  label="Country"
                  placeholder="Pick one"
                  data={['Ghana', 'Other']}
                  searchable
                />
              </Grid.Col>
                
              <Grid.Col pt={10} span={{ base: 12, md: 6, lg: 6 }}>
                <Button  type="submit"
                  disabled={enablePersonal}
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
  )
}

export default PersonalDetails
