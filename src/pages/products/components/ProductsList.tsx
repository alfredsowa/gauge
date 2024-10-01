import { ActionIcon, Avatar, Center, Flex, Grid, Group, Menu, Paper, ScrollArea, Table, TableTdProps, Text, TextInput, UnstyledButton, keys, rem } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconChevronUp, IconCopy, IconEdit, IconEye, IconSearch, IconSelector, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import classes from '../../purchases/assets/TableSelection.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper';
import Empty from '../../../components/Empty';
import { notify } from '../../../requests/general/toast';
import { modals } from '@mantine/modals';
import { ProductBasicModel } from '../../../requests/models/_product';
import { deleteProduct, duplicateProduct, getProducts } from '../../../requests/_productRequests';
import TotalRecord from '../../../components/TotalRecord';
import TableLoadingSingle from '../../../components/TableLoadingSingle';
import AddProductModal from "./AddProductModal.tsx";

interface RowData {
  name: string;
  price: number;
  sku: string;
  stock_quantity: number;
  updated_at: string;
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
          <Text fw={700} >
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
  
function filterData(data: ProductBasicModel[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0])?.some((key: keyof ProductBasicModel) => 
      typeof item[key] === 'string' && 
      typeof item[key]!== 'undefined' && 
      (item[key] as string)?.toLowerCase().includes(query)
    )
  );
}
  
function sortData(
  data: ProductBasicModel[],
  payload: { sortBy: keyof ProductBasicModel | null; reversed: boolean; search: string }) {
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

const ProductsList = () => {

    const [search, setSearch] = useState('');
    const [products, setProducts] = useState<ProductBasicModel[]>();
    const [sortedData, setSortedData] = useState<ProductBasicModel[]>();
    const [sortBy, setSortBy] = useState<keyof ProductBasicModel>('name');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(()=>{
      setLoading(true)
      const load_products = async () => {
          const getProductsResponse = await getProducts();
          setProducts(getProductsResponse.data.data);
          setLoading(false)
      }
      load_products()
    },[])

    useEffect(()=>{
        setSortedData(products);
    },[products])

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        if(products) {
            setSortedData(sortData(products, { sortBy: field, reversed, search }));
        }
    };
    
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        setLoading(true)
        const { value } = event.currentTarget;
        setSearch(value);
        if(products) {
            setSortedData(sortData(products, { sortBy, reversed: reverseSortDirection, search: value }));
        }
    
        setLoading(false)
    };

    const deleteItem = async(id: number) => {
      try {
          const response = await deleteProduct(id)
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

    const duplicateProductData = async(id: number) => {
        const response = await duplicateProduct(id)
        const data = response.data

        if(data.saved) {

            notify({
                type:'success',
                message: data.message,
                title: 'Done'
            })
            navigate(`/products/${data.data.slug}/edit`)
        }
        
    }
    
    const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete your profile',
      centered: true,
      children: (
        <Text >
          Are you sure you want to delete Product? This data will be lost permanently..
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
                          <Text  fw={600}>
                          {row.name} 
                          </Text>
                          <Text  c="dimmed">
                            {!row.is_active? (
                              <Text component='span' fz="sm" tt={'uppercase'} c="yellow">
                                    Draft
                              </Text>
                          ):''}
                          </Text>
                      </div>
                  </Group>
                </Table.Td>

                <Table.Td ta={'left'}>
                  {
                    (row.stock_quantity <= 0)? 
                    (<Text  c="red">Out of stock </Text>):
                    (row.min_stock_quantity > row.stock_quantity)? 
                    (<Text  c="dimmed"><Text component='span'  c={'yellow'}> Running out </Text> - <PrettyFigure figure={row.stock_quantity} /></Text>):
                    (<Text  c="dimmed"><Text component='span'  c={'green'}> In stock </Text> - <PrettyFigure figure={row.stock_quantity} /></Text>)
                  }
                </Table.Td>

                <Table.Td ta={'left'}>
                  <Text  c="dimmed">
                  <MoneyFigure figure={row.labour_cost} />
                  </Text>
                </Table.Td>

                <Table.Td ta={'left'}>
                    <Text  c={'dimmed'}>
                        {/* <Text  c={'dimmed'} component='span'><MoneyFigure figure={row.wholesale_price} /></Text> */}
                        <Text  c={'dimmed'} component='span'>
                          {
                            row.use_manual_pricing?(
                              <Text  c={'dimmed'} component='span'><MoneyFigure figure={row.wholesale_price} /></Text>
                            ):(
                              <MoneyFigure figure={row.product_costs.total_cost_of_goods * Number(row.wholesale_markup)} />
                            )
                          }
                          </Text>
                    </Text>
                </Table.Td>

                <Table.Td ta={'left'}>
                    <Text  c={'dimmed'}>
                      {
                        row.use_manual_pricing?(
                          <Text  c={'dimmed'} component='span'><MoneyFigure figure={row.price} /></Text>
                        ):(
                          <MoneyFigure figure={row.product_costs.total_cost_of_goods * Number(row.wholesale_markup) * Number(row.retail_markup)} />
                        )
                      }
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
                          <Menu.Item component={Link} to={`/products/${row.slug}/view`}
                                leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                View
                            </Menu.Item>
                            <Menu.Item component={Link} to={`/products/${row.slug}/edit`}
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                                Edit
                            </Menu.Item>
                            <Menu.Item onClick={()=>duplicateProductData(row.id)}
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
                        <AddProductModal />
                        {/*<Button component={Link} to={'/products/add'} variant='filled'*/}
                        {/*leftSection={<IconPlus size={16} />}>New Product</Button>*/}
                    </Flex>
                </Grid.Col>
            </Grid>
        </Paper>
        {
          loading?<TableLoadingSingle withImage={true} columns={6} />:
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
                        sorted={sortBy === 'name'}
                        reversed={reverseSortDirection}
                        onSort={() => setSorting('name')}
                        >
                        Name
                        </Th>
                        
                        <Table.Th style={{ width: '120px' }} ta={'left'}>
                          Current Stock
                        </Table.Th>
                        
                        <Table.Th style={{ width: '120px' }} ta={'left'}>
                          Labour
                        </Table.Th>
                        
                        <Table.Th style={{ width: '120px' }} ta={'left'}>
                          Wholesale
                        </Table.Th>
                        
                        <Table.Th style={{ width: '120px' }} ta={'left'}>
                          Retail
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
          </Paper>):(
            <Empty  />
          )}
      </>
    )
}

export default ProductsList
