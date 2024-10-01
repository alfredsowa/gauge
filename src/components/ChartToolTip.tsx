/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Divider, Group, Paper, Text } from '@mantine/core'
import { toHeadline } from '../requests/general/_stringHelper';

interface ChartTooltipProps {
    label: string;
    payload: Record<string, any>[] | undefined;
  }

const ChartToolTip = ({ label, payload }: ChartTooltipProps) => {
    if (!payload) return null;
  return (
    <>
      <Paper withBorder shadow="md" radius="md" w={'180px'}>
        <Group p={10} px={15}>
            <Text fw={500}>
                {label}
            </Text>
        </Group>
        <Divider  />
        <Box p={10} px={15}>
            {payload.map((item: any) => (
                <Group style={{borderLeft: '5px solid', borderLeftColor:item.color}} 
                justify='space-between' wrap='nowrap' 
                key={item.name} mb={3}>
                    <Text mx={6} c={item.color} fz="sm">
                        {toHeadline(item.name)}
                    </Text>
                    <Text fz="sm">
                        {item.value}
                    </Text>
                </Group>
                
            ))}
        </Box>
      
    </Paper>
    </>
  )
}

export default ChartToolTip
