/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../auth/core/Auth'
import {Button, Card, Grid, NumberInput, Select, TextInput, Textarea, rem, Anchor} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import dayjs from 'dayjs';
import {IconCalendar, IconPlus} from '@tabler/icons-react'
import TextFieldToolTip from '../../../components/TextFieldToolTip'
import { SupplierBasic } from '../../../requests/models/_business'
import { purchaseStatusOptions } from '../../../requests/general/options'
import { MaterialBasicModel } from '../../../requests/models/_material';
import { getMaterialsOption } from '../../../requests/_materialsRequests';

// Define the type for generalInformation prop
interface GeneralInformation {
    getInputProps: (name: string) => any;
    key: (name: string) => string;
    getValues: any;
  }

type MaterialOpt = {
    value: string;
    label: string;
}

const PurchaseForm = ({generalInformation, suppliers,handleNewSupplierClick}:
    {generalInformation: GeneralInformation, suppliers: SupplierBasic[]|null, handleNewSupplierClick: ()=>void}) => {
    const [materials, setMaterials] = useState<MaterialBasicModel[]|null>([]);
    // const [suppliers, setSuppliers] = useState<SupplierBasic[]|null>([]);
    const {currentBusiness} = useAuth()
    



    useEffect(()=>{
        const materialsResponse = async() => {
        const response = await getMaterialsOption(true);
        setMaterials(response.data);
        }

        materialsResponse()
    },[])

    const materialsOpt: MaterialOpt[]|undefined = useMemo(
        () => {
            if(materials) {
                if(materials?.length > 0) {
                    return materials?.map((material) => ({
                        value: `${material.id}`,
                        label: material.name,
                    }));
                }
            }
        },
        [materials]
      );

    const suppliersOpt = useMemo(
        () => {
            if(suppliers?.length === 0) return suppliers;
          return suppliers?.map((supplier) => ({
            value: `${supplier.id}`,
            label: `${supplier.contact_person} (${supplier.company_name})`,
          }));
        },
        [suppliers]
      );

  return (
    <>
        <Card radius={'md'} mb={'lg'} p={30}>

            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

            {/* Material */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('material')}
                key={generalInformation.key('material')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Material"
                placeholder="Choose one"
                data={materialsOpt}
                searchable
                nothingFoundMessage="Nothing found..."
                />
            </Grid.Col>

            {/* Purchase Date */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <DateInput
                {...generalInformation.getInputProps('purchase_date')}
                key={generalInformation.key('purchase_date')}
                radius={"md"}
                leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                clearable
                maxDate={dayjs(new Date()).toDate()}
                
                defaultValue={generalInformation.getValues.purchase_date}
                label="Purchase Date"
                required
                withAsterisk
                placeholder=""
                />
            </Grid.Col>

            {/* Status */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('status')}
                key={generalInformation.key('status')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Payment Status"
                placeholder="Choose one"
                data={purchaseStatusOptions}
                />
            </Grid.Col>

            {/* Quantity */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <NumberInput
                {...generalInformation.getInputProps('quantity')}
                key={generalInformation.key('quantity')}
                radius={"md"}
                step={0.01}
                leftSection={<TextFieldToolTip title="This will be update the material current stock level"/>}
                variant="filled"
                // c={'dimmed'}
                min={0}
                
                label="Quantity Purchased"
                withAsterisk
                thousandSeparator=","
                required
                placeholder="0"
                />
            </Grid.Col>

            {/* Unit Price */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <NumberInput
                {...generalInformation.getInputProps('unit_price')}
                key={generalInformation.key('unit_price')}
                radius={"md"}
                leftSection={<TextFieldToolTip title="The material unit price will be updated with this figure when different"/>}
                variant="filled"
                // c={'dimmed'}
                 
                min={0}
                step={0.01}
                prefix={currentBusiness?.currency_symbol}
                label="Unit Price"
                required
                thousandSeparator=","
                withAsterisk
                placeholder="0"
                />
            </Grid.Col>

            {/* Amount Paid */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <NumberInput
                {...generalInformation.getInputProps('amount_paid')}
                key={generalInformation.key('amount_paid')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                min={0}
                step={0.01}
                prefix={currentBusiness?.currency_symbol}
                label="Amount Paid"
                required
                thousandSeparator=","
                withAsterisk
                placeholder="0"
                />
            </Grid.Col>
            
            {/* Invoice Number */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('invoice_number')}
                key={generalInformation.key('invoice_number')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Invoice Number"
                // withAsterisk
                // required
                placeholder="INV0001"
                />
            </Grid.Col>

            {/* Discount*/}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <NumberInput
                {...generalInformation.getInputProps('discounts')}
                key={generalInformation.key('discounts')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                min={0}
                max={100}
                step={0.01}
                suffix="%"
                label="Discount"
                placeholder="0"
                />
            </Grid.Col>

            {/* Delivery*/}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <NumberInput
                {...generalInformation.getInputProps('shipping')}
                key={generalInformation.key('shipping')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                min={0}
                max={100}
                step={0.01}
                prefix={currentBusiness?.currency_symbol}
                thousandSeparator=","
                label="Delivery Cost"
                placeholder="0"
                />
            </Grid.Col>

            {/* Supplier */}
            <Grid.Col pt={10} span={{ base: 12, sm: 8, md: 8, lg: 8 }}>
                <Select
                {...generalInformation.getInputProps('supplier_id')}
                key={generalInformation.key('supplier_id')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Supplier"
                placeholder="Choose one"
                data={suppliersOpt}
                />
                <Anchor variant='filled' fw={500} fz={'xs'} onClick={handleNewSupplierClick}>
                    <IconPlus size={10} /> Add New Supplier
                </Anchor>
            </Grid.Col>

            {/* Purchase Details */}
            <Grid.Col pt={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                {...generalInformation.getInputProps('purchase_details')}
                key={generalInformation.key('purchase_details')}
                radius={"md"}
                variant="filled"
                placeholder="You can add more information or specifications..."
                label="Purchase Details"
                autosize
                minRows={3}
                />
            </Grid.Col>

            {/* Notes */}
            <Grid.Col pt={5} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                {...generalInformation.getInputProps('notes')}
                key={generalInformation.key('notes')}
                radius={"md"}
                variant="filled"
                placeholder="Here can be any information you want to tag the purchase to"
                label="Other Notes"
                autosize
                minRows={3}
                />
            </Grid.Col>
                
            <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                <Button  
                type="submit"
                // disabled={enablePersonal}
                px={40}
                variant="filled">
                Save
                </Button>
            </Grid.Col>
            </Grid>

        </Card>
    </>
  )
}

export default PurchaseForm
