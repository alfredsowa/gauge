import { ActionIcon, Avatar, Button, Center, Flex, Grid, Group, Menu, Paper, ScrollArea, Table, TableTrProps, Text, TextInput, UnstyledButton, keys, rem } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconChevronUp, IconEdit, IconEye, IconPlus, IconSearch, IconSelector, IconTrash, IconUser } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import classes from '../assets/TableSelection.module.css';
import { SalesBasicModel } from '../../../requests/models/_sales';
import { Link, useSearchParams } from 'react-router-dom';
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper';
import Empty from '../../../components/Empty';
import { notify } from '../../../requests/general/toast';
import { modals } from '@mantine/modals';
import { deleteSales, salesLoader } from '../../../requests/_saleRequests';
import { DefaultDateTime } from '../../../requests/general/_dates';
import SaleStatusBadge from '../../../components/SaleStatusBadge';
import { isStringInArray } from '../../../requests/general/_stringHelper';
import PaymentStatusBadge from '../../../components/PaymentStatusBadge';
import TotalRecord from '../../../components/TotalRecord';
import TableLoadingSingle from '../../../components/TableLoadingSingle';
import SalesFilterModal from './SalesFilterModal';
import { useQuery } from '@tanstack/react-query';

interface RowData {
    product_name: string;
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
            <Text fw={500}>
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
  
function filterData(data: SalesBasicModel[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      keys(data[0])?.some((key: Extract<keyof SalesBasicModel, string>) => 
        typeof item[key] === 'string' && 
        typeof item[key]!== 'undefined' && 
        (item[key] as string)?.toLowerCase().includes(query)
      )
    );
}
  
function sortData(
    data: SalesBasicModel[],
    payload: { sortBy: keyof SalesBasicModel | null; reversed: boolean; search: string }
) {
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

const SalesList = () => {

    const {data:saleList,isLoading} = useQuery({
        queryKey: ['sales'],
        queryFn: salesLoader
    })

    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortedData, setSortedData] = useState(saleList);
    const [sortBy, setSortBy] = useState<keyof SalesBasicModel>('product_name');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        if(saleList) {
            if(searchParams.size === 0){
                setSortedData(saleList);
            }
            else {
                let filteringdata: SalesBasicModel[] = saleList
                
                if (searchParams.get('status') != null){
                    const order_status = searchParams.get('status');
                    const statusArray = order_status?.split(',');
                    if(statusArray && statusArray?.length > 0 && statusArray[0] != '') {
                        filteringdata = filteringdata.filter(sale => statusArray?.includes(String(sale.order_status)));
                    }
                }
                if (searchParams.get('payment') != null){
                    const payment = searchParams.get('payment');
                    const paymentArray = payment?.split(',');

                    if(paymentArray && paymentArray?.length > 0 && paymentArray[0] != '') {
                        filteringdata = filteringdata.filter(sale => paymentArray?.includes(String(sale.payment_status)));
                    }
                }
                setSortedData(filteringdata);
            }
            setLoading(false)
        }
    },[saleList,searchParams])

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        if(saleList) {
            setSortedData(sortData(saleList, { sortBy: field, reversed, search }));
        }
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const { value } = event.currentTarget;
        setSearch(value);
        if(saleList) {
            setSortedData(sortData(saleList, { sortBy, reversed: reverseSortDirection, search: value }));
        }
        setLoading(false)
    };

    const deleteItem = async(id: number|undefined) => {
        try {
            const response = await deleteSales(id)
            if(response.data.deleted) {
                const data = saleList?.filter((sale)=>{
                    return sale.id!== id
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
    
    const openDeleteModal = (id: number|undefined) =>
        modals.openConfirmModal({
          title: 'Delete your sale',
          centered: true,
          children: (
            <Text >
              Are you sure you want to delete Sale? This data will be lost permanently..
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
                <Group gap="sm">
                    <Avatar src={row.product_image} size={40} radius={10}>MK</Avatar>
                    <div>
                        <Text fw={500}>
                        {row.product_name} 
                        </Text>
                        <Text c={'dimmed'}>
                            Quantity: <PrettyFigure figure={row.quantity}  />
                        </Text>
                    </div>
                    </Group>
                </Table.Td>
                <Table.Td>
                <SaleStatusBadge status={row.order_status}  />
                    {/* <Text>
                    {row.order_status}
                    </Text> */}
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                    {row.sold_by}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                        <DefaultDateTime dateFormat={row.sale_date_time}  />
                    </Text>
                </Table.Td>
                <Table.Td>
                    <PaymentStatusBadge status={row.payment_status} />
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                        <MoneyFigure figure={row.total_amount_paid} />
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                        <ActionIcon color='gray' variant="light">
                        <IconChevronRight style={{ width: '70%', height: '70%' }} stroke={2} />
                        </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                        <Menu.Item component={Link} to={`/sales/${row.id}/view`}
                                leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                View
                            </Menu.Item>
                        {/* <ViewSaleModal sale={row} /> */}
                        {
                            !isStringInArray(row.order_status,['completed'])?(
                            <Menu.Item component={Link} to={`/sales/${row.id}/edit`}
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                                Edit
                            </Menu.Item>
                            ):''
                        }

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
                            <SalesFilterModal setSearchParams={setSearchParams} searchParams={searchParams} />
                            <Button component={Link} to={'/sales/customers'} variant='light'
                            rightSection={<IconUser size={16} />}>Customers</Button>
                            
                            <Button component={Link} to={'/sales/add'} variant='filled'
                            leftSection={<IconPlus size={16} />}>Record Sale</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Paper>
            {
                isLoading||loading? <TableLoadingSingle withImage={true} columns={7}/>:
                rows.length > 0 ? (
                <Paper shadow="xs" p="sm" radius="lg">
                    <Group justify="space-between" mb={10}>
                        <TotalRecord count={rows.length} />
                    </Group>
                    <ScrollArea>
                        <Table.ScrollContainer minWidth={700}>
                            <Table withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" miw={700} layout="fixed">
                                <Table.Thead>
                                <Table.Tr>
                                    <Th
                                    sorted={sortBy === 'product_name'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('product_name')}
                                    >
                                    Products
                                    </Th>
                                    <Table.Th style={{ width: '120px' }}>
                                    Status
                                    </Table.Th>
                                    <Table.Th style={{ width: '200px' }}>
                                    Sold By
                                    </Table.Th>
                                    <Table.Th style={{ width: '180px' }}>
                                    Date Sold
                                    </Table.Th>
                                    <Table.Th style={{ width: '150px' }}>
                                    Payment
                                    </Table.Th>
                                    <Table.Th style={{ width: '130px' }}>
                                        Amount Paid
                                    </Table.Th>
                                    <Table.Th style={{ width: '60px' }}>
                                    </Table.Th>
                                </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                
                                {rows}
                                
                                </Table.Tbody>
                            </Table>
                            </Table.ScrollContainer>
                    </ScrollArea>
                </Paper>):(
                    <Empty  />
                )
            }
        </>
    )
}

export default SalesList
