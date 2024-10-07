import classes from '../../assets/css/Sections.module.css';
import {Box, Card, Container, Grid, GridCol, rem, Text, Title} from "@mantine/core";
import { IconAppWindow, IconPigMoney, IconTrendingUp } from '@tabler/icons-react';

const WhySection = () => {
    return (
        <Box py={rem(80)}>
            <Container size="lg">
                <Title className={classes.title} c="gauge-primary" mb={20}>Why You Need This</Title>
                <Title className={classes.subtitle}>
                    Choose Gauge to transform your business
                </Title>
                <Text>Comparing this software to others, we pride our expertise in these three unique vital areas.
                    As a new product, we have some special features and approaches that will help you reach your business goals.
                </Text>
                <Grid gutter={{ base: 20, xs: 'md', md: 'xl', xl: 50 }} justify="flex-start" align="stretch" mt={30}>
                    <GridCol span={{base: 12, sm: 4, md: 4, lg: 4}}>
                        <Card withBorder style={{height: '100%'}} shadow="md" radius="md" padding="xl">
                            <IconAppWindow
                            style={{ width: rem(50), height: rem(50) }}
                            stroke={1.5}
                            // color="gauge-primary.2"
                            />
                            <Title mt={20} fz={{base: 18, md: 22, lg: 24}} fw={600}>
                                User-Friendly
                            </Title>
                            <Text c={'dimmed'}>
                                Designed specifically for small businesses, the software is easy to navigate, 
                                making it accessible for non-technical users.
                            </Text>
                        </Card>
                    </GridCol>
                    <GridCol span={{base: 12, sm: 4, md: 4, lg: 4}}>
                    <Card withBorder style={{height: '100%'}} shadow="md" radius="md" padding="xl">
                            <IconPigMoney
                            style={{ width: rem(50), height: rem(50) }}
                            stroke={1.5}
                            // color="gauge-primary.2"
                            />
                            <Title mt={20} fz={{base: 18, md: 22, lg: 24}} fw={600}>
                            Cost Savings
                            </Title>
                            <Text c={'dimmed'}>
                            By minimizing material wastage and improving efficiency, businesses can save money on resources, 
                            labor, and time.
                            </Text>
                        </Card>
                    </GridCol>
                    <GridCol span={{base: 12, sm: 4, md: 4, lg: 4}}>
                    <Card withBorder style={{height: '100%'}} shadow="md" radius="md" padding="xl">
                            <IconTrendingUp
                            style={{ width: rem(50), height: rem(50) }}
                            stroke={1.5}
                            // color="gauge-primary.2"
                            />
                            <Title mt={20} fz={{base: 18, md: 22, lg: 24}} fw={600}>
                            Scalability
                            </Title>
                            <Text c={'dimmed'}>
                            Growing to adapt to the growth of businesses, making it suitable for both 
                            small artisans and larger operations.
                            </Text>
                        </Card>
                    </GridCol>
                </Grid>
            </Container>
        </Box>
    )
}
export default WhySection
