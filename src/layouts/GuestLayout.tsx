import {Center, Group, rem} from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../auth/core/Auth'
import classes from '../assets/css/Authentication.module.css';

const GuestLayout = () => {
    const {currentUser} = useAuth()
    const current: string|null = localStorage.getItem('ls-auth-data')

    // If user is logged in, redirect to dashboard page.
    if (current && currentUser){
      window.location.href = "/dashboard";
      // return <Navigate to='/dashboard' />
    }
    
  return (
    <Group mih={"100vh"} justify={'center'} p={rem(30)} className={classes.wrapper}>
        <Center>
            <Outlet  />
        </Center>
    </Group>
    
  )
}

export default GuestLayout
