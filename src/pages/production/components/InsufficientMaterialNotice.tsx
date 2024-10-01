import { List, Text } from '@mantine/core'
import PaperCard from '../../../components/PaperCard'
import PaperCardHeader from '../../../components/PaperCardHeader'
import PaperCardBody from '../../../components/PaperCardBody'

const InsufficientMaterialNotice = ({insufficientNote}:{insufficientNote: string[]|undefined}) => {
    if (!insufficientNote) return null
  return (
    <div style={{marginBottom:'15px'}}>
        <PaperCard>
            <PaperCardHeader>
                Insufficient Notice
            </PaperCardHeader>
            <PaperCardBody>
                <List size="sm">
                    {insufficientNote.map((material,key) => (
                        <List.Item c={'orange'} mb={7} key={key}>{material}</List.Item>
                    ))}
                </List>
                 <Text fz={'sm'}>Please add the required materials and try again.</Text>
            </PaperCardBody>
        </PaperCard>
    </div>
  )
}

export default InsufficientMaterialNotice
