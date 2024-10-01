/* eslint-disable @typescript-eslint/no-explicit-any */
import { Anchor, Button, Grid, NumberInput, Select, TextInput, Textarea, rem } from '@mantine/core'
import { IconAlertCircle, IconArrowRight, IconCalendar, IconEye, IconReload, IconUser } from '@tabler/icons-react';
import { useMemo } from 'react'
import { priorityOptions, productionTypeOptions } from '../../../requests/general/options';
import { EmployeeBasicModel } from '../../../requests/models/_employee';
import TextLabelWithToolTip from '../../../components/TextLabelWithToolTip';
import { ProductBasicModel } from '../../../requests/models/_product';
import { DateInput } from '@mantine/dates';
import { isStringInArray, toHeadline } from '../../../requests/general/_stringHelper';
import { IntermediateGoodBasicModel } from '../../../requests/models/_intermediateGood';
// import { MoneyFigure } from '../../../requests/general/_numberHelper';
import { useAuth } from '../../../auth/core/Auth';
import PaperCard from '../../../components/PaperCard';
import PaperCardBody from '../../../components/PaperCardBody';
import { Link } from 'react-router-dom';
import { ProductionBasicModel } from '../../../requests/models/_production';

interface ProductionInformation {
    getInputProps: (name: string) => any;
    key: (name: string) => string;
    getValues: any;
}

const singleOptionList = (options: string[]) => {
    return options.map((option) => ({
        value: option,
        label: toHeadline(option),
    }));
}

const ProductionForm = ({productionInformation, assignees, products, intermediate_goods, category,getProductionData}:
    {productionInformation: ProductionInformation, 
        assignees: EmployeeBasicModel[]|undefined,
        products: ProductBasicModel[]|undefined,
        // selectedItem: IntermediateGoodBasicModel|ProductBasicModel|undefined,
        category:string,
        intermediate_goods: IntermediateGoodBasicModel[]|undefined
        getProductionData: ProductionBasicModel|undefined
    }) => {
    const {currentBusiness} = useAuth()
  
    const assigneesOptions = useMemo(
        () => {
            return assignees?.map((assignee) => ({
            value: `${assignee.id}`,
            label: `${assignee.first_name} ${assignee.last_name}`,
            }));
        },
        [assignees]
    );
  
    const productsOptions = useMemo(
        () => {
            return products?.map((product) => ({
            value: `${product.id}`,
            label: `${product.name}`,
            }));
        },
        [products]
    );
  
    const intermediateGoodsOptions = useMemo(
        () => {
            return intermediate_goods?.map((good: IntermediateGoodBasicModel) => ({
            value: `${good.id}`,
            label: `${good.name}`,
            }));
        },
        [intermediate_goods]
    );

    return (
    <>
        <PaperCard>
            {/* <PaperCardHeader>
                Hello
            </PaperCardHeader> */}
            <PaperCardBody>
                <Grid gutter={{ base: 20, md: 20, xl: 20 }}>

                    {/* Production title */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12 }}>
                        <TextInput
                        {...productionInformation.getInputProps('title')}
                        key={productionInformation.key('title')}
                        radius={"md"}
                        variant="filled"
                        // size="md"
                        label="Title"
                        withAsterisk
                        required
                        placeholder="What are you working on..."
                        />
                    </Grid.Col>

                    {/* Priority */}
                    <Grid.Col pt={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Select
                        {...productionInformation.getInputProps('priority')}
                        key={productionInformation.key('priority')}
                        radius={"md"}
                        variant="filled"
                        checkIconPosition="right"
                        leftSection={<IconAlertCircle style={{ width: rem(16), height: rem(16) }} />}
                        required
                        withAsterisk
                        // size="sm"
                        label="Priority Level"
                        placeholder="How critical?"
                        data={singleOptionList(priorityOptions)}
                        nothingFoundMessage="Nothing found..."
                        />
                    </Grid.Col>

                    {/* Production Type */}
                    {
                        isStringInArray(category,['product'])?(
                            <>
                            {/* Type */}
                            <Grid.Col pt={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                                <Select
                                    {...productionInformation.getInputProps('type')}
                                    key={productionInformation.key('type')}
                                    radius={"md"}
                                    variant="filled"
                                    checkIconPosition="right"
                                    // c={'dimmed'}
                                    disabled={getProductionData?.status !== 'backlog'}
                                    required
                                    withAsterisk
                                    // size="sm"
                                    label={(<TextLabelWithToolTip label={"Type"} 
                                        title={"Intermediate Good is a component or part of an original product."}  />)}
                                    placeholder="Choose type..."
                                    data={singleOptionList(productionTypeOptions)}
                                />
                            </Grid.Col>

                            {/* Product / Intermediate Good */}
                            <Grid.Col pt={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                                {
                                    productionInformation.getValues().type === "product" ? (
                                        <>
                                            <Select
                                                {...productionInformation.getInputProps('product')}
                                                key={productionInformation.key('product')}
                                                radius={"md"}
                                                variant="filled"
                                                checkIconPosition="right"
                                                disabled={getProductionData?.status !== 'backlog'}
                                                // disabled={productionInformation.getValues().type !== "product"}
                                                required
                                                withAsterisk
                                                // size="sm"
                                                label={(<TextLabelWithToolTip label={"Product"} title={"The selected product quantity will be increased by the quantity provided"}  />)}
                                                placeholder="Choose product..."
                                                data={productsOptions}
                                            />
                                        </>
                                    ):(
                                        // intermediateGoodsOptions
                                        <>
                                            <Select
                                                {...productionInformation.getInputProps('intermediate_good')}
                                                key={productionInformation.key('intermediate_good')}
                                                radius={"md"}
                                                variant="filled"
                                                checkIconPosition="right"
                                                required
                                                withAsterisk
                                                disabled={getProductionData?.status !== 'backlog'}
                                                // size="sm"
                                                label={(<TextLabelWithToolTip label={"Intermediate Good"} title={"The selected item quantity will be increased by the quantity provided"}  />)}
                                                placeholder="Choose intermediate good..."
                                                data={intermediateGoodsOptions}
                                            />
                                        </>
                                    )
                                }
                                
                            </Grid.Col>
                            </>
                        ):null
                        
                    }

                    {/* quantity */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <NumberInput
                        {...productionInformation.getInputProps('quantity')}
                        key={productionInformation.key('quantity')}
                        radius={"md"}
                        variant="filled"
                        thousandSeparator=","
                        // c={'dimmed'}
                        // size="sm"
                        required
                        withAsterisk
                        label="Quantity to Produce"
                        min={1}
                        placeholder="1"
                        />
                    </Grid.Col>

                    {
                        category == 'sample' && (
                            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                                <NumberInput
                                {...productionInformation.getInputProps('labour_cost')}
                                key={productionInformation.key('labour_cost')}
                                radius={"md"}
                                variant="filled"
                                step={0.1}
                                thousandSeparator=","
                                prefix={currentBusiness?.currency_symbol}
                                // c={'dimmed'}
                                // size="sm"
                                // readOnly={isStringInArray(productionInformation.getValues().type,['product','intermediate_good'])}
                                label="Labour Cost per item"
                                // label={(<TextLabelWithToolTip label={"Labour Cost per item"} title={"Amount the assignee recieves for each production"}  />)}
                                min={0}
                                placeholder="0"
                                />
                                {/* {
                                    selectedItem? (
                                        <Text fz={'sm'} c={'orange'}>
                                            Default cost : <MoneyFigure figure={selectedItem.labour_cost}  />
                                        </Text>
                                    ): null
                                } */}
                            </Grid.Col>
                        )
                    }
                    {/* labour_cost % */}


                    {/* Estimated Hours */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <NumberInput
                        {...productionInformation.getInputProps('estimated_hours')}
                        key={productionInformation.key('estimated_hours')}
                        radius={"md"}
                        variant="filled"
                        // c={'dimmed'}
                        min={0}
                        step={0.1}
                        // size="sm"
                        label="Estimated Hours per item"
                        // label={(<TextLabelWithToolTip label={"Estimated Hours per item"} title={"How long do you estimate each item must take?"}  />)}
                        placeholder="0"
                        />
                    </Grid.Col>

                    {/* Assignee */}
                    <Grid.Col pt={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Select
                        {...productionInformation.getInputProps('assignee')}
                        key={productionInformation.key('assignee')}
                        radius={"md"}
                        variant="filled"
                        checkIconPosition="right"
                        //   c={'dimmed'}
                        leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                        required
                        withAsterisk
                        // size="sm"
                        label="Assignee"
                        placeholder="Assign to..."
                        data={assigneesOptions}
                        searchable
                        nothingFoundMessage={(<Anchor px={15}>Add Employee</Anchor>)}
                        />
                    </Grid.Col>

                    {/* Start Date */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <DateInput
                        {...productionInformation.getInputProps('start_date')}
                        key={productionInformation.key('start_date')}
                        radius={"md"}
                        leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}
                        variant="filled"
                        clearable
                        // maxDate={dayj(new Date()).toDate()}
                        // size="sm"
                        label="Start Date"
                        />
                    </Grid.Col>

                    {/* Deadline Date */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <DateInput
                        {...productionInformation.getInputProps('deadline_date')}
                        key={productionInformation.key('deadline_date')}
                        radius={"md"}
                        leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}
                        variant="filled"
                        // c={'dimmed'}
                        clearable
                        // maxDate={dayj(new Date()).toDate()}
                        // size="sm"
                        label="Deadline Date"
                        // required
                        // withAsterisk
                        // placeholder=""
                        />
                    </Grid.Col>

                    {/* Description */}
                    <Grid.Col pt={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                        <Textarea
                        {...productionInformation.getInputProps('description')}
                        key={productionInformation.key('description')}
                        radius={"md"}
                        variant="filled"
                        placeholder="You can add more information or specifications..."
                        label="Description"
                        autosize
                        minRows={3}
                        />
                    </Grid.Col>

                    {/* <Grid.Col pt={10} pb={10} span={12}>
                    <Text size='sm' c={'teal'}>Information provided must be Per Production Unit</Text>
                    <Divider mt={4} mb={1} />
                    </Grid.Col> */}

                    {/* <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                        <Switch mb={12} mt={12}
                        disabled={productionInformation.getValues().type !== 'component'}
                        defaultChecked={productionInformation.getValues().is_material}
                        {...productionInformation.getInputProps('is_material')}
                        key={productionInformation.key('is_material')}
                        label="Save to inventory as an in-house material?"
                        description="These components are materials that can be selected on another production instead of selected individual materials that are used for the same production"
                        />
                    </Grid.Col> */}

                    {/* <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                    </Grid.Col> */}

                    </Grid>

                    <Grid>
                        <Grid.Col mt={20} span={{ base: 12, md: 12, lg: 12 }}>
                            <Button 
                            mr={10}
                            mb={10}
                            type="submit"
                            px={40}
                            size='lg'
                            variant="filled"
                            rightSection={<IconArrowRight size={14} />}>
                            Save
                            </Button>
                            <Button  
                            mb={10}
                            mr={10}
                            size='lg'
                            type="reset"
                            color='red'
                            px={40}
                            variant="light"
                            rightSection={<IconReload size={14} />}>
                            Reset
                            </Button>

                            {
                                !getProductionData?.insufficient_materials?
                                getProductionData?.category === 'product' ? (
                                    (getProductionData.product_id || getProductionData.intermediate_good_id)? (
                                        <Button  
                                        mb={10}
                                        size='lg'
                                        component={Link}
                                        to={'/productions/' + productionInformation.getValues().id+'/view'}
                                        px={40}
                                        variant="light"
                                        rightSection={<IconEye size={14} />}>
                                        View
                                    </Button>
                                    ):null
                                ) : (
                                    <>
                                    <Button  
                                        mb={10}
                                        size='lg'
                                        component={Link}
                                        to={'/productions/' + productionInformation.getValues().id+'/view'}
                                        px={40}
                                        variant="light"
                                        rightSection={<IconEye size={14} />}>
                                        View
                                    </Button>
                                    </>
                                ):null
                            }
                            
                        </Grid.Col>
                </Grid>
            </PaperCardBody>
        </PaperCard>
    </>
  )
}

export default ProductionForm
