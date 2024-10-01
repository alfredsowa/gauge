import { Center, Flex, Group, Image, Loader, Stack } from '@mantine/core'
import logo from '../assets/images/gauge-primary.png'

const SplashScreen = () => {
  return (
    <Center style={{height: "100vh"}}>
        <Flex
            h="100%"
            w="100%"
            bg="white"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap">
            <Group justify="center">
                <Center>
                <Stack>
                    <Center>
                        <Loader color='#038FC4' mb={10} size={40} />
                    </Center>
                    <Image
                        radius="md"
                        src={logo}
                        w={200}
                        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                    /> 
                </Stack>
                </Center>
            </Group>
                
        </Flex>
    </Center>
  )
}

export default SplashScreen
