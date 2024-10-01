import { Group, Skeleton, Table, 
    TableTdProps, 
    // TableThProps 
} from '@mantine/core'
import PaperCard from './PaperCard';

const TableLoadingSingle = ({withImage=false, columns=4, rows=3}: {withImage?: boolean; columns?: number, rows?: number}) => {

    let loading: React.ReactElement<TableTdProps>[] = [];
    // let loadingHead: React.ReactElement<TableTdProps>[] = [];
    const changeableCols = columns - 2

    for (let counter = 1; counter <= rows; counter++) {
    let row_column: React.ReactElement<TableTdProps>[] = [];
        loading = [...loading,
            <Table.Tr key={counter}>
                <Table.Td>
                    <Group gap="sm">
                        {withImage && <Skeleton height={40} radius="md" width={40} />}
                        <div>
                            <Skeleton height={14} mt={6} width={70} radius="sm" />
                        </div>
                    </Group>
                </Table.Td>
                
                {
                    columns > 2 ?
                    row_column = [...row_column,...Array(changeableCols).fill(null)].map((_, index) => (
                        <Table.Td key={index}>
                            <Skeleton height={14} width={50} radius="sm" />
                        </Table.Td>
                    )):null
                }

                <Table.Td>
                    <Skeleton height={30} width={30} radius="sm" />
                </Table.Td>

            </Table.Tr>
        ] 
    }
    
    return (
    <>
    <PaperCard>
    <Table mt={40} withRowBorders={true} highlightOnHover withColumnBorders={false} horizontalSpacing="sm" verticalSpacing="xs" miw={700} layout="fixed" mb={20}>
        <Table.Thead>
        <Table.Tr>

            {/* {loadingHead} */}
            
            {/* <Table.Th style={{ width: '60px' }}>

            </Table.Th> */}
        </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
        {loading}
        </Table.Tbody>
    </Table>
    </PaperCard>
    </>
    )
}

export default TableLoadingSingle
