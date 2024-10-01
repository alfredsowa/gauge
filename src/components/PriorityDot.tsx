import { Tooltip } from '@mantine/core'
import { toHeadline } from '../requests/general/_stringHelper'
import { IconCircleFilled } from '@tabler/icons-react'

const PriorityDot = ({priority,fz}:{priority: string,fz?:string|number}) => {

    const tag = (priority === 'normal') ? "orange": 
                (priority === 'critical') ? "red" :
                (priority === 'low') ? "blue" : "dimmed"

    return (
        <>
        <Tooltip label={toHeadline(priority)+' Priority'} >
            <IconCircleFilled size={fz? fz:"0.6rem"} color={tag} />
        </Tooltip>
        </>
    )
}

export default PriorityDot
