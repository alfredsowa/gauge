import { LinkItem } from '../../requests/models/_general'
import PageBreadCrumb from '../../components/PageBreadCrumb'
import { Avatar, Button, Grid, Group, Text } from '@mantine/core'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { ProductCost, ProductModel } from '../../requests/models/_product'
import { DefaultDate } from '../../requests/general/_dates'
import { MoneyFigure, PrettyFigure, PrettyPercentage } from '../../requests/general/_numberHelper'
import { modals } from '@mantine/modals'
import { deleteProduct } from '../../requests/_productRequests'
import { notify } from '../../requests/general/toast'
import PageTitle from '../../components/PageTitle'
import PaperCard from '../../components/PaperCard'
import PaperCardHeader from '../../components/PaperCardHeader'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import PaperCardBody from '../../components/PaperCardBody'
import ProductMaterials from './components/ProductMaterials'
import ProductCostAndPricing from './components/ProductCostAndPricing'
import { useEffect, useState } from 'react'
    
const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/products' },
    { title: 'View product', href: '#' },
]

const ViewProduct = () => {
    const [productCosts, setProductCosts] = useState<ProductCost>();
    const navigate  = useNavigate()
    const getProductData = useLoaderData() as ProductModel;

    useEffect(() =>{
        const prodCost = () => {
          return setProductCosts(getProductData.product_costs)
        }
    
        prodCost()
      },[getProductData])

    const deleteItem = async() => {
        try {
            const response = await deleteProduct(getProductData.id)
            if(response.data.deleted) {
            
            notify({
                type:'success',
                message: response.data.message,
                title: 'Done'
            })

            navigate('/products', {replace: true})
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
        title: 'Delete your product',
        centered: true,
        children: (
            <Text size="sm">
            Are you sure you want to delete Product? This data will be lost permanently..
            </Text>
        ),
        labels: { confirm: 'Delete', cancel: "Cancel" },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => deleteItem(),
    });
  
    
    return (
        <>
        <PageTitle title="View Product">
            <PageBreadCrumb pageBreadCrumbs={items} />
        </PageTitle>

        <Grid>
            <Grid.Col span={{ base: 12, lg: 7 }}>
                <PaperCard>
                    <PaperCardHeader>
                        <Text fw={'bold'} fz={'md'}>
                            Product Details
                        </Text>
                        <Button.Group>
                            <Button size='xs' component={Link} to={`/products/${getProductData.slug}/edit`}
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
                            <Grid.Col span={{ base: 12, sm: 4, md: 6, lg: 6 }}>
                                <Avatar radius={14} style={{ maxWidth: 'auto', minWidth:'150px',
                                    maxHeight: '200px', minHeight:'150px' }}
                                        src={getProductData.image}  />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 12, lg: 6 }}>
                                <Grid>
                                    <Grid.Col span={12}>
                                        <Group justify='space-between'>
                                        <Text size='sm' c={'dimmed'}>Product name:</Text>
                                        <Text size='sm'>{getProductData.name}</Text>
                                        </Group>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Group justify='space-between'>
                                        <Text size='sm' c={'dimmed'}>Status:</Text>
                                        {getProductData.is_active?  
                                        (
                                            <Text size='sm' c="green">
                                                Online
                                            </Text>
                                            
                                        ):
                                        (
                                            <Text size='sm' c="red">
                                                Draft
                                            </Text>
                                        )}
                                        </Group>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Group justify='space-between'>
                                        <Text size='sm' c={'dimmed'}>Retail Price:</Text>
                                        <Text size='sm'><MoneyFigure figure={getProductData.price}  /></Text>
                                        </Group>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Group justify='space-between'>
                                        <Text size='sm' c={'dimmed'}>Wholesale Price:</Text>
                                        <Text size='sm'><MoneyFigure figure={getProductData.wholesale_price}  /></Text>
                                        </Group>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Group justify='space-between'>
                                        <Text size='sm' c={'dimmed'}>Production Cost:</Text>
                                        <Text size='sm'><MoneyFigure figure={getProductData.production_cost}  /></Text>
                                        </Group>
                                    </Grid.Col>
                                </Grid>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 12, lg: 6 }}>
                                <Group justify='space-between'>
                                    <Text size='sm' c={'dimmed'}>SKU:</Text>
                                    <Text size='sm'>{getProductData.sku?getProductData.sku:"N/A"}</Text>
                                </Group>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 12, lg: 6 }}>
                                <Group justify='space-between'>
                                    <Text size='sm' c={'dimmed'}>Stock Quantity:</Text>
                                    <Text size='sm'>
                                        {
                                            (getProductData.stock_quantity <= 0)?
                                                (
                                                    <>
                                                        <PrettyFigure figure={getProductData.stock_quantity} />
                                                        <Text size='sm' component='span' mx={4} fw={600} c={'red'}>
                                                            - Out of stock
                                                        </Text>
                                                    </>):
                                                (getProductData.min_stock_quantity > getProductData.stock_quantity)?
                                                    (
                                                        <>
                                                            <PrettyFigure figure={getProductData.stock_quantity} />
                                                            <Text size='sm' component='span' mx={4} fw={600} c={'yellow'}>
                                                                - Almost out of stock
                                                            </Text>
                                                        </>):
                                                    (
                                                        <>
                                                            <PrettyFigure figure={getProductData.stock_quantity} />
                                                            <Text size='sm' component='span' mx={4} fw={600} c={'green'}>
                                                                - In stock
                                                            </Text>
                                                        </>)
                                        }
                                    </Text>
                                </Group>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 12, lg: 6 }}>
                                <Group justify='space-between'>
                                    <Text size='sm' c={'dimmed'}>Minimum Stock Quantity:</Text>
                                    <Text size='sm'><PrettyFigure figure={getProductData.min_stock_quantity} /></Text>
                                </Group>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 12, lg: 6 }}>
                                <Group justify='space-between'>
                                <Text size='sm' c={'dimmed'}>Discount:</Text>
                                <Text size='sm'><PrettyPercentage figure={getProductData.discount_price}  /></Text>
                                </Group>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 12, lg: 6 }}>
                                <Group justify='space-between'>
                                <Text size='sm' c={'dimmed'}>Created On:</Text>
                                <Text size='sm'><DefaultDate dateFormat={getProductData.created_at}  /></Text>
                                </Group>
                            </Grid.Col>
                            {/*<Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 6 }}></Grid.Col>*/}
                            <Grid.Col span={{ base: 12, sm: 6, md: 12, lg: 6 }}>
                                <Group justify='space-between'>
                                <Text size='sm' c={'dimmed'}>Last Updated:</Text>
                                <Text size='sm'><DefaultDate dateFormat={getProductData.updated_at}  /></Text>
                                </Group>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                                <Group justify='space-between'>
                                <Text size='sm' c={'dimmed'}>Description:</Text>
                                <Text size='sm'>{getProductData.description}</Text>
                                </Group>
                            </Grid.Col>
                            {/* <Grid.Col span={12}>
                                <Divider my="xs" fw={700} mb={0} label="Payment Information" labelPosition="left" />
                            </Grid.Col> */}
                        </Grid>
                    </PaperCardBody>
                </PaperCard>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 5 }} id='product_materials'>
            <PaperCard>
            <PaperCardHeader>
              <Text fw={'bold'} fz={'md'}>
                Cost & Pricing
              </Text>
            </PaperCardHeader>
            <PaperCardBody>
              <ProductCostAndPricing productCosts={productCosts} product={getProductData}/>
            </PaperCardBody>
          </PaperCard>
            <PaperCard>
                <PaperCardHeader>
                    <Text fw={'bold'} fz={'md'}>
                        Product Materials Information
                    </Text>
                </PaperCardHeader>
                <PaperCardBody>
                    <ProductMaterials
                        setProductCosts={setProductCosts} 
                        product_id={getProductData.id} 
                        prodMaterials={getProductData.materials} 
                        prodIntermediateGoods={getProductData.used_intermediate_goods} 
                        />
                </PaperCardBody>
            </PaperCard>
            </Grid.Col>
        </Grid>
        </>
  )
}

export default ViewProduct
