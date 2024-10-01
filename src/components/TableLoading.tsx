import { Group, Skeleton, Table, TableTdProps } from '@mantine/core'

const TableLoading = ({withImage=true, columns=4}: {withImage?: boolean; columns?: number}) => {

    let loading: React.ReactElement<TableTdProps>[] = [];
    const changeableCols = columns - 2
                
    

    for (let counter = 1; counter <= 3; counter++) {
    let row_column: React.ReactElement<TableTdProps>[] = [];
        loading = [...loading,
            <Table.Tr key={counter}>
                <Table.Td>
                    <Group gap="sm">
                        {withImage && <Skeleton height={40} radius="md" width={40} />}
                        <div>
                            <Skeleton height={17} width={100} radius="sm" />
                            <Skeleton height={14} mt={6} width={50} radius="sm" />
                        </div>
                    </Group>
                </Table.Td>
                
                {
                    columns > 2 ?
                    row_column = [...row_column,...Array(changeableCols).fill(null)].map((_, index) => (
                        <Table.Td key={index}>
                            <Skeleton height={14} width={70} radius="sm" />
                            <Skeleton height={14} mt={6} width={50} radius="sm" />
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
        {loading}
    </>
    )
}

export default TableLoading
