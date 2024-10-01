import { ActionIcon, Menu, rem, Table, Text } from '@mantine/core'
import { ReconciliationModel } from '../../../requests/models/_audit'
import { toHeadline } from '../../../requests/general/_stringHelper'
import { IconChevronRight, IconEye, IconTrash } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { modals } from '@mantine/modals'
import { getMonthYear } from '../../../requests/general/_dates'

const ReconciliationItem = ({row,deleteItem}:{row: ReconciliationModel,deleteItem: (id: number) => void}) => {

    const openDeleteModal = (id: number) =>
        modals.openConfirmModal({
          title: 'Delete record',
          centered: true,
          children: (
            <Text size="sm">
              Are you sure you want to delete this reconciliation? This data will be lost permanently..
            </Text>
          ),
          labels: { confirm: 'Delete', cancel: "Cancel" },
          confirmProps: { color: 'red' },
          onCancel: () => console.log('Cancel'),
          onConfirm: () => deleteItem(id),
        });

  return (
    <>
    <Table.Tr>
        <Table.Td>
            <Text>
            {row.title}
            </Text>
        </Table.Td>

        <Table.Td>
            <Text c="dimmed">
            {toHeadline(row.type)}
            </Text>
        </Table.Td>

        <Table.Td>
            <Text c="dimmed">
                {getMonthYear(row.period)}
            </Text>
        </Table.Td>

        <Table.Td>
            {row.closed?
            (<Text c="green">Closed</Text>):
            (row.paused?
            (<Text c="dimmed">Paused</Text>):
            (<Text c="orange">On-going</Text>))}
        </Table.Td>

        <Table.Td>
            <Text c="dimmed">
                {
                    (row.categories.length > 0 && row.type == "materials")?
                    row.categories.length:'All'
                }
            </Text>
        </Table.Td>

        <Table.Td>
            <Text c="dimmed">
                {row.user.firstname+" " + row.user.name}
            </Text>
        </Table.Td>

        <Table.Td>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                <ActionIcon color='gray' variant="light" aria-label="Settings">
                <IconChevronRight style={{ width: '70%', height: '70%' }} stroke={2} />
                </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item component={Link} to={`/reconciliations/${row.id}/view`}
                        leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                        View
                    </Menu.Item>
                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                
                <Menu.Item 
                    onClick={()=>openDeleteModal(row.id)}
                        color="red"
                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                    >
                    Delete
                </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Table.Td>
    </Table.Tr>
    </>
  )
}

export default ReconciliationItem
