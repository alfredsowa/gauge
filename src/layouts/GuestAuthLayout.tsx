import { Navigate, Outlet } from 'react-router-dom'
import { AuthInit, useAuth } from '../auth/core/Auth'
import { Center } from '@mantine/core'

const GuestAuthLayout = () => {
    const {currentUser} = useAuth()

    if (currentUser) {
        if (!currentUser.verified) {
            return <Navigate to='/verify-email' />
        }
        return <Navigate to='/dashboard' />
    }
    
  return (
    
    <AuthInit>
        <div style={{minHeight: "10vh", padding: "20vh 0"}}>
            <Center>
                <Outlet  />
            </Center>
        </div>
    </AuthInit>
    
  )
}

export default GuestAuthLayout
