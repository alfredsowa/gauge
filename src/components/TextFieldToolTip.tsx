import { Center, Text, Tooltip, rem } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

const TextFieldToolTip = ({title}:{title: string}) => {
    
  return (
    <Tooltip
        label={title}
        position="top-end"
        withArrow
        transitionProps={{ transition: 'pop-bottom-right' }}
    >
        <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
        <Center>
            <IconInfoCircle style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </Center>
        </Text>
    </Tooltip>
  )
}

export default TextFieldToolTip
