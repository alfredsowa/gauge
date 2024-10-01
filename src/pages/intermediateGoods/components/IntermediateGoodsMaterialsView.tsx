import { Avatar, Group, Table, Text} from '@mantine/core'
import { useMemo } from 'react'
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper'
import { IntermediateGoodMaterialsModel } from '../../../requests/models/_intermediateGood'

const IntermediateGoodsMaterialsView = ({prodMaterials}:{prodMaterials: IntermediateGoodMaterialsModel[]|undefined}) => {
    const intermediateGoodMaterials = prodMaterials

    const total_material_cost: number = useMemo(
        () => {
        
            let totalCost = 0;

            if(intermediateGoodMaterials) {
              for (let position = 0; position < intermediateGoodMaterials.length; position++) {
                totalCost += Number(intermediateGoodMaterials[position].cost_per_unit) * Number(intermediateGoodMaterials[position].quantity);
              }
            }

            return totalCost
        },
        [intermediateGoodMaterials]
    );
    
  return (
    <>
        <Text mb={5}>Total Materials: <Text component='span' fw={700}><PrettyFigure figure={intermediateGoodMaterials?.length} /></Text> with total cost at <Text component='span' fw={700}><MoneyFigure figure={total_material_cost} /></Text></Text>
        {/* <Text mb={12} fz={'sm'}>Cost of Materials: <Text component='span' fw={700}><MoneyFigure figure={total_material_cost} /></Text></Text> */}

        {/* <Grid gutter={'md'}> */}
        <Table.ScrollContainer minWidth={500}>
        <Table striped withColumnBorders withRowBorders={false}>
            <Table.Thead>
                <Table.Tr>
                <Table.Th>Material</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Cost</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
        {/* Displaying the intermediateGood materials */}
        {
            intermediateGoodMaterials?  // Check if intermediateGoodMaterials exist before mapping over them. If not, display a message.
            intermediateGoodMaterials.length > 0 ?
            intermediateGoodMaterials.map((material) => {
                
                return (
                    // <Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                        // <Paper p={7} withBorder shadow='none' key={material.id}>
                        //     <Group gap="sm" justify='space-between'>
                        //         <Group no-wrap='wrap'>
                        //             {/* <Avatar src={material.image} size={40} radius={10}>MK</Avatar> */}
                        //             <div>
                        //                 <Text  fw={600}>
                        //                     {material.name}
                        //                 </Text>
                        //                 <Text  fw={400} c="dimmed">
                        //                     Quantity: <PrettyFigure figure={material.quantity} />
                        //                     <Text  fw={400} c="dimmed" component='span' ml={10}>- Cost: <MoneyFigure figure={Number(material.quantity)*Number(material.cost_per_unit)} /></Text>
                        //                 </Text>
                        //             </div>
                        //         </Group>
                        //     </Group>
                        // </Paper>
                        <Table.Tr key={material.id}>
                            <Table.Td>
                            <Group no-wrap='wrap'>
                                <Avatar src={material.image} size={40} radius={10}>MT</Avatar>
                                <Text>{material.name}</Text>
                                </Group></Table.Td>
                            <Table.Td><Text><PrettyFigure figure={material.quantity} /></Text></Table.Td>
                            <Table.Td><Text><MoneyFigure figure={Number(material.quantity)*Number(material.cost_per_unit)} /></Text></Table.Td>
                      </Table.Tr>
                    // </Grid.Col>
                    
                )
            }):(
                <Text  c="dimmed" mt={20}>No materials added yet.</Text>
            ):''
        }
        </Table.Tbody>
        </Table>
        </Table.ScrollContainer>
        {/* </Grid> */}
    </>
  )
}

export default IntermediateGoodsMaterialsView
