import {Text, Title, Button, rgba, Grid, GridCol, Group, ThemeIcon} from '@mantine/core';
import image from '../assets/images/materials.jpg';
import classes from '../assets/WelcomePopUp.module.css';
import {IconNumber1, IconNumber2, IconNumber3} from "@tabler/icons-react";
import {Link} from "react-router-dom";

export function MaterialsPopUp({close}:{close:() => void}) {
    // const {currentUser} = useAuth()

    return (
        <Grid mah={670}>
            <GridCol p={50} span={{base: 12, md: 7, lg: 7}}>
                <div className={classes.body}>
                    <Title className={classes.title}>Hi there!</Title>
                    <Text fz="sm" c="dimmed">
                        Welcome to the Materials page. Here, you can add all the materials you use for production.
                    </Text>

                    <Text fw={500} fz="lg" mb={25} mt={25} c={'gauge-primary.6'}>
                        Quick Tips:
                    </Text>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber1 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}>
                            <Text fz={'sm'} component={'span'} fw={700}>Materials Categories</Text>:
                            Add the various types of material categories for better organization.</Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber2 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}>
                            <Text fz={'sm'} component={'span'} fw={700}>Add New Materials</Text>:
                            Click on the <Text fz={'sm'} component={'span'} fw={500}>"Add Material" </Text>
                             button to input details of the materials you use.</Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber3 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Track Stock Levels </Text>: Keep an
                            eye on your current and minimum stock levels to avoid shortages.
                        </Text>
                    </Group>

                    <Group wrap="nowrap" mt={50} justify={'center'}>
                        <Button variant={'transparent'} td={'underline'} onClick={close}>Skip</Button>
                        <Button variant={'filled'} onClick={close} component={Link} to={'/materials/add'}>Add Material</Button>
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