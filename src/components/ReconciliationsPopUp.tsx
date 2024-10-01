import {Text, Title, Button, rgba, Grid, GridCol, Group, ThemeIcon} from '@mantine/core';
import image from '../assets/images/audit.jpg';
import classes from '../assets/WelcomePopUp.module.css';
import {IconNumber1, IconNumber2, IconNumber3} from "@tabler/icons-react";
import {Link} from "react-router-dom";

export function ReconciliationsPopUp({close}:{close:() => void}) {

    return (
        <Grid mah={670}>
            <GridCol p={50} span={{base: 12, md: 7, lg: 7}}>
                <div className={classes.body}>
                    <Title className={classes.title}>Hi there!</Title>
                    <Text fz="sm" c="dimmed">
                        Welcome to the Reconciliations page. Here, you can ensure your material
                        inventory records are accurate and up-to-date.
                    </Text>

                    <Text fw={500} fz="lg" mb={25} mt={25} c={'gauge-primary.6'}>
                        Quick Tips:
                    </Text>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber1 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>New Reconciliation </Text>: Click on
                            the <Text fz={'sm'} component={'span'} fw={500}>"Start Reconciliation"</Text> button to start
                            reconciling your material inventory.
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber2 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Match Material Records </Text>:
                            Ensure all your material usage and stock levels match your records.
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber3 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Identify Discrepancies </Text>:
                            Quickly spot and resolve any discrepancies in your material inventory.
                        </Text>
                    </Group>

                    <Group wrap="nowrap" mt={50} justify={'center'}>
                        <Button variant={'transparent'} td={'underline'} onClick={close}>Skip</Button>
                        <Button variant={'filled'} onClick={close} component={Link} to={'/reconciliations'}>Start Reconciliation</Button>
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