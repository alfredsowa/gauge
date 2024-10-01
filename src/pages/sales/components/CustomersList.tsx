import { ActionIcon, Button, Center, Flex, Grid, Group, Menu, Paper, ScrollArea, Table, TableTrProps, Text, TextInput, UnstyledButton, keys, rem } from '@mantine/core';
import { IconArrowLeft, IconChevronDown, IconChevronRight, IconChevronUp, IconEdit, IconEye, IconPlus, IconSearch, IconSelector, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import classes from '../assets/TableSelection.module.css';
import { CustomerBasicModel } from '../../../requests/models/_sales';
import { Link } from 'react-router-dom';
import { PrettyFigure } from '../../../requests/general/_numberHelper';
import Empty from '../../../components/Empty';
import { notify } from '../../../requests/general/toast';
import { modals } from '@mantine/modals';
import { deleteCustomer } from '../../../requests/_saleRequests';
import TotalRecord from '../../../components/TotalRecord';
import TableLoadingSingle from '../../../components/TableLoadingSingle';

interface RowData {
    last_name: string;
}
  
function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={classes.th}  style={{ minWidth: '200px' }}>
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
  
function filterData(data: CustomerBasicModel[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      keys(data[0])?.some((key: keyof CustomerBasicModel) => 
        typeof item[key] === 'string' && 
        typeof item[key]!== 'undefined' && 
        (item[key] as string)?.toLowerCase().includes(query)
      )
    );
}
  
function sortData(
    data: CustomerBasicModel[],
    payload: { sortBy: keyof CustomerBasicModel | null; reversed: boolean; search: string }
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

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

const CustomersList = ({customers}:{customers: CustomerBasicModel[]|undefined}) => {

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(customers);
    const [sortBy, setSortBy] = useState<keyof CustomerBasicModel>('last_name');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(customers) {
            setSortedData(customers);
        }
        setLoading(false)
    },[customers])

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        if(customers) {
            setSortedData(sortData(customers, { sortBy: field, reversed, search }));
        }
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const { value } = event.currentTarget;
        setSearch(value);
        if(customers) {
            setSortedData(sortData(customers, { sortBy, reversed: reverseSortDirection, search: value }));
        }
        setLoading(false)
    };

    const deleteItem = async(id: number|undefined) => {
        try {
            const response = await deleteCustomer(id)
            if(response.data.deleted) {
                const data = customers?.filter((sale)=>{
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
          title: 'Delete your customer',
          centered: true,
          children: (
            <Text>
              Are you sure you want to delete customer? This data will be lost permanently..
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
                        {row.last_name} {row.first_name}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                    {row.email}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                    {row.phone}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                        {row.city} - {row.country}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <PrettyFigure figure={row.purchases} />
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                        {row.last_purchase}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                        <ActionIcon color='gray' variant="light" aria-label="Settings">
                        <IconChevronRight style={{ width: '70%', height: '70%' }} stroke={2} />
                        </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                        <Menu.Item component={Link} to={`/sales/customers/${row.id}/view`}
                                leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                View
                            </Menu.Item>
                            <Menu.Item component={Link} to={`/sales/customers/${row.id}/edit`}
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                                Edit
                            </Menu.Item>

                        {
                            !row.prevent_delete?(
                            <>
                            <Menu.Divider />
                            <Menu.Label>Danger zone</Menu.Label>
                            
                            <Menu.Item 
                                onClick={()=>openDeleteModal(row.id)}
                                    color="red"
                                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                >
                                Delete
                            </Menu.Item>
                            </>
                            ):''
                        }
                        
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
                            <Button component={Link} to={'/sales'} variant='light'
                            leftSection={<IconArrowLeft size={16} />}> Sales</Button>
                            
                            <Button component={Link} to={'/sales/customers/add'} variant='filled'
                            leftSection={<IconPlus size={16} />}>Add New</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Paper>
            {
                rows.length > 0 ? (
                <Paper shadow="xs" p="sm" radius="lg">
                    <Group justify="space-between" mb={10}>
                        <TotalRecord count={rows.length} />
                    </Group>
                    <ScrollArea>
                    <Table.ScrollContainer minWidth={700}>
                        <Table withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" miw={700}>
                            <Table.Thead>
                            <Table.Tr>
                                <Th
                                sorted={sortBy === 'last_name'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('last_name')}
                                >
                                Name
                                </Th>
                                <Table.Th style={{ minWidth: '150px' }}>
                                Email
                                </Table.Th>
                                <Table.Th style={{ minWidth: '150px' }}>
                                Phone
                                </Table.Th>
                                <Table.Th style={{ width: '180px' }}>
                                Location
                                </Table.Th>
                                <Table.Th style={{ width: '80px' }}>
                                Sales
                                </Table.Th>
                                <Table.Th style={{ minWidth: '130px' }}>
                                Last Sale
                                </Table.Th>
                                <Table.Th style={{ width: '60px' }}>
                                </Table.Th>
                            </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                            {loading?<TableLoadingSingle withImage={false} columns={7}/>: 
                                rows.length > 0 ? (
                                    rows
                                ) : (
                                    <Table.Tr>
                                    <Table.Td colSpan={7}>
                                        <Center>
                                            <Empty  />
                                        </Center>
                                        
                                    </Table.Td>
                                    </Table.Tr>
                                )
                            }
                            {/* {rows.length > 0 ? (
                                rows
                            ) : (
                                <Table.Tr>
                                <Table.Td colSpan={7}>
                                    <Center>
                                        <Empty  />
                                    </Center>
                                    
                                </Table.Td>
                                </Table.Tr>
                            )} */}
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

export default CustomersList
