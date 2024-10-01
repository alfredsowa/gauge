import { ActionIcon, Avatar, Group, Indicator, Menu, Paper, Text, rem } from '@mantine/core'
import { MaterialCollectionData } from '../../../requests/models/_material'
import { IconChevronRight, IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { MoneyFigure } from '../../../requests/general/_numberHelper'
import classes from '../assets/TableSelection.module.css';
import { Link } from 'react-router-dom';
import { deleteMaterial } from '../../../requests/_materialsRequests';
import { notify } from '../../../requests/general/toast';
import { modals } from '@mantine/modals';

const RowItem = ({row,sortedData,setSortedData}:{row: MaterialCollectionData,
  sortedData: MaterialCollectionData[]|undefined,
  setSortedData: React.Dispatch<React.SetStateAction<MaterialCollectionData[]|undefined>>}) => {

  const deleteItem = async () => {
    
    const response = await deleteMaterial(row.id)
    if(response.data.removed){
      notify({
        type:'success',
        message: response.data.message,
        title: 'Done'
      })

      const getData = sortedData?.filter((data) => {
        return data.id!== row.id
      })

      setSortedData(getData)

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
      <Paper mb={3} p="sm" radius="md" withBorder={false}>
        <Group wrap="wrap" justify="space-between">
          <Group miw={250}>
          <Indicator disabled={row.current_stock_level <= row.minimum_stock_level ? false:true}
          position="bottom-center" size={18}  withBorder processing color='red' inline label="Low">
            <Avatar
              size={50}
              radius="md"
              src={row.image}
            />
            </Indicator>

            <div>
              <Text fw={600} className={classes.name}>
                {row.name}
              </Text>
              <Group wrap="nowrap" gap={3} mt={3}>
                <Text c={'dimmed'} fw={400}>
                  <MoneyFigure figure={row.cost_per_unit}  /> per unit
                </Text>
                {/* <IconQrcode color='dimmed' stroke={1.5} size="1rem" className={classes.icon} /> */}
                
              </Group>
            </div>
          </Group>
            
          <div>
            <Group gap="xl">
              <div >
                <Group wrap="nowrap" gap={3} mt={3}>
                  {/* <IconCash stroke={1.5} size="1rem" className={classes.icon} /> */}
                  {/* <Text fw={600}>
                  <MoneyFigure figure={row.cost_per_unit}  />
                  </Text> */}
                </Group>

                <Group wrap="nowrap" gap={3} mt={3}>
                  {/* <IconChartPie stroke={1.5} size="1rem" className={classes.icon} /> */}
                  <Text c={'dimmed'}>
                  {row.current_stock_level > 0 ? (
                    <>
                    <Text component='span'>{row.current_stock_level}</Text> {row.unit_of_measurement}  
                    <Text component='span' c={row.current_stock_level <= row.minimum_stock_level ? 'red':'dimme'}> left</Text>
                    </>
                    
                  ):(
                    <Text component='span' c={'red'}>Out of stock</Text>
                  )}
                  </Text>
                </Group>

              </div>

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

                  <Menu.Divider />

                  <Menu.Label>Danger zone</Menu.Label>
                  
                  <Menu.Item 
                  onClick={() => openDeleteModal()}
                    color="red"
                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            
          </div>
              
            
        </Group>
      </Paper>
    </>
  )
}

export default RowItem
