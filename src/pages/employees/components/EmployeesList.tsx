import { ActionIcon, Avatar, Button, Center, Flex, Grid, Group, Menu, Paper, ScrollArea, Table, TableTrProps, Text, TextInput, UnstyledButton, keys, rem } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconChevronUp, IconEdit, IconPlus, IconSearch, IconSelector, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import classes from '../../purchases/assets/TableSelection.module.css';
import { Link } from 'react-router-dom';
import Empty from '../../../components/Empty';
import { modals } from '@mantine/modals';
// import { deleteEmployee } from '../../../requests/_employeeRequests';
// import { DefaultDate } from '../../../requests/general/_dates';
import { EmployeeModel } from '../../../requests/models/_employee';
import { deleteEmployee, employeesLoader } from '../../../requests/_employeeRequests';
import { notify } from '../../../requests/general/toast';
import TotalRecord from '../../../components/TotalRecord';
import { DefaultReadableDate } from '../../../requests/general/_dates';
import TableLoadingSingle from '../../../components/TableLoadingSingle';
import { useQuery } from '@tanstack/react-query';
// import ViewPurchaseModal from './ViewPurchaseModal';

interface RowData {
  last_name: string;
  first_name: string;
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
  
function filterData(data: EmployeeModel[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0])?.some((key: Extract<keyof EmployeeModel, string>) => 
      typeof item[key] === 'string' && 
      typeof item[key]!== 'undefined' && 
      (item[key] as string)?.toLowerCase().includes(query)
    )
  );
}
  
function sortData(
  data: EmployeeModel[],
  payload: { sortBy: keyof EmployeeModel | null; reversed: boolean; search: string }) {
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

const EmployeesList = () => {

  const {data:employeeList, isLoading} = useQuery({
    queryKey: ['employees'],
    queryFn: employeesLoader
  })
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(employeeList);
    const [sortBy, setSortBy] = useState<keyof EmployeeModel>('last_name');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(employeeList) {
            setSortedData(employeeList);
        setLoading(false)
        }
    },[employeeList])

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        if(employeeList) {
            setSortedData(sortData(employeeList, { sortBy: field, reversed, search }));
        }
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const { value } = event.currentTarget;
        setSearch(value);
        if(employeeList) {
            setSortedData(sortData(employeeList, { sortBy, reversed: reverseSortDirection, search: value }));
        }
        setLoading(false)
    };

    const deleteItem = async(id: number) => {
      try {
          const response = await deleteEmployee(id)
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
      title: 'Delete your profile',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete Employee? This data will be lost permanently..
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
                      <Avatar src={row.image} size={40} radius={10}>EM</Avatar>
                      <div>
                          <Text fw={500}>
                          {row.first_name} {row.last_name} 
                          </Text>
                          <Text c="dimmed">
                            {row.title}
                          </Text>
                      </div>
                  </Group>
                </Table.Td>

                <Table.Td>
                    <Text c="dimmed">
                    {row.department}
                    </Text>
                </Table.Td>

                <Table.Td c="dimmed">
                    <Text>
                        {row.phone_number}
                    </Text>
                </Table.Td>

                {/* <Table.Td>
                    <Text>
                        {row.email}
                    </Text>
                </Table.Td> */}

                {/* <Table.Td>
                    <Text>
                        <MoneyFigure figure={row.salary}  />
                    </Text>
                </Table.Td> */}

                <Table.Td>
                    <Text c="dimmed">
                        <DefaultReadableDate dateFormat={row.hire_date}  />
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
                            {/* <Menu.Item component={Link} to={`/employees/${row.id}/view`}
                                leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                View
                            </Menu.Item> */}
                            <Menu.Item component={Link} to={`/employees/${row.id}/edit`}
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                                Edit
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
                            
                            <Button component={Link} to={'/employees/add'} variant='filled'
                            leftSection={<IconPlus size={16} />}>Add New</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Paper>
            {
                isLoading||loading? <TableLoadingSingle withImage={true} columns={5}/>:
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
                                sorted={sortBy === 'last_name'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('last_name')}
                                >
                                Name
                                </Th>
                                
                                <Table.Th style={{ width: '150px' }}>
                                Department
                                </Table.Th>
                                
                                <Table.Th style={{ width: '150px' }}>
                                Contact
                                </Table.Th>
                                
                                {/* <Table.Th style={{ width: '200px' }}>
                                Email
                                </Table.Th> */}
                                
                                {/* <Table.Th style={{ width: '100px' }}>
                                Salary
                                </Table.Th> */}
                                
                                <Table.Th style={{ width: '160px' }}>
                                Hire Date
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
                ): (<Empty />)
            }
        </>
    )
}

export default EmployeesList
