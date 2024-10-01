import { hasLength, useForm } from "@mantine/form";
import { useState } from "react";
import { IconBan, IconKey, } from "@tabler/icons-react";
import { Button, Grid, Group, LoadingOverlay, PasswordInput, Text, rem } from "@mantine/core";
import { notify } from "../../../requests/general/toast";
import { updatePassword } from "../../../requests/profile/_requests";
import { AxiosError } from "axios";

const UpdatePassword = () => {

  const [passwordFormloading, setPasswordFormloading] = useState(false);
  const [enableChangePassword, setEnableChangePassword] = useState(true);

    const updatePasswordForm = useForm({
        initialValues: {
          current_password: "",
          password: "",
          password_confirmation: "",
        },
        validate: {
          current_password: hasLength({min: 6},'Password must be at least 6 characters'),
          password: hasLength({min: 6},'Password must be at least 6 characters'),
          password_confirmation: (value, values) => value !== values.password ? 'Passwords does not match' : null,
        },
      });
    
      const enablePasswordForm = () => {
        setEnableChangePassword((c) => { return !c})
        updatePasswordForm.reset();
        
      }
    
      const handlePasswordSubmit = async(values: typeof updatePasswordForm.values) => {
    
        setPasswordFormloading(true);

        try{
          const response = await updatePassword(values)
          
          if(response.data.saved) {
            notify({
              type:'success',
              message: 'Your security should be hard to break down',
              title: 'Password Updated'
            })

            setEnableChangePassword((c) => { return !c})   
          }
    
          console.log(response.data)
          
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
        
        setPasswordFormloading(false);
      }

  return (
    <>
      <LoadingOverlay
          visible={passwordFormloading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 1 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
      />

      {enableChangePassword ? (
      <Group justify="space-between" style={{width: "100%"}}>
        <Text mt={5} fw={500} size="md">
          Password <br />
          <Text component="span" mt={7} fw={500} c={"dimmed"} size="sm">
            **********
          </Text>
        </Text>
        
        <Button variant="light" onClick={enablePasswordForm}>Reset Password</Button>
        </Group>
      ):(
        <form style={{width:'100%'}} onSubmit={updatePasswordForm.onSubmit(handlePasswordSubmit)} method='POST'>

          <Grid mt={15} gutter={{ base: 5, xs: 'sm', md: 'sm', xl: 'md' }}>

            {/* Cuurent Password */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
              <PasswordInput
                {...updatePasswordForm.getInputProps('current_password')}
                key={updatePasswordForm.key('current_password')}
                radius={"md"}
                leftSection={<IconKey style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                label="Current Password"
                required
                withAsterisk
                placeholder="**********"
              />
            </Grid.Col>

            {/* New Password */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6,  md: 4, lg: 4 }}>
              <PasswordInput
                {...updatePasswordForm.getInputProps('password')}
                key={updatePasswordForm.key('password')}
                radius={"md"}
                leftSection={<IconKey style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                label="New Password"
                required
                withAsterisk
                placeholder="**********"
              />
            </Grid.Col>

            {/* Password Confirmation */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
              <PasswordInput
                {...updatePasswordForm.getInputProps('password_confirmation')}
                key={updatePasswordForm.key('password_confirmation')}
                radius={"md"}
                leftSection={<IconKey style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                label="Confirm Password"
                required
                withAsterisk
                placeholder="**********"
              />
            </Grid.Col>

            <Grid.Col pt={10}>
              <Group justify="space-between" wrap="wrap">
                <Button type="submit"
                  px={40}
                  variant="filled">
                  Change Password
                </Button>

                <Button onClick={enablePasswordForm}
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

export default UpdatePassword
