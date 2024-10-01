import { Accordion, ActionIcon, Avatar, Button, Group, LoadingOverlay, NumberInput, Paper, Select, Stack, Text} from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { getBasicMaterials } from '../../../requests/_materialsRequests'
import { MaterialBasicModel } from '../../../requests/models/_material'
import { MoneyFigure, PrettyFigure } from '../../../requests/general/_numberHelper'
import { useForm } from '@mantine/form'
import { notify } from '../../../requests/general/toast'
import { IconTrash } from '@tabler/icons-react'
import { AxiosError } from 'axios'
import { deleteProductIntermediateGood, deleteProductMaterial, getProductCost, saveProductMaterial } from '../../../requests/_productRequests'
import { ProductCost, ProductMaterialsModel } from '../../../requests/models/_product'
import { isStringInArray } from '../../../requests/general/_stringHelper'
import { IntermediateGoodBasicModel, IntermediateGoodVitalModel } from '../../../requests/models/_intermediateGood'
import { useQuery } from '@tanstack/react-query'
import { intermediateGoodsLoader } from '../../../requests/_intermediateGoodsRequests'

type MaterialOpt = {
    value: string;
    label: string;
    disabled: boolean;
  }
  
const ProductMaterials = ({product_id,prodMaterials,prodIntermediateGoods,setProductCosts,edit=false}:{
    product_id: number, 
    edit?: boolean, 
    prodMaterials: ProductMaterialsModel[]|undefined
    prodIntermediateGoods: IntermediateGoodVitalModel[]|undefined,
    setProductCosts:React.Dispatch<React.SetStateAction<ProductCost|undefined>>
}) => {
    const [materials, setMaterials] = useState<MaterialBasicModel[]>()
    const [productMaterials, setProductMaterials] = useState<ProductMaterialsModel[]|undefined>(prodMaterials)
    const [productIntermediateGoods, setProductIntermediateGoods] = useState<IntermediateGoodVitalModel[]|undefined>(prodIntermediateGoods)
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialBasicModel|undefined>()
    // const [selectedIntermediateGoods, setSelectedIntermediateGoods] = useState<IntermediateGoodBasicModel|undefined>()
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    const {data: intermediateGoods} = useQuery({
        queryKey: ['intermediateGoods'],
        queryFn: intermediateGoodsLoader
    })

    // const {data: materialss} = useQuery({
    //     queryKey: ['materials'],
    //     queryFn: getBasicMaterials
    // })
    // console.log(materialss);
    

    useEffect(() => {
        const materialsData = async() => {
            const materialResponse = await getBasicMaterials()
            const allMaterials = materialResponse.data
            setMaterials(allMaterials)
        }

        const productCosts = async() => {
            const productCostResponse = await getProductCost(product_id)
            setProductCosts(productCostResponse.data)
        }

        materialsData();
        productCosts()
    },[product_id,setProductCosts])

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

    const intermediateGoodsOpt: MaterialOpt[]|undefined = useMemo(
        () => {
            if(intermediateGoods) {
                if(intermediateGoods.length > 0) {
                    return intermediateGoods?.map((material: IntermediateGoodBasicModel) => ({
                        value: `${material.id}`,
                        label: `${material.name}`,
                        disabled: (material.stock_quantity <= 0),
                    }));
                }

            }

        },
        [intermediateGoods]
    );

    const total_material_cost: number = useMemo(
        () => {
        
            let totalCost = 0;

            if(productMaterials) {
              for (let position = 0; position < productMaterials.length; position++) {
                totalCost += Number(productMaterials[position].cost_per_unit) * Number(productMaterials[position].quantity);
              }
            }

            if(productIntermediateGoods) {
              for (let position = 0; position < productIntermediateGoods.length; position++) {
                const goods_quantity = Number(productIntermediateGoods[position].quantity)
                totalCost += Number(productIntermediateGoods[position].labour_cost) * goods_quantity;
                for (let position2 = 0; position2 < productIntermediateGoods[position].used_materials.length; position2++) {
                    totalCost += Number(productIntermediateGoods[position].used_materials[position2].quantity) * 
                    Number(productIntermediateGoods[position].used_materials[position2].material.cost_per_unit) * goods_quantity;
                }
              }
            }

            return totalCost
        },
        [productMaterials,productIntermediateGoods]
    );

    const generalInformation = useForm({
        mode: 'controlled',
        initialValues: {
            material_type: 'Intermediate',
            material: 0,
            quantity: 0,
        },
        validate: {
            material_type: (value) => (!isStringInArray(value,['Intermediate','Material']) ? 'Invalid material type' : null),
            material: (value) => (value < 1 ? 'Invalid material selected' : null),
            quantity: (value) => (value < 0 ? 'Quantity must be 0 or above' : null),
        },
    });

    generalInformation.watch('material', ({ value }) => {
        
        if (value) {
            if(generalInformation.getValues().material_type === 'Intermediate') {
                // setSelectedIntermediateGoods(intermediateGoods?.find((material: IntermediateGoodBasicModel) => material.id === Number(value)))
            }
            else {
                setSelectedMaterial(materials?.find((material: MaterialBasicModel) => material.id === Number(value)))
            }
            
        }
        else {
            // setSelectedIntermediateGoods(undefined)
            setSelectedMaterial(undefined)
        }
    });

    const handleSubmit = async(values: typeof generalInformation.values) => {
    
        const data = {
            product_id: Number(product_id),
            material_type: values.material_type,
            material_id: Number(values.material),
            quantity: values.quantity,
        }

        setLoading(true);

        try{

            const response = await saveProductMaterial(data)
            
            if(response.data.saved) {
                const productCostResponse = await getProductCost(product_id)
                setProductCosts(productCostResponse.data)

                notify({
                type:'success',
                message: response.data.message,
                title: 'Saved'
                })
                setLoading(false);

                generalInformation.reset()
                // setTotalMaterialsUsed(0)

                if(values.material_type === 'Material') {
                    setProductMaterials(response.data.data)
                }
                else {
                    setProductIntermediateGoods(response.data.data)
                }
                setOpenForm(false)
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

    const resetProductCost = async() => {
        const productCostResponse = await getProductCost(product_id)
        setProductCosts(productCostResponse.data)
    }

    const removeMaterial = async(id: number) => {

        try{
            const response = await deleteProductMaterial({id,product_id})
            const deleted = response.data.deleted

            if(deleted) {
                const data = productMaterials?.filter((material)=>{
                    return material.id!== id
                })
                setProductMaterials(data)
                resetProductCost()
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

    const removeIntermediateGood = async(id: number) => {

        try{
            const response = await deleteProductIntermediateGood({id,product_id})
            const deleted = response.data.deleted

            if(deleted) {
                const data = productIntermediateGoods?.filter((material)=>{
                    return material.id!== id
                })

                setProductIntermediateGoods(data)

                resetProductCost()

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
        { 
            edit &&(
                <Stack justify="unset" mb={15}>
                    <Text fw={600} mb={10} size='sm'>
                        {/* Materials<br /> */}
                        <Text component='span'  c={'dimmed'}>
                            Provide all materials and intermediate goods used for this product
                        </Text>
                    </Text>
                    {
                        openForm?(
                            <Stack pos={'relative'}>
                            <LoadingOverlay
                                visible={loading}
                                zIndex={1000}
                                overlayProps={{ radius: 'sm', blur: 1 }}
                                loaderProps={{ color: 'blue', type: 'bars' }}
                            />
                            <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
                                <Select
                                {...generalInformation.getInputProps('material_type')}
                                key={generalInformation.key('material_type')}
                                radius={"md"}
                                variant="filled"
                                checkIconPosition="right"
                                required
                                withAsterisk
                                // size="sm"
                                mb={10}
                                label="Material Type"
                                placeholder="Intermediate goods or materials"
                                data={['Intermediate', 'Material']}
                                />

                                <Select
                                {...generalInformation.getInputProps('material')}
                                key={generalInformation.key('material')}
                                radius={"md"}
                                variant="filled"
                                checkIconPosition="right"
                                required
                                withAsterisk
                                // size="sm"
                                mb={10}
                                label="Material"
                                placeholder="Which material has been used?"
                                data={generalInformation.getValues().material_type == 'Material'?materialsOpt:intermediateGoodsOpt}
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
                                // size="sm"
                                label={
                                    generalInformation.getValues().material_type == 'Material'? `Quantity in (${selectedMaterial?.unit_of_measurement})`:`Quantity in (Piece)`
                                }
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
                        ):(
                            <Button onClick={()=>setOpenForm(true)}  variant='light'>Add Material</Button>
                            
                        )
                    }
                    
                </Stack>
            )
        }
        

        <Text mb={5} >Total Cost of Materials: <Text component='span' fw={700}><MoneyFigure figure={total_material_cost} /></Text></Text>

        {/* Displaying the product materials */}
        <Accordion variant="separated">

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
                                                <Text  fw={600}>
                                                    {material.name}
                                                </Text>
                                                <Text  c="dimmed">
                                                    Quantity: <PrettyFigure figure={material.quantity} />

                                                    <Text  c="dimmed" component='span' ml={10}> - Labour: <MoneyFigure figure={Number(material.labour_cost)*Number(material.quantity)} /></Text>
                                                </Text>
                                            </div>
                                        </Group>
                                        {
                                            edit && (
                                            <ActionIcon onClick={()=>removeIntermediateGood(material.id)} variant="light" color="red" size="md" aria-label="Delete">
                                                <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                            </ActionIcon>
                                            )
                                        }
                                    </Group>
                                </Paper>
                            )
                        }):(
                            <Text  fs={'italic'} ta={'center'} c="dimmed" my={10}>Nothing added yet</Text>
                        ):(<Text  ta={'center'} fs={'italic'} c="dimmed" my={10}>Nothing added yet</Text>)
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
                                                <Text  fw={600}>
                                                    {material.name}
                                                </Text>
                                                <Text  c="dimmed">
                                                    Quantity: <PrettyFigure figure={material.quantity} />

                                                    <Text  c="dimmed" component='span' ml={10}></Text>
                                                </Text>
                                            </div>
                                        </Group>
                                        {
                                            edit && (
                                                <ActionIcon onClick={()=>removeMaterial(material.id)} variant="light" color="red" size="md" aria-label="Delete">
                                                    <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                                </ActionIcon>
                                            )
                                        }
                                        
                                    </Group>
                                </Paper>
                            )
                        }):(
                            <Text  c="dimmed" mt={20}>No materials added yet.</Text>
                        ):''
                    }
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    </>
  )
}

export default ProductMaterials
