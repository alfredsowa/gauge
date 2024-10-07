import classes from '../../assets/css/SectionsCallToAction.module.css';
import {Box, Button, Center, Container, rem, Text, Title} from "@mantine/core";
// import {IconExternalLink} from "@tabler/icons-react";
import {Link} from "react-router-dom";

const CallToAction = () => {

    // let location = useLocation();
    // console.log(window.location.origin);
    return (
        <Box py={rem(80)} bg={"gauge-primary.1"}>
            <Container size="lg" c={'dark'}>
                <Center>
                    <div style={{textAlign: "left"}}>
                        <Title className={classes.subtitle} mb={30}>
                            Are You Ready To Transform Your Business?
                        </Title>
                        <Text className={classes.description}>
                            Start shaping your business with Gauge for FREE while you contribute to help us effectively shape your 
                            business processes.
                            You can also learn more about how it works.
                        </Text>
                        <Button
                            // mx={20}
                            mt={35}
                            color={'gauge-primary.7'}
                            component={Link} to={'/register'}
                            size="lg"
                        >
                            Get Started Now
                        </Button>
                        {/*<Button*/}
                        {/*    mt={35}*/}
                        {/*    variant={'filled'}*/}
                        {/*    color={'white'}*/}
                        {/*    c={'gauge-primary.7'}*/}
                        {/*    target={'_blank'}*/}
                        {/*    component={'a'} href="https://resoura.app/gauge"*/}
                        {/*    size="lg"*/}
                        {/*    rightSection={<IconExternalLink size={18} />}*/}
                        {/*>*/}
                        {/*    Learn More*/}
                        {/*</Button>*/}
                    </div>
                </Center>

            </Container>
        </Box>
    )
}
export default CallToAction
