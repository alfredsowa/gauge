import { Group, LoadingOverlay, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {useEffect, useMemo, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import SalesForm from "./components/SalesForm";
import { notify } from "../../requests/general/toast";
import PageTitle from "../../components/PageTitle";
import { createSales, getCustomers } from "../../requests/_saleRequests";
import { ProductBasicModel } from "../../requests/models/_product";
import { getProducts } from "../../requests/_productRequests";
import { CustomerBasicModel } from "../../requests/models/_sales";
import { getEmployees } from "../../requests/_employeeRequests";
import { EmployeeBasicModel } from "../../requests/models/_employee";
import { AxiosError } from "axios";
import SalesCustomerQuickForm from "./components/SalesCustomerQuickForm";
import { paymentMethodOptions, paymentStatusOptions, salesChannelOptions, saleStatusOptions, salesTypeOptions } from "../../requests/general/options";

const AddSale = () => {
  const [products, setProducts] = useState<ProductBasicModel[]|null>([]);
  const [customers, setCustomers] = useState<CustomerBasicModel[]|null>([]);
  const [employees, setEmployees] = useState<EmployeeBasicModel[]|null>([]);
  const [formLoading, setFormLoading] = useState(false);

  const navigate = useNavigate()
  const hiddenNewCustomer = useRef<HTMLAnchorElement>(null);

  const handleNewCustomerClick = () => {
    hiddenNewCustomer.current?.click();
  };

  useEffect(()=>{
    const productsResponse = async() => {
      const response = await getProducts();
      const active_products = response.data.data.filter(active_product => active_product.is_active)
      setProducts(active_products);

      const responseCustomers = await getCustomers();
      setCustomers(responseCustomers.data.data);

      const responseEmployees = await getEmployees();
      setEmployees(responseEmployees.data.data);
    }

    productsResponse()
  },[])

  type ProductOpt = {
    value: string;
    label: string;
  }

  const productsOpt: ProductOpt[]|undefined = useMemo(
    () => {
      return products?.map((product) => ({
        value: `${product.id}`,
        label: product.name,
      }));
    },
    [products]
  );
  
  const generalInformation = useForm({
    mode: 'controlled',
    initialValues: {
      id: '',
      product_id: '',
      sale_date_time: '',
      quantity: 0,
      employee_id: '',
      order_status: '',
      payment_status: '',
      payment_method: '',
      // selling_price: 0,
      total_amount_paid: 0,
      invoice_number: '',
      customer_id: '',
      sale_type: 'retail',
      sales_channel: '',
      delivery_details: '',
    },
    validate: {
      product_id: (value) => ((parseInt(value) < 1) ? 'Invalid product selected' : null),
      // sale_date_time: (value) => value.length < 0 ? 'Enter a positive number' : null,
      quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      employee_id: (value) => ((parseInt(value) < 1) ? 'Invalid seller selected' : null),
      order_status: (value) => (!saleStatusOptions.includes(value)? 'Invalid status selected' : null),
      payment_status: (value) => (!paymentStatusOptions.includes(value)  ? 'Invalid status selected' : null),
      payment_method: (value) => (!paymentMethodOptions.includes(value) ? 'Invalid payment method' : null),
      sales_channel: (value) => (!salesChannelOptions.includes(value) ? 'Select a valid channel' : null),
      total_amount_paid: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      invoice_number: (value) => value.length < 0 ?(value.length < 2 ? 'Must be 2 or more characters' : null):null,
      customer_id: (value) => ((parseInt(value) < 1) ? 'Invalid customer selected' : null),
      sale_type: (value) => !salesTypeOptions.includes(value) ? 'Select a valid type': null,
      delivery_details: (value) => value.length < 0 ?(value.length < 2 ? 'Delivery details is too small' : null): null,
    },
  });

  const handleSubmit = async(values: typeof generalInformation.values) => {

    setFormLoading(true);
    const data = {
      customer_id: parseInt(values.customer_id),
      product_id: parseInt(values.product_id),
      employee_id: parseInt(values.employee_id),
      quantity: values.quantity,
      sale_type: values.sale_type,
      // selling_price: values.selling_price,
      sale_date_time: values.sale_date_time,
      sales_channel: values.sales_channel,
      total_amount_paid: values.total_amount_paid,
      payment_method: values.payment_method,
      payment_status: values.payment_status,
      order_status: values.order_status,
      invoice_number: values.invoice_number,
      delivery_details: values.delivery_details,
    }
    console.log(data)

    try{

      const response = await createSales(data)
      
      if(response.data.saved) {

        notify({
          type:'success',
          message: response.data.message,
          title: 'Great'
        })
        setFormLoading(false);

        generalInformation.reset()

        return navigate('/sales')

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
          message: 'Please reload the page and try again.',
          title: 'Something went wrong'
        })
      }
      setFormLoading(false);
    }
    
    setFormLoading(false);
  }
  
  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sales', href: '/sales' },
    { title: 'Record New Sale', href: '#' },
  ]

  return (
    <>
    <PageTitle title='New Sale'>
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>
    <Group justify="flex-end">
    <SalesCustomerQuickForm setBuyers={setCustomers} buyers={customers} hiddenNewCustomer={hiddenNewCustomer}/>
    </Group>

    <Stack mt={10} pos={'relative'}>

      <LoadingOverlay
        visible={formLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

      <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
        <SalesForm generalInformation={generalInformation} productsOpt={productsOpt} 
        customers={customers} employees={employees} products={products} handleNewCustomerClick={handleNewCustomerClick}/>
      </form>
    </Stack>
    </>
  );
}

export default AddSale