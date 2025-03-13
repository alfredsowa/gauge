import {ReactElement, useEffect, useState} from 'react'
import {MaterialCollection, MaterialCollectionData} from '../../../requests/models/_material';
import {
    Button,
    em,
    Flex,
    Grid,
    Paper,
    rem,
    ScrollArea,
    Table,
    TextInput,
} from '@mantine/core';
import {
    IconPlus,
    IconSearch,
} from '@tabler/icons-react';
import Empty from '../../../components/Empty';
import {Link, useSearchParams} from 'react-router-dom';
import Categories from './Categories';
import MaterialItem from './MaterialItem';
import FilterModal from './FilterModal';
import {getMaterials} from "../../../requests/_materialsRequests.ts";
import TableLoadingSingle from "../../../components/TableLoadingSingle.tsx";
import {useMediaQuery} from "@mantine/hooks";
import Paginator from "../../../components/Paginator.tsx";
import MobileCardLoading from "../../../components/MobileCardLoading.tsx";
import {MOBILE_SCREEN_SIZE} from "../../../base/constants.ts";

const MaterialsList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [materialsList, setMaterialsList] = useState<MaterialCollectionData[] | undefined>();
    const [current_page, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [per_page, setPerPage] = useState(10);
    const [last_page, setLastPage] = useState(1);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const isMobile = useMediaQuery(`(max-width: ${em(MOBILE_SCREEN_SIZE)})`);

    const queryDataResponse = async (page?: number) => {
        if (!page) {
            page = current_page;
        }
        const response = await getMaterials(page,per_page,search,searchParams)
        if(response.data.data){
            setValue(response.data)
        }
        setLoading(false)
    }

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

    useEffect(()=>{
        setLoading(true)
        queryDataResponse().then()

    },[searchParams])

    const onNext = async (current_page: number) => {
        setLoading(true)
        if(current_page < last_page) {
            setCurrentPage(current_page)
        }
        else {
            setCurrentPage(last_page)
        }

        const response = await getMaterials(current_page,per_page,search);
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
        const response = await getMaterials(current_page,per_page,search);
        if(response.data.data){
            setValue(response.data)
        }
        setLoading(false)
    };

    const onPerPage = async (per_page: number) => {
        setLoading(true)
        setPerPage(per_page);
        setCurrentPage(1);
        const response = await getMaterials(1,per_page,search);
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

    let rows: ReactElement<MaterialCollectionData>[] = [];

    if(materialsList) {
        rows = materialsList.map((row) => (
            <MaterialItem
                isMobile={isMobile}
                row={row}
                setMaterialsList={setMaterialsList}
                key={row.id}
                materialsList={materialsList}
            />
        ));
    }

    return (
        <>
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
                    <TextInput
                        radius={'md'}
                        size={'md'}
                        placeholder="Enter 3 or more to start search by name"
                        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                        {/*{reverseSortDirection?(*/}
                        {/*    <Tooltip arrowPosition="side" arrowOffset={5} arrowSize={4} label="Sort A-Z" withArrow position="top-start">*/}
                        {/*        <Button size={'sm'} variant="light" color="gauge-primary" aria-label="Sort A-Z" onClick={()=>handleSort('name')}>*/}
                        {/*            <IconSortDescendingLetters size={20} />*/}
                        {/*        </Button>*/}
                        {/*    </Tooltip>*/}
                        {/*):(*/}
                        {/*    <Tooltip arrowPosition="side" arrowOffset={5} arrowSize={4} label="Sort Z-A" withArrow position="top-start">*/}
                        {/*        <Button size={'sm'} variant="light" color="gauge-primary" aria-label="Sort Z-A" onClick={()=>handleSort('name')}>*/}
                        {/*            <IconSortAscendingLetters size={20} />*/}
                        {/*        </Button>*/}
                        {/*    </Tooltip>*/}
                        {/*)}*/}
                        <FilterModal setSearchParams={setSearchParams} />
                        <Categories  />
                        {isMobile && (
                            <Button size={'sm'} component={Link} to={'/materials/add'} variant='filled'
                                    leftSection={<IconPlus size={16} />}>Add</Button>
                        )}
                    </Flex>
                </Grid.Col>
            </Grid>

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
                ):(<Empty title={'No Material found'} />)
            }
        </>
    )
}

export default MaterialsList