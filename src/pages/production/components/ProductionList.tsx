import { ActionIcon, Avatar, Button, Flex, Grid, GridColProps, Group, Menu, Paper, Text, TooltipFloating, rem } from '@mantine/core';
import { IconChevronRight, IconCopy, IconHistory, IconPencil, IconStatusChange, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom';
import { modals } from '@mantine/modals';
import { ProductionBasicModel } from '../../../requests/models/_production';
import { deleteProduction, duplicateProduction, getProductions } from '../../../requests/_productionRequests';
import { notify } from '../../../requests/general/toast';
import { isStringInArray, toHeadline } from '../../../requests/general/_stringHelper';
import Priority from '../../../components/Priority';
import StatusBadge from '../../../components/StatusBadge';
import { AxiosError } from 'axios';
import TableLoadingSingle from '../../../components/TableLoadingSingle';
import AddProductionModal from './AddProductionModal';
import { productionEnds } from '../../../requests/general/options';
import { useQuery } from '@tanstack/react-query';
import EmptyProduction from '../../../components/EmptyProduction';

const ProductionList = () => {

    const {data,isLoading} = useQuery({
        queryKey: ['productions'],
        queryFn: getProductions
    })
    
    const [sortedData, setSortedData] = useState<ProductionBasicModel[]|undefined>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const allProductionLists = data?.data.data;

    useEffect(()=>{
        const productionLists = allProductionLists?.filter(production => {
            return !isStringInArray(production.status,productionEnds)
        });
        // if(productionLists) {
        setSortedData(productionLists);
        setLoading(false);
        // }
    },[allProductionLists])
    
 
    const duplicateProductData = async(id: number) => {

        try{
            const response = await duplicateProduction(id)
            const data = response.data

            if(data.saved) {

                notify({
                    type:'success',
                    message: data.message,
                    title: 'Done'
                })
                navigate(`/productions/${data.data.id}/edit`)
            }
        } catch(error) {
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.message+" Please reload the page and try again.", // Use optional chaining to access data property
                title: 'Something went wrong'
              })
            } else {
              notify({
                type:'error',
                message: 'An unexpected error occurred',
                title: 'Something went wrong'
              })
            }
          }
        
    }

    const deleteItem = async(id: number) => {
      try {

          const response = await deleteProduction(id)
          if(response.data.deleted) {
            const data = sortedData?.filter((production)=>{
                return production.id !== id
            })

            setSortedData(data)
            
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
          notify({
              type:'error',
              message: 'Something went wrong',
              title: 'Oops!'
          })
      }
        
    }
    
    const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete Production',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete Production? This data will be lost permanently..
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteItem(id),
    });
    
    let grids: React.ReactElement<GridColProps>[] = [];
    if(sortedData) {
        grids = sortedData.map((row) => (
            <Grid.Col key={row.id} span={{base:12, sm: 6, md: 4}}>
            <Paper p={20} radius={10} withBorder={false} shadow='xs'>
                <Group mb={10} justify='space-between'>
                    <Priority priority={row.priority} bar={true} />
                    <div>
                        <TooltipFloating label='Edit Production' >
                        <ActionIcon mr={5} variant="light" aria-label="Settings" component={Link} to={`/productions/${row.id}/edit`}>
                            <IconPencil style={{ width: '70%', height: '70%' }} stroke={2} />
                        </ActionIcon>
                        </TooltipFloating>
                        {
                            !row.insufficient_materials?
                            (row.category === 'product')?
                            (row.type === 'product' && row.product_id) || (row.type === 'intermediate_good' && row.intermediate_good_id)?(
                                <TooltipFloating label='Change Status' >
                                <ActionIcon mr={5} variant="filled" aria-label="Settings" component={Link} to={`/productions/${row.id}/view`}>
                                    <IconStatusChange style={{ width: '70%', height: '70%' }} stroke={2} />
                                </ActionIcon>
                                </TooltipFloating>
                            ):null:(
                                <TooltipFloating label='Change Status' >
                                <ActionIcon mr={5} variant="filled" aria-label="Settings" component={Link} to={`/productions/${row.id}/view`}>
                                    <IconStatusChange style={{ width: '70%', height: '70%' }} stroke={2} />
                                </ActionIcon>
                                </TooltipFloating>
                            ):null
                        }
                        
                        <Menu shadow="md" width={200}>
                            <TooltipFloating label='More Actions' >
                            <Menu.Target>
                            <ActionIcon color='gray' variant="light" aria-label="Settings">
                            <IconChevronRight style={{ width: '70%', height: '70%' }} stroke={2} />
                            </ActionIcon>
                            </Menu.Target>
                            </TooltipFloating>

                            <Menu.Dropdown>

                                <Menu.Item onClick={() => duplicateProductData(row.id)}
                                    leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}>
                                    Duplicate
                                </Menu.Item>
                            <Menu.Divider />

                            {/* <Menu.Label>Danger zone</Menu.Label> */}
                            
                            <Menu.Item 
                                onClick={()=>openDeleteModal(row.id)}
                                    color="red"
                                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                >
                                Delete
                            </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </Group>
                <Group mb={10}>
                    <Text fz={'md'} fw={'600'}>{row.title}</Text>
                </Group>
                <Group mb={6} justify='space-between'>
                    <Text c="dimmed">
                    {toHeadline(row.category)}
                    </Text>
                    <StatusBadge status={row.status}  />
                    {/* <Text>
                        <IconCalendar size={20} />
                        <DefaultReadableDate dateFormat={row.start_date} />
                    </Text> */}
                </Group>
                {
                    row.assignee?(
                        <Group gap="sm">
                            <Avatar size={25} src={row.assignee?.image} radius={25} />
                            <Text>
                                {`${row.assignee?.first_name} ${row.assignee?.last_name}`}
                            </Text>
                        </Group>
                    ):(
                        <Text c={'dimmed'} fs={'italic'}>No Assigned</Text>
                    )
                }
                
            </Paper>
            </Grid.Col>
        ));
    }

    return (
        <>
            <Grid mb={15}>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                    <Text fz={'lg'}>
                        These shows the list of all unfinished productions.
                    </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                    <Flex
                        gap="md"
                        justify="flex-end"
                        align="center"
                        direction="row"
                        wrap="wrap"
                    >
                        <Button component={Link} to={'/productions/history'} variant='light'
                        leftSection={<IconHistory size={16} />}>History</Button>
                        <AddProductionModal  />
                    </Flex>
                </Grid.Col>
            </Grid>

            {
                isLoading||loading? <TableLoadingSingle withImage={false} columns={6}/>:
                grids.length > 0 ? (
                    <>
                    <Grid mt={20}>
                        {grids}
                    </Grid>
                    </>
                ):(
                    <EmptyProduction  />
                )
            }
            


        </>
    )
}

export default ProductionList
