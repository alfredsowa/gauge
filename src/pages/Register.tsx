import { upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
    TextInput,
    PasswordInput,
    Text,
    Group,
    Button,
    Checkbox,
    Anchor,
    Stack,
    Center, LoadingOverlay,
} from '@mantine/core';
import { useState } from 'react';
import { useAuth } from '../auth/core/Auth';
import { getUserByToken, register } from '../auth/core/_requests';
import { notify } from '../requests/general/toast';
import useDocumentTitle from '../hooks/use-document-title'
import { AxiosError } from 'axios';
import LogoHeader from '../components/LogoHeader';

// const {VITE_APP_NAME} = import.meta.env

const Register = () => {

    const [loading, setLoading] = useState(false)
    // const [status, setStatus] = useState("")
    const {saveAuth, setCurrentUser} = useAuth()
    useDocumentTitle("Register")

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
        email: '',
        name: '',
        firstname: '',
        password: '',
        password_confirmation: '',
        terms: true,
        },

        validate:  {
            name: (value) => (value.length < 2 ? 'Name is too small' : null),
            firstname: (value) => (value.length < 2 ? 'Name is too small' : null),
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 5 ? 'Password should include at least 6 characters' : null),
            password_confirmation: (value, values) => value !== values.password ? 'Passwords does not match' : null,
        },
    });
    
    const handleSubmit = async(values: typeof form.values) => {

        setLoading(true);

        try {
            // let authInfo = null
            
            const {data: auth} = await register(values.name, values.firstname,values.email, values.password, values.password_confirmation)
            // auth = auth;

            if (auth.error) {
                notify({
                    title: 'Error',
                    message: auth.error.response.data.error,
                    type: 'error',
                })
                
                setLoading(false)
                return;
            } 
            
            saveAuth(auth)
            const user = await getUserByToken(auth.api_token)
            setCurrentUser(user)
            notify({
                title: 'Successful',
                message: 'You have been successfully registered.',
                type:'success',
            })
            
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

    return (
        <Stack pb={50} pt={50}>
            <div style={{minWidth: '350px'}}>
                <Center mb={30}>
                    <LogoHeader/>
                </Center>
                {/*<Paper radius="md" w={400} p="xl" mt={'sm'} m="xl" withBorder {...props}>*/}
                    <LoadingOverlay
                        visible={loading}
                        zIndex={1000}
                        overlayProps={{ radius: 'sm', blur: 1 }}
                        loaderProps={{ color: 'blue', type: 'bars' }}
                    />
                <Text size="lg" mb={30} fw={500} ta="center">
                    Explore limitless possibilities for Free
                </Text>

                <form onSubmit={form.onSubmit(handleSubmit)} method='POST'>
                    <Stack>

                        <TextInput
                            size='md'
                            required
                            // label="Surname"
                            placeholder="Last Name"
                            value={form.values.name}
                            radius="md"
                            {...form.getInputProps('name')}
                        />

                        <TextInput
                            size='md'
                            required
                            // label="First Name"
                            placeholder="First Name"
                            value={form.values.firstname}
                            radius="md"
                            {...form.getInputProps('firstname')}
                        />

                        <TextInput
                            size='md'
                            required
                            // label="Email"
                            placeholder="john@example.com"
                            value={form.values.email}
                            {...form.getInputProps('email')}
                            radius="md"
                        />

                        <PasswordInput
                            required
                            size='md'
                            autoComplete='off'
                            // label="Password"
                            placeholder="Enter Password"
                            value={form.values.password}
                            radius="md"
                            {...form.getInputProps('password')}
                        />

                        <PasswordInput
                            required
                            size='md'
                            autoComplete='off'
                            // label="Confirm Password"
                            placeholder="Confirm Password"
                            value={form.values.password_confirmation}
                            {...form.getInputProps('password_confirmation')}
                            radius="md"
                        />

                        <Checkbox
                            required
                            label="I accept terms and conditions"
                            checked={form.values.terms}
                            onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                        />
                    </Stack>

                    <Button type="submit" fullWidth mt="lg" size="lg" loading={loading}>
                        {upperFirst("Register")}
                    </Button>
                    <Group justify="space-between" mt="md">
                        <Anchor size="sm" href="/login" title='Already have an account? Login'>
                            Already have an account? Login
                        </Anchor>
                    </Group>

                </form>
                {/*</Paper>*/}
                {/* </Container> */}
            </div>
        </Stack>
)
}

export default Register