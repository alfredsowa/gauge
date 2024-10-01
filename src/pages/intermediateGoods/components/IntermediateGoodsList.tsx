import { ActionIcon, Avatar, Center, Flex, Grid, Group, Menu, Paper, ScrollArea, Table, TableTdProps, Text, TextInput, UnstyledButton, keys, rem } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconChevronUp, IconCopy, IconEdit, IconEye, IconSearch, IconSelector, IconTrash } from '@tabler/icons-react';
import React, { useState } from 'react'
import classes from '../../purchases/assets/TableSelection.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper';
import Empty from '../../../components/Empty';
import { notify } from '../../../requests/general/toast';
import { modals } from '@mantine/modals';
import { IntermediateGoodBasicModel, IntermediateGoodMaterialsModel } from '../../../requests/models/_intermediateGood.tsx';
import { deleteIntermediateGood, duplicateIntermediateGood } from '../../../requests/_intermediateGoodsRequests.ts';
// import { DefaultReadableDate } from '../../../requests/general/_dates';
import TotalRecord from '../../../components/TotalRecord';
// import TableLoadingSingle from '../../../components/TableLoadingSingle';
import AddIntermediateGoodsModal from "./AddIntermediateGoodsModal.tsx";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface RowData {
  name: string;
}
  
interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}
  
function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
      <Table.Th className={classes.th} style={{ width: '300px' }}>
      <UnstyledButton onClick={onSort} className={classes.control}>
          <Group justify="space-between">
          <Text fw={700}>
              {children}
          </Text>
          <Center className={classes.icon}>
              <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
          </Group>
      </UnstyledButton>
      </Table.Th>
  );
}
  
function filterData(data: IntermediateGoodBasicModel[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0])?.some((key: keyof IntermediateGoodBasicModel) =>
      typeof item[key] === 'string' && 
      typeof item[key]!== 'undefined' && 
      (item[key] as string)?.toLowerCase().includes(query)
    )
  );
}
  
function sortData(
  data: IntermediateGoodBasicModel[],
  payload: { sortBy: keyof IntermediateGoodBasicModel | null; reversed: boolean; search: string }) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return sortBy!== null && typeof sortBy === 'string'
        ? (b[sortBy] as string).localeCompare(a[sortBy] as string)
          : 0;
      }

      return sortBy && typeof sortBy === 'string'? (a[sortBy] as string).localeCompare(b[sortBy] as string) : 0;
    }),
    payload.search
  );
}


const IntermediateGoodsList = ({intermediateGoods}:{intermediateGoods: IntermediateGoodBasicModel[]|undefined}) => {

    const [search, setSearch] = useState('');
    // const [intermediateGoods, setIntermediateGoods] = useState<IntermediateGoodBasicModel[]>();
    const [sortedData, setSortedData] = useState(intermediateGoods);
    const [sortBy, setSortBy] = useState<keyof IntermediateGoodBasicModel>('name');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    // const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const queryClient = useQueryClient();

    const {mutate: duplicatingIntermediateGood} = useMutation({
      mutationKey: ['intermediateGoodsNew'],
      mutationFn: (id: number) => {
          return duplicateIntermediateGood(id)
      },
      onSuccess: (response) => {
          queryClient.invalidateQueries({queryKey:['intermediateGoods'], refetchType: 'all'})
          notify({
              type:'success',
              message: response.data.message,
              title: 'Duplicate Created'
          })
          return navigate(`/intermediate-goods/${response.data.data.slug}/edit`)
      },
      onError: (error) => {
          if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                  type:'error',
                  message: error.response?.data.error, // Use optional chaining to access data property
                  title: 'Something went wrong'
              })
          } else {
              notify({
                  type:'error',
                  message: 'An unexpected error occurred',
                  title: 'Something went wrong'
              })
          }
      }
  })

    // useEffect(()=>{
    //
    //     const load_intermediateGoods = async () => {
    //         const getIntermediateGoodsResponse = await getIntermediateGoods();
    //         setIntermediateGoods(getIntermediateGoodsResponse.data.data);
    //     }
    //
    //     setLoading(false)
    //     load_intermediateGoods()
    // },[])
    //
    // useEffect(()=>{
    //     setSortedData(intermediateGoods);
    // },[intermediateGoods])

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        if(intermediateGoods) {
            setSortedData(sortData(intermediateGoods, { sortBy: field, reversed, search }));
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        // setLoading(true)
        const { value } = event.currentTarget;
        setSearch(value);
        if(intermediateGoods) {
            setSortedData(sortData(intermediateGoods, { sortBy, reversed: reverseSortDirection, search: value }));
        }
    
        // setLoading(false)
    };

  function sumMaterialCost(materials: IntermediateGoodMaterialsModel[]) {
    if(!Array.isArray(materials)) return 0;
    if(materials.length === 0) return 0;

    let totalCost = 0;

    for (let position = 0; position < materials.length; position++) {
      totalCost += Number(materials[position].cost_per_unit) * Number(materials[position].quantity);
    }

    return totalCost
  }

    const deleteItem = async(id: number) => {
      try {
          const response = await deleteIntermediateGood(id)
          if(response.data.deleted) {
            const data = sortedData?.filter((purchase)=>{
                return purchase.id!== id
            })
            setSortedData(data)
            notify({
                type:'success',
                message: response.data.message,
                title: 'Done'
            })
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

    const duplicateIntermediateGoodData = async(id: number) => {
      duplicatingIntermediateGood(id)
        // const response = await duplicateIntermediateGood(id)
        // const data = response.data

        // if(data.saved) {

        //     notify({
        //         type:'success',
        //         message: data.message,
        //         title: 'Done'
        //     })
        //     navigate(`/intermediate-goods/${data.data.id}/edit`)
        // }
        
    }
    
    const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete your profile',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete IntermediateGood? This data will be lost permanently..
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteItem(id),
    });
    
    let rows: React.ReactElement<TableTdProps>[] = [];

    if(sortedData) {
        rows = sortedData.map((row) => (

            <Table.Tr key={row.id}>
                <Table.Td>
                  <Group gap="sm">
                      <Avatar src={row.image} size={40} radius={10}>PD</Avatar>
                      <div>
                          <Text fw={600}>
                          {row.name}
                          </Text>
                          <Text c="dimmed">
                              {!row.status? (
                                  <Text component='span' fz="sm" tt={'uppercase'} c="yellow">
                                      Draft
                                  </Text>
                              ):''}
                            {/*Modified: <DefaultReadableDate dateFormat={row.updated_at} />*/}
                              {/* SKU: {row.sku} */}
                          </Text>
                      </div>
                  </Group>
                </Table.Td>

                <Table.Td ta={'center'}>
                  {
                    (row.stock_quantity <= 0)? 
                    (<Text c="red">Out of stock </Text>):
                    (row.min_stock_quantity > row.stock_quantity)? 
                    (<Text c="dimmed"><Text component='span' c={'yellow'}> Running out </Text> - <PrettyFigure figure={row.stock_quantity} /></Text>):
                    (<Text c="dimmed"><Text component='span' c={'green'}> In stock </Text> - <PrettyFigure figure={row.stock_quantity} /></Text>)
                  }
                </Table.Td>

                <Table.Td ta={'center'}>
                  <Text c="dimmed">
                      {row.min_stock_quantity}
                  </Text>
                </Table.Td>

                <Table.Td ta={'left'}>
                  <Text c="dimmed">
                      {row.materials?<MoneyFigure figure={sumMaterialCost(row.materials)}  />:0}
                  </Text>
                </Table.Td>

                <Table.Td ta={'left'}>
                    <Text c={'dimmed'}>
                        <Text c={'dimmed'} component='span' fw={600}><MoneyFigure figure={row.labour_cost} /></Text>
                    </Text>
                </Table.Td>

                <Table.Td ta={'left'}>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                        <ActionIcon color='gray' variant="light">
                        <IconChevronRight style={{ width: '70%', height: '70%' }} stroke={2} />
                        </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item component={Link} to={`/intermediate-goods/${row.slug}/view`}
                                leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                View
                            </Menu.Item>
                            <Menu.Item component={Link} to={`/intermediate-goods/${row.slug}/edit`}
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                                Edit
                            </Menu.Item>
                            <Menu.Item onClick={()=>duplicateIntermediateGoodData(row.id)}
                                leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}>
                                Duplicate
                            </Menu.Item>
                        <Menu.Divider />

                        <Menu.Label>Danger zone</Menu.Label>
                        
                        <Menu.Item 
                            onClick={()=>openDeleteModal(row.id)}
                                color="red"
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            >
                            Delete
                        </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Table.Td>
            </Table.Tr>
        ));
    }

    return (
        <>
            <Paper mb={15} p="sm" radius="md">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                        <TextInput
                        placeholder="Search by any field"
                        // mb="md"
                        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={handleSearchChange}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                        <Flex
                            gap="md"
                            justify="flex-end"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <AddIntermediateGoodsModal />
                            {/*<Button component={Link} to={'/intermediate-goods/add'} variant='filled'*/}
                            {/*leftSection={<IconPlus size={16} />}>New Intermediate Good</Button>*/}
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Paper>
            {
              rows.length > 0 ? (
              <Paper shadow="xs" p="sm" radius="lg">
              <TotalRecord count={rows.length} />
                  <ScrollArea>
                      <Table withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" miw={700} layout="fixed">
                          <Table.Thead>
                          <Table.Tr>
                              <Th 
                              sorted={sortBy === 'name'}
                              reversed={reverseSortDirection}
                              onSort={() => setSorting('name')}
                              >
                              Name
                              </Th>
                              
                              <Table.Th style={{ width: '150px' }} ta={'center'}>
                                Current Stock
                              </Table.Th>
                              
                              <Table.Th style={{ width: '150px' }} ta={'center'}>
                                Minimum Stock
                              </Table.Th>
                              
                              <Table.Th style={{ width: '150px' }} ta={'left'}>
                                Materials Cost
                              </Table.Th>
                              
                              <Table.Th style={{ width: '150px' }} ta={'left'}>
                                Labour Cost
                              </Table.Th>

                              <Table.Th style={{ width: '60px' }} ta={'left'}>

                              </Table.Th>
                          </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                          {rows}
                          </Table.Tbody>
                      </Table>
                  </ScrollArea>
              </Paper>
              ):
              (
                <Empty  />
              )}
        </>
    )
}

export default IntermediateGoodsList
