import { Accordion, Avatar, Group, Paper, Text } from '@mantine/core'
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper'
import { ProductModel } from '../../../requests/models/_product'

const ProductMaterialsList = ({product}:{product: ProductModel|undefined}) => {

    const productIntermediateGoods = product?.intermediate_goods
    const productMaterials = product?.materials

  return (
    <div>
        <Accordion variant="contained">
            <Accordion.Item value="intermediate-goods">
                <Accordion.Control>
                Intermediate Goods ({productIntermediateGoods?.length?productIntermediateGoods.length:0})
                </Accordion.Control>
                <Accordion.Panel>
                {
                        productIntermediateGoods?  // Check if productMaterials exist before mapping over them. If not, display a message.
                        productIntermediateGoods.length > 0 ?
                        productIntermediateGoods.map((material) => {
                            return (
                                <Paper p={7} px={10} mb={7} withBorder shadow='none' key={material.id}>
                                    <Group gap="sm" justify='space-between'>
                                        <Group>
                                            <Avatar src={material.image} size={40} radius={10}>IG</Avatar>
                                            <div>
                                                <Text fz="sm" fw={600}>
                                                    {material.name}
                                                </Text>
                                                <Text fz="sm" c="dimmed">
                                                    Quantity: <PrettyFigure figure={material.quantity} />

                                                    <Text fz="sm" c="dimmed" component='span' ml={10}> - Labour: <MoneyFigure figure={Number(material.labour_cost)*Number(material.quantity)} /></Text>
                                                </Text>
                                            </div>
                                        </Group>
                                    </Group>
                                </Paper>
                            )
                        }):(
                            <Text fz="sm" fs={'italic'} ta={'center'} c="dimmed" my={10}>Nothing added yet</Text>
                        ):(<Text fz="sm" ta={'center'} fs={'italic'} c="dimmed" my={10}>No product selected</Text>)
                    }
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="materials">
                <Accordion.Control>
                Materials ({productMaterials?.length?productMaterials.length:0})
                </Accordion.Control>
                <Accordion.Panel>
                    {
                        productMaterials?  // Check if productMaterials exist before mapping over them. If not, display a message.
                        productMaterials.length > 0 ?
                        productMaterials.map((material) => {
                            return (
                                <Paper p={7} px={10} mb={7} withBorder shadow='none' key={material.id}>
                                    <Group gap="sm" justify='space-between'>
                                        <Group>
                                            <Avatar src={material.image} size={40} radius={10}>MK</Avatar>
                                            <div>
                                                <Text fz="sm" fw={600}>
                                                    {material.name}
                                                </Text>
                                                <Text fz="sm" c="dimmed">
                                                    Quantity: <PrettyFigure figure={material.quantity} />

                                                    <Text fz="sm" c="dimmed" component='span' ml={10}></Text>
                                                </Text>
                                            </div>
                                        </Group>
                                    </Group>
                                </Paper>
                            )
                        }):(
                            <Text fz="sm" ta={'center'} fs={'italic'} c="dimmed" my={10}>No materials added yet.</Text>
                        ):<Text fz="sm" ta={'center'} fs={'italic'} c="dimmed" my={10}>No product selected</Text>
                    }
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    </div>
  )
}

export default ProductMaterialsList
