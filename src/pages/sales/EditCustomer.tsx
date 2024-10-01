import { LoadingOverlay, Stack } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import { notify } from "../../requests/general/toast";
import PageTitle from "../../components/PageTitle";
import { saveCustomers } from "../../requests/_saleRequests";
import CustomerForm from "./components/CustomerForm";
import { CustomerBasicModel } from "../../requests/models/_sales";
import { AxiosError } from "axios";

const EditCustomer = () => {
  const [formLoading, setFormLoading] = useState(false);
  const customer = useLoaderData() as CustomerBasicModel

  const navigate = useNavigate()
  
  const generalInformation = useForm({
    initialValues: {
      id: customer.id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone?customer.phone:'',
      address: customer.address?customer.address:'',
      city: customer.city?customer.city:'',
      state: customer.state?customer.state:'',
      country: customer.country?customer.country:'',
      company_name: customer.company_name?customer.company_name:'',
      contact_person: customer.contact_person?customer.contact_person:'',
      additional_info: customer.additional_info?customer.additional_info:'',
    },
    validate: {
      first_name: (value) => (value.length < 2  ? 'First name is too small' : null),
      last_name: (value) => (value.length < 2  ? 'Last name is too small' : null),
      email: (isEmail()),
      phone: (value) => value.length > 0 ?(value.length < 10 ? 'Must be 10 or more characters' : null) : null,
      city: (value) => value.length > 0 ?(value.length < 2 ? 'City name is too small' : null) : null,
      state: (value) => value.length > 0 ?(value.length < 2 ? 'State name is too small' : null) : null,
      country: (value) => value.length > 0 ?(value.length < 2 ? 'Country name is too small' : null) : null,
      company_name: (value) => value.length > 0 ?(value.length < 2 ? 'Company name is too small' : null) : null,
      contact_person: (value) => value.length > 0 ?(value.length < 2 ? 'Contact person name is too small' : null) : null,
      address: (value) => value.length > 0 ?(value.length < 5 ? 'Address is too short': null):null,
      additional_info: (value) => value.length < 0 ?(value.length < 2 ? 'Details is too small' : null): null,
    },
  });

  const handleSubmit = async(values: typeof generalInformation.values) => {

    setFormLoading(true);
    const data = {
      id: customer.id,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      city: values.city,
      state: values.state,
      country: values.country,
      company_name: values.company_name,
      contact_person: values.contact_person,
      address: values.address,
      additional_info: values.additional_info,
    }
    console.log(data)

    try{

      const response = await saveCustomers(data)
      
      if(response.data.saved) {

        notify({
          type:'success',
          message: response.data.message,
          title: 'Great'
        })
        setFormLoading(false);

        generalInformation.reset()

        return navigate('/sales/customers')

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
    { title: 'Customers', href: '/sales/customers' },
    { title: 'Edit Customer', href: '#' },
  ]

  return (
    <>
    <PageTitle title='Edit Customer'>
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

    <Stack mt={40} pos={'relative'}>

      <LoadingOverlay
        visible={formLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

      <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
        <CustomerForm generalInformation={generalInformation} />
      </form>
    </Stack>
    </>
  );
}

export default EditCustomer