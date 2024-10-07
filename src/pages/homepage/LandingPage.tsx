import {Container, Title, Text, Button, Grid, Image, Center } from '@mantine/core';
import classes from '../../assets/css/LandingPage.module.css';
import {Link} from "react-router-dom";
import {UserModel} from "../../auth/core/_models.ts";
// import {IconExternalLink} from "@tabler/icons-react";

const LandingPage = ({currentUser}:{currentUser: UserModel|undefined}) => {
  const show = false
  return (
    <div className={classes.root}>
      <div style={{backgroundColor:'rgba(0, 0, 0, 0.5)'}} className={classes.shell}>
        <Container size="lg">
          {
            show? (
              <div className={classes.inner}>
                <div className={classes.content}>
                  <Title className={classes.title} c={'white'}>
                  Manufacturing Software that elimates wastage and boosts operations.
                  {/* Manufacturing Management Software<br/> For Small Businesses */}
                  </Title>

                  <Text className={classes.description}>
                    Gauge aims to help small businesses streamline manufacturing processes to prevent time and materials wastage
                  </Text>

                  <div  className={classes.actionButton}>
                    {currentUser ? (
                        <Button className={classes.actionButton}
                            color={'gauge-primary.4'}
                            component={Link} to={'/dashboard'}
                            size="lg"
                        >
                          Go to Dashboard
                        </Button>
                    ):(
                        <Button
                          radius={'xl'}
                          color={'gauge-primary.7'}
                          component={Link} to={'/register'}
                          size="lg"
                        >
                          Get Started for Free
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
                  </div>

                </div>
              </div>
            ):''
          }
          
          <Grid justify='center' align="stretch">
            <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 7 }}>
            {/* <div className={classes.inner}> */}
            {/* <div className={classes.content}> */}
              <Title className={classes.title} c={'white'}>
              Manufacturing Software that elimates wastage and boosts operations.
              {/* Manufacturing Management Software<br/> For Small Businesses */}
              </Title>

              <Text className={classes.description}>
                Gauge aims to help small businesses streamline manufacturing processes to prevent time and materials wastage
              </Text>

              <div  className={classes.actionButton}>
                {currentUser ? (
                    <Button className={classes.actionButton}
                        color={'gauge-primary.4'}
                        component={Link} to={'/dashboard'}
                        size="lg"
                    >
                      Go to Dashboard
                    </Button>
                ):(
                    <Button
                      radius={'xl'}
                      color={'gauge-primary.7'}
                      component={Link} to={'/register'}
                      size="lg"
                    >
                      Get Started for Free
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
              </div>

            {/* </div> */}
          {/* </div> */}
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5 }}>
              <Center>
              <Image className={classes.illustration} src={'/src/assets/images/dashboard.png'}  />
              </Center>
            </Grid.Col>
          </Grid>
        </Container>
      </div>
    </div>
  )
}

export default LandingPage
