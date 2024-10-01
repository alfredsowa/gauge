import { Center, Flex, Grid, Group, SimpleGrid, Skeleton, Stack, Text, rem } from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconCalendar,
  IconChartPie,
  IconList,
  IconChartBar,
} from '@tabler/icons-react';
import { BarChart, DonutChart, DonutChartCell } from '@mantine/charts';
import useDocumentTitle from '../hooks/use-document-title'
import PageTitle from '../components/PageTitle';
import { useEffect, useState } from 'react';
import { getCardAnalytics } from '../requests/_dashboardRequests';
import { CardAnalytics, MostUsedMaterial, TopMovingProducts } from '../requests/models/_dashboard';
import { ProductionBasicModel } from '../requests/models/_production';
import { getFullMonth } from '../requests/general/_dates';
import CardAnalyticsStat from '../components/CardAnalyticsStat';
import ProductionDasboardCard from '../components/ProductionDasboardCard';
import PaperCard from '../components/PaperCard';
import PaperCardBody from '../components/PaperCardBody';
import PaperCardHeader from '../components/PaperCardHeader';
import { useSearchParams } from "react-router-dom";
import { DateValue, MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import MaterialsUsedDasboardCard from '../components/MaterialsUsedDasboardCard';
import ChartToolTip from '../components/ChartToolTip';
import PopUpSetupGuide from "../components/PopUpSetupGuide.tsx";

type ProductGraph = {
  product: string;
  productions: number;
}

type ProductSaleGraph = {
  product: string;
  quantity: number;
}

const currentMonth = new Date().getMonth()+1;

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cardAnalytics, setCardAnalytics] = useState<CardAnalytics[]>()
  const [latestOngoingProductionsTable, setLatestOngoingProductionsTable] = useState<ProductionBasicModel[]>()
  const [completedProductsProductionsGraph, setCompletedProductsProductionsGraph] = useState<ProductionBasicModel[]>()
  const [salesChannelRate, setSalesChannelRate] = useState<DonutChartCell[]>([])
  const [topMovingProductsGraph, setTopMovingProductsGraph] = useState<TopMovingProducts[]>()
  const [mostUsedMaterials, setMostUsedMaterials] = useState<MostUsedMaterial[]>()
  const [cardAnalyticsLoading, setCardAnalyticsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString())
  const [monthSelected, setMonthSelected] = useState(currentMonth)

  const icon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

  useDocumentTitle("Dashboard")

  useEffect(() => {

    const cardAnalyticsResponse = async() => {

      let response
      if (searchParams.size > 0) {
        const month = Number(searchParams.get("month"))
        const year = Number(searchParams.get("year"))
        setMonthSelected(month)
        response = await getCardAnalytics({month: month,year: year})
      }
      else{
        setMonthSelected(currentMonth)
        setSelectedDate(new Date().toISOString())
        response = await getCardAnalytics()
      }
      
      if (response) {
        setCardAnalytics(response.data.card_analytics)

        setLatestOngoingProductionsTable(response.data.recent_productions)
        setMostUsedMaterials(response.data.most_materials_used_selected_month)
        setCompletedProductsProductionsGraph(response.data.completed_product_productions)
        setTopMovingProductsGraph(response.data.top_moving_products_selected_month)
        setSalesChannelRate(response.data.channel_rate)
        setCardAnalyticsLoading(false)
      }
    }

    cardAnalyticsResponse()
    
  },[searchParams]);
  
  

  const stats = cardAnalytics?.map((stat) => {
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;
    return (
      <CardAnalyticsStat key={stat.title} stat={stat} DiffIcon={DiffIcon} />
    );

  });

  const latestOngoingProductionsTableList = latestOngoingProductionsTable?.map((production) =>{
    return (
      <ProductionDasboardCard key={production.id} production={production} cardAnalyticsLoading={cardAnalyticsLoading} />
    )

  })

  const mostUsedMaterialsTableList = mostUsedMaterials?.map((material) =>{
    return (
      <MaterialsUsedDasboardCard key={material.id} material={material} />
    )

  })

  let completedProductsProductionsGraphList: ProductGraph[]|null = null

  if(completedProductsProductionsGraph){
    completedProductsProductionsGraphList = completedProductsProductionsGraph.map((production) =>{
      return {
        product: production.product.name,
        productions: production.quantity
      }
    });
  }

  let salesChannelChart: DonutChartCell[] = []

  if(salesChannelRate){
    salesChannelChart = salesChannelRate.map((channel) =>{
      return {
        name: channel.name,
        value: Number(channel.value),
        color: channel.color
      }
    });
  }

  let topProductsSoldGraphList: ProductSaleGraph[]|null = null

  if(topMovingProductsGraph){
    topProductsSoldGraphList = topMovingProductsGraph.map((product) =>{
      return {
        product: product.name,
        quantity: Number(product.quantity)
      }
    });
  }
  
  const changeMonth = (value: DateValue) => {
    if(value) {
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      
      setSelectedDate(value.toISOString());
      
      setSearchParams({ month: String(month), year: String(year) });
    }
  };

  return (
    <>
      <PageTitle back={false} title='Dashboard' />

      <Group mb={10} justify="space-between">
        <Text mx={5} fw={500}>Quick monthly comparison analysis</Text>
        <Group>
          <Text mx={5} fw={500}>Select Month </Text>
          <MonthPickerInput
            w={200}
            leftSection={icon}
            dropdownType="modal"
            // defaultValue={new Date(selectedDate)}
            value={new Date(selectedDate)}
            onChange={(date) => changeMonth(date)}
            maxDate={dayjs(new Date()).toDate()}
          />
        </Group>
        
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" verticalSpacing="lg">
        {
          cardAnalyticsLoading?(
            <>
            <Skeleton h={123} radius={14}></Skeleton>
            <Skeleton h={123} radius={14}></Skeleton>
            <Skeleton h={123} radius={14}></Skeleton>
            </>
          ):
        stats
        }
      </SimpleGrid>

      <Grid mt={30} gutter={{ base: 5, xs: 'md', md: 'xl', xl: 30 }}>

        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          {
            cardAnalyticsLoading?(
              <>
              <Skeleton h={290} radius={14}></Skeleton>
              </>
            ):
            <PaperCard height={290}>
              <PaperCardHeader>
                <Text fz="lg" fw={600} >
                  Most Products Produced in {getFullMonth(Number(monthSelected))}
                </Text>
                {/* <ActionIcon variant="subtle" color="gray">
                  <IconMaximize style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon> */}
              </PaperCardHeader>
              <PaperCardBody>
              {
                (completedProductsProductionsGraphList !== null 
                  && 
                  completedProductsProductionsGraphList.length > 0) ? 
                
                <BarChart
                  h={350}
                  barProps={{ radius: 10 }}
                  tooltipProps={{
                    content: ({ label, payload }) => <ChartToolTip label={label} payload={payload} />,
                  }}
                  data={completedProductsProductionsGraphList}
                  dataKey="product"
                  // withLegend={true}
                  valueFormatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                  withBarValueLabel
                  series={[
                    { name: 'productions', color: 'gauge-primary.3' },
                  ]}
                  tickLine="y" 
                  legendProps={{ verticalAlign: 'top', height: 50 }}
                /> : (
                  // <Card p={20} withBorder={false} radius={14}>
                    <Flex justify={"center"} align="center" wrap="wrap" p={20}>
                      <Stack align="center" justify="flex-start">
                        <IconChartBar  size="3.5rem" stroke={1} />
                        <Text fz="sm" fw={400} c="dimmed" mb="sm">
                          No product produced this month
                        </Text>
                        <Text fz="sm" fw={400} c="dimmed" mb="md">
                          We want to see you producing more and more for your customers. Let's get busy! 
                        </Text>
                      </Stack>
                    </Flex>
                  // </Card>
                )
              }
              </PaperCardBody>
            </PaperCard>
          }
          
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          {
            cardAnalyticsLoading?(
              <>
              <Skeleton h={290} radius={14}></Skeleton>
              </>
            ):
            <PaperCard height={290}>
              <PaperCardHeader>
                <Text fz="lg" fw={600} >
                  Top Moving Products in {getFullMonth(Number(monthSelected))}
                </Text>
                {/* <ActionIcon variant="subtle" color="gray">
                  <IconMaximize style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon> */}
              </PaperCardHeader>
              <PaperCardBody>
              {
                (topProductsSoldGraphList !== null 
                  && 
                  topProductsSoldGraphList.length > 0) ? 
                
                <BarChart
                  h={350}
                  barProps={{ radius: 10 }}
                  data={topProductsSoldGraphList}
                  dataKey="product"
                  tooltipProps={{
                    content: ({ label, payload }) => <ChartToolTip label={label} payload={payload} />,
                  }}
                  // withLegend={true}
                  valueFormatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                  withBarValueLabel
                  series={[
                    { name: 'quantity', color: 'gauge-primary.3' },
                  ]}
                  tickLine="y" 
                  legendProps={{ verticalAlign: 'top', height: 50 }}
                /> : (
                  // <Card p={20} withBorder={false} radius={14}>
                    <Flex justify={"center"} align="center" wrap="wrap" p={20}>
                      <Stack align="center" justify="flex-start">
                        <IconChartBar  size="3.5rem" stroke={1} />
                        <Text fz="sm" fw={400} c="dimmed" mb="sm">
                          No product sold this month
                        </Text>
                        <Text fz="sm" fw={400} c="dimmed" mb="md">
                          We want to see you selling more and more to your customers. Let's get busy! 
                        </Text>
                      </Stack>
                    </Flex>
                  // </Card>
                )
              }
              </PaperCardBody>
            </PaperCard>
          }
        </Grid.Col>
      </Grid>

      <Grid>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          {
            cardAnalyticsLoading?(
              <>
              <Skeleton h={370} radius={14}></Skeleton>
              </>
            ):
            <PaperCard height={410}>
              <PaperCardHeader>
                <Text fz="lg" fw={600} >
                  Channels Rate in {getFullMonth(Number(monthSelected))}
                </Text>
                {/* <ActionIcon variant="subtle" color="gray">
                  <IconMaximize style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon> */}
              </PaperCardHeader>
              <PaperCardBody>
                <Text fz={'sm'}>
                  This chart shows the total number of items sold.
                </Text>
                <Center>
                  {
                    salesChannelRate.length > 0 ? (
                      <DonutChart 
                        labelColor=''
                        size={200} 
                        tooltipDataSource="segment"
                        thickness={50} 
                        withLabelsLine 
                        withLabels 
                        paddingAngle={3} 
                        data={salesChannelChart} 
                      />
                    ): (
                      // <Card p={20} withBorder={false} radius={14}>
                        <Flex justify={"center"} align="center" wrap="wrap" mt={30}>
                          <Stack align="center" justify="flex-start">
                            <IconChartPie  size="3.5rem" stroke={1} />
                            <Text fz="sm" fw={400} c="dimmed" mb="md">
                              No sales channel rate data available
                            </Text>
                          </Stack>
                        </Flex>
                      // </Card>
                    )
                  }
                  
                </Center>
              </PaperCardBody>
            </PaperCard>
          }
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
          {
            cardAnalyticsLoading?(
              <>
              <Skeleton h={410} radius={14}></Skeleton>
              </>
            ):
            <PaperCard height={410}>
              <PaperCardHeader>
                <Text fz="lg" fw={600} >
                  Most Used Materials in {getFullMonth(Number(monthSelected))}
                </Text>
                {/* <ActionIcon variant="subtle" color="gray">
                  <IconMaximize style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon> */}
              </PaperCardHeader>
              <PaperCardBody px={0} py={0}>
                {
                  (mostUsedMaterialsTableList !== undefined && mostUsedMaterialsTableList.length > 0) ? 
                  mostUsedMaterialsTableList :

                    <Flex justify={"center"} align="center" wrap="wrap" mt={30}>
                          <Stack align="center" justify="flex-start">
                            <IconList  size="3.5rem" stroke={1} />
                            <Text fz="sm" fw={400} c="dimmed" mb="md">
                              No used materials recorded
                            </Text>
                          </Stack>
                        </Flex>
                }
              </PaperCardBody>
            </PaperCard>
          }
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          {
            cardAnalyticsLoading?(
              <>
              <Skeleton h={410} radius={14}></Skeleton>
              </>
            ):
            <PaperCard height={410}>
              <PaperCardHeader>
                <Text fz="lg" fw={600} >
                  Latest Productions
                </Text>
                {/* <ActionIcon variant="subtle" color="gray">
                  <IconMaximize style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon> */}
              </PaperCardHeader>
              <PaperCardBody px={0} py={0}>
                {
                  (latestOngoingProductionsTableList !== undefined 
                    && 
                    latestOngoingProductionsTableList.length > 0) ? 
                  
                  latestOngoingProductionsTableList : 
                   
                  // <Card p={20} withBorder={false} radius={14}>
                    <Flex justify={"center"} align="center" wrap="wrap" p={20}>
                      <Stack align="center" justify="flex-start">
                        <IconList  size="3.5rem" stroke={2} />
                        <Text fz="sm" fw={400} c="dimmed" mb="md">
                          No ongoing productions 
                        </Text>
                        <Text fz="sm" fw={400} c="dimmed" mb="md">
                          We want to see you producing more and more for your customers. Let's get busy! 
                        </Text>
                      </Stack>
                    </Flex>
                  // </Card>
                }
              </PaperCardBody>
            </PaperCard>
          }
        </Grid.Col>
      </Grid>

      <PopUpSetupGuide />
    </>
  );
}

export default Dashboard