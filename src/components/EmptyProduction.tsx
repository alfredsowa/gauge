import { IconPlus } from '@tabler/icons-react';
import {Center, Stack, Text} from "@mantine/core";

const EmptyProduction = () => {
    
  return (
        <Stack py={50} c={'dimmed'} ta={'center'}>
      <Center>
            <IconPlus size={50} stroke={1} style={{marginRight: '20px'}} />
            <Text fz={40} ta={'center'} c={'dimmed'}>
              New Production Run
            </Text>
      </Center>
        </Stack>
  )
}

export default EmptyProduction
