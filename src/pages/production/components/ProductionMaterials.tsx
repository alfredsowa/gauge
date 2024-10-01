import { Accordion, ActionIcon, Avatar, Button, Group, LoadingOverlay, Modal, NumberInput, Paper, Select, Text} from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { getBasicMaterials } from '../../../requests/_materialsRequests'
import { MaterialBasicModel } from '../../../requests/models/_material'
import { ProductionIntermediateGoods, ProductionMaterial } from '../../../requests/models/_production'
import { GetWithUnit, MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { notify } from '../../../requests/general/toast'
import { deleteProductionMaterial, saveProductionMaterial } from '../../../requests/_productionRequests'
import { IconTrash } from '@tabler/icons-react'
import { isStringInArray } from '../../../requests/general/_stringHelper'
import { AxiosError } from 'axios'
import PaperCard from '../../../components/PaperCard'
import PaperCardBody from '../../../components/PaperCardBody'
import PaperCardHeader from '../../../components/PaperCardHeader'
import { productionDontAlterMaterials, productionEnds } from '../../../requests/general/options'

type MaterialOpt = {
    value: string;
    label: string;
    disabled: boolean;
  }

const ProductionMaterials = ({prodMaterials,prodIntermediateGoods,production_id,category,proStage, production_quantity,view=true}:
    {prodMaterials: ProductionMaterial[], prodIntermediateGoods: ProductionIntermediateGoods[]|undefined
        production_id: number,category:string, proStage: string|null, production_quantity: number,view?:boolean}) => {
    const [materials, setMaterials] = useState<MaterialBasicModel[]>()
    const [productionMaterials, setProductionMaterials] = useState<ProductionMaterial[]>(prodMaterials)
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialBasicModel|undefined>()
    const [totalMaterialsUsed, setTotalMaterialsUsed] = useState(0);
    const [enableForm, setEnableForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        const materialsData = async() => {
            const materialResponse = await getBasicMaterials()
            const allMaterials = materialResponse.data
            setMaterials(allMaterials)
        }

        materialsData()
    },[])

    const materialsOpt: MaterialOpt[]|undefined = useMemo(
        () => {
          return materials?.map((material: MaterialBasicModel) => ({
            value: `${material.id}`,
            label: `${material.name} ${material.is_component?(' - COMPONENT'):''}`,
            disabled: (material.current_stock_level <= 0),
          }));
        },
        [materials]
    );

    const generalInformation = useForm({
        mode: 'controlled',
        initialValues: {
          material: 0,
          quantity: 0,
          cost: 0
        },
        validate: {
            material: (value) => (value < 1 ? 'Invalid material selected' : null),
            quantity: (value) => (value < 0 ? 'Quantity must be 0 or above' : null),
            cost: (value) => (value < 0 ? 'Cost must be 0 or above' : null),
        },
    });

    generalInformation.watch('material', ({ value }) => {
        
        if (value) {
            setSelectedMaterial(materials?.find((material: MaterialBasicModel) => material.id === Number(value)))
            setEnableForm(true)
        }
        else {
            setSelectedMaterial(undefined)
            setEnableForm(false)
        }
    });

    generalInformation.watch('quantity', ({ value }) => {
        if (value) {
            generalInformation.setFieldValue('cost',value * Number(selectedMaterial?.cost_per_unit))
            setTotalMaterialsUsed(value * Number(production_quantity))
            
        }
    });

    const handleSubmit = async(values: typeof generalInformation.values) => {
    
        const data = {
            production_id: Number(production_id),
            material_id: Number(values.material),
            quantity: values.quantity,
            cost: values.cost,
        }

        setLoading(true);

        try{

            const response = await saveProductionMaterial(data)
            
            if(response.data.saved) {

                notify({
                type:'success',
                message: response.data.message,
                title: 'Great'
                })
                setLoading(false);

                generalInformation.reset()
                setTotalMaterialsUsed(0)

                setProductionMaterials(response.data.data)

                close();

            }

        } catch(error) {
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.message, // Use optional chaining to access data property
                title: 'Something went wrong'
              })
            } else {
              notify({
                type:'error',
                message: 'An unexpected error occurred',
                title: 'Something went wrong'
              })
            }
            setLoading(false);
          }
        
        setLoading(false);
    }

    const addNewMaterial = () => {
        open()
    }

    const removeMaterial = async(id: number) => {

        try{
            const response = await deleteProductionMaterial({id,production_id})
            const deleted = response.data.deleted

            if(deleted) {
                const data = productionMaterials?.filter((material)=>{
                    return material.id!== id
                })
                setProductionMaterials(data)
                notify({
                    type:'success',
                    message: response.data.message,
                    title: 'Done'
                })
            }
        } catch(error) {
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.message, // Use optional chaining to access data property
                title: 'Something went wrong'
              })
            } else {
              notify({
                type:'error',
                message: 'An unexpected error occurred',
                title: 'Something went wrong'
              })
            }
          }
    }
    
  return (
    <>
        <Modal opened={opened} size="lg" padding={'xl'} onClose={close} 
        title={<Text fw={600} fz={17}>Add New Materials Per Unit Item</Text>} overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}>

        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: 'blue', type: 'bars' }}
        />

            <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
                <Select
                {...generalInformation.getInputProps('material')}
                key={generalInformation.key('material')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                required
                c={'dimmed'}
                withAsterisk
                mb={10}
                label="Select Material"
                placeholder="Which material has been used?"
                data={materialsOpt}
                searchable
                nothingFoundMessage="Nothing found..."
                />
                
                <NumberInput
                {...generalInformation.getInputProps('quantity')}
                key={generalInformation.key('quantity')}
                radius={"md"}
                mb={4}
                disabled={!enableForm}
                variant="filled"
                thousandSeparator=","
                c={'dimmed'}
                label="Quantity Per Unit Item"
                min={0.001}
                max={(selectedMaterial)?Math.floor((selectedMaterial.current_stock_level)/production_quantity):0}
                step={0.01}
                placeholder="7"
                />
                {
                    selectedMaterial &&
                    <Text fz="sm" c={'dark'} mb={10}>
                        Current Stock Level is {selectedMaterial && 
                        // <PrettyFigure figure={Number(selectedMaterial?.current_stock_level)}  />
                        <GetWithUnit figure={Number(selectedMaterial?.current_stock_level)} unit={selectedMaterial?.unit_of_measurement} symbol={false} />}. 
                        <Text component='span' c={totalMaterialsUsed > Number(selectedMaterial?.current_stock_level)?'red':'green'}>
                            {(isStringInArray(proStage,['completed','damaged']))?' Used ':' Using '}
                            {<GetWithUnit figure={totalMaterialsUsed} unit={selectedMaterial?.unit_of_measurement} symbol={false} />}
                        </Text>
                        
                    </Text>
                }

                <NumberInput
                {...generalInformation.getInputProps('cost')}
                key={generalInformation.key('cost')}
                radius={"md"}
                variant="filled"
                thousandSeparator=","
                disabled={!enableForm}
                c={'dimmed'}
                label="Cost Per Unit Item"
                mb={10}
                min={0}
                step={0.01}
                placeholder="700"
                />


                {(selectedMaterial)?(
                    (totalMaterialsUsed > selectedMaterial?.current_stock_level)?(
                    <Text mb={0} fz="sm" c={'red'}>
                        The materials required for the entire production exceeds the current materials in stock. <br />
                        - Update the production quantity then proceed.
                    </Text>
                ):''):
                ''}
                <Button 
                    disabled = {(selectedMaterial)?((totalMaterialsUsed > selectedMaterial?.current_stock_level)?true:false):
                    true}
                    size='lg'
                    mr={10}
                    mt={20}
                    type="submit"
                    px={20}
                    variant="filled"
                    >
                    Save
                </Button>
            </form>
        </Modal>
        <PaperCard>
            <PaperCardHeader>
                <Text fz={18} fw={500}>
                    Materials Per Unit Item
                  </Text>
                </PaperCardHeader>
            <PaperCardBody>
                
                {
                    isStringInArray(proStage,productionEnds)?'':
                    category === 'product'?(
                        <Text mb={10} c={'orange'}>
                            Materials can only be updated at the product or intermediate good level.
                        </Text>
                    ):(
                        <Group justify="space-between">
                            {view || isStringInArray(proStage,productionDontAlterMaterials)?'':(
                            <Button mb={15} size='sm' onClick={addNewMaterial} variant='light'>Add Material</Button>
                            )}
                        </Group> 
                    )
                }
                
                
                <Accordion variant="separated">

                    <Accordion.Item value="materials">
                        <Accordion.Control>
                        Materials ({productionMaterials?.length?productionMaterials.length:0})
                        </Accordion.Control>
                        <Accordion.Panel>
                            {
                                productionMaterials?  // Check if productMaterials exist before mapping over them. If not, display a message.
                                productionMaterials.length > 0 ?
                                productionMaterials.map((material) => {
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

                                                            <Text c="dimmed" component='span' ml={10}> - Cost: <MoneyFigure figure={Number(material.cost)} /></Text>
                                                        </Text>
                                                    </div>
                                                </Group>
                                                {
                                                    (view || isStringInArray(proStage,productionDontAlterMaterials) || category === 'product')?'':(
                                                        <ActionIcon onClick={()=>removeMaterial(material.id)} variant="light" color="red" size="md" aria-label="Delete">
                                                            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                                        </ActionIcon>
                                                    )
                                                }
                                            </Group>
                                        </Paper>
                                    )
                                }):(
                                    <Text fz="sm" c="dimmed" mt={20}>No materials added</Text>
                                ):''
                            }
                        </Accordion.Panel>
                    </Accordion.Item>

                    {
                        prodIntermediateGoods?  // Check if productMaterials exist before mapping over them. If not, display a message.
                        prodIntermediateGoods.length > 0 ?
                        <Accordion.Item value="intermediate-goods">
                            <Accordion.Control>
                            Intermediate Goods ({prodIntermediateGoods?.length?prodIntermediateGoods.length:0})
                            </Accordion.Control>
                            <Accordion.Panel>
                                {
                                    prodIntermediateGoods.map((material) => {
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
                                    })
                                }
                            </Accordion.Panel>
                        </Accordion.Item>
                        :null:null
                    }
                </Accordion>
            </PaperCardBody>
        </PaperCard>
    </>
  )
}

export default ProductionMaterials
