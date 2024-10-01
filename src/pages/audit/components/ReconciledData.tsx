import { ScrollArea, Table } from '@mantine/core'
import { ReconciliationData, ReconciliationModel } from '../../../requests/models/_audit';
import ReconciledItem from './ReconciledItem';

const ReconciledData = ({reconciliation}:{ reconciliation: ReconciliationModel }) => {
    
    const form_fields = JSON.parse(reconciliation.data)

    const fields = form_fields.map((item: ReconciliationData) => (
        <ReconciledItem item={item} key={item.key} />    
    ));

  return (
    <>
        <ScrollArea my={10}>
            <Table withRowBorders={true} highlightOnHover withColumnBorders={false} 
            horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" mb={20}>
                <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{ width: '200px' }}>
                    Material
                    </Table.Th>
                    
                    <Table.Th style={{ width: '140px' }}>
                        Current Level
                    </Table.Th>
                    
                    <Table.Th style={{ width: '140px' }}>
                        Actual Level
                    </Table.Th>
                    
                    <Table.Th style={{ width: '300px' }}>
                        Note
                    </Table.Th>
                </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                {
                    fields
                }
                </Table.Tbody>
            </Table>

        </ScrollArea>
    </>
  )
}

export default ReconciledData
