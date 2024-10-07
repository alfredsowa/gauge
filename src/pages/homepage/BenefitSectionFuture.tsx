import classes from '../../assets/css/Sections.module.css';
import {Grid, GridCol, rem, SimpleGrid, Stack, Text, ThemeIcon, Title} from "@mantine/core";
import { IconDragDrop, IconGraph, IconBrandStackshare, IconTruckDelivery, IconDeviceMobile, IconBuildingStore, IconBrowser, IconListSearch, IconCalculator } from '@tabler/icons-react';

const data = [
    {
        icon: <IconGraph style={{ width: rem(20), height: rem(20) }} stroke={2} />,
      title: 'Insights & Reporting',
      description: 'Generate reports on production, inventory, sales, and overall business performance.',
    },
    {
        icon: <IconDragDrop style={{ width: rem(20), height: rem(20) }} stroke={2} />,
      title: 'Customizable Dashboard',
      description: 'A central dashboard that gives an overview of key metrics like stock levels, production progress, and sales.',
    },
    {
        icon: <IconBrandStackshare style={{ width: rem(20), height: rem(20) }} stroke={2} />,
      title: 'Integration with Accounting Tools',
      description: 'Integrate with accounting softwares for streamlined financial management.',
    },
    {
        icon: <IconTruckDelivery style={{ width: rem(20), height: rem(20) }} stroke={2} />,
        title: 'Order and Delivery Tracking',
        description: 'Track customer orders and delivery status, ensuring that products are shipped and received on time.',
    },
    {
        icon: <IconCalculator style={{ width: rem(20), height: rem(20) }} stroke={2} />,
        title: 'Production Cost Estimation',
        description: 'Estimate costs for upcoming production runs based on materials, labor, and overhead.',
    },
    {
        icon: <IconDeviceMobile style={{ width: rem(20), height: rem(20) }} stroke={2} />,
        title: 'Mobile Accessibility',
        description: 'Access the app via mobile devices to manage operations on the go.',
    },
    {
        icon: <IconBuildingStore style={{ width: rem(20), height: rem(20) }} stroke={2} />,
        title: 'Multi-Store and Location',
        description: 'The app can be accessed by multiple accounts and allow multiple store locations',
    },
    {
        icon: <IconBrowser style={{ width: rem(20), height: rem(20) }} stroke={2} />,
        title: 'Storefront Ecommerce Website',
        description: 'Customers will be able to see and purchase products using your own ecommerce website',
    },
    {
        icon: <IconListSearch style={{ width: rem(20), height: rem(20) }} stroke={2} />,
        title: 'Suppliers Access',
        description: 'Create suppliers directory allow access and collaboration between businesses and suppliers.',
    },
  ];

const BenefitSectionFuture = () => {

    const items = data.map((item) => (
        <div className={classes.item} key={item.title}>
            <ThemeIcon variant="light" size={50} radius={50}>
                {item.icon}
            </ThemeIcon>
          <div>
            <Text fw={700} fz="lg" className={classes.itemTitle}>
              {item.title}
            </Text>
            <Text c="dimmed">{item.description}</Text>
          </div>
        </div>
      ));

    return (
        <Grid gutter={{ base: 20, xs: 'md', md: 'xl', xl: 70 }} align="stretch">
            <GridCol span={{base: 12}} py={30}>
                <Stack >
                    <Title className={classes.subtitle}>
                        Short-Term Additional Features
                    </Title>
                    <Text c={'dimmed'}>
                        In the near future, we plan to add the following features to the app to improve business productivity and results.
                    </Text>
                </Stack>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={30} mt={30}>
                    {items}
                </SimpleGrid>
            </GridCol>
        </Grid>
    )
}
export default BenefitSectionFuture
