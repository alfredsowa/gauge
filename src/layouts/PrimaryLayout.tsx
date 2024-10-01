import { AppShell, Container, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {Navigate, Outlet} from 'react-router-dom'
import PrimarySidebar from './components/PrimarySidebar';
import PrimaryHeader from './components/PrimaryHeader';
import { useAuth } from '../auth/core/Auth';

const PrimaryLayout = () => {
    const [opened, { toggle }] = useDisclosure();

  const {currentUser} = useAuth()
  

  if (currentUser) {
    if (!currentUser.verified) {
        return <Navigate to='/verify-email' />
    }

    if (currentUser.business_id === null || !currentUser.business?.setup) {
      return <Navigate to='/business-setup' replace={false}/>
    }
    
  }

  if (!currentUser) {
    return <Navigate to='/login' />
  }
  
  return (
    <AppShell
        header={{ height: { base: 100 } }}
        navbar={{
            width: { md: 240, lg: 240 },
            breakpoint: 'md',
            collapsed: { mobile: !opened },
        }}
        padding="md"  withBorder={true}>

        <PrimaryHeader toggle={toggle} opened={opened} />

        <PrimarySidebar toggle={toggle} />

        <AppShell.Main bg={'var(--mantine-color-default-hover)'}>
            <Container fluid>
                <Outlet />
            </Container>
        </AppShell.Main>
    </AppShell>
  )
}

export default PrimaryLayout
