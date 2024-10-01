import image from '../assets/images/no-data.svg'
import {Center, Image, Stack, Text} from "@mantine/core";

const Empty = ({w=250,h=250}:{w?: number|undefined, h?: number|undefined}) => {
    
  return (
      <Center>
        <Stack py={50}>
            <Image src={image} maw={w} mah={h} alt="empty image" />
            <Text fz={30} ta={'center'} c={'dimmed'}>No Records Available</Text>
        </Stack>
      </Center>
  )
}

export default Empty
