import { Badge } from '@mantine/core'
import { isStringInArray, toHeadline } from '../requests/general/_stringHelper'

const SaleStatusBadge = ({status}:{status: string}) => {

    const tag = (isStringInArray(status, ['processing'])) ? "blue":
                (status === 'pending') ? "cyan":
                (status === 'completed') ? "green":"gray"

    return (
        <>
            <Badge color={tag} size='sm' radius="sm">{toHeadline(status)}</Badge>
        </>
    )
}

export default SaleStatusBadge
