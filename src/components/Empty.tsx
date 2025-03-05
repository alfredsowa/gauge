import image from '../assets/images/no-data.svg'
import {Center, Image, Stack, Text} from "@mantine/core";

const Empty = ({
    w=200,
    h=200,
    title="No Records Available",
}:{
    w?: number|undefined,
    h?: number|undefined,
    title?:string|undefined,
}) => {
    
  return (
      <Center>
        <Stack py={100}>
            <Image src={image} maw={w} mah={h} alt="empty image" />
            <Text fz={{sm: 20, md: 20}} ta={'center'} c={'dimmed'}>{title}</Text>
        </Stack>
      </Center>
  )
}

export default Empty
