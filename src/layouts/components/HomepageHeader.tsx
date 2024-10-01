import {
    Group,
    Button,
    Anchor,
    Container,
  } from '@mantine/core';
  import classes from '../../assets/css/HomepageHeader.module.css';
import { Link } from 'react-router-dom';
import LogoHeader from '../../components/LogoHeader';
import {UserModel} from "../../auth/core/_models.ts";
  
  export function HomepageHeader({currentUser,logout}:{currentUser: UserModel|undefined, logout: ()=>void}) {
  
    return (
      <Container size="lg" pt={10} pb={10}>
        <header className={classes.header}>
          <Group justify="space-between">
            
            <LogoHeader  />
  
            <Group>
                {currentUser ? (
                    <>
                        <Button variant="light" color="orange" onClick={logout}>Logout</Button>
                    </>
                ):(
                    <>
                        <Anchor variant="light" c={'gauge-primary.6'} fw={600} component={Link} to="/login" title='Get started on your goals'>
                            Login
                        </Anchor>
                    </>
                )}
            </Group>
          </Group>
        </header>
        </Container>
      // </Box>
    );
  }