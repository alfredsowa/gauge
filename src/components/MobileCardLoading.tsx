import { Group, Skeleton, TableTdProps } from '@mantine/core'
import PaperCard from "./PaperCard.tsx";
import PaperCardBody from "./PaperCardBody.tsx";

const MobileCardLoading = ({withImage=true, columns=4}: {withImage?: boolean; columns?: number}) => {

    let loading: React.ReactElement<TableTdProps>[] = [];
    const changeableCols = columns - 2
                
    

    for (let counter = 1; counter <= 5; counter++) {
    let row_column: React.ReactElement<TableTdProps>[] = [];
        loading = [...loading,
            <PaperCard mb={10} shadow="none" key={counter}>
                <PaperCardBody py={13} px={10}>
                    <Group justify="space-between">
                    <Group gap="sm">
                        {withImage && <Skeleton height={50} radius="md" width={50} />}
                        <div>
                            <Skeleton height={18} width={200} radius="sm" />
                            <Skeleton height={15} mt={6} width={50} radius="sm" />
                        </div>
                    </Group>

                {
                    columns > 2 ?
                    row_column = [...row_column,...Array(changeableCols).fill(null)].map((_, index) => (
                        <div key={index}>
                            <Skeleton height={14} width={70} radius="sm" />
                            <Skeleton height={14} mt={6} width={50} radius="sm" />
                        </div>
                    )):null
                }

                <div>
                    <Skeleton height={30} width={30} radius="sm" />
                </div>
                    </Group>
                </PaperCardBody>
            </PaperCard>
        ] 
    }
    
    return (
    <>
        {loading}
    </>
    )
}

export default MobileCardLoading
