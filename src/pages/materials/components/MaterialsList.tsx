import React, {ReactElement, useEffect, useState} from 'react'
import {MaterialCollectionData} from '../../../requests/models/_material';
import {
    Button,
    Flex,
    Grid,
    Group,
    keys,
    Paper,
    rem,
    ScrollArea,
    Table,
    TextInput,
    Tooltip,
} from '@mantine/core';
// import RowItem from './RowItem';
import { IconPlus, IconSearch, IconSortAscendingLetters, IconSortDescendingLetters } from '@tabler/icons-react';
import Empty from '../../../components/Empty';
import {Link, useSearchParams} from 'react-router-dom';
import Categories from './Categories';
import TotalRecord from '../../../components/TotalRecord';
import MaterialItem from './MaterialItem';
import FilterModal from './FilterModal';
import {getMaterials} from "../../../requests/_materialsRequests.ts";
import TableLoadingSingle from "../../../components/TableLoadingSingle.tsx";


function filterData(data: MaterialCollectionData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      keys(data[0])?.some((key: Extract<keyof MaterialCollectionData, string>) => 
        typeof item[key] === 'string' && 
        typeof item[key]!== 'undefined' && 
        (item[key] as string)?.toLowerCase().includes(query)
      )
    );
  }
  
  function sortData(
    data: MaterialCollectionData[],
    payload: { sortBy: keyof MaterialCollectionData | undefined; reversed: boolean; search: string }
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

const MaterialsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState<MaterialCollectionData[] | undefined>();
  const [sortBy, setSortBy] = useState<keyof MaterialCollectionData>('name');
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [materialsList, setMaterialsList] = useState<MaterialCollectionData[] | undefined>();

  useEffect(() => {
    setLoading(true)

    const queryDataResponse = async () => {
        const response = await getMaterials()
        if(response.data.data){
            setMaterialsList(response.data.data)
            setLoading(false)
        }
    }

    queryDataResponse()
      
  },[])

    useEffect(()=>{
      if(searchParams.size === 0){
        setSortedData(materialsList);
      }
      else if (materialsList && searchParams.get('categories')){
        const categoriesString = searchParams.get('categories')
        const categoriesArray = categoriesString?.split(',')
        setSortedData(materialsList.filter(material => categoriesArray?.includes(String(material.material_category_id))));
        // setSortedData(sortData(materialsList, { sortBy: sortBy, reversed: reverseSortDirection, search: searchParams.get('search')?? '' }));
      }

    },[searchParams,materialsList])
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);

        if (materialsList) {
            setSortedData(sortData(materialsList, { sortBy: sortBy, reversed: reverseSortDirection, search: value }));
        }
    };

      const handleSort = (field: keyof MaterialCollectionData) => {
        const reversed = field === sortBy?!reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        if (sortedData) {
            setSortedData(sortData(sortedData, { sortBy: field, reversed, search }));
        }
      }

    let rows: ReactElement<MaterialCollectionData>[] = [];

    if(sortedData) {
        rows = sortedData.map((row) => (
          <MaterialItem row={row} setMaterialsList={setMaterialsList} key={row.id} materialsList={materialsList}/>
      ));
    }
      
  return (
    <>
        <Paper mb={15} p="sm" radius="md">
            <Grid>
                <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                  <TextInput
                      placeholder="Search by any field"
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
                    {reverseSortDirection?(
                      <Tooltip hiddenFrom='sm' arrowPosition="side" arrowOffset={5} arrowSize={4} label="Sort A-Z" withArrow position="top-start">
                      <Button variant="light" color="gauge-primary" aria-label="Sort A-Z" onClick={()=>handleSort('name')}>
                        <IconSortDescendingLetters size={20} />
                      </Button>
                      </Tooltip>
                      ):(
                      <Tooltip arrowPosition="side" arrowOffset={5} arrowSize={4} label="Sort Z-A" withArrow position="top-start">
                      <Button variant="light" color="gauge-primary" aria-label="Sort Z-A" onClick={()=>handleSort('name')}>
                        <IconSortAscendingLetters size={20} />
                      </Button>
                      </Tooltip>
                    )}
                    <FilterModal setSearchParams={setSearchParams} />
                  <Categories  />
                  <Button component={Link} to={'/materials/add'} variant='filled'
                    leftSection={<IconPlus size={16} />}>Add New</Button>
                </Flex>
                </Grid.Col>
            </Grid>
        </Paper>

      {
        loading?<TableLoadingSingle withImage={true} columns={6} />:
        rows.length > 0 ? (
          <Paper shadow="xs" p={10} radius="lg">
          <Group justify="space-between" mb={10}>
            <TotalRecord count={rows.length} />
          </Group>
          <ScrollArea>
            <Table withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" miw={700} layout="fixed" mb={20}>
              <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: '300px' }}>
                    Name
                  </Table.Th>
                  
                  <Table.Th style={{ width: '150px' }}>
                    Current Stock
                  </Table.Th>
                  
                  <Table.Th style={{ width: '150px' }}>
                    Minimum Stock
                  </Table.Th>
                  
                  <Table.Th style={{ width: '90px' }}>
                    Unit Cost
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
        ):(<Empty />)
      }
        
    </>
  )
}

export default MaterialsList