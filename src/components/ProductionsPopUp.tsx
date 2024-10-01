import {Text, Title, Button, rgba, Grid, GridCol, Group, ThemeIcon} from '@mantine/core';
import image from '../assets/images/production.jpg';
import classes from '../assets/WelcomePopUp.module.css';
import {IconNumber1, IconNumber2, IconNumber3, IconNumber4} from "@tabler/icons-react";
import {Link} from "react-router-dom";

export function ProductionsPopUp({close}:{close:() => void}) {

    return (
        <Grid mah={670}>
            <GridCol p={50} span={{base: 12, md: 7, lg: 7}}>
                <div className={classes.body}>
                    <Title className={classes.title}>Hi there!</Title>
                    <Text fz="sm" c="dimmed">
                        Welcome to the Productions page. Here, you can track and manage all your production runs.
                    </Text>

                    <Text fw={500} fz="lg" mb={25} mt={25} c={'gauge-primary.6'}>
                        Quick Tips:
                    </Text>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber1 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Existing Products </Text>: In order
                            to begin a production run for a product, the product should already exist.
                            <Text component={Link} fz={'sm'} c={'gauge-primary.6'} to={'/products/add'} td={'underline'}> Add New Product</Text>
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber2 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>New Production Run </Text>: Click on
                            the <Text fz={'sm'} component={'span'} fw={500}>"Add Production"</Text> button to schedule
                            and manage your production activities.
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber3 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Monitor Status </Text>: Keep track
                            of your production runs from planning to completion.
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber4 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Assign Tasks </Text>: Assign
                            production tasks to team members and manage workloads efficiently.
                        </Text>
                    </Group>

                    <Group wrap="nowrap" mt={50} justify={'center'}>
                        <Button variant={'transparent'} td={'underline'} onClick={close}>Skip</Button>
                        <Button variant={'filled'} onClick={close} component={Link} to={'/productions'}>Production</Button>
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