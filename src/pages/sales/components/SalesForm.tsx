/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useMemo, useState} from 'react'
import { useAuth } from '../../../auth/core/Auth'
import {Button, Card, Grid, NumberInput, Select, Text, TextInput, Textarea, rem, Anchor} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs';
import {IconCalendar, IconPlus} from '@tabler/icons-react'
import TextFieldToolTip from '../../../components/TextFieldToolTip'
import { paymentMethodOptions, paymentStatusOptions, salesChannelOptions, saleStatusOptions, salesTypeOptions } from '../../../requests/general/options'
import { CustomerBasicModel } from '../../../requests/models/_sales';
import { EmployeeBasicModel } from '../../../requests/models/_employee';
import { ProductBasicModel } from '../../../requests/models/_product';
import { MoneyFigure } from '../../../requests/general/_numberHelper';
import { singleOptionList } from '../../../requests/general/_stringHelper';

// Define the type for generalInformation prop
interface GeneralInformation {
    watch(arg0: string, arg1: ({ value }: { value: any; }) => void): unknown;
    getInputProps: (name: string) => any;
    key: (name: string) => string;
    getValues: any;
    setValues: any;
  }

type MaterialOpt = {
    value: string;
    label: string;
}
    // let cost = 0;
    let active_product: ProductBasicModel|undefined = undefined;
    // let active_type = 'retail';


const SalesForm = ({generalInformation, productsOpt, customers,employees,products,handleNewCustomerClick}:
    {
        generalInformation: GeneralInformation, productsOpt: MaterialOpt[]|undefined,
        customers: CustomerBasicModel[]|null, employees: EmployeeBasicModel[]|null,
        products: ProductBasicModel[]|null,
        handleNewCustomerClick: ()=>void
    }) => {

    const [cost, setCost] = useState(0);
    const [product_max, setProduct_max] = useState(1);

    useEffect(() => {
        if(products) {
            const active_product = products.find((product: ProductBasicModel) => product.id === Number(generalInformation.getValues().product_id))
            if(active_product) {
                setProduct_max(active_product.stock_quantity)
                if(active_product.use_manual_pricing) {
                    if(generalInformation.getValues().sale_type ==='retail') {
                        setCost(active_product.price)
                    } else {
                        setCost(active_product.wholesale_price)
                    }
                } else {
                    const wholesale_price = active_product.product_costs.total_cost_of_goods * Number(active_product.wholesale_markup);
                    const retail_price = wholesale_price * Number(active_product.retail_markup)

                    if(generalInformation.getValues().sale_type === 'retail') {
                        setCost(retail_price)
                    }else {
                        setCost(wholesale_price)
                    }
                }
            }
        }
    },[products,generalInformation])

    const {currentBusiness} = useAuth()

    const customersOpt = useMemo(
        () => {
          return customers?.map((customer) => ({
            value: `${customer.id}`,
            label: `${customer.first_name} ${customer.last_name}`,
          }));
        },
        [customers]
      );

    const employeesOpt = useMemo(
        () => {
          return employees?.map((employee) => ({
            value: `${employee.id}`,
            label: `${employee.first_name} ${employee.last_name}`,
          }));
        },
        [employees]
      );

    generalInformation.watch('product_id', ({ value }) => {
        
        if (value) {
            active_product = products?.find((product: ProductBasicModel) => product.id === Number(value))
        }

        if(active_product) {

            if(active_product.use_manual_pricing) {
                
                if(generalInformation.getValues().sale_type === 'retail') {
                    setCost(active_product.price)
                }else {
                    setCost(active_product.wholesale_price)
                }

            }else {
                const wholesale_price = active_product.product_costs.total_cost_of_goods * Number(active_product.wholesale_markup);
                const retail_price = wholesale_price * Number(active_product.retail_markup)

                if(generalInformation.getValues().sale_type === 'retail') {
                    setCost(retail_price)
                }else {
                    setCost(wholesale_price)
                }
            }
        }
        else {
            setCost(0)
        }

        // generalInformation.setValues({selling_price:cost})
        console.log(cost);
        
    });

    // generalInformation.watch('quantity', ({ value }) => {

    // })
      
    generalInformation.watch('sale_type', ({ value }) => {
        if (generalInformation.getValues().product_id) {
            active_product = products?.find((product: ProductBasicModel) => product.id === Number(generalInformation.getValues().product_id))
        }

        if(active_product) {

            if(active_product.use_manual_pricing) {
                
                if(value === 'retail') {
                    setCost(active_product.price)
                }else {
                    setCost(active_product.wholesale_price)
                }

            }else {
                const wholesale_price = active_product.product_costs.total_cost_of_goods * Number(active_product.wholesale_markup);
                const retail_price = wholesale_price * Number(active_product.retail_markup)

                if(value === 'retail') {
                    setCost(retail_price)
                }else {
                    setCost(wholesale_price)
                }
            }
        }
        else {
            setCost(cost);
        }

        // generalInformation.setValues({selling_price:cost})
        console.log(cost);
        
    });
  return (
    <>
        <Card radius={'md'} mb={'lg'} p={30}>

            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

            {/* Product */}
            <Grid.Col pt={10} span={{ base: 12, sm: 8, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('product_id')}
                key={generalInformation.key('product_id')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Product"
                placeholder="Select one"
                data={productsOpt}
                searchable
                nothingFoundMessage="Nothing found..."
                />
            </Grid.Col>

            {/* Sale Type */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('sale_type')}
                key={generalInformation.key('sale_type')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Sale Type"
                placeholder="Select one"
                data={singleOptionList(salesTypeOptions)}
                />
            </Grid.Col>

            {/* Sold Date */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <DateTimePicker
                {...generalInformation.getInputProps('sale_date_time')}
                key={generalInformation.key('sale_date_time')}
                radius={"md"}
                leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                clearable
                maxDate={dayjs(new Date()).toDate()}
                
                defaultValue={generalInformation.getValues.sale_date_time}
                label="Sold Date"
                required
                withAsterisk
                placeholder=""
                />
            </Grid.Col>
            
            {/* Quantity */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <NumberInput
                {...generalInformation.getInputProps('quantity')}
                key={generalInformation.key('quantity')}
                radius={"md"}
                step={0.01}
                leftSection={<TextFieldToolTip title="This will be update the product current stock level"/>}
                variant="filled"
                // c={'dimmed'}
                min={0}
                max={product_max}
                label="Quantity Sold"
                withAsterisk
                thousandSeparator=","
                required
                placeholder="0"
                />
            </Grid.Col>

            {/* Sold By */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('employee_id')}
                key={generalInformation.key('employee_id')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Sold By"
                placeholder="Select one"
                data={employeesOpt}
                />
            </Grid.Col>

            {/* Amount Paid */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <NumberInput
                {...generalInformation.getInputProps('total_amount_paid')}
                key={generalInformation.key('total_amount_paid')}
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
                <Text >Product Cost: 
                    <Text c={'orange'} component='span' fw={600} fz={'sm'}> <MoneyFigure figure={cost*generalInformation.getValues().quantity}  /></Text>
                </Text>
            </Grid.Col>

            {/* Sales Channel */}
            <Grid.Col pt={10} span={{ base: 12, sm: 8, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('sales_channel')}
                key={generalInformation.key('sales_channel')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Sales Channel"
                placeholder="Select one"
                data={singleOptionList(salesChannelOptions)}
                />
            </Grid.Col>

            {/* Status */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('order_status')}
                key={generalInformation.key('order_status')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Order Status"
                placeholder="Select one"
                data={singleOptionList(saleStatusOptions)}
                />
            </Grid.Col>

            {/* Payment Status */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('payment_status')}
                key={generalInformation.key('payment_status')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Payment Status"
                placeholder="Select one"
                data={singleOptionList(paymentStatusOptions)}
                />
            </Grid.Col>

            {/* Payment Method */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('payment_method')}
                key={generalInformation.key('payment_method')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Payment Method"
                placeholder="Select one"
                data={singleOptionList(paymentMethodOptions)}
                />
            </Grid.Col>

            {/* Customer */}
            <Grid.Col pt={10} span={{ base: 12, sm: 8, md: 4, lg: 4 }}>
                <Select
                {...generalInformation.getInputProps('customer_id')}
                key={generalInformation.key('customer_id')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Customer"
                placeholder="Select one"
                data={customersOpt}
                />
                <Anchor variant='filled' fw={500}  onClick={handleNewCustomerClick}>
                    <IconPlus size={10} /> Add New Customer
                </Anchor>
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
                placeholder="INV0001"
                />
            </Grid.Col>

            {/* Delivery Details */}
            <Grid.Col pt={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                {...generalInformation.getInputProps('delivery_details')}
                key={generalInformation.key('delivery_details')}
                radius={"md"}
                variant="filled"
                placeholder="You can add more information or specifications..."
                label="Delivery Details"
                autosize
                minRows={3}
                />
            </Grid.Col>
                
            <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                <Button  
                type="submit"
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

export default SalesForm
