import { ActionIcon, Avatar, Button, Center, Flex, Grid, Group, Menu, Paper, ScrollArea, Table, TableTrProps, Text, TextInput, UnstyledButton, keys, rem } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconChevronUp, IconEdit, IconPlus, IconSearch, IconSelector, IconTrash, IconTruckDelivery } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import classes from '../assets/TableSelection.module.css';
import { PurchaseBasicModel } from '../../../requests/models/_purchase';
import { Link } from 'react-router-dom';
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper';
import Empty from '../../../components/Empty';
import { deletePurchase, getPurchases } from '../../../requests/_purchaseRequests';
import { notify } from '../../../requests/general/toast';
import { modals } from '@mantine/modals';
import ViewPurchaseModal from './ViewPurchaseModal';
import TotalRecord from '../../../components/TotalRecord';
import TableLoadingSingle from '../../../components/TableLoadingSingle';

interface RowData {
    material_name: string;
    purchase_date: string;
    supplier_name: string;
    invoice_number: string;
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
  
function filterData(data: PurchaseBasicModel[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      keys(data[0])?.some((key: keyof PurchaseBasicModel) => 
        typeof item[key] === 'string' && 
        typeof item[key]!== 'undefined' && 
        (item[key] as string)?.toLowerCase().includes(query)
      )
    );
}
  
function sortData(
    data: PurchaseBasicModel[],
    payload: { sortBy: keyof PurchaseBasicModel | null; reversed: boolean; search: string }
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

const PurchaseList = () => {

    const [search, setSearch] = useState('');
    const [purchaseList, setPurchaseList] = useState<PurchaseBasicModel[]|undefined>([]);
    const [sortedData, setSortedData] = useState(purchaseList);
    const [sortBy, setSortBy] = useState<keyof PurchaseBasicModel>('material_name');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const purchasesResponse = async() => {
          const response = await getPurchases()
          setPurchaseList(response.data.data)
          setLoading(false)
        }
        purchasesResponse()
      },[])

    useEffect(()=>{
        if(purchaseList) {
            setSortedData(purchaseList);
        }
        
    },[purchaseList])

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        if(purchaseList) {
            setSortedData(sortData(purchaseList, { sortBy: field, reversed, search }));
        }
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const { value } = event.currentTarget;
        setSearch(value);
        if(purchaseList) {
            setSortedData(sortData(purchaseList, { sortBy, reversed: reverseSortDirection, search: value }));
        }
        setLoading(false)
    };

    const deleteItem = async(id: number) => {
        try {
            const response = await deletePurchase(id)
            if(response.data.deleted) {
                const data = purchaseList?.filter((purchase)=>{
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
          title: 'Delete your profile',
          centered: true,
          children: (
            <Text size="sm">
              Are you sure you want to delete Purchase? This data will be lost permanently..
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
                    <Avatar src={row.material_image} size={40} radius={10}>MK</Avatar>
                    <div>
                        <Text fw={600}>
                        {row.material_name} {row.status === 'Draft'? (
                            <Text component='span' fz="xs" tt={'uppercase'} c="yellow">
                                 - Draft
                            </Text>
                        ):''}
                        </Text>
                        <Text c="dimmed">
                            Date: {row.purchase_date}
                        </Text>
                    </div>
                    </Group>
                </Table.Td>
                <Table.Td ta={'left'}>
                    <Text c="dimmed">
                    <PrettyFigure figure={row.actual_quantity}  />
                    </Text>
                </Table.Td>
                <Table.Td ta={'left'}>
                    <Text c="dimmed">
                    <MoneyFigure figure={row.amount_paid} />
                    </Text>
                </Table.Td>
                <Table.Td ta={'left'}>
                    <Text c="dimmed">
                        {row.supplier_name}
                    </Text>
                </Table.Td>
                <Table.Td ta={'left'}>
                    <Text c="dimmed">
                        {row.supplier_contact}
                    </Text>
                </Table.Td>
                <Table.Td ta={'left'}>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                        <ActionIcon color='gray' variant="light" aria-label="Settings">
                        <IconChevronRight style={{ width: '70%', height: '70%' }} stroke={2} />
                        </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                        <ViewPurchaseModal purchase={row} />
                        {
                            row.status === 'Draft'?(
                            <Menu.Item component={Link} to={`/purchases/${row.id}/edit`}
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
                            <Button component={Link} to={'/purchases/suppliers'} variant='light'
                            rightSection={<IconTruckDelivery size={16} />}>Suppliers</Button>
                            
                            <Button component={Link} to={'/purchases/add'} variant='filled'
                            leftSection={<IconPlus size={16} />}>Record Purchase</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Paper>
            {
                loading?(
                    <>
                        <TableLoadingSingle withImage={true} columns={6} rows={4} />
                    </>
                    )
                    :
                rows.length > 0 ? (
                <Paper shadow="xs" p="sm" radius="lg">
                    <Group justify="space-between" mb={10}>
                    <TotalRecord count={rows.length} />
                    </Group>
                    <ScrollArea>
                        <Table withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" miw={700} layout="fixed">
                            <Table.Thead>
                            <Table.Tr>
                                <Th
                                sorted={sortBy === 'material_name'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('material_name')}
                                >
                                Material
                                </Th>
                                <Table.Th style={{ width: '100px' }} ta={'left'}>
                                    Quantity
                                {/* <Text fw={700}>
                                </Text> */}
                                </Table.Th>
                                <Table.Th style={{ width: '100px' }} ta={'left'}>
                                    Paid
                                {/* <Text fw={700}>
                                </Text> */}
                                </Table.Th>
                                <Table.Th style={{ width: '250px' }} ta={'left'}>
                                    Supplier
                                {/* <Text fw={700}>
                                </Text> */}
                                </Table.Th>
                                <Table.Th style={{ width: '250px' }} ta={'left'}>
                                        Contact
                                    {/* <Text fw={700}>
                                    </Text> */}
                                </Table.Th>
                                {/* <Th
                                sorted={sortBy === 'supplier_name'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('supplier_name')}
                                >
                                Supplier & Contact
                                </Th> */}
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
                ):(<Empty />)
            }
        </>
    )
}

export default PurchaseList
