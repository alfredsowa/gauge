import { LinkItem } from '../../requests/models/_general'
import PageBreadCrumb from '../../components/PageBreadCrumb'
import { Accordion, Avatar, Button, Card, Center, Grid, Group, SimpleGrid, Stack, Text, Title, rem } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { GetWithUnit, MoneyFigure, PrettyFigure } from '../../requests/general/_numberHelper'
import { DefaultDate } from '../../requests/general/_dates'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { MaterialViewModel } from '../../requests/models/_material'
import classes from '../purchases/assets/Accordion.module.css'
import { deleteMaterial } from '../../requests/_materialsRequests'
import { modals } from '@mantine/modals'
import { notify } from '../../requests/general/toast'
import PageTitle from '../../components/PageTitle'

const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Materials', href: '/materials' },
    { title: 'View material', href: '#' },
  ]

interface AccordionLabelProps {
    invoice_number: string;
    status: string;
    purchased_date: string|undefined;
}
function AccordionLabel({ invoice_number, purchased_date,status }: AccordionLabelProps) {
    return (
        <Group  justify="space-between" wrap="nowrap" p={0}>
            <div>
                <Text fz="sm" fw={600}>Invoice #: {invoice_number}
                    {status === 'Draft' ? (
                        <Text component='span' tt={"uppercase"} c={"yellow"} fz={"xs"}> - {status}</Text>
                    ):(
                        <Text component='span' tt={"uppercase"} c={"green"} fz={"xs"}> - {status}</Text>
                    )}
                </Text>
            </div>
                <Text fz="sm" me={20} c="dimmed" fw={400}>
                    Purchased on: {(purchased_date?purchased_date:'-')}
                </Text>
        </Group>
    );
}

const ViewMaterial = () => {
    const materialViewData = useLoaderData() as MaterialViewModel;
    const navigate = useNavigate()

    useDocumentTitle("View Material")

    const deleteItem = async(id: number) => {
        try {
            const response = await deleteMaterial(id)
            if(response.data.removed) {
              
              notify({
                  type:'success',
                  message: response.data.message,
                  title: 'Done'
              })
    
              navigate('/materials', {replace: true})
            }
            else {
              notify({
                  type:'error',
                  message: response.data.message,
                  title: 'Sorry!'
              })
            }
        } catch (error) {
            notify({
                type:'error',
                message: 'Something went wrong',
                title: 'Oops!'
            })
        }
          
      }

    const openDeleteModal = (id: number) =>
        modals.openConfirmModal({
        title: 'Delete your material',
        centered: true,
        children: (
            <Text >
            Are you sure you want to delete material? This data will be lost permanently..
            </Text>
        ),
        labels: { confirm: 'Delete', cancel: "Cancel" },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => deleteItem(id),
    });

    const purchases = materialViewData.purchases

    const purchasesList = purchases?.map((purchase) => (
        <Accordion.Item value={String(purchase.id)} key={purchase.id}>
            <Accordion.Control>
                <AccordionLabel 
                    invoice_number={purchase.invoice_number} 
                    purchased_date={purchase.purchase_date}
                    status={purchase.status} />
            </Accordion.Control>
            <Accordion.Panel>
            <Grid gutter={{ base: 5, xs: 'sm', md: 'md', xl: 30 }}>

                <Grid.Col pt={10} pb={0} span={{ base: 6, sm: 6, md: 6, lg: 6 }}>
                    <Text fz="sm" fw={500}>
                        Supplied By 
                    </Text>
                    <Text fz="sm" c="dimmed">
                        {purchase.supplier_name} - ({purchase.supplier_contact})
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
        <PageTitle title='View Material'>
            <PageBreadCrumb pageBreadCrumbs={items} />
        </PageTitle>

        <Grid>
        
            <Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 3 }}>
                <Stack p={20}> 
                    <Center>
                        <Avatar src={materialViewData.image} size={rem(240)} radius={20}>PR</Avatar>
                    </Center>
                    <Button variant='light' component={Link} to={`/materials/${materialViewData.id}/edit`}>Edit Material</Button>
                    {
                        materialViewData.deletable?(
                            <Button variant='filled' onClick={()=>openDeleteModal(materialViewData.id)} color='red'>Delete Material</Button>
                        ):''
                    }

                </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 8, md: 8, lg: 9 }}>
                <Card radius={10} p={20}> 

                    <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
                        <div>
                            <Text fw={500}>
                                Material Name
                            </Text>
                        </div>
                        <div>
                            <Text c="dimmed">
                                {materialViewData.name}
                            </Text>
                        </div>

                        <div>
                            <Text fw={500}>
                                Cost per unit
                            </Text>
                        </div>
                        <div>
                        <Text c="dimmed">
                                <MoneyFigure figure={Number(materialViewData.cost_per_unit)}  />
                            </Text>
                        </div>

                        <div>
                            <Text fw={500}>
                                Code
                            </Text>
                        </div>
                        <div>
                            <Text c="dimmed">
                            {materialViewData.code?materialViewData.code : 'N/A'}
                            </Text>
                        </div>

                        <div>
                            <Text fw={500}>
                                Current Stock Level
                            </Text>
                        </div>
                        <div>
                            {
                                (materialViewData.current_stock_level <= 0)? 
                                (
                                <Text c="dimmed">
                                    {/* <GetWithUnit figure={materialViewData.current_stock_level} unit={materialViewData.unit_of_measurement}/>  */}
                                    <Text component='span' mx={4} fw={600} c={'red'}> 
                                        Out of stock 
                                    </Text>
                                </Text>):
                                (materialViewData.minimum_stock_level > materialViewData.current_stock_level)? 
                                (
                                <Text c="dimmed">
                                    <GetWithUnit figure={materialViewData.current_stock_level} unit={materialViewData.unit_of_measurement}/> 
                                    <Text component='span' mx={4} fw={600} c={'yellow'}> 
                                        - almost out of stock
                                    </Text>
                                </Text>):
                                (
                                <Text c="dimmed">
                                    <GetWithUnit figure={materialViewData.current_stock_level} unit={materialViewData.unit_of_measurement}/> 
                                    <Text component='span' mx={4} fw={600} c={'green'}> 
                                        - in stock 
                                    </Text>
                                </Text>)
                            }
                        </div>

                        <div>
                            <Text fw={500}>
                                Minimum Stock Level
                            </Text>
                        </div>
                        <div>
                            <Text c="dimmed">
                            {materialViewData.minimum_stock_level}
                            </Text>
                        </div>
                        
                        <div>
                            <Text fw={500}>
                                Total Cost
                            </Text>
                        </div>
                        <div>
                            <Text c="dimmed">
                            <MoneyFigure figure={Number(materialViewData.total_cost)}  />
                            </Text>
                        </div>
                        
                        <div>
                            <Text fw={500}>
                                Type
                            </Text>
                        </div>
                        <div>
                            <Text c="dimmed">
                            {materialViewData.type}
                            </Text>
                        </div>
                        
                        <div>
                            <Text fw={500}>
                                Unit of measurement
                            </Text>
                        </div>
                        <div>
                            <Text c="dimmed">
                            {materialViewData.unit_of_measurement}
                            </Text>
                        </div>
                        
                        {/*<div>*/}
                        {/*    <Text fw={500}>*/}
                        {/*        Status*/}
                        {/*    </Text>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <Text c="dimmed">*/}
                        {/*    {materialViewData.status}*/}
                        {/*    </Text>*/}
                        {/*</div>*/}
                        
                        <div>
                            <Text fw={500}>
                                Created On
                            </Text>
                        </div>
                        <div>
                            <Text c="dimmed">
                                <DefaultDate dateFormat={String(materialViewData.created_at)}  />
                            </Text>
                        </div>

                        <div>
                            <Text fw={500}>
                                Last Updated
                            </Text>
                        </div>
                        <div>
                            <Text  c="dimmed">
                                <DefaultDate dateFormat={String(materialViewData.updated_at)}  />
                            </Text>
                        </div>
                        
                        <div>
                            <Text fw={500}>
                                Description
                            </Text>
                        </div>
                        <div>
                            <Text c="dimmed">
                            {materialViewData.description}
                            </Text>
                        </div>

                    </SimpleGrid>
                
                </Card>
            </Grid.Col>

        </Grid>

        <Title size={"h4"} mt={30} mb={15}>
            Purchase History
        </Title>
        {
            purchases && purchases.length > 0 ?(
                <Accordion mb={'lg'} chevronPosition="right" variant="separated" transitionDuration={100} classNames={classes}>
                    {purchasesList}
                </Accordion>
            ):
            (
                <Text fz='xl' c={'dimmed'}>No purchases made yet</Text>
            )
        }
        
    </>
  )
}

export default ViewMaterial
