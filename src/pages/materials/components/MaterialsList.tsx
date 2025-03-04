import React, {ReactElement, useEffect, useState} from 'react'
import {MaterialCollection, MaterialCollectionData} from '../../../requests/models/_material';
import {
    Button, em,
    Flex,
    Grid,
    keys,
    Paper,
    rem,
    ScrollArea,
    Table,
    TextInput,
    Tooltip,
} from '@mantine/core';
import {
    IconSearch,
    IconSortAscendingLetters,
    IconSortDescendingLetters
} from '@tabler/icons-react';
import Empty from '../../../components/Empty';
import {useSearchParams} from 'react-router-dom';
import Categories from './Categories';
import MaterialItem from './MaterialItem';
import FilterModal from './FilterModal';
import {getMaterials} from "../../../requests/_materialsRequests.ts";
import TableLoadingSingle from "../../../components/TableLoadingSingle.tsx";
import {useMediaQuery} from "@mantine/hooks";
import Paginator from "../../../components/Paginator.tsx";
import MobileCardLoading from "../../../components/MobileCardLoading.tsx";


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
    const [current_page, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [per_page, setPerPage] = useState(10);
    const [last_page, setLastPage] = useState(1);
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);


    useEffect(() => {
        setLoading(true)

        const queryDataResponse = async () => {
            const response = await getMaterials(current_page, per_page)
            console.log(response.data)
            if(response.data.data){
                setMaterialsList(response.data.data)
                setCurrentPage(response.data.meta.current_page)
                setPerPage(response.data.meta.per_page)
                setTotalRecords(response.data.meta.total)
                setLastPage(response.data.meta.last_page)
                setLoading(false)
            }
        }

        queryDataResponse().then()

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

    const onNext = async (current_page: number) => {
        setLoading(true)
        if(current_page < last_page) {
            setCurrentPage(current_page)
        }
        else {
            setCurrentPage(last_page)
        }
        console.log(current_page)
        const response = await getMaterials(current_page,per_page)
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
        const response = await getMaterials(current_page,per_page)
        if(response.data.data){
            setValue(response.data)
        }
        setLoading(false)
    };

    const onPerPage = async (per_page: number) => {
        setLoading(true)
        setPerPage(per_page);
        const response = await getMaterials(1,per_page);
        if(response.data.data){
            setValue(response.data)
        }
        setLoading(false)
    }

    const setValue = (materials: MaterialCollection) => {
        setMaterialsList(materials.data)
        setCurrentPage(materials.meta.current_page)
        setPerPage(materials.meta.per_page)
        setTotalRecords(materials.meta.total)
        setLastPage(materials.meta.last_page)
    }

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
            <MaterialItem isMobile={isMobile} row={row} setMaterialsList={setMaterialsList} key={row.id} materialsList={materialsList}/>
        ));
    }

    return (
        <>
            {/*<Paper mb={15} p="md" radius="md">*/}
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
                        <TextInput
                            size={'md'}
                            placeholder="Search by any field"
                            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, lg: 6 }} mb={'20'}>
                        <Flex
                            gap="xs"
                            justify="flex-end"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            {reverseSortDirection?(
                                <Tooltip arrowPosition="side" arrowOffset={5} arrowSize={4} label="Sort A-Z" withArrow position="top-start">
                                    <Button size={'sm'} variant="light" color="gauge-primary" aria-label="Sort A-Z" onClick={()=>handleSort('name')}>
                                        <IconSortDescendingLetters size={20} />
                                    </Button>
                                </Tooltip>
                            ):(
                                <Tooltip arrowPosition="side" arrowOffset={5} arrowSize={4} label="Sort Z-A" withArrow position="top-start">
                                    <Button size={'sm'} variant="light" color="gauge-primary" aria-label="Sort Z-A" onClick={()=>handleSort('name')}>
                                        <IconSortAscendingLetters size={20} />
                                    </Button>
                                </Tooltip>
                            )}
                            <FilterModal setSearchParams={setSearchParams} />
                            <Categories  />
                        </Flex>
                    </Grid.Col>
                </Grid>
            {/*</Paper>*/}

            {
                loading?
                    isMobile?
                    <MobileCardLoading withImage={true} columns={2} />:
                    <TableLoadingSingle withImage={true} columns={6} />:
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
                                    <Paper  shadow="xs" p={0} radius="lg">
                                        <ScrollArea>
                                            <Table
                                                withRowBorders={true}
                                                highlightOnHover
                                                withColumnBorders={false}
                                                horizontalSpacing="lg"
                                                verticalSpacing="xs"
                                                miw={700}
                                                layout="fixed"
                                                mb={20}>
                                                <Table.Thead p={20}>
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

                                                        <Table.Th style={{ width: '120px' }}>
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
                                )
                            }
                        </div>
                    ):(<Empty />)
            }

        </>
    )
}

export default MaterialsList