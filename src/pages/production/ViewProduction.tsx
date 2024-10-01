/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { LinkItem } from '../../requests/models/_general';
import PageBreadCrumb from '../../components/PageBreadCrumb';
import { Accordion, ActionIcon, Alert, Badge, Card, Grid, Group, Text } from '@mantine/core';
import { IconEdit, IconInfoCircle } from '@tabler/icons-react';
import { History, ProductionFullModel, ProductionIntermediateGoods, ProductionMaterial } from '../../requests/models/_production';
import { DefaultDate } from '../../requests/general/_dates';
import { isStringInArray, toHeadline } from '../../requests/general/_stringHelper';
import { MoneyFigure, PrettyFigure } from '../../requests/general/_numberHelper';
import TimelineComponent from '../../components/Timeline';
import PageTitle from '../../components/PageTitle';
import ProductionMaterials from './components/ProductionMaterials';
import PaperCard from '../../components/PaperCard';
import PaperCardBody from '../../components/PaperCardBody';
import { useDocumentTitle } from '@mantine/hooks';
import StatusProductionModal from './components/StatusProductionModal';
import { productionEnds } from '../../requests/general/options';
import PaperCardHeader from '../../components/PaperCardHeader';
import GroupList from '../../components/GroupList';
import ProductMaterialsList from './components/ProductMaterialsList';
import IntermediateGoodMaterialsList from './components/IntermediateGoodMaterialsList';
import { IntermediateGoodBasicModel } from '../../requests/models/_intermediateGood';
import { getFullProduct } from '../../requests/_productRequests';
import { ProductModel } from '../../requests/models/_product';
import { getBasicIntermediateGood } from '../../requests/_intermediateGoodsRequests';

const ViewProduction = () => {
    const getProductionViewData = useLoaderData() as ProductionFullModel
    const production = getProductionViewData
    const [history, setHistory] = useState<History[]>(production.history)
    const [proStage, setProStage] = useState<string | null>(production.status)
    const [proStatus, setProStatus] = useState<string|null>(production.status)
    const [product, setProduct] = useState<ProductModel | undefined>()
    const [intermediateGood, setIntermediateGood] = useState<IntermediateGoodBasicModel | undefined>()
    // const [formLoading, setFormLoading] = useState(false)
    const prodMaterials: ProductionMaterial[] = production.materials
    const prodIntermediateGoods: ProductionIntermediateGoods[] = production.intermediate_goods

    useEffect(()=>{

        const getMaterials = async () => {
            if(production.type === "product") {
                const response = await getFullProduct(production.product_id)
                setProduct(response.data)
            }
            else if(production.type === "intermediate_good") {
                const response = await getBasicIntermediateGood(production.intermediate_good_id)
                setIntermediateGood(response.data)
            }
        }
        getMaterials()
        
    })

    const items: Array<LinkItem> = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Productions', href: '/productions' },
        { title: 'View production', href: '#' },
      ]
      
    
    useDocumentTitle("View Productions")
    
      return (
        <>
        <PageTitle title='View Production'>
            <PageBreadCrumb pageBreadCrumbs={items} />
        </PageTitle>

        <Grid gutter={{ base: 5, xs: 'md', md: 'md', xl: 30 }}>

            <Grid.Col pt={10} span={{ base: 12, lg: 7 }}>

                {
                    production.insufficient_materials?(
                        <Alert mb={15} variant="light" color="red" radius="lg" title="Insufficient Materials" icon={<IconInfoCircle />}>
                            <Text fz={'sm'}>This production cannot proceed due to insufficient materials. 
                                Please update your inventory to proceed or reduce the production quantity.</Text>
                        </Alert>
                        ):''
                }
                

                <PaperCard>
                    <PaperCardHeader>
                        <Text fz={18} fw={500}>
                            {production.title}
                        </Text>
                        <Group>
                            
                            {
                                (!isStringInArray(proStage,productionEnds))?(
                                    <ActionIcon size='lg' component={Link} to={`/productions/${production.id}/edit`} 
                                    variant='light' aria-label="Edit Production"> 
                                    <IconEdit size={17} stroke={2}  />
                                    </ActionIcon>
                                ):(proStage === 'completed' ? (
                                    <Badge color="green" size='lg' radius="md">{toHeadline(production.status)}</Badge>
                                ):(proStage === 'cancel' ?(
                                    <Badge color="red" tt={'uppercase'} size='lg' radius="md">Cancelled</Badge>
                                ):<Badge color="red" tt={'uppercase'} size='lg' radius="md">Damaged</Badge>))
                            }
                            {
                                !isStringInArray(proStatus,productionEnds)?(
                                    !production.insufficient_materials?(
                                        <StatusProductionModal previousStatus={proStatus} id={production.id} nextStatus={proStage} setNextStatus={setProStage} setPreviousStatus={setProStatus} setHistory={setHistory} />
                                    ):''
                                ):null
                            }
                            
                        </Group>
                    </PaperCardHeader>
                    <PaperCardBody px={0} py={0}>

                        <GroupList>
                            <Text c="dimmed">Category</Text>
                            <Text ml={10} fw={500}>
                                {toHeadline(production.category)} 
                            </Text>
                        </GroupList>

                        {
                            production.category === 'product'?(
                            <>
                                {
                                    production.type === 'product'?(
                                        <>

                                            <GroupList>
                                                <Text c={'dimmed'}>Product Name</Text>
                                                <Text ml={10} fw={500}> {production.product.name}</Text>
                                            </GroupList>
                                        </>
                                    ): production.type === 'intermediate_good' && (
                                        <>
                                        
                                            <GroupList>
                                                <Text c={'dimmed'}>Intermediate Good</Text>
                                                <Text ml={10} fw={500}>{production.intermediate_good.name} </Text>
                                            </GroupList>
                                        </>
                                    )
                                }
                            </>
                            ):''
                        }

                        <GroupList>
                            <Text c="dimmed">Priority</Text>
                            <Text ml={10} fw={500}> {toHeadline(production.priority)} </Text>
                        </GroupList>

                        <GroupList>
                            <Text c="dimmed">Estimated Time</Text>
                            <Text ml={10} fw={500}> {production.estimated_hours} Hours </Text>
                        </GroupList>

                        <GroupList>
                            <Text c="dimmed">Quantity</Text>
                            <Text ml={10} fw={500}> <PrettyFigure figure={production.quantity} /> </Text>
                        </GroupList>

                        <GroupList>
                            <Text c="dimmed">Labour Cost</Text>
                            <Text ml={10} fw={500}> <MoneyFigure figure={production.labour_cost} /> </Text>
                        </GroupList>

                        <GroupList noBorder>
                            <Text c="dimmed">Assignee</Text>
                            <Text ml={10} fw={500}> {production.assignee.first_name} {production.assignee.last_name} </Text>
                        </GroupList>
                    </PaperCardBody>
                </PaperCard>

                <PaperCard>
                    <PaperCardHeader>
                        <Text fz={18} fw={500}>
                            Dates
                        </Text>
                    </PaperCardHeader>
                    <PaperCardBody px={0} py={0}>
                        <GroupList>
                            <Text c="dimmed">Start Date</Text>
                            <Text ml={10} fw={500}> <DefaultDate dateFormat={production.start_date} /> </Text>
                        </GroupList>
                        <GroupList>
                            <Text c="dimmed">End Date</Text>
                            <Text ml={10} fw={500}> <DefaultDate dateFormat={production.end_date} /> </Text>
                        </GroupList>
                        <GroupList>
                            <Text c="dimmed">Deadline Date</Text>
                            <Text ml={10} fw={500}> <DefaultDate dateFormat={production.deadline_date} /> </Text>
                        </GroupList>
                        <GroupList>
                            <Text c="dimmed">Created On</Text>
                            <Text ml={10} fw={500}> <DefaultDate dateFormat={production.created_at} /> </Text>
                        </GroupList>
                        <GroupList noBorder>
                            <Text c="dimmed">Last Updated</Text>
                            <Text ml={10} fw={500}> <DefaultDate dateFormat={production.updated_at} /> </Text>
                        </GroupList>
                    </PaperCardBody>
                </PaperCard>

                <PaperCard>
                    <PaperCardHeader>
                        <Text fz={18} fw={500}>
                            Description
                        </Text>
                    </PaperCardHeader>
                    <PaperCardBody>
                        {production.description?production.description:'-'}
                    </PaperCardBody>
                </PaperCard>

                <Grid gutter={10}>

                    
                </Grid>
            </Grid.Col>

            <Grid.Col pt={10} span={{ base: 12, lg: 5 }}>

               

                {
                    (proStage === 'backlog' && production.category === 'product')?
                    production.type === 'product'?
                    (
                        <>
                        <PaperCard>
                            <PaperCardHeader>
                            <Text fw={600}>
                                Materials Per Unit Item
                            </Text>
                            </PaperCardHeader>
                            <PaperCardBody>
                                <ProductMaterialsList product={product} />
                            </PaperCardBody>
                        </PaperCard>
                        </>
                    ):
                    (
                        <>
                        <PaperCard>
                            <PaperCardHeader>
                            <Text fw={600}>
                                Materials Per Unit Item
                            </Text>
                            </PaperCardHeader>
                            <PaperCardBody>
                            <IntermediateGoodMaterialsList intermediateGood={intermediateGood} />
                            </PaperCardBody>
                        </PaperCard>
                        </>
                    ):
                    (
                        <ProductionMaterials prodMaterials={prodMaterials} 
                        category={production.category} 
                        prodIntermediateGoods={prodIntermediateGoods} 
                        proStage={proStage} production_id={production.id} 
                        production_quantity={production.quantity} />
                    )
                }

                <Accordion variant="filled" radius={14}>
                    <Accordion.Item component={Card} p={0} value="materials">
                        <Accordion.Control>
                        <Text fz={18} fw={500}>
                            Production History
                        </Text>
                        </Accordion.Control>
                        <Accordion.Panel component={Card}>
                            <TimelineComponent history={history} />
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
               

                
                
            </Grid.Col>

        </Grid>
      
    </>
  )
}

export default ViewProduction
