import { upperFirst } from '@mantine/hooks';
import { isEmail, useForm } from '@mantine/form';
import {
    TextInput,
    PasswordInput,
    Text,
    Group,
    Button,
    Anchor,
    Stack,
    LoadingOverlay,
    Checkbox,
    Center,
    rem,
} from '@mantine/core';
import { useState } from 'react';
import { useAuth } from '../auth/core/Auth';
import { getUserByToken, login } from '../auth/core/_requests';
import { IconAt, IconLock} from '@tabler/icons-react';
import { notify } from '../requests/general/toast';
import useDocumentTitle from '../hooks/use-document-title'
import { AxiosError } from 'axios';
import LogoHeader from '../components/LogoHeader';
// import { AxiosError } from 'axios';

const Login = () => {

    const [loading, setLoading] = useState(false)
    const {saveAuth, setCurrentUser} = useAuth()
    useDocumentTitle("Login")

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
        email: '',
        password: '',
        terms: true,
        },

        validate:  {
            email: isEmail("Invalid email address"),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });
    
    const handleSubmit = async(values: typeof form.values) => {

        setLoading(true);

        try {
            const {data: auth} = await login(values.email, values.password)
            
            saveAuth(auth)
            const user = await getUserByToken(auth.api_token)            
            setCurrentUser(user)
            
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

            saveAuth(undefined)
            
            setLoading(false)
          }
          
        setLoading(false);
      };
      const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
      const lock = <IconLock style={{ width: rem(16), height: rem(16) }} />;

    return (
        <Stack pb={50} >

            
        {/*<Paper radius="md" shadow='none'*/}
        {/*       // bg={rgba("255,255,255",0.6)}*/}
        {/*       // bg={rgba("255,255,255",0.6)}*/}
        {/*       maw={400} miw={400} p="xl" m="xl"*/}
        {/*       mt={'sm'} withBorder={false} {...props}>*/}

            <div style={{minWidth:'350px'}}>
            <Center mb={30}>
                <LogoHeader  />
            </Center>

            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 1 }}
                loaderProps={{ color: 'blue', type: 'bars' }}
            />

            {/*<Text style={{fontSize:'2rem'}} mb={10} fw={500} ta="center">*/}
            {/*    Welcome!*/}
            {/*</Text>*/}

            <Text size="sm" fw={300} c={'gray'} mb={10} ta="center">
                Provide your account credentials
            </Text>
                
            <form onSubmit={form.onSubmit(handleSubmit)} method='POST'>
                <Stack>

                <TextInput
                    leftSectionPointerEvents="none"
                    leftSection={icon}
                    required
                    size='md'
                    placeholder="Email Address"
                    value={form.values.email}
                    {...form.getInputProps('email')}
                    radius="md"
                />

                <PasswordInput
                    leftSectionPointerEvents="none"
                    leftSection={lock}
                    required
                    autoComplete='off'
                    size='md'
                    mt={10}
                    placeholder="Password"
                    value={form.values.password}
                    radius="md"
                    {...form.getInputProps('password')}
                />
                </Stack>
                <Group justify="flex-end" grow mt="md">
                <Checkbox label="Keep me logged in" mt="sm" size="sm" />
                    <Anchor ta={'right'} size='sm' mt="sm" href="/forgot-password" title='Forgot Password'>
                        Forgot Password?
                    </Anchor>
                </Group>
                   
                <Button type="submit" fullWidth mt="sm" size="lg" loading={loading}>
                    {upperFirst("Login")}
                </Button>

                <Center mt="lg">
                    <Anchor size='sm' href="/register" title='Already have an account? Login'>
                        Don't have an account? Register
                    </Anchor>
                </Center>
            </form>
        {/*</Paper>*/}
        {/* </Container> */}
            </div>
        </Stack>
    )
}

export default Login