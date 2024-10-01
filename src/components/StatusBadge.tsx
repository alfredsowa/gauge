import { Badge } from '@mantine/core'
import { isStringInArray } from '../requests/general/_stringHelper'

const StatusBadge = ({status}:{status: string}) => {

    const tag = (isStringInArray(status,['on-hold','backlog']))? "gray": 
                (isStringInArray(status, ['quality_control'])) ? "blue":
                (status === 'in_progress') ? "cyan":
                (status === 'completed') ? "green":
                (status === 'damaged'|| status ==='cancel') ? "red": "gray"

    const title = 
                (status === 'on_hold') ? "On Hold" :
                // (status === 'backlog') ? "Backlog":
                (status === 'quality_control') ? "Quality Control" :
                (status === 'in_progress') ? "In Progress":
                (status === 'completed') ? "Completed":
                (status === 'damaged') ? "Damaged":
                (status ==='cancel') ? "Cancelled":"Backlog"

    return (
        <>
            <Badge color={tag} size='md' radius="sm">{title}</Badge>
        </>
    )
}

export default StatusBadge
