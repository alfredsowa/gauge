import { ActionIcon, Flex, Grid, Group, Menu, Paper, ScrollArea, Table, TableTrProps, Text, TextInput, rem } from '@mantine/core';
import { IconChevronRight, IconCopy, IconEdit, IconEye, IconSearch, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Empty from '../../../components/Empty';
import { modals } from '@mantine/modals';
import { ProductionBasicModel } from '../../../requests/models/_production';
import { deleteProduction, duplicateProduction, getProductions } from '../../../requests/_productionRequests';
import { notify } from '../../../requests/general/toast';
import { isStringInArray, toHeadline } from '../../../requests/general/_stringHelper';
import Priority from '../../../components/Priority';
import StatusBadge from '../../../components/StatusBadge';
import TotalRecord from '../../../components/TotalRecord';
import { AxiosError } from 'axios';
import ProductionFilterModal from './ProductionFilterModal';
import { DefaultReadableDate } from '../../../requests/general/_dates';
import TableLoadingSingle from '../../../components/TableLoadingSingle';
import AddProductionModal from './AddProductionModal';
import { productionEnds } from '../../../requests/general/options';
import { useQuery } from '@tanstack/react-query';

function filterData(data: ProductionBasicModel[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
        item['title'].toLowerCase().includes(query)
    )
}
  
function sortData(
  data: ProductionBasicModel[],
  payload: { sortBy: keyof ProductionBasicModel | null; reversed: boolean; search: string }) {
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

const ProductionList = () => {

    const {data,isLoading} = useQuery({
        queryKey: ['productions'],
        queryFn: getProductions
    })
    
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState<ProductionBasicModel[]|undefined>();
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const productionLists = data?.data.data;
    const sortBy: keyof ProductionBasicModel = 'title'
    const reverseSortDirection: boolean = false


    useEffect(()=>{
        if(productionLists) {
            setSortedData(productionLists);
            setLoading(false);
        }
    },[productionLists])

    useEffect(()=>{
        
        if(productionLists) {
            if(searchParams.size === 0){
                setSortedData(productionLists);
            }
            else {
                let filteringdata: ProductionBasicModel[] = productionLists
                
                if (searchParams.get('status') != null){
                    const order_status = searchParams.get('status');
                    const statusArray = order_status?.split(',');
                    
                    if(statusArray && statusArray?.length > 0 && statusArray[0] != '') {
                        filteringdata = filteringdata.filter(production => statusArray?.includes(String(production.status)));
                    }
                }
                if (searchParams.get('type') != null){
                    const type = searchParams.get('type');
                    const typeArray = type?.split(',');

                    if(typeArray && typeArray?.length > 0 && typeArray[0] != '') {
                        filteringdata = filteringdata.filter(production => typeArray?.includes(String(production.type)));
                    }
                }
                if (searchParams.get('priority') != null){
                    const priority = searchParams.get('priority');
                    const priorityArray = priority?.split(',');

                    if(priorityArray && priorityArray?.length > 0 && priorityArray[0] != '') {
                        filteringdata = filteringdata.filter(production => priorityArray?.includes(String(production.priority)));
                    }
                }
                setSortedData(filteringdata);
            }
            setLoading(false)
        }
    },[productionLists,searchParams])
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const { value } = event.currentTarget;
        setSearch(value);
        if(productionLists) {
            setSortedData(sortData(productionLists, { sortBy, reversed: reverseSortDirection, search: value }));
        }
        setLoading(false);
    };

    const duplicateProductData = async(id: number) => {

        try{
            const response = await duplicateProduction(id)
            const data = response.data

            if(data.saved) {

                notify({
                    type:'success',
                    message: data.message,
                    title: 'Done'
                })
                navigate(`/productions/${data.data.id}/edit`)
            }
        } catch(error) {
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.message+" Please reload the page and try again.", // Use optional chaining to access data property
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
        
    }

    const deleteItem = async(id: number) => {
      try {
          const response = await deleteProduction(id)
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
    
    const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete Production',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete Production? This data will be lost permanently..
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteItem(id),
    });
    
    let rows: React.ReactElement<TableTrProps>[] = [];
    if(sortedData) {
        rows = sortedData.map((row) => (
            <Table.Tr key={row.id}>

                <Table.Td>
                    <Text fw={500}>
                    {row.title}
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text c="dimmed">
                    {toHeadline(row.category)}
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text c="dimmed">
                    <Priority priority={row.priority} />
                    </Text>
                </Table.Td>

                <Table.Td>
                    <StatusBadge status={row.status}  />
                </Table.Td>

                <Table.Td>
                    <Text c="dimmed">
                        <DefaultReadableDate dateFormat={row.deadline_date}  />
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text c="dimmed">
                    {
                        row.assignee? 
                    (row.assignee?.first_name+" "+row.assignee?.last_name) : '-'}
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Group>
                    {/* <Button variant="filled" color="gray" size="xs">Change Status</Button> */}
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                        <ActionIcon color='gray' variant="light" aria-label="Settings">
                        <IconChevronRight style={{ width: '70%', height: '70%' }} stroke={2} />
                        </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            {
                                !row.insufficient_materials?
                                (row.category === 'product')?
                                (row.type === 'product' && row.product_id) || (row.type === 'intermediate_good' && row.intermediate_good_id)?(
                                    <Menu.Item component={Link} to={`/productions/${row.id}/view`}
                                        leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                        View
                                    </Menu.Item>
                                ):null:(
                                    <Menu.Item component={Link} to={`/productions/${row.id}/view`}
                                        leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                        View
                                    </Menu.Item>
                                ):null
                            }

                            {
                                !isStringInArray(row.status,productionEnds) &&
                                <Menu.Item component={Link} to={`/productions/${row.id}/edit`}
                                    leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                                    Edit
                                </Menu.Item>
                            }

                            <Menu.Item onClick={() => duplicateProductData(row.id)}
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
                    </Group>
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
                        placeholder="Search by Production Title"
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
                            <ProductionFilterModal setSearchParams={setSearchParams} searchParams={searchParams} />
                            <AddProductionModal  />
                            {/* <Button component={Link} to={'/productions/add'} variant='filled'
                            leftSection={<IconPlus size={16} />}>New Production</Button> */}
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Paper>

            {
                isLoading||loading? <TableLoadingSingle withImage={false} columns={7}/>:
                rows.length > 0 ? (
                    <Paper shadow="xs" p="sm" radius="md">
                        <Group justify="space-between" mb={10}>
                            <TotalRecord count={rows.length} />
                        </Group>
                            <ScrollArea>
                                <Table withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" mb={20} miw={700} layout="fixed">
                                    <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th ta={'left'} style={{ width: '300px' }}>
                                                Title
                                            {/* <Text fw={500}>
                                            </Text> */}
                                        </Table.Th>
                                        <Table.Th style={{ width: '100px' }}>
                                                Category
                                            {/* <Text fw={500}>
                                            </Text> */}
                                        </Table.Th>
                                        <Table.Th style={{ width: '100px' }}>
                                            Priority
                                        {/* <Text fw={500}>
                                        </Text> */}
                                        </Table.Th>
                                        <Table.Th style={{ width: '100px' }}>
                                            Status
                                        {/* <Text fw={500}>
                                        </Text> */}
                                        </Table.Th>
                                        <Table.Th style={{ width: '150px' }}>
                                                Deadline
                                            {/* <Text fw={500}>
                                            </Text> */}
                                        </Table.Th>
                                        <Table.Th style={{ width: '150px' }}>
                                                Assignee
                                            {/* <Text fw={500}>
                                            </Text> */}
                                        </Table.Th>
                                        <Table.Th style={{ width: '60px' }}>

                                        </Table.Th>
                                    </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {rows}
                                    </Table.Tbody>
                                </Table>
                            </ScrollArea>
                    </Paper>
                ):(
                    <Empty  />
                )
            }
            


        </>
    )
}

export default ProductionList
