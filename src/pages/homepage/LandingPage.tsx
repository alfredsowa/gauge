import {Container, Title, Text, Button, Group } from '@mantine/core';
import classes from '../../assets/css/LandingPage.module.css';
import {Link} from "react-router-dom";
import {UserModel} from "../../auth/core/_models.ts";
// import {IconExternalLink} from "@tabler/icons-react";

const LandingPage = ({currentUser}:{currentUser: UserModel|undefined}) => {
  return (
    <div className={classes.root}>
      <div style={{backgroundColor:'rgba(0, 0, 0, 0.5)'}} className={classes.shell}>
        <Container size="lg">
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title} c={'white'}>
              Manufacturing Inventory Management <br/> Software For Small   Businesses
              </Title>

              <Text className={classes.description} fw={500} fz={18} pt={30} w={"75%"} mx={'auto'}>
                Gauge aims to help small businesses streamline manufacturing processes to prevent time and materials wastage
              </Text>

              <Group justify={'center'} mt={40}>
                {currentUser ? (
                    <Button
                        color={'gauge-primary.4'}
                        component={Link} to={'/dashboard'}
                        size="lg"
                    >
                      Go to Dashboard
                    </Button>
                ):(
                    <Button
                      color={'gauge-primary.7'}
                      component={Link} to={'/register'}
                      size="lg"
                    >
                      Join Our MVP Trial
                    </Button>
                )}
                {/*<Button*/}
                {/*  variant={'filled'}*/}
                {/*  color={'white'}*/}
                {/*  c={'gauge-primary.7'}*/}
                {/*  target={'_blank'}*/}
                {/*  component={'a'} href="https://resoura.app/gauge"*/}
                {/*  size="lg"*/}
                {/*  rightSection={<IconExternalLink size={18} />}*/}
                {/*>*/}
                {/*  Learn More*/}
                {/*</Button>*/}
              </Group>

            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default LandingPage
