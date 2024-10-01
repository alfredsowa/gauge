import PageBreadCrumb from '../../components/PageBreadCrumb'
import PageTitle from '../../components/PageTitle'
import { LinkItem } from '../../requests/models/_general'
import {Link, useLoaderData, useNavigate} from 'react-router-dom'
import { CustomerModel } from '../../requests/models/_sales'
import { Accordion, ActionIcon, Avatar, Divider, Grid, GridCol, Group, Text} from '@mantine/core'
import PaperCard from '../../components/PaperCard'
import PaperCardHeader from '../../components/PaperCardHeader'
import PaperCardBody from '../../components/PaperCardBody'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { notify } from '../../requests/general/toast'
import { deleteCustomer } from '../../requests/_saleRequests'
import { DefaultDateTime, DefaultReadableDate } from '../../requests/general/_dates'
import SaleStatusBadge from '../../components/SaleStatusBadge'
import { toHeadline } from '../../requests/general/_stringHelper'
import { MoneyFigure, PrettyFigure } from '../../requests/general/_numberHelper'
import PaymentStatusBadge from '../../components/PaymentStatusBadge'

const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sales', href: '/sales' },
    { title: 'Customers', href: '/sales/customers' },
    { title: 'View Customer', href: '#' },
]
const ViewCustomer = () => {
    const navigate = useNavigate()
    const customer = useLoaderData() as CustomerModel
    
    const sales = customer.sales.map((sale) => (
        <Accordion.Item value={String(sale.id)} key={sale.id}>
          <Accordion.Control>
          <Group wrap="nowrap">
                <Avatar src={sale.product_image} radius="sm" size="md" />
                <div>
                    <Text size="sm" fw={600} c="dimmed">{sale.product_name}</Text>
                    <Text size="sm" c="dimmed" fw={400}>
                    <DefaultDateTime dateFormat={sale.sale_date_time}  />
                    </Text>
                </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
          <Grid>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Avatar radius={14} style={{ width: '200px', height: '200px' }} src={sale.product_image}  />
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                            <Grid>
                                <GridCol span={12}>
                                    <Text size='sm' c={'dimmed'}>Product name</Text>
                                    <Text size='sm'>{sale.product_name}</Text>
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
                                    <Text size='sm' c={'dimmed'}>Sale Type</Text>
                                    <Text size='sm'>{toHeadline(sale.sale_type)}</Text>
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
          </Accordion.Panel>
        </Accordion.Item>
      ));

    const deleteItem = async() => {
        try {
            const response = await deleteCustomer(customer.id)
            if(response.data.deleted) {
                notify({
                    type:'success',
                    message: response.data.message,
                    title: 'Done'
                })
                navigate('/sales/customers', {replace: true})
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
          title: 'Delete your customer',
          centered: true,
          children: (
            <Text size="sm">
              Are you sure you want to delete customer? This data will be lost permanently..
            </Text>
          ),
          labels: { confirm: 'Delete', cancel: "Cancel" },
          confirmProps: { color: 'red' },
          onCancel: () => console.log('Cancel'),
          onConfirm: () => deleteItem(),
    });
    
  return (
    <>
        <PageTitle title='View Customer'>
            <PageBreadCrumb pageBreadCrumbs={items} />
        </PageTitle>
      
        <PaperCard>
            <PaperCardHeader>
                <Text fw={'bold'}>
                    Customer Information
                </Text>
                <ActionIcon.Group>
                    <ActionIcon component={Link} to={`/sales/customers/${customer.id}/edit`} variant="light" radius="md" aria-label="Edit">
                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                
                    {
                        !customer.prevent_delete?(
                            <ActionIcon variant="filled" color={'red'} radius="md" aria-label="Delete" onClick={()=>openDeleteModal()}>
                                <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                        ):''
                    }
                </ActionIcon.Group>
            </PaperCardHeader>
            <PaperCardBody>
                <Grid>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>Name</Text>
                        <Text size='sm'>{customer.first_name+' '+customer.last_name}</Text>
                    </GridCol>
                    
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>Added on</Text>
                        <Text size='sm'>{<DefaultReadableDate dateFormat={customer.created_at} />}</Text>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>Email</Text>
                        <Text size='sm'>{customer.email}</Text>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>Phone</Text>
                        <Text size='sm'>{customer.phone}</Text>
                    </GridCol>
                    <GridCol span={12}>
                        <Divider my="xs" fw={700} mb={0} label="Location" labelPosition="left" />
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>Country</Text>
                        <Text size='sm'>{customer.country?customer.country:'-'}</Text>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>State/Region</Text>
                        <Text size='sm'>{customer.state?customer.state:'-'}</Text>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>City</Text>
                        <Text size='sm'>{customer.city?customer.city:'-'}</Text>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>Address</Text>
                        <Text size='sm'>{customer.address?customer.address:'-'}</Text>
                    </GridCol>
                    <GridCol span={12}>
                        <Divider my="xs" fw={700} mb={0} label="Other Information" labelPosition="left" />
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>Company</Text>
                        <Text size='sm'>{customer.company_name?customer.company_name:'-'}</Text>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Text size='sm' c={'dimmed'}>Contact person</Text>
                        <Text size='sm'>{customer.contact_person?customer.contact_person:'-'}</Text>
                    </GridCol>

                    <GridCol span={12}>
                        <Text size='sm' c={'dimmed'}>Additional information</Text>
                        <Text size='sm'>{customer.additional_info?customer.additional_info:'-'}</Text>
                    </GridCol>
                </Grid>
                
            </PaperCardBody>
        </PaperCard>
        
        <PaperCard>
            <PaperCardHeader>
                <Text fw={'bold'}>Purchase History</Text>
            </PaperCardHeader>
            <PaperCardBody>
                {/* <Text size='sm'>
                    List of purchases made by the customer.
                </Text> */}
                <Text size='sm'>
                    Total number of purchases: <Text size='sm' component='span' fw={600}>
                     <PrettyFigure figure={customer.purchases?customer.purchases:0}  />
                    </Text>
                </Text>
                <Accordion mt={20} chevronPosition="right" variant="contained">
                    {sales?sales:(
                        <Text size='sm' c={'dimmed'}>No purchases made</Text>
                    )}
                </Accordion>
            </PaperCardBody>
        </PaperCard>
        
    </>
  )
}

export default ViewCustomer
