import { Anchor, Button, Center, LoadingOverlay, Stack, Text, TextInput, rem } from '@mantine/core'
import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks'
import { useState } from 'react'
import { sendResetPasswordCode } from '../auth/core/_requests';
import { useNavigate } from 'react-router-dom';
import { IconAt } from '@tabler/icons-react';
import { notify } from '../requests/general/toast';
import useDocumentTitle from '../hooks/use-document-title'
import { AxiosError } from 'axios';
import LogoHeader from '../components/LogoHeader';



const ForgotPassword = () => {
    useDocumentTitle("Forgot Password")

    const navigate = useNavigate();
    
    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            email: '',
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
        },
    });

    const [loading, setLoading] = useState(false)
    

    const handleSubmit = async(values: typeof form.values) => {
        setLoading(true);
        
        try {
            const response = await sendResetPasswordCode(values.email)  

            if (response.data.result) {
                notify({
                    title: 'Request Successful',
                    message: "We have sent you a verification code to your email address",
                    type: 'success',
                })
                
                navigate("/reset-password",{state:{email:values.email}});
            }

            setLoading(false)
            
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
    const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;

  return (
    <Stack pb={50}>
        <div style={{minWidth: '350px'}}>
            <Center mb={30}>
                <LogoHeader/>
            </Center>
            {/*<Paper radius="md" maw={400} p="xl" mt={'sm'} m="xl" withBorder {...props}>*/}
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 1 }}
                loaderProps={{ color: 'blue', type: 'bars' }}
            />
            <Stack>
                <Text style={{fontSize:"2em"}} fw={600} mb={7} ta="center">
                    Forgot Password
                </Text>

                <Text size="sm" fw={300} c={'gray'} mb={10} ta="center">
                Provide the your email address and
                receive a confirmation code.
                </Text>
            </Stack>

            <form onSubmit={form.onSubmit(handleSubmit)} method='POST'>
                <Stack mb={30} mt={20}>
                    <TextInput
                        leftSectionPointerEvents="none"
                        leftSection={icon}
                        size='md'
                        type='email'
                        required
                        placeholder="Email Address"
                        value={form.values.email}
                        {...form.getInputProps('email')}
                        radius="md"
                    />
                </Stack>

                <Button type="submit" fullWidth mt="sm" size="lg" loading={loading}>
                    {upperFirst("Submit")}
                </Button>

                <Center mt="sm">
                    <Anchor size='sm' href="/login" title='Return to Login'>
                        Return to Login
                    </Anchor>
                </Center>
                
            </form>
        {/*</Paper>*/}
        </div>
    </Stack>
  )
}

export default ForgotPassword
