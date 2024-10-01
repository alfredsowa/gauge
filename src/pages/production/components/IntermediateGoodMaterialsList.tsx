import { IntermediateGoodBasicModel } from '../../../requests/models/_intermediateGood'
import { Avatar, Group, Paper, Text } from '@mantine/core'
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper'

const IntermediateGoodMaterialsList = ({intermediateGood}:{intermediateGood: IntermediateGoodBasicModel|undefined}) => {
    const intermediateGoodMaterials = intermediateGood?.materials

    return (
    <div>
      {
            intermediateGoodMaterials?  // Check if intermediateGoodMaterials exist before mapping over them. If not, display a message.
            intermediateGoodMaterials.length > 0 ?
            intermediateGoodMaterials.map((material) => {
                return (
                    <Paper p={7} px={10} mb={7} withBorder shadow='none' key={material.id}>
                        <Group gap="sm" justify='space-between'>
                            <Group>
                                <Avatar src={material.image} size={40} radius={10}>MK</Avatar>
                                <div>
                                    <Text fz="sm" fw={600}>
                                        {material.name}
                                    </Text>
                                    <Text fz="sm" fw={400} c="dimmed">
                                        Quantity: <PrettyFigure figure={material.quantity} />
                                        <Text fz="sm" fw={400} c="dimmed" component='span' ml={10}>- Cost: <MoneyFigure figure={Number(material.quantity)*Number(material.cost_per_unit)} /></Text>
                                    </Text>
                                </div>
                            </Group>
                        </Group>
                    </Paper>
                )
            }):(
                <Text fz="sm" ta={'center'} fs={'italic'} c="dimmed" my={10}>No materials added yet.</Text>
            ):<Text fz="sm" ta={'center'} fs={'italic'} c="dimmed" my={10}>No intermediate good selected</Text>
        }
    </div>
  )
}

export default IntermediateGoodMaterialsList
