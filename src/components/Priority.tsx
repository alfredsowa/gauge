import { Text } from '@mantine/core'
import { toHeadline } from '../requests/general/_stringHelper'

const Priority = ({priority,fz}:{priority: string,fz?:string|number}) => {

    const tag = (priority === 'normal') ? "yellow": 
                (priority === 'critical') ? "red" :
                (priority === 'low') ? "blue" : "dimmed"

    return (
        <>
            <Text fz={fz?fz:'sm'} fw={300} component='span' c={tag}>{toHeadline(priority)} </Text>
        </>
    )
}

export default Priority
