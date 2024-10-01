import PageBreadCrumb from '../../components/PageBreadCrumb'
import PageTitle from '../../components/PageTitle'
import { LinkItem } from '../../requests/models/_general'
import {Link, useLoaderData, useNavigate} from 'react-router-dom'
import { SalesModel } from '../../requests/models/_sales'
import { ActionIcon, Avatar, Divider, Grid, GridCol, Text} from '@mantine/core'
import PaperCard from '../../components/PaperCard'
import PaperCardHeader from '../../components/PaperCardHeader'
import PaperCardBody from '../../components/PaperCardBody'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react'
import SaleStatusBadge from '../../components/SaleStatusBadge'
import { DefaultDateTime } from '../../requests/general/_dates'
import { toHeadline } from '../../requests/general/_stringHelper'
import PaymentStatusBadge from '../../components/PaymentStatusBadge'
import { MoneyFigure } from '../../requests/general/_numberHelper'
import { modals } from '@mantine/modals'
import { notify } from '../../requests/general/toast'
import { deleteSales } from '../../requests/_saleRequests'

const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sales', href: '/sales' },
    { title: 'View Sale', href: '#' },
]
const ViewSale = () => {
    const navigate = useNavigate()
    const sale = useLoaderData() as SalesModel

    const deleteItem = async() => {
        try {
            const response = await deleteSales(sale.id)
            if(response.data.deleted) {
                notify({
                    type:'success',
                    message: response.data.message,
                    title: 'Done'
                })

                navigate('/sales', {replace: true})
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
          title: 'Delete your sale',
          centered: true,
          children: (
            <Text size="sm">
              Are you sure you want to delete Sale? This data will be lost permanently..
            </Text>
          ),
          labels: { confirm: 'Delete', cancel: "Cancel" },
          confirmProps: { color: 'red' },
          onCancel: () => console.log('Cancel'),
          onConfirm: () => deleteItem(),
    });
    
  return (
    <>
        <PageTitle title='View Sale'>
            <PageBreadCrumb pageBreadCrumbs={items} />
        </PageTitle>
      <Grid>
        <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
            <PaperCard>
                <PaperCardHeader>
                    <Text fw={'bold'}>
                        Sales Information
                    </Text>
                    <ActionIcon.Group>
                        {
                            sale.order_status === 'completed' ? '': (
                                <ActionIcon component={Link} to={`/sales/${sale.id}/edit`} variant="light" radius="md" aria-label="Edit">
                                    <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                </ActionIcon>
                            )
                        }
                    
                    <ActionIcon variant="filled" color={'red'} radius="md" aria-label="Delete" onClick={()=>openDeleteModal()}>
                        <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                    </ActionIcon.Group>
                </PaperCardHeader>
                <PaperCardBody>
                    <Grid>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Avatar radius={14} style={{ width: '200px', height: '200px' }} src={sale.product?.image}  />
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Grid>
                                <GridCol span={12}>
                                    <Text size='sm' c={'dimmed'}>Product name</Text>
                                    <Text size='sm'>{sale.product?.name}</Text>
                                </GridCol>
                                <GridCol span={12}>
                                    <Text size='sm' c={'dimmed'}>Status</Text>
                                    <SaleStatusBadge status={sale.order_status} />
                                </GridCol>
                                <GridCol span={12}>
                                    <Text size='sm' c={'dimmed'}>Quantity</Text>
                                    <Text size='sm'>{sale.quantity}</Text>
                                </GridCol>
                                <GridCol span={12}>
                                    <Text size='sm' c={'dimmed'}>Sale Type - Channel</Text>
                                    <Text size='sm'>{toHeadline(sale.sale_type)} - {toHeadline(sale.sales_channel)}</Text>
                                </GridCol>
                            </Grid>
                        </GridCol>
                        
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Text size='sm' c={'dimmed'}>Sold by</Text>
                            <Text size='sm'>{sale.sold_by}</Text>
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Text size='sm' c={'dimmed'}>Sold on</Text>
                            <Text size='sm'><DefaultDateTime dateFormat={sale.sale_date_time} /></Text>
                        </GridCol>
                        <GridCol span={12}>
                            <Divider my="xs" fw={700} mb={0} label="Payment Information" labelPosition="left" />
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Text size='sm' c={'dimmed'}>Amount Paid</Text>
                            <Text size='sm'><MoneyFigure figure={sale.total_amount_paid} /></Text>
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Text size='sm' c={'dimmed'}>Selling Price</Text>
                            <Text size='sm'><MoneyFigure figure={sale.selling_price} /></Text>
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Text size='sm' c={'dimmed'}>Method</Text>
                            <Text size='sm'>{toHeadline(sale.payment_method)}</Text>
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Text size='sm' c={'dimmed'}>Status</Text>
                            <PaymentStatusBadge status={sale.payment_status}  />
                        </GridCol>
                        <GridCol span={12}>
                            <Divider my="xs" fw={700} mb={0} label="Update Information" labelPosition="left" />
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Text size='sm' c={'dimmed'}>Updated by</Text>
                            <Text size='sm'>{sale.added_by}</Text>
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Text size='sm' c={'dimmed'}>Last updated on</Text>
                            <Text size='sm'><DefaultDateTime dateFormat={sale.updated_at} /></Text>
                        </GridCol>

                        <GridCol span={12}>
                            <Text size='sm' c={'dimmed'}>Delivery details</Text>
                            <Text size='sm'>{sale.delivery_details}</Text>
                        </GridCol>
                    </Grid>
                    
                </PaperCardBody>
            </PaperCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
            <PaperCard>
                <PaperCardHeader>
                    <Text fw={'bold'}>Customer Details</Text>
                    <ActionIcon.Group>
                    <ActionIcon component={Link} to={`/sales/customers/${sale.customer?.id}/view`} variant="light" radius="md" aria-label="Settings">
                        <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon component={Link} to={`/sales/customers/${sale.customer?.id}/edit`} variant="filled" radius="md" aria-label="Settings">
                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                    </ActionIcon.Group>
                </PaperCardHeader>
                <PaperCardBody>
                    <Text size='sm' c={'dimmed'}>
                        Name
                    </Text>
                    <Text size='sm'>
                        {`${sale.customer?.first_name} ${sale.customer?.last_name}`}
                    </Text>
                    <Text mt={'10px'} size='sm' c={'dimmed'}>
                        Email
                    </Text>
                    <Text size='sm'>
                        {`${sale.customer?.email}`}
                    </Text>
                    <Text mt={'10px'} size='sm' c={'dimmed'}>
                        Phone
                    </Text>
                    <Text size='sm'>
                        {`${sale.customer?.phone}`}
                    </Text>
                    <Text mt={'10px'} size='sm' c={'dimmed'}>
                        Location
                    </Text>
                    <Text size='sm'>
                        {`${sale.customer?.city} - ${sale.customer?.country}`}
                    </Text>
                    <Text mt={'10px'} size='sm' c={'dimmed'}>
                        Address
                    </Text>
                    <Text size='sm'>
                        {`${sale.customer?.address}`}
                    </Text>
                </PaperCardBody>
            </PaperCard>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ViewSale
