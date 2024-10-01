import {Text, Title, Button, rgba, Grid, GridCol, Group, ThemeIcon} from '@mantine/core';
import image from '../assets/images/welcome-.jpg';
import classes from '../assets/WelcomePopUp.module.css';
import {IconBuildingStore, IconTools, IconUsers} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {UserModel} from "../auth/core/_models.ts";

// const appName = import.meta.env.VITE_APP_NAME
export function WelcomePopUp({close,currentUser}:{close:() => void,currentUser:UserModel|undefined}) {
    // const {currentUser} = useAuth()

    return (
        <Grid mah={670}>
            <GridCol p={50} span={{base: 12, md: 7, lg: 7}}>
                <div className={classes.body}>
                    <Title className={classes.title}>Welcome {currentUser?.firstname},</Title>
                    <Text fw={500} fz="lg" mb={5}>
                        We're thrilled to have you on board
                    </Text>
                    <Text fz="sm" c="dimmed">
                        We believe you've made an excellent choice by joining our community.
                        Our goal is to help you manage your business operations effortlessly and efficiently.
                    </Text>

                    <Text fw={500} fz="lg" mb={25} mt={25} c={'gauge-primary.6'}>
                        How to get started
                    </Text>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconTools stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}>Add the <Text fz={'sm'} component={'span'} fw={600}>Materials </Text>
                            used in production runs.</Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconBuildingStore stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}>Add the kinds of <Text fz={'sm'} component={'span'} fw={600}>Products </Text>
                            you produce or manufacture.</Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconUsers stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}>Add your <Text fz={'sm'} component={'span'} fw={600}>Employees </Text> or
                            <Text component={'span'} fz={'sm'} fw={600}> Production Staff </Text>.</Text>
                    </Group>

                    <Group wrap="nowrap" mt={50} justify={'center'}>
                        <Button variant={'transparent'} td={'underline'} onClick={close}>Skip</Button>
                        <Button variant={'filled'} onClick={close} component={Link} to={'/materials'}>Continue</Button>
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