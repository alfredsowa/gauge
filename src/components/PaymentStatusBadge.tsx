import { Badge } from '@mantine/core'
import { isStringInArray, toHeadline } from '../requests/general/_stringHelper'

const PaymentStatusBadge = ({status}:{status: string}) => {

    const tag = (isStringInArray(status,['on_hold','refunded']))? "gray": 
                (isStringInArray(status, ['processing'])) ? "blue":
                (status === 'pending') ? "cyan":
                (status === 'paid') ? "green":
                (isStringInArray(status, ['failed','canceled'])) ? "red":"gray"

    return (
        <>
            <Badge color={tag} size='sm' radius="sm">{toHeadline(status)}</Badge>
        </>
    )
}

export default PaymentStatusBadge
