import { Center, Grid, Image, Text } from '@mantine/core'
import { PurchaseBasicModel } from '../../../requests/models/_purchase'
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper'

const ViewPurchase = ({purchase}:{purchase: PurchaseBasicModel}) => {
    
  return (
    <>
        <Grid>
        {/* <Grid gutter={{ base: 5, xs: 'sm', md: 'md', xl: 30 }}> */}

            <Grid.Col pt={10} pb={0} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Center>
                    <Image
                        radius="md"
                        h={200}
                        w="auto"
                        fit="contain"
                        src={purchase.material_image}
                    />
                </Center>
            </Grid.Col>


            <Grid.Col pt={10} pb={0} span={{ base: 12, sm: 8, md: 8, lg: 8 }}>
                <Grid>
                    <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                        <Text fz="sm" fw={500}>
                            Material
                        </Text>
                        <Text fz="sm" c="dimmed">{purchase.material_name}
                            {purchase.status === 'Draft' && (
                                <Text component='span' tt={"uppercase"} c={"yellow"} fz={"xs"}> - {purchase.status}</Text>
                            )}
                        </Text>
                    </Grid.Col>

                    <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                        <Text fz="sm" fw={500}>
                            Purchase Date
                        </Text>
                        <Text fz="sm" c="dimmed">
                            {purchase.purchase_date}
                        </Text>
                    </Grid.Col>

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
                            <MoneyFigure figure={purchase.amount_paid} />
                        </Text>
                    </Grid.Col>

                    <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                        <Text fz="sm" fw={500}>
                            Quantity
                        </Text>
                        <Text fz="sm" c="dimmed">
                            <PrettyFigure figure={purchase.quantity} />
                        </Text>
                    </Grid.Col>

                    <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                        <Text fz="sm" fw={500}>
                            Unit Price
                        </Text>
                        <Text fz="sm" c="dimmed">
                        <MoneyFigure figure={purchase.unit_price} />
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
                </Grid>
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
    </>
  )
}

export default ViewPurchase
