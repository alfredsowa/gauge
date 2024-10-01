import { Anchor, Center, Stack, Text } from '@mantine/core'
import { Link, Navigate, useLocation } from 'react-router-dom';
import LogoHeader from '../components/LogoHeader';



const PasswordConfirmed = () => {

    const location = useLocation();
    const previous: string = location.state.previous;

    if(previous !== "resetPassword") {
        return <Navigate to="/login" />
    }
    
  return (
    <Stack>
        <div style={{minWidth: '350px'}}>
            <Center mb={30}>
            <LogoHeader  />
            </Center>
        {/*<Paper radius="md" maw={400} p="xl" mt={'sm'} m="xl" withBorder {...props}>*/}
            <Stack>
                <Text size="2em" fw={600} mb={4} c={'green'} ta="center">
                    Password Confirmed
                </Text>

                <Text size="sm" fw={300} c={'gray'} mb={10} ta="center">
                You have successfully updated your password.
                </Text>
            </Stack>

            <Center>
            <Anchor component={Link} size='md' fw={500} to="/login" title='Login'>
                Click to Login
            </Anchor>
            </Center>
        {/*</Paper>*/}
        </div>
    </Stack>
  )
}

export default PasswordConfirmed
