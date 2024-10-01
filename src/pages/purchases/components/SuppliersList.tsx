import { ActionIcon, Center, Flex, Grid, Group, Menu, Paper, ScrollArea, Table, TableTrProps, Text, TextInput, UnstyledButton, keys, rem } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconChevronUp, IconSearch, IconSelector, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import classes from '../assets/TableSelection.module.css';
import Empty from '../../../components/Empty';
import { deleteSupplier } from '../../../requests/_purchaseRequests';
import { modals } from '@mantine/modals';
import { SupplierBasic } from '../../../requests/models/_business';
import AddSupplierModal from './AddSupplierModal';
import { notify } from '../../../requests/general/toast';
import EditSupplierModal from './EditSupplierModal';
import ViewSupplierModal from './ViewSupplierModal';
import TotalRecord from '../../../components/TotalRecord';
import TableLoadingSingle from '../../../components/TableLoadingSingle';

interface RowData {
    contact_person: string;
    contact_detail: string;
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
        <Table.Th className={classes.th} style={{ width: '250px' }}>
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
  
function filterData(data: SupplierBasic[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      keys(data[0])?.some((key: keyof SupplierBasic) => 
        typeof item[key] === 'string' && 
        typeof item[key]!== 'undefined' && 
        (item[key] as string)?.toLowerCase().includes(query)
      )
    );
}
  
function sortData(
    data: SupplierBasic[],
    payload: { sortBy: keyof SupplierBasic | null; reversed: boolean; search: string }
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

const SuppliersList = ({supplierList, setSupplierList}:{supplierList: SupplierBasic[]|undefined,
    setSupplierList: React.Dispatch<React.SetStateAction<SupplierBasic[]|undefined>>
}) => {

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(supplierList);
    const [sortBy, setSortBy] = useState<keyof SupplierBasic>('contact_person');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(supplierList) {
            setSortedData(supplierList);
        }
        setLoading(false)
    },[supplierList])

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        if(supplierList) {
            setSortedData(sortData(supplierList, { sortBy: field, reversed, search }));
        }
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        setLoading(true)
        const { value } = event.currentTarget;
        setSearch(value);
        if(supplierList) {
            setSortedData(sortData(supplierList, { sortBy, reversed: reverseSortDirection, search: value }));
        }
        setLoading(false)
    };

    const deleteItem = async(id: number) => {
        try {
            const response = await deleteSupplier(id)
            if(response.data.deleted) {
                const data = supplierList?.filter((supplier)=>{
                    return Number(supplier.id) !== id
                })
                setSupplierList(data)
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
          title: 'Delete your supplier',
          centered: true,
          children: (
            <Text>
              Are you sure you want to delete this supplier? This data will be lost permanently..
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
                    <div>
                        <Text fw={500}>
                        {row.contact_person}
                        </Text>
                    </div>
                    </Group>
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                    {row.company_name}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                        {row.contact_detail}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text c="dimmed">
                        {row.location}
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
                        <ViewSupplierModal id={Number(row.id)}  />
                        <EditSupplierModal row={row}  setSupplierList={setSupplierList}/>

                        <Menu.Divider />

                        <Menu.Label>Danger zone</Menu.Label>
                        
                        <Menu.Item 
                            onClick={()=>openDeleteModal(Number(row.id))}
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
                            <AddSupplierModal setSupplierList={setSupplierList}  />
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
                        <Table withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" mb={20} miw={700} layout="fixed">
                            <Table.Thead>
                            <Table.Tr>
                                <Th
                                sorted={sortBy === 'contact_person'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('contact_person')}
                                >
                                Contact Person
                                </Th>
                                <Table.Th style={{ width: '250px' }}>
                                    Company
                                {/* <Text fw={700}>
                                </Text> */}
                                </Table.Th>
                                <Table.Th style={{ width: '220px' }}>
                                    Contact
                                {/* <Text fw={700}>
                                </Text> */}
                                </Table.Th>
                                <Table.Th style={{ width: '200px' }}>
                                    Location
                                {/* <Text fw={700}>
                                </Text> */}
                                </Table.Th>
                                <Table.Th style={{ width: '60px' }}>

                                </Table.Th>
                            </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                            {loading?<TableLoadingSingle withImage={false} columns={5}/>: 
                                rows.length > 0 ? (
                                    rows
                                ) : (
                                    <Table.Tr>
                                    <Table.Td colSpan={5}>
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
                                <Table.Td colSpan={3}>
                                    <Center>
                                        <Empty  />
                                    </Center>
                                    
                                </Table.Td>
                                </Table.Tr>
                            )} */}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
                ) : (
                    <Empty />
                )
            }
        </>
    )
}

export default SuppliersList
