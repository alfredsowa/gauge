import { Anchor, Button, Center, Group, LoadingOverlay, PinInput, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks'
import { useState } from 'react'
import { AuthInit, useAuth } from '../auth/core/Auth';
import { resendVerifyToken, verifyEmail } from '../auth/core/_requests';
import {getAuth} from '../auth/core/AuthHelpers'
import { Navigate } from 'react-router-dom';
import { notify } from '../requests/general/toast';
import axios from 'axios';
import LogoHeader from '../components/LogoHeader';

const codeLimit = import.meta.env.VITE_APP_CODE_GENERATION_LIMIT
const ONBOARDING_STAGE = 'onboarding-stage';
let onstage = 'details-setup';
const localStorageValue = localStorage.getItem(ONBOARDING_STAGE);
if (localStorageValue) {
  onstage = localStorageValue
}
else {
  localStorage.setItem(ONBOARDING_STAGE,onstage);
}

const VerifyEmail = () => {
    
    const {currentUser,setCurrentUser,logout} = useAuth()
    
    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
        code: '',
        },
        validate: {
            code: (val) => (val.length < Number(codeLimit) || val.length > Number(codeLimit) ? `Verification code must ${codeLimit} characters` : null),
        },
    });

    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    
    const getAuthData = getAuth()

    const api_token = getAuthData?.api_token
            
    if (!currentUser || !api_token) {
        setCurrentUser(undefined)
    }

    const reSendCode = async () => {
        if (api_token) {
            setResending(true)
            const response = resendVerifyToken(api_token)
            const getResponse = (await response).data
            if(getResponse.sent) {
                notify({
                    title: 'Request Successful',
                    message: getResponse.message,
                    type: 'success',
                })
                setLoading(false)
            }
            setResending(false)
        } else {
            console.error('API token is not defined');
        }
    }

    const handleSubmit = async(values: typeof form.values) => {
        setLoading(true);
        
        if (api_token) {
            try {
                const response = await verifyEmail(api_token,values.code)  
                        
                setCurrentUser(response.data)
                notify({
                    title: 'Confirmation Successful',
                    message: "You have successfully verified your email address",
                    type:'success',
                })
                setLoading(false)

                window.location.href = "/dashboard";
                return <Navigate to="/dashboard" replace={true} />
                
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // Now you can access properties of the AxiosError type
                    if(error.response?.data.error) {
                        notify({
                            title: 'Error',
                            message: error.response.data.error,
                            type:'error',
                        })
                    }
                } else {
                    // Handle other types of errors
                    console.error(error);
                    notify({
                        title: 'Error',
                        message: 'Something went wrong',
                        type:'error',
                    })
                }

                setLoading(false)
            
            }
        }
    }

  return (
    <AuthInit>
        {(!currentUser || !api_token)?<Navigate to="/login" />:(currentUser.verified && currentUser.business_id === null)?(
            <Navigate to="/business-setup" replace={true} />
        ):null}
        <Center bg={'var(--mantine-color-default-hover)'} style={{height: "100vh", padding: "20vh 0"}}>
            <Stack>

                <div style={{minWidth: '350px'}}>
                    <Center mb={30}>
                        <LogoHeader />
                    </Center>

                    {/*<Paper radius="md" maw={400} p="xl" mt={'sm'} m="xl" withBorder {...props}>*/}

                    <LoadingOverlay
                        visible={loading||resending}
                        zIndex={1000}
                        overlayProps={{ radius: 'sm', blur: 1 }}
                        loaderProps={{ color: 'blue', type: 'bars' }}
                    />

                    <Text size="md" fw={300} c={'gray'} mb={10} ta="center">
                    Enter the verification code sent to your email inbox
                    </Text>

                    <form onSubmit={form.onSubmit(handleSubmit)} method='POST'>
                        <Stack mb={30}>

                            <PinInput 
                            radius={'md'}
                            size="xl" 
                            length={5} 
                            value={form.values.code}
                            placeholder="" 
                            {...form.getInputProps('code')}
                            />

                        </Stack>

                        <Group justify="space-between" mt="sm">
                            <Anchor component="button" fw={700} c="dimmed" type="button" onClick={reSendCode} size="sm">
                                Resend Code 
                            </Anchor>
                            <Anchor component="button" fw={700} c="red" type="button" onClick={logout} size="sm">
                                Logout
                            </Anchor>
                        </Group>

                        <Center>
                            <Button type="submit"  fullWidth mt="sm" size="md" loading={loading}>
                                {upperFirst('Verify')}
                            </Button>
                        </Center>
                        
                    </form>
                {/*</Paper>*/}
                </div>
            </Stack>
        </Center>
    </AuthInit>
  )
}

export default VerifyEmail
