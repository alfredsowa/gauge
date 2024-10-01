import { IconCheck, IconExclamationCircle, IconExclamationMark } from '@tabler/icons-react';
import { notifications } from "@mantine/notifications"
import { rem } from '@mantine/core';

type NotifyContent = {
    type: 'success'|'warning'|'error', 
    message: string, 
    title?: string|null, 
    icon?: JSX.Element|null, 
    position?: string|null, 
    autoClose?: number|null
}
export function notify(content: NotifyContent)
    {

    let color = "blue"
    // let backgroundColor = ""
    if(content.type === 'success'){
        content.icon = <IconCheck style={{ width: rem(18), height: rem(18) }} />
        color = "teal"
    }
    else if(content.type === 'warning'){
        content.icon = <IconExclamationCircle style={{ width: rem(18), height: rem(18) }} />
        color = "orange"
    }
    else if(content.type === 'error'){
        content.icon = <IconExclamationMark style={{ width: rem(18), height: rem(18) }} />
        color = "red"
    }

    if(content.position === null){
        content.position = 'top-right'
    }

    if(content.autoClose === null){
        content.autoClose = 6000
    }

    return notifications.show({
        message: content.message,
        color: color,
        withCloseButton: true,
        position: content?.position,
        title: content?.title,
        icon: content?.icon,
        autoClose: content?.autoClose,
        style: { border: `2px solid ${color}` }
      })

}