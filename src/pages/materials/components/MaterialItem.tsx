import React from 'react'
import { MaterialCollectionData } from '../../../requests/models/_material'
import {deleteMaterial} from '../../../requests/_materialsRequests'
import { notify } from '../../../requests/general/toast'
import { modals } from '@mantine/modals'
import { ActionIcon, Avatar, Group, Menu, rem, Table, Text } from '@mantine/core'
import { IconChevronRight, IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { GetWithUnit, MoneyFigure } from '../../../requests/general/_numberHelper'

const MaterialItem = ({row,materialsList,setMaterialsList}:{row: MaterialCollectionData,
    materialsList: MaterialCollectionData[]|undefined,
    setMaterialsList: React.Dispatch<React.SetStateAction<MaterialCollectionData[]|undefined>>}) => {
  
    const deleteItem = async () => {
      
      const response = await deleteMaterial(row.id)
      if(response.data.removed){
        notify({
          type:'success',
          message: response.data.message,
          title: 'Done'
        })

        const getData = materialsList?.filter((data) => {
          return data.id!== row.id
        })
          // const materialResponse = await getMaterials()
          // if(materialResponse.data.data){
          //     setMaterialsList(materialResponse.data.data)
          // }else {
          // }
          setMaterialsList(getData)
  
      }
      else {
        notify({
          type:'error',
          message: response.data.message,
          title: 'Error'
        })
      }
    }
    
    const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Delete Material',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this material? This data will be lost permanently..
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteItem(),
    });
  return (
    <>
        <Table.Tr key={row.id}>
                <Table.Td>
                    <Group gap="sm" wrap='nowrap'>
                        {/*<Indicator disabled={row.current_stock_level > row.minimum_stock_level}*/}
                        {/*           position="top-center" size={14}  withBorder processing color='red' inline*/}
                        {/*           label={<Text fz={12}>low</Text>}>*/}
                            <Avatar component={Link} to={`/materials/${row.id}/view`}
                            size={50}
                            radius="md"
                            src={row.image}
                            />
                        {/*</Indicator>*/}
                        <div>
                            <Text fw={600} component={Link} to={`/materials/${row.id}/view`}>
                            {row.name} 
                            </Text>
                            <Text c="dimmed">
                            {row.category?.title}
                            </Text>
                        </div>
                    </Group>
                </Table.Td>

                <Table.Td>
                    {
                    (row.current_stock_level <= 0)? 
                    (<Text c={'red'}>Out of stock </Text>):
                    (row.minimum_stock_level > row.current_stock_level)? 
                    (<Text c="yellow"><GetWithUnit figure={row.current_stock_level} unit={row.unit_of_measurement}/></Text>):
                    (<Text c="dimmed"><GetWithUnit figure={row.current_stock_level} unit={row.unit_of_measurement}/></Text>)
                    }
                </Table.Td>

                <Table.Td>
                    <Text c="dimmed">
                    <GetWithUnit figure={row.minimum_stock_level} unit={row.unit_of_measurement}/>
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text c={'dimmed'} fw={600}>
                        <MoneyFigure figure={row.cost_per_unit} />
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
                    <Menu.Item component={Link} to={`/materials/${row.id}/edit`}
                    leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                    Edit
                    </Menu.Item>
                    <Menu.Item component={Link} to={`/materials/${row.id}/view`}
                    leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                    View
                    </Menu.Item>
                    {
                        row.deletable?(
                        <>
                            <Menu.Divider />

                            <Menu.Label>Danger zone</Menu.Label>
                            <Menu.Item
                                onClick={() => openDeleteModal()}
                                color="red"
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            >
                                Delete
                            </Menu.Item>
                        </>
                        ):''
                    }

                </Menu.Dropdown>
                </Menu>
                </Table.Td>
        </Table.Tr>
    </>
  )
}

export default MaterialItem
