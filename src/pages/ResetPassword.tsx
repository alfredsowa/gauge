import { Anchor, Button, Center, Group, LoadingOverlay, PasswordInput, PinInput, Stack, Text, rem } from '@mantine/core'
import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks'
import { useState } from 'react'
import { comfirmNewPassword, sendResetPasswordCode } from '../auth/core/_requests';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { IconLock} from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { notify } from '../requests/general/toast';
import LogoHeader from '../components/LogoHeader';

const codeLimit = import.meta.env.VITE_APP_CODE_GENERATION_LIMIT

const ResetPassword = () => {

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            code: '',
            password: '',
            password_confirmation: '',
        },
        validate: {
            code: (val) => (val.length >= Number(codeLimit)) ? null : 'Code must be at least 6 characters',
            password: (val) => (val.length <= 5 ? 'Password should include at least 6 characters' : null),
            password_confirmation: (value, values) => value !== values.password ? 'Passwords does not match' : null,
        },
    });

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const location = useLocation();
    
    if(!location.state.email) {
        return <Navigate to="/forgot-password" />
    }
    const subjectEmail: string = location.state.email;

    const resendCode = async () => {
        try {
            setLoading(true)
            const response = await sendResetPasswordCode(subjectEmail)  
            if(response.data.result) {
                notify({
                    title: "Confirmation Code Sent",
                    message: "A confirmation code has been sent to the account email",
                    type:'success',
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
        }
        setLoading(false)
    }
    
    const handleSubmit = async(values: typeof form.values) => {
        setLoading(true);
        
        try {
            const response = await comfirmNewPassword(subjectEmail, values.code, values.password, values.password_confirmation)  
            
            if(response.data.result) {
                notify({
                    title: 'Successful',
                    message: "You are clear to login",
                    type:'success',
                })
                navigate("/password-confirmed",{state:{previous:"resetPassword"}});
                // return <Navigate to='/password-confirmed' replace={true} />
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
            setLoading(false)
        }
    }
    const icon = <IconLock style={{ width: rem(16), height: rem(16) }} />;

  return (
    <Stack pb={50}>
        {/* <Center>
            {responseMessage}
        </Center> */}

        <div style={{minWidth: '350px'}}>
            <Center mb={30}>
                <LogoHeader />
            </Center>
        {/*<Paper radius="md" maw={400} p="xl" mt={'sm'} m="xl" withBorder>*/}
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: 'blue', type: 'bars' }}
        />
        <Stack>
            <Text style={{fontSize:"2em"}} fw={600} mb={1} ta="center">
                Reset Password
            </Text>

            <Text size="sm" fw={300} c={'gray'} mb={10} ta="center">
                Enter the confirmation code set to <br/><Text component={"span"} fw={500}>{subjectEmail}</Text>.
            </Text>
        </Stack>

            <form onSubmit={form.onSubmit(handleSubmit)} method='POST'>
                <Stack mb={30} mt={20}>
                    <PinInput 
                    autoCorrect='off'
                        size="xl" mb={15}
                        length={Number(codeLimit)}
                        value={form.values.code}
                        placeholder="" 
                        {...form.getInputProps('code')}
                    />
                    <PasswordInput
                        leftSectionPointerEvents="none"
                        leftSection={icon}
                        required
                        autoComplete='off'
                        // label="Password"
                        size='md'
                        placeholder="Enter Password"
                        value={form.values.password}
                        radius="md"
                        {...form.getInputProps('password')}
                    />

                    <PasswordInput
                        leftSectionPointerEvents="none"
                        leftSection={icon}
                        required
                        autoComplete='off'
                        size='md'
                        // label="Confirm Password"
                        placeholder="Confirm Password"
                        value={form.values.password_confirmation}
                        {...form.getInputProps('password_confirmation')}
                        radius="md"
                    />
                </Stack>

                <Button type="submit" fullWidth mt="sm" size="lg" loading={loading}>
                    {upperFirst("Reset Password")}
                </Button>

                <Group justify="space-between" mt="sm">
                    <Anchor component="button" size='sm' onClick={resendCode} title='Return to Login'>
                        Resend Code
                    </Anchor>
                    <Anchor component={Link} size='sm' to="/login" title='Return to Login'>
                        Return to Login
                    </Anchor>
                </Group>
                
            </form>
        {/*</Paper>*/}
        </div>
    </Stack>
  )
}

export default ResetPassword
