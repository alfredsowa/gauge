import { Tooltip, rem } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

const TextLabelWithToolTip = ({title, label}:{label: string,title: string}) => {
    
  return (
    <>
      {label}
      <Tooltip
        multiline
        w={220}
        label={title}
        // position="top-end"
        withArrow
        transitionProps={{ transition: 'pop-bottom-right' }}
      >
        <IconInfoCircle style={{ width: rem(20), height: rem(20), marginLeft: rem(5), paddingTop: '5px', marginBottom:'-3px' }} stroke={1.5} />
    </Tooltip>
    </>
    
  )
}

export default TextLabelWithToolTip
