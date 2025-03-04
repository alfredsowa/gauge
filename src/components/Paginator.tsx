import {useMemo} from 'react'
import {ActionIcon, Group, NativeSelect, Text} from "@mantine/core";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";

type PaginatorProps = {
    totalRecords: number,
    per_page: number,
    // setPerPage: (page: number) => void,
    current_page: number,
    // setCurrentPage: (page: number) => void,
    last_page: number,
    onNext: (current_page: number) => void,
    onPrev: (current_page: number) => void,
    onPerPage: (page: number) => void,
    // from: number,
    // to: number,
}

const Paginator = ({
        totalRecords,
        per_page,
        last_page,
        current_page,
        onNext,
        onPrev,
        onPerPage
   }:PaginatorProps) => {

    const message = useMemo(()=> {
        return `Showing ${per_page * (current_page - 1) + 1} – ${Math.min(totalRecords, per_page * current_page)} of ${totalRecords}`;
    },[current_page,per_page,totalRecords]);


    return (
        <>
            <Group justify="space-between" my={'md'}>
                <NativeSelect
                    onChange={(e) => onPerPage(parseInt(e.target.value))}
                    value={per_page}
                    leftSectionPointerEvents="none"
                    data={['10', '25', '50', '100']}
                />
                <Group justify="start">
                    <Text size="sm">{message}</Text>
                    <ActionIcon.Group>
                        <ActionIcon variant="default" disabled={current_page < 2} onClick={()=>onPrev(current_page-1)} size="lg" aria-label="Gallery">
                            <IconChevronLeft size={20} stroke={1.5} />
                        </ActionIcon>

                        <ActionIcon variant="default" disabled={current_page >= last_page} size="lg" onClick={()=>onNext(current_page+1)} aria-label="Likes">
                            <IconChevronRight size={20} stroke={1.5} />
                        </ActionIcon>
                    </ActionIcon.Group>
                </Group>
            </Group>
        </>
    )
}
export default Paginator
