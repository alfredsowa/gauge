import {Text, Title, Button, rgba, Grid, GridCol, Group, ThemeIcon} from '@mantine/core';
import image from '../assets/images/sales.jpg';
import classes from '../assets/WelcomePopUp.module.css';
import {IconNumber1, IconNumber2, IconNumber3} from "@tabler/icons-react";
import {Link} from "react-router-dom";

// const appName = import.meta.env.VITE_APP_NAME
export function SalesPopUp({close}:{close:() => void}) {
    // const {currentUser} = useAuth()

    return (
        <Grid mah={670}>
            <GridCol p={50} span={{base: 12, md: 7, lg: 7}}>
                <div className={classes.body}>
                    <Title className={classes.title}>Hi there!</Title>
                    {/*<Text fw={500} fz="lg" mb={5}>*/}
                    {/*    We're thrilled to have you on board*/}
                    {/*</Text>*/}
                    <Text fz="sm" c="dimmed">
                        Welcome to the Sales & Customers page. Here, you can track and manage all your sales
                        transactions and customers.
                    </Text>

                    <Text fw={500} fz="lg" mb={25} mt={25} c={'gauge-primary.6'}>
                        Quick Tips:
                    </Text>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber1 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Manage Customers </Text>: Add and
                            manage customer details to keep your sales records accurate.
                            <Text component={Link} fz={'sm'} c={'gauge-primary.6'} to={'/sales/customers/add'}
                                  td={'underline'}> Add New Customer</Text>
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber2 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Add New Sales </Text>: Click on
                            the <Text fz={'sm'} component={'span'} fw={500}>"Add Sale"</Text> button to input details
                            of your sales transactions.
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber3 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Track Sales </Text>: Record retail,
                            wholesale, online, in-person sales, and payment status effortlessly.
                        </Text>
                    </Group>

                    <Group wrap="nowrap" mt={50} justify={'center'}>
                        <Button variant={'transparent'} td={'underline'} onClick={close}>Skip</Button>
                        <Button variant={'filled'} onClick={close} component={Link} to={'/sales/add'}>Add Sale</Button>
                    </Group>
                </div>
            </GridCol>
            <GridCol p={0} visibleFrom={'md'} span={{base: 12, md: 5, lg: 5}}
            style={{backgroundImage: `url(${image})`,backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',backgroundColor:rgba('0,0,0',0.5)}}>
            </GridCol>
        </Grid>
    );
}