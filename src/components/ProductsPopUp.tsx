import {Text, Title, Button, rgba, Grid, GridCol, Group, ThemeIcon} from '@mantine/core';
import image from '../assets/images/products.jpg';
import classes from '../assets/WelcomePopUp.module.css';
import {IconNumber1, IconNumber2, IconNumber3} from "@tabler/icons-react";
import {Link} from "react-router-dom";

// const appName = import.meta.env.VITE_APP_NAME
export function ProductsPopUp({close}:{close:() => void}) {
    // const {currentUser} = useAuth()

    return (
        <Grid mah={670}>
            <GridCol p={50} span={{base: 12, md: 7, lg: 7}}>
                <div className={classes.body}>
                    <Title className={classes.title}>Hi There!</Title>
                    {/*<Text fw={500} fz="lg" mb={5}>*/}
                    {/*    We're thrilled to have you on board*/}
                    {/*</Text>*/}
                    <Text fz="sm" c="dimmed">
                        Welcome to the Products page. Here, you can add and manage all the products you offer.
                    </Text>

                    <Text fw={500} fz="lg" mb={25} mt={25} c={'gauge-primary.6'}>
                        Quick Tips:
                    </Text>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber1 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Add New Products </Text>: Click on
                            the <Text fz={'sm'} component={'span'} fw={500}>"Add Product"</Text> button to input details of the products you make or sell.
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber2 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Add Product Materials </Text>: You
                            get to attach all the materials you use to make the products.
                        </Text>
                    </Group>
                    <Group wrap="nowrap" mb={20}>
                        <ThemeIcon size="lg" color={'gauge-primary.6'} variant={'light'}>
                            <IconNumber3 stroke={1.4} style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fz={'sm'}><Text fz={'sm'} component={'span'} fw={700}>Track Inventory </Text>: Keep an
                            eye on your stock levels to ensure you always have enough on hand.
                        </Text>
                    </Group>

                    <Group wrap="nowrap" mt={50} justify={'center'}>
                        <Button variant={'transparent'} td={'underline'} onClick={close}>Skip</Button>
                        <Button variant={'filled'} onClick={close} component={Link} to={'/products'}>Products</Button>
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