import { Table, Text } from '@mantine/core'
import { GetWithUnit } from '../../../requests/general/_numberHelper'
import { ReconciliationData } from '../../../requests/models/_audit'

const ReconciledItem = ({item}:{item: ReconciliationData}) => {
  return (
    <>
            <Table.Tr key={item.id}>
                <Table.Td>
                    <Text c={'dimmed'} fw={600}>
                        {item.name}
                        <Text fw={400} c={'dimmed'}>
                        {item.category}
                    </Text>
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text c={'dimmed'}>
                        <GetWithUnit figure={item.current_stock} unit={item.unit}  />
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text c={'dimmed'}>
                        <GetWithUnit figure={item.actual_stock?item.actual_stock:0} unit={item.unit}  />
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text c={'dimmed'}>
                        {item.note?item.note: "-"}
                    </Text>
                </Table.Td>
            </Table.Tr>
        </>
  )
}

export default ReconciledItem
