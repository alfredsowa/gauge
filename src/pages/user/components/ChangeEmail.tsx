import { hasLength, isEmail, useForm } from "@mantine/form";
import { useState } from "react";
import { IconAt, IconBan, IconKey, } from "@tabler/icons-react";
import { Button, Grid, Group, LoadingOverlay, PasswordInput, Text, TextInput, rem } from "@mantine/core";
import { UserModel } from "../../../auth/core/_models";
import { api_token, changeEmailAddress } from "../../../requests/profile/_requests";
import { getUserByToken } from "../../../auth/core/_requests";
import { notify } from "../../../requests/general/toast";
import { AxiosError } from "axios";

const ChangeEmail = ({currentUser,setCurrentUser}:{currentUser:UserModel,setCurrentUser: React.Dispatch<React.SetStateAction<UserModel | undefined>>}) => {

  const [emailFormloading, setEmailFormLoading] = useState(false);
  const [enableChangeEmail, setEnableChangeEmail] = useState(true);

    const updateEmail = useForm({
        initialValues: {
          email: "",
          password: "",
        },
        validate: {
          email: isEmail('Invalid email'),
          password: hasLength({min: 6},'Password must be at least 6 characters'),
        },
      });
    
      const enableEmailForm = () => {
        setEnableChangeEmail((p) => { return !p})
        updateEmail.reset();
        
      }
    
      const handleEmailSubmit = async(values: typeof updateEmail.values) => {
    
        setEmailFormLoading(true);

        try{
          const response = await changeEmailAddress(values)
          
          if(response.data.saved) {
            notify({
              type:'success',
              message: 'A confirmation code has been sent to your email address.',
              title: 'Email Change Activated'
            })
            setEnableChangeEmail((p) => { return !p})
            const user = await getUserByToken(api_token)            
            setCurrentUser(user)
          }
    
        } catch(error) {
          if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
            notify({
              type:'error',
              message: error.response?.data.message, // Use optional chaining to access data property
              title: 'Something went wrong'
            })
          } else {
            notify({
              type:'error',
              message: 'An unexpected error occurred',
              title: 'Something went wrong'
            })
          }
        }
        
        setEmailFormLoading(false);
      }

  return (
    <>
    <LoadingOverlay
        visible={emailFormloading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
    />
      {enableChangeEmail ? (
        <Group justify="space-between" style={{width: "100%"}} >
          <Text mt={5} fw={500} size="md">
            Email Address <br />
            <Text component="span" mt={7} fw={500} c={"dimmed"} size="sm">
              {currentUser.email}
            </Text>
          </Text>
          <Button variant="light" onClick={enableEmailForm}>Change Email</Button>
      </Group>
      ):(
        <form style={{width:'100%'}} onSubmit={updateEmail.onSubmit(handleEmailSubmit)} method='POST'>

              <Grid mt={15} gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

                {/* Surname */}
                <Grid.Col pt={10} pb={10} span={{ base: 12, md: 6, lg: 6 }}>
                  <TextInput
                    {...updateEmail.getInputProps('email')}
                    key={updateEmail.key('email')}
                    radius={"md"}
                    leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
                    variant="filled"
                    // c={'dimmed'}
                    label="Email"
                    withAsterisk
                    required
                    placeholder="Email Address"
                  />
                </Grid.Col>

                {/* First Name */}
                <Grid.Col pt={10} pb={10} span={{ base: 12, md: 6, lg: 6 }}>
                  <PasswordInput
                    {...updateEmail.getInputProps('password')}
                    key={updateEmail.key('password')}
                    radius={"md"}
                    leftSection={<IconKey style={{ width: rem(16), height: rem(16) }} />}
                    variant="filled"
                    // c={'dimmed'}
                    label="Password"
                    required
                    withAsterisk
                    placeholder="Current Password"
                  />
                </Grid.Col>

                <Grid.Col pt={10}>
                  <Group justify="space-between" wrap="wrap">
                    <Button  type="submit"
                      px={40}
                      variant="filled"
                      // rightSection={<IconReplace size={14} />}
                      >
                      Confirm Update
                    </Button>
                    <Button onClick={enableEmailForm}
                      px={40}
                      color="red"
                      variant="light"
                      leftSection={<IconBan size={14} />}>
                      Cancel
                    </Button>
                  </Group>
                </Grid.Col>

                </Grid>

              </form>
      )}
    </>
  )
}

export default ChangeEmail
