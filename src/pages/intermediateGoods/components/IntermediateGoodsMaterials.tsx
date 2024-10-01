import { ActionIcon, Avatar, Button, Group, LoadingOverlay, NumberInput, Paper, Select, Stack, Text} from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { getBasicMaterials } from '../../../requests/_materialsRequests'
import { MaterialBasicModel } from '../../../requests/models/_material'
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper'
// import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { notify } from '../../../requests/general/toast'
import { IconTrash } from '@tabler/icons-react'
import { AxiosError } from 'axios'
import { deleteIntermediateGoodMaterial, saveIntermediateGoodMaterial } from '../../../requests/_intermediateGoodsRequests'
import { IntermediateGoodMaterialsModel } from '../../../requests/models/_intermediateGood'

type MaterialOpt = {
    value: string;
    label: string;
    disabled: boolean;
  }

const IntermediateGoodsMaterials = ({intermediate_good_id,prodMaterials}:{intermediate_good_id: number, prodMaterials: IntermediateGoodMaterialsModel[]|undefined}) => {
    const [materials, setMaterials] = useState<MaterialBasicModel[]>()
    const [intermediateGoodMaterials, setIntermediateGoodMaterials] = useState<IntermediateGoodMaterialsModel[]|undefined>(prodMaterials)
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialBasicModel|undefined>()
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    // const [opened, { open, close }] = useDisclosure(false);

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
            if(materials) {
                if(materials.length > 0) {
                    return materials?.map((material: MaterialBasicModel) => ({
                        value: `${material.id}`,
                        label: `${material.name}`,
                        disabled: (material.current_stock_level <= 0),
                    }));
                }

            }

        },
        [materials]
    );

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

    const generalInformation = useForm({
        mode: 'controlled',
        initialValues: {
          material: 0,
          quantity: 0,
        //   cost: 0
        },
        validate: {
            material: (value) => (value < 1 ? 'Invalid material selected' : null),
            quantity: (value) => (value < 0 ? 'Quantity must be 0 or above' : null),
            // cost: (value) => (value < 0 ? 'Cost must be 0 or above' : null),
        },
    });

    generalInformation.watch('material', ({ value }) => {
        
        if (value) {
            setSelectedMaterial(materials?.find((material: MaterialBasicModel) => material.id === Number(value)))
            // setEnableForm(true)
        }
        else {
            setSelectedMaterial(undefined)
            // setEnableForm(false)
        }
    });

    const handleSubmit = async(values: typeof generalInformation.values) => {
    
        const data = {
            intermediate_good_id: Number(intermediate_good_id),
            material_id: Number(values.material),
            quantity: values.quantity,
        }

        setLoading(true);

        try{

            const response = await saveIntermediateGoodMaterial(data)
            
            if(response.data.saved) {

                notify({
                type:'success',
                message: response.data.message,
                title: 'Saved'
                })
                setLoading(false);

                generalInformation.reset()

                setIntermediateGoodMaterials(response.data.data)

                setOpenForm(false)

            }

        } catch(error) {
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.error, // Use optional chaining to access data property
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

    const removeMaterial = async(id: number) => {

        try{
            const response = await deleteIntermediateGoodMaterial({id,intermediate_good_id})
            const deleted = response.data.deleted

            if(deleted) {
                const data = intermediateGoodMaterials?.filter((material)=>{
                    return material.id!== id
                })
                setIntermediateGoodMaterials(data)
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
        <Stack justify="unset" mb={15}>
            <Text fw={600} mb={10} size='sm'>
                {/* Materials<br /> */}
                <Text component='span' c={'dimmed'}>
                    Provide all the materials that are used for this intermediateGood
                </Text>
            </Text>
            {
                !openForm ? (
                    <Button onClick={()=>setOpenForm(true)} hidden={openForm} variant='light'>Add Material</Button>
                ): (
                    <Stack pos={'relative'}>
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
                            // c={'dimmed'}
                            withAsterisk
                            
                            mb={10}
                            label="Material"
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
                            // disabled={!enableForm}
                            variant="filled"
                            thousandSeparator=","
                            // c={'dimmed'}
                            
                            label={`Quantity in (${selectedMaterial?.unit_of_measurement})`}
                            min={0}
                            step={0.01}
                            placeholder="7"
                            />
                            <Button 
                                mr={10}
                                mt={20}
                                type="submit"
                                px={20}
                                variant="filled"
                                >
                                Save
                            </Button>
                            <Button mt={20} onClick={()=>setOpenForm(false)} hidden={!openForm}  variant="light" color="red">Cancel</Button>
                        </form>
                    </Stack>
                )
            }
        </Stack>

        <Text mb={5} >Total Materials: <Text component='span' fw={700}><PrettyFigure figure={intermediateGoodMaterials?.length} /></Text></Text>
        <Text mb={12} >Cost of Materials: <Text component='span' fw={700}><MoneyFigure figure={total_material_cost} /></Text></Text>

        {/* Displaying the intermediateGood materials */}
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
                                    <Text  fw={600}>
                                        {material.name}
                                    </Text>
                                    <Text  fw={400} c="dimmed">
                                        Quantity: <PrettyFigure figure={material.quantity} />
                                        <Text  fw={400} c="dimmed" component='span' ml={10}>- Cost: <MoneyFigure figure={Number(material.quantity)*Number(material.cost_per_unit)} /></Text>
                                    </Text>
                                </div>
                            </Group>
                            <ActionIcon onClick={()=>removeMaterial(material.id)} variant="light" color="red" size="md" aria-label="Delete">
                                <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                        </Group>
                    </Paper>
                )
            }):(
                <Text  c="dimmed" mt={20}>No materials added yet.</Text>
            ):''
        }
    </>
  )
}

export default IntermediateGoodsMaterials
