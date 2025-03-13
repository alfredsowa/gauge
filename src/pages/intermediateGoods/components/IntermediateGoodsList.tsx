import {
    ActionIcon,
    Avatar,
    Grid,
    Group,
    Menu,
    Paper,
    ScrollArea,
    Table,
    TableTdProps,
    Text,
    TextInput,
    rem,
    em,
} from '@mantine/core';
import {
    IconChevronRight,
    IconCopy,
    IconEdit,
    IconEye,
    IconSearch,
    IconTrash
} from '@tabler/icons-react';
import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper';
import Empty from '../../../components/Empty';
import { notify } from '../../../requests/general/toast';
import { modals } from '@mantine/modals';
import {
    IntermediateGoodBasicCollectionModel, IntermediateGoodBasicModel,
    IntermediateGoodMaterialsModel
} from '../../../requests/models/_intermediateGood.tsx';
import {
    deleteIntermediateGood,
    duplicateIntermediateGood,
    getIntermediateGoods
} from '../../../requests/_intermediateGoodsRequests.ts';
import AddIntermediateGoodsModal from "./AddIntermediateGoodsModal.tsx";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {useMediaQuery} from "@mantine/hooks";
import {MOBILE_SCREEN_SIZE} from "../../../base/constants.ts";
import Paginator from "../../../components/Paginator.tsx";
import MobileCardLoading from "../../../components/MobileCardLoading.tsx";
import TableLoadingSingle from "../../../components/TableLoadingSingle.tsx";

const IntermediateGoodsList = () => {

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [intermediateGoods, setIntermediateGoods] = useState<IntermediateGoodBasicModel[]>();
    const navigate = useNavigate()
    const [current_page, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [per_page, setPerPage] = useState(10);
    const [last_page, setLastPage] = useState(1);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const queryClient = useQueryClient();
    const isMobile = useMediaQuery(`(max-width: ${em(MOBILE_SCREEN_SIZE)})`);

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

    const queryDataResponse = async (page?: number) => {
        if (!page) {
            page = current_page;
        }
        const response = await getIntermediateGoods(page,per_page,search)
        if(response.data.data){
            setValue(response.data)
        }
        setLoading(false)
    }

    // FOR SEARCHING
    useEffect(() => {
        setLoading(true)
        queryDataResponse().then()
    },[])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (search.replace(/\s/g,'').length > 2) {
                setDebouncedQuery(search);
            } else if (search.replace(/\s/g,'').length === 0 || search === '') {
                queryDataResponse().then(); // Fetch all items when search is cleared
            }
        }, 1000);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        if (debouncedQuery.length <= 2) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                queryDataResponse().then()
            } catch (err) {
                console.log("Failed to fetch search results");
            } finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, [debouncedQuery]);
    //END SEARCHING

    //PAGINATION SCRIPTS
    const onNext = async (current_page: number) => {
        setLoading(true)
        if(current_page < last_page) {
            setCurrentPage(current_page)
        }
        else {
            setCurrentPage(last_page)
        }

        const response = await getIntermediateGoods(current_page,per_page,search);
        if(response.data.data){
            setValue(response.data)
        }
        setLoading(false)
    };

    const onPrev = async (current_page: number) => {
        setLoading(true)
        if(current_page < 1) {
            setCurrentPage(1)
        }
        else {
            setCurrentPage(current_page)
        }
        const response = await getIntermediateGoods(current_page,per_page,search);
        if(response.data.data){
            setValue(response.data)
        }
        setLoading(false)
    };

    const onPerPage = async (per_page: number) => {
        setLoading(true)
        setPerPage(per_page);
        setCurrentPage(1);
        const response = await getIntermediateGoods(1,per_page,search);
        if(response.data.data){
            setValue(response.data)
        }
        setLoading(false)
    }

    const setValue = (goods: IntermediateGoodBasicCollectionModel) => {
        setIntermediateGoods(goods.data)
        setCurrentPage(goods.meta.current_page)
        setPerPage(goods.meta.per_page)
        setTotalRecords(goods.meta.total)
        setLastPage(goods.meta.last_page)
    }
    // END PAGINATION SCRIPTS

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
                queryDataResponse().then()
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

    if(intermediateGoods) {
        rows = intermediateGoods.map((row) => (

            <Table.Tr key={row.id}>
                <Table.Td>
                  <Group gap="sm">
                      <Avatar src={row.image} size={40} radius={10}>PD</Avatar>
                      <div>
                          <Text fw={500}>
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

                {/* <Table.Td ta={'left'}>
                    <Text c={'dimmed'}>
                        <Text c={'dimmed'} component='span' fw={600}><MoneyFigure figure={row.labour_cost} /></Text>
                    </Text>
                </Table.Td> */}

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
            <Grid mb={'20'}>
                <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
                    <TextInput
                        radius={'md'}
                        size={'md'}
                        placeholder="Enter 3 or more to start search by name"
                        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        // onChange={handleSearchChange}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
                    <Group gap="sm" justify="right">
                        {isMobile && (
                            <AddIntermediateGoodsModal />
                        )}
                    </Group>
                </Grid.Col>
            </Grid>
            {
                loading?
                isMobile?
                <MobileCardLoading withImage={true} columns={2} />:
                <TableLoadingSingle withImage={true} columns={5} />:
                rows.length > 0 ? (
                  <div>
                      <Paginator
                          totalRecords={totalRecords}
                          per_page={per_page}
                          current_page={current_page}
                          last_page={last_page}
                          onNext={onNext}
                          onPrev={onPrev}
                          onPerPage={onPerPage}
                      />
                      {
                          isMobile?(
                              rows
                          ):(
                              <Paper shadow="xs"  radius="lg">
                              {/* <TotalRecord count={rows.length} /> */}
                                  <ScrollArea>
                                      <Table withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" miw={700} layout="fixed">
                                          <Table.Thead>
                                          <Table.Tr>
                                              <Table.Th style={{ width: '250px' }} ta={'left'}>
                                              Name
                                              </Table.Th>

                                              <Table.Th style={{ width: '150px' }} ta={'center'}>
                                                Current Stock
                                              </Table.Th>

                                              <Table.Th style={{ width: '150px' }} ta={'center'}>
                                                Minimum Stock
                                              </Table.Th>

                                              <Table.Th style={{ width: '150px' }} ta={'left'}>
                                                Materials Cost
                                              </Table.Th>

                                              {/* <Table.Th style={{ width: '150px' }} ta={'left'}>
                                                Labour Cost
                                              </Table.Th> */}

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
                          )
                      }
                  </div>
                  ):
                (
                <Empty title={'No Goods found'} />
                )
            }
        </>
    )
}

export default IntermediateGoodsList
