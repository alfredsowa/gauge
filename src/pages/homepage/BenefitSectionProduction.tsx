import classes from '../../assets/css/Sections.module.css';
import {Grid, Image, Stack, Text, Title} from "@mantine/core";
import SectionListItem from "../../components/SectionListItem.tsx";
import image from '../../assets/images/planning.jpg'

const BenefitSectionProduction = () => {
    return (
        <Grid gutter={{ base: 20, xs: 'md', md: 'xl', xl: 70 }} align="center" >
            <Grid.Col span={{base: 12, sm: 6, md: 6, lg: 6}} py={30} my={"auto"}>
                <Image
                    radius="md"
                    src={image}
                    // h={'100%'}
                    // fallbackSrc="https://placehold.co/600x400?text=Gauge"
                />
            </Grid.Col>
            <Grid.Col span={{base: 12, sm: 6, md: 6, lg: 6}} py={30} mih={400} my={"auto"}>
                <Stack >
                    <Title className={classes.subtitle}>
                        Production Planning and Execution
                    </Title>
                    <Text c={'dimmed'}>
                        Plan and schedule production runs, track progress, and manage resources in real time.
                    </Text>
                    <SectionListItem title={"Optimizes resource allocation, ensures timely production, and helps reduce downtime and bottlenecks in the production process."} />
                </Stack>
            </Grid.Col>
        </Grid>
    )
}
export default BenefitSectionProduction
