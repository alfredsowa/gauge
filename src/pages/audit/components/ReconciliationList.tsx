import { Group, Paper, ScrollArea, Table, TableTrProps } from '@mantine/core';
import React from 'react'
import Empty from '../../../components/Empty';
import { notify } from '../../../requests/general/toast';
import TotalRecord from '../../../components/TotalRecord';
// import { ReconciliationModel } from '../../../requests/models/_audit';
import { deleteReconciliation, getReconciliationsLoader } from '../../../requests/_auditRequest';
import ReconciliationItem from './ReconciliationItem';
import BeginReconciliationModal from './BeginReconciliationModal';
import TableLoadingSingle from '../../../components/TableLoadingSingle';
import { useQuery } from '@tanstack/react-query';

const ReconciliationList = () => {

    const {data: reconciliations, isLoading} = useQuery({
        queryKey: ['stockTaken'], 
        queryFn: getReconciliationsLoader,
        select: (data)=>data||[],
    })
    
    if(isLoading) return "Loading...";

    const deleteItem = async(id: number) => {
      try {
          const response = await deleteReconciliation(id)
          
          if(response.data.deleted) {
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
          console.log(error);
          notify({
              type:'error',
              message: 'Something went wrong',
              title: 'Oops!'
          })
      }
        
    }
    
    let rows: React.ReactElement<TableTrProps>[] = [];
    if(reconciliations) {
        rows = reconciliations.map((row) => (
            <ReconciliationItem row={row} key={row.id} deleteItem={deleteItem} />
        ));
    }

    return (
        <>
            <Group mb={15} justify='space-between'>
                <div></div>
                <BeginReconciliationModal />
            </Group>
            {
                isLoading?
                <TableLoadingSingle withImage={false} columns={7}/>: 
                rows.length > 0 ? (
                <Paper shadow="xs" p="sm" radius="lg">
                    <Group justify="space-between" mb={10}>
                        <TotalRecord count={rows.length} />
                    </Group>
                    <ScrollArea>
                        <Table withRowBorders={true} highlightOnHover withColumnBorders={false} 
                        horizontalSpacing="sm" verticalSpacing="xs" miw={700} layout="fixed" mb={20}>
                            <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ width: '300px' }}>
                                Title
                                </Table.Th>
                                
                                <Table.Th style={{ width: '100px' }}>
                                Type
                                </Table.Th>
                                
                                <Table.Th style={{ width: '100px' }}>
                                Period
                                </Table.Th>
                                
                                <Table.Th style={{ width: '100px' }}>
                                Status
                                </Table.Th>
                                
                                <Table.Th style={{ width: '120px' }}>
                                Categories
                                </Table.Th>
                                
                                <Table.Th style={{ width: '160px' }}>
                                Created by
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
                </Paper>):(
                    <Empty  />
                )
            }
        </>
    )
}

export default ReconciliationList
