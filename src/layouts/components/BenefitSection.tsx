import classes from '../../assets/css/Sections.module.css';
import {Box, Container, Grid, GridCol, Image, rem, Stack, Title} from "@mantine/core";
import SectionListItem from "../../components/SectionListItem.tsx";
import image from '../../assets/images/section-photo1.jpg'

const BenefitSection = () => {
    return (
        <Box py={rem(80)}>
            <Container size="lg">
                <Title className={classes.title} ta={'center'} mb={60}>What you can do</Title>
                <Grid gutter={{ base: 20, xs: 'md', md: 'xl', xl: 50 }} align="stretch">
                    <GridCol span={{base: 12, sm: 6, md: 6, lg: 6}} py={30} my={"auto"}>
                        <Image
                            radius="md"
                            src={image}
                            h={500}
                            // fallbackSrc="https://placehold.co/600x400?text=Gauge"
                        />
                    </GridCol>
                    <GridCol span={{base: 12, sm: 6, md: 6, lg: 6}} py={30} mih={400} my={"auto"}>
                        <Stack >
                            <Title className={classes.subtitle}>
                                We have simplified the process to streamline your manufacturing operations
                            </Title>
                            <SectionListItem title={"Manage production materials from your suppliers"} />
                            <SectionListItem title={"Start a productions runs that integrates with your products and materials"} />
                            <SectionListItem title={"Record sales and purchases of raw materials"} />
                            <SectionListItem title={"Perform simple periodic stock reconciliation"} />
                        </Stack>
                    </GridCol>
                </Grid>
            </Container>
        </Box>
    )
}
export default BenefitSection
