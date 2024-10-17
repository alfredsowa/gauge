import { Text, TooltipFloating } from '@mantine/core'
import { toHeadline } from '../requests/general/_stringHelper'

const Priority = ({priority,fz, bar=false}:{priority: string,fz?:string|number, bar?: boolean}) => {

    const tag = (priority === 'normal') ? "orange": 
                (priority === 'critical') ? "red" :
                (priority === 'low') ? "blue" : "dimmed"

    return (
        <>
        {
            bar?(
                <TooltipFloating label={toHeadline(priority)}>
                <div style={{width: '50px', height: '7px', backgroundColor: tag, borderRadius: '10px'}}></div></TooltipFloating>
            ):(
                <Text fz={fz?fz:'sm'} fw={300} component='span' c={tag}>{toHeadline(priority)} </Text>
            )
        }
        </>
    )
}

export default Priority
