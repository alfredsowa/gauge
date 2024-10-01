import { LinkItem } from '../../requests/models/_general'
import PageBreadCrumb from '../../components/PageBreadCrumb'
import { Avatar, Button, Grid, SimpleGrid, Table, Text } from '@mantine/core'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { IntermediateGoodModel } from '../../requests/models/_intermediateGood'
import { DefaultDate } from '../../requests/general/_dates'
import { MoneyFigure, PrettyFigure } from '../../requests/general/_numberHelper'
import { modals } from '@mantine/modals'
import { deleteIntermediateGood } from '../../requests/_intermediateGoodsRequests.ts'
import { notify } from '../../requests/general/toast'
import PageTitle from '../../components/PageTitle'
import PaperCard from '../../components/PaperCard'
import PaperCardHeader from '../../components/PaperCardHeader'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import PaperCardBody from '../../components/PaperCardBody'
import IntermediateGoodsMaterialsView from './components/IntermediateGoodsMaterialsView.tsx'
    
const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Intermediate Goods', href: '/intermediate-goods' },
    { title: 'View Intermediate Good', href: '#' },
]

const ViewIntermediateGood = () => {
    const navigate  = useNavigate()
    const getIntermediateGoodData = useLoaderData() as IntermediateGoodModel;

    const deleteItem = async() => {
        try {
            const response = await deleteIntermediateGood(getIntermediateGoodData.id)
            if(response.data.deleted) {
            
            notify({
                type:'success',
                message: response.data.message,
                title: 'Done'
            })

            navigate('/intermediate-goods', {replace: true})
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
  
    const openDeleteModal = () =>
        modals.openConfirmModal({
        title: 'Delete an intermediate good',
        centered: true,
        children: (
            <Text size="sm">
            Are you sure you want to delete Intermediate Good? This data will be lost permanently..
            </Text>
        ),
        labels: { confirm: 'Delete', cancel: "Cancel" },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => deleteItem(),
    });
  
    
    return (
        <>
        <PageTitle title="View Intermediate Good">
            <PageBreadCrumb pageBreadCrumbs={items} />
        </PageTitle>

        <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <PaperCard>
                    <PaperCardHeader>
                        <Text fw={'bold'} fz={'md'}>
                            {getIntermediateGoodData.name} - {getIntermediateGoodData.status?  
                                        (
                                            <Text component='span' c="green">
                                                Active
                                            </Text>
                                            
                                        ):
                                        (
                                            <Text component='span' c="red">
                                                Disabled
                                            </Text>
                                        )}
                        </Text>
                        <Button.Group>
                            <Button size='xs' component={Link} to={`/intermediate-goods/${getIntermediateGoodData.slug}/edit`}
                            variant="light" radius="md" aria-label="Edit" leftSection={<IconPencil size={14} stroke={1.5} />}>
                                 Edit
                            </Button>
                            <Button size='xs'  variant="filled" color={'red'} radius="md" aria-label="Delete" onClick={openDeleteModal} 
                            leftSection={<IconTrash size={14} stroke={1.5} />}>
                                 Delete
                            </Button>
                        </Button.Group>
                    </PaperCardHeader>
                    <PaperCardBody>
                        <Grid gutter={'lg'}>
                            <Grid.Col span={{ base: 12, sm: 3, md: 3, lg: 3 }}>
                                <Avatar radius={14} style={{ maxWidth: '220px', minWidth:'150px', height: 'auto', minHeight:'150px' }}
                                        src={getIntermediateGoodData.image}  />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 8, md: 8, lg: 8 }}>
                                <SimpleGrid cols={2}>
                                    <div>
                                        <Text fw={500}>Stock Quantity:
                                        <Text component='span' ml={10} c={'dimmed'}>
                                            {
                                                (getIntermediateGoodData.stock_quantity <= 0)?
                                                (
                                                    <>
                                                        <Text component='span' c={'red'}>
                                                            Out of stock
                                                        </Text>
                                                    </>
                                                ):
                                                (getIntermediateGoodData.min_stock_quantity > getIntermediateGoodData.stock_quantity)?
                                                (
                                                    <>
                                                        <PrettyFigure figure={getIntermediateGoodData.stock_quantity} />
                                                        <Text component='span' mx={4} c={'yellow'}>
                                                            - Almost out of stock
                                                        </Text>
                                                    </>
                                                ):
                                                (
                                                    <>
                                                        <PrettyFigure figure={getIntermediateGoodData.stock_quantity} />
                                                        <Text component='span' mx={4}  c={'green'}>
                                                            - In stock
                                                        </Text>
                                                    </>
                                                )
                                            }</Text>
                                        </Text>
                                    </div>
                                    <div>
                                    <Text fw={500}>Min. Stock Quantity: 
                                    <Text component='span' ml={10} c={'dimmed'}><PrettyFigure figure={getIntermediateGoodData.min_stock_quantity} /></Text></Text>
                                    </div>
                                    <div>
                                    <Text fw={500}>Labour Cost:
                                    <Text component='span' ml={10} c={'dimmed'}><MoneyFigure figure={getIntermediateGoodData.labour_cost}  /></Text></Text>
                                    </div>
                                    <div>
                                    <Text fw={500}>Labour Cost:
                                    <Text component='span' ml={10} c={'dimmed'}><MoneyFigure figure={getIntermediateGoodData.labour_cost}  /></Text></Text>
                                    </div>
                                    <div>
                                        <Text fw={500}>Created:
                                        <Text component='span' ml={10} c={'dimmed'}>
                                            <DefaultDate dateFormat={getIntermediateGoodData.created_at}  />
                                        </Text></Text>
                                    </div>
                                    <div>
                                        <Text fw={500}>Last Updated:
                                        <Text component='span' ml={10} c={'dimmed'}><DefaultDate dateFormat={getIntermediateGoodData.updated_at}  /></Text></Text>
                                    </div>
                                </SimpleGrid>
                                <div style={{marginTop:'15px'}}>
                                <Text fw={500}>Description:</Text>
                                <Text c={'dimmed'}>{getIntermediateGoodData.description}</Text>
                                </div>
                            </Grid.Col>
                        </Grid>
                    </PaperCardBody>
                </PaperCard>

                <PaperCard>
                    <PaperCardHeader>
                        <Text fw={'bold'} fz={'md'}>
                            Materials
                        </Text>
                    </PaperCardHeader>
                    <PaperCardBody>
                    <IntermediateGoodsMaterialsView prodMaterials={getIntermediateGoodData.materials} />
                    </PaperCardBody>
                </PaperCard>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <PaperCard>
                    <PaperCardHeader>
                        <Text fw={'bold'} fz={'md'}>
                            Production History
                        </Text>
                    </PaperCardHeader>
                    <PaperCardBody>
                        {
                            getIntermediateGoodData.productions?.length > 0 ? (
                                <Table.ScrollContainer minWidth={500}>
                                    <Table striped withColumnBorders withRowBorders={false}>
                                        <Table.Thead>
                                            <Table.Tr>
                                            <Table.Th><Text>Title</Text></Table.Th>
                                            <Table.Th><Text>Assignee</Text></Table.Th>
                                            <Table.Th w={100}><Text>Quantity</Text></Table.Th>
                                            <Table.Th w={150}><Text>Date</Text></Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {
                                                getIntermediateGoodData.productions.map((productions) => {
                                                    return (
                                                        <Table.Tr>
                                                            <Table.Td>
                                                                <Text>{productions.title}</Text>
                                                            </Table.Td>
                                                            <Table.Td>
                                                                <Text>{productions.status}</Text>
                                                            </Table.Td>
                                                            <Table.Td>
                                                                <Text>{productions.first_name+" "+productions.last_name}</Text>
                                                            </Table.Td>
                                                            <Table.Td>
                                                                <Text><PrettyFigure figure={productions.production_quantity}  /></Text>
                                                            </Table.Td>
                                                        </Table.Tr>
                                                    )
                                                })
                                            }
                                        </Table.Tbody>
                                    </Table>
                                </Table.ScrollContainer>
                            ):(
                                <Text c={'dimmed'}>No Production records</Text>
                            )
                        }
                        
                    </PaperCardBody>
                </PaperCard>
            </Grid.Col>
        </Grid>
        </>
  )
}

export default ViewIntermediateGood
