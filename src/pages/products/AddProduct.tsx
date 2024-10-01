import { LoadingOverlay, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notify } from "../../requests/general/toast";
import { useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import ProductForm from "./components/ProductForm";
import { createProduct } from "../../requests/_productRequests";
import PageTitle from "../../components/PageTitle";
import { AxiosError } from "axios";

const AddProduct = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [fileM, setFileM] = useState<File | null>(null)

  const navigate  = useNavigate()
  
  const generalInformation = useForm({
    initialValues: {
      name: '',
      sku: '',
      price: 0,
      wholesale_price: 0,
      discount_price: 0,
      stock_quantity: 0,
      min_stock_quantity: 1,
      is_produced: '',
      is_active: '',
      description: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too small' : null),
      sku: (value) => (value.length > 0 && value.length < 4 ? 'Sku is too small' : null),
      price: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      wholesale_price: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      discount_price: (value) => ((Number(value) > 0 && Number(value) < 0) ? 'Enter a positive number' : null),
      stock_quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      min_stock_quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      description: (value) => value.length < 0 ?(value.length < 5 ? 'Description is too small' : null):null,
    },
  });

  const handleSubmit = async(values: typeof generalInformation.values) => {

    setFormLoading(true);

    if(fileM) {
      const formData = new FormData();
      formData.append('file', fileM);
    }
    else {
      setFileM(null)
    }
    
    const data = {
      file: fileM,
      name: values.name,
      sku: values.sku,
      price: Number(values.price),
      wholesale_price: Number(values.wholesale_price),
      discount_price: Number(values.discount_price),
      stock_quantity: Number(values.stock_quantity),
      min_stock_quantity: Number(values.min_stock_quantity),
      is_produced: values.is_produced?true: false,
      is_active: values.is_active?true: false,
      description: values.description,
    }

    try{

      const response = await createProduct(data)
      
      if(response.data.saved) {

        notify({
          type:'success',
          message: response.data.message,
          title: 'Great'
        })
        setFormLoading(false);

        return navigate(`/products/${response.data.product_slug}/edit`)

      }

    } catch(error) {
      console.log(error);
      
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
      setFormLoading(false);
    }
    
    setFormLoading(false);
  }
  
  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/products' },
    { title: 'Add new product', href: '#' },
  ]

  return (
    <>
    <PageTitle title='New Product'>
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

    <Stack mt={40} pos={'relative'}>

      <LoadingOverlay
        visible={formLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

      <form method='POST' onReset={generalInformation.onReset} onSubmit={generalInformation.onSubmit(handleSubmit)}>
        <ProductForm generalInformation={generalInformation} setFileM={setFileM} />
      </form>
    </Stack>
    </>
  );
}

export default AddProduct