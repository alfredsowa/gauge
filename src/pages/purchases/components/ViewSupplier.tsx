import { Accordion, Avatar, Divider, Grid, Group, Text } from '@mantine/core'
import { PurchaseBasicModel, SupplierFull } from '../../../requests/models/_purchase'
import classes from '../assets/Accordion.module.css'
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper';

    interface AccordionLabelProps {
        label: string;
        image: string;
        status: string;
        purchased_date: string|undefined;
    }
    
    function AccordionLabel({ label, image, purchased_date,status }: AccordionLabelProps) {
        return (
            <Group wrap="nowrap" p={0}>
                <Avatar src={image} radius="xl" size="sm" />
                <div>
                    <Text fz="sm">{label}
                        {status === 'Draft' && (
                            <Text component='span' tt={"uppercase"} c={"yellow"} fz={"xs"}> - {status}</Text>
                        )}
                    </Text>
                    <Text fz="xs" c="dimmed" fw={400}>
                        {purchased_date}
                    </Text>
                </div>
            </Group>
        );
    }

const ViewSupplier = ({supplier}:{supplier: SupplierFull|undefined}) => {
    const purchases: PurchaseBasicModel[]|undefined = supplier?.purchases
    
    const items = purchases?.map((purchase) => (
        <Accordion.Item value={String(purchase.id)} key={purchase.id}>
            <Accordion.Control>
                <AccordionLabel 
                    label={purchase.material_name} 
                    image={purchase.material_image}
                    purchased_date={purchase.purchase_date}
                    status={purchase.status} />
            </Accordion.Control>
            <Accordion.Panel>
            <Grid gutter={{ base: 5, xs: 'sm', md: 'md', xl: 30 }}>

                <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                    <Text fz="sm" fw={500}>
                        Invoice#
                    </Text>
                    <Text fz="sm" c="dimmed">
                        {purchase.invoice_number}
                    </Text>
                </Grid.Col>

                <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                    <Text fz="sm" fw={500}>
                        Amount Paid
                    </Text>
                    <Text fz="sm" c="dimmed">
                        <MoneyFigure figure={purchase.amount_paid}  />
                    </Text>
                </Grid.Col>

                <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                    <Text fz="sm" fw={500}>
                        Quantity
                    </Text>
                    <Text fz="sm" c="dimmed">
                        <PrettyFigure figure={purchase.quantity}  />
                    </Text>
                </Grid.Col>

                <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                    <Text fz="sm" fw={500}>
                        Unit Price
                    </Text>
                    <Text fz="sm" c="dimmed">
                        <MoneyFigure figure={purchase.unit_price}  />
                    </Text>
                </Grid.Col>

                <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                    <Text fz="sm" fw={500}>
                        Shipping / Delivery
                    </Text>
                    <Text fz="sm" c="dimmed">
                        {purchase.shipping?(<MoneyFigure figure={Number(purchase.shipping)}  />):'-'}
                    </Text>
                </Grid.Col>

                <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                    <Text fz="sm" fw={500}>
                        Tax
                    </Text>
                    <Text fz="sm" c="dimmed">
                    {purchase.tax?purchase.tax:'-'}
                    </Text>
                </Grid.Col>

                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                    <Text fz="sm" fw={500}>
                        Purchase Details
                    </Text>
                    <Text fz="sm" c="dimmed">
                        {purchase.purchase_details?purchase.purchase_details:' - '}
                    </Text>
                </Grid.Col>

                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                    <Text fz="sm" fw={500}>
                        Other Notes
                    </Text>
                    <Text fz="sm" c="dimmed">
                        {purchase.notes?purchase.notes:' - '}
                    </Text>
                </Grid.Col>


            </Grid>

          </Accordion.Panel>
        </Accordion.Item>
      ));

  return (
    <>
        <Grid gutter={{ base: 5, xs: 'sm', md: 'md', xl: 30 }}>

            <Grid.Col pt={10} pb={10} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                <Text fz="sm" fw={500}>
                    Contact Person
                </Text>
                <Text fz="sm" c="dimmed">
                    {supplier?.contact_person}
                </Text>
            </Grid.Col>

            <Grid.Col pt={10} pb={10} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                <Text fz="sm" fw={500}>
                    Company
                </Text>
                <Text fz="sm" c="dimmed">
                    {supplier?.company_name}
                </Text>
            </Grid.Col>

            <Grid.Col pt={10} pb={10} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                <Text fz="sm" fw={500}>
                    Contact Details
                </Text>
                <Text fz="sm" c="dimmed">
                    {supplier?.contact_detail}
                </Text>
            </Grid.Col>

            <Grid.Col pt={10} pb={10} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                <Text fz="sm" fw={500}>
                    Location
                </Text>
                <Text fz="sm" c="dimmed">
                    {supplier?.location}
                </Text>
            </Grid.Col>

            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                <Text fz="sm" fw={500}>
                    Note
                </Text>
                <Text fz="sm" c="dimmed">
                    {supplier?.note}
                </Text>
            </Grid.Col>

        </Grid>

        <Divider my="md" />

        <Text fz="sm" mb={10} fw={500}>
            Purchases: <Text component='span' fz={'sm'}>{purchases?.length}</Text>
        </Text>
        <Accordion mb={'lg'} chevronPosition="right" variant="contained" transitionDuration={100} classNames={classes}>
            {items}
        </Accordion>
    </>
  )
}

export default ViewSupplier
