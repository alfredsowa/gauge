import classes from '../../assets/css/Sections.module.css';
import {Grid, GridCol, Image, Stack, Text, Title} from "@mantine/core";
import SectionListItem from "../../components/SectionListItem.tsx";
import image from '../../assets/images/customers.jpg'

const BenefitSectionManagement = () => {
    return (
        <Grid gutter={{ base: 20, xs: 'md', md: 'xl', xl: 70 }} align="stretch">
            <GridCol span={{base: 12, sm: 6, md: 6, lg: 6}} py={30} mih={400} my={"auto"}>
                <Stack >
                    <Title className={classes.subtitle}>
                    Management: Sales & Customer, Supplier & Purchase, Employee
                    </Title>
                    <Text c={'dimmed'}>
                    Manage and track supplier information, purchase orders, track sales, and manage customer and employee information
                    </Text>
                    {/* <Text c={'dimmed'}>
                    Prevents overstocking and shortages, reduces material wastage, and ensures smooth production runs by managing inventory efficiently.
                    </Text> */}
                    <SectionListItem title={"Streamlines procurement, improves supplier relationships, and ensures timely restocking to avoid production delays."} />
                    <SectionListItem title={"Enhances customer relationships, improves order fulfillment, and helps businesses track and manage their sales efficiently."} />
                    {/* <SectionListItem title={"Enhances customer relationships, improves order fulfillment, and helps businesses track and manage their sales efficiently."} /> */}
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
export default BenefitSectionManagement
