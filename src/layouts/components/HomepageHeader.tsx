import {
    Group,
    Button,
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
                        <Button radius={'xl'} size='sm' variant="light" color="orange" onClick={logout}>Logout</Button>
                    </>
                ):(
                    <>
                        <Button radius={'xl'} size='sm' component={Link} to="/login" variant="filled" onClick={logout}>LOGIN</Button>
                    </>
                )}
            </Group>
          </Group>
        </header>
        </Container>
      // </Box>
    );
  }