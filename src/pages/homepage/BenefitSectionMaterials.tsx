import classes from '../../assets/css/Sections.module.css';
import {Grid, GridCol, Image, Stack, Text, Title} from "@mantine/core";
import SectionListItem from "../../components/SectionListItem.tsx";
import image from '../../assets/images/inventory.jpg'

const BenefitSectionMaterials = () => {
    return (
        <Grid gutter={{ base: 20, xs: 'md', md: 'xl', xl: 70 }} align="stretch">
            <GridCol span={{base: 12, sm: 6, md: 6, lg: 6}} py={30} mih={400} my={"auto"}>
                <Stack >
                    <Title className={classes.subtitle}>
                        Inventory & Materials Usage Tracking
                    </Title>
                    <Text c={'dimmed'}>
                        Record and monitor materials used during production, ensuring accuracy in usage and minimizing errors, and monitor stock levels,
                    </Text>
                    {/* <Text c={'dimmed'}>
                    Prevents overstocking and shortages, reduces material wastage, and ensures smooth production runs by managing inventory efficiently.
                    </Text> */}
                    <SectionListItem title={"Prevents overstocking and shortages, and ensures smooth production runs by managing inventory efficiently."} />
                    <SectionListItem title={"Reduces material wastage and ensures accurate cost tracking, which improves profitability and resource management."} />
                    {/* <SectionListItem title={"Record sales and purchases of raw materials"} />
                    <SectionListItem title={"Perform simple periodic stock reconciliation"} /> */}
                </Stack>
            </GridCol>
            <GridCol span={{base: 12, sm: 6, md: 6, lg: 6}} py={30} my={"auto"}>
                <Image
                    radius="md"
                    src={image}
                    // h={'100%'}
                    // fallbackSrc="https://placehold.co/600x400?text=Gauge"
                />
            </GridCol>
        </Grid>
    )
}
export default BenefitSectionMaterials
