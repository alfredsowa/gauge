import {Grid, LoadingOverlay, Stack, Text} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { notify } from "../../requests/general/toast";
import { useLoaderData, useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import ProductForm from "./components/ProductForm";
import { createProduct } from "../../requests/_productRequests";
import {ProductCost, ProductModel} from "../../requests/models/_product";
import PageTitle from "../../components/PageTitle";
import { AxiosError } from "axios";
import PaperCard from "../../components/PaperCard.tsx";
import PaperCardHeader from "../../components/PaperCardHeader.tsx";
import PaperCardBody from "../../components/PaperCardBody.tsx";
import ProductMaterials from "./components/ProductMaterials.tsx";
import ProductCostAndPricing from "./components/ProductCostAndPricing.tsx";

const EditProduct = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [productCosts, setProductCosts] = useState<ProductCost>();
  const [fileM, setFileM] = useState<File | null>(null)
  const getProductData = useLoaderData() as ProductModel;

  const navigate  = useNavigate()

  useEffect(() =>{
    const prodCost = () => {
      return setProductCosts(getProductData.product_costs)
    }

    prodCost()
  },[getProductData])
  
  const generalInformation = useForm({
    initialValues: {
      id: getProductData.id,
      name: getProductData.name,
      sku: getProductData.sku?getProductData.sku:'',
      price: getProductData.price,
      wholesale_price: getProductData.wholesale_price,
      wholesale_markup: getProductData.wholesale_markup,
      retail_markup: getProductData.retail_markup,
      use_manual_pricing: getProductData.use_manual_pricing,
      labour_cost: getProductData.labour_cost,
      stock_quantity: getProductData.stock_quantity,
      min_stock_quantity: getProductData.min_stock_quantity,
      is_produced: Number(getProductData.is_produced) === 1,
      is_active: Number(getProductData.is_active) === 1,
      description: getProductData.description?getProductData.description:'',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too small' : null),
      sku: (value) => (value?.length > 0 && value?.length < 5 ? 'Sku is too small' : null),
      price: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      wholesale_price: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      labour_cost: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
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
      id: getProductData.id,
      file: fileM,
      name: values.name,
      sku: values.sku,
      price: Number(values.price),
      wholesale_price: Number(values.wholesale_price),
      wholesale_markup: Number(values.wholesale_markup),
      retail_markup: Number(values.retail_markup),
      use_manual_pricing: values.use_manual_pricing,
      labour_cost: Number(values.labour_cost),
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

        return navigate(`/products`)

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
    { title: 'Edit product', href: '#' },
  ]

  return (
    <>
    <PageTitle title='Edit Product'>
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

      <Grid>
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <Stack pos={'relative'}>

            <LoadingOverlay
                visible={formLoading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 1 }}
                loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
            />

            <form method='POST' onReset={generalInformation.onReset} onSubmit={generalInformation.onSubmit(handleSubmit)}>
              <ProductForm generalInformation={generalInformation} imageUrl={getProductData.image} setFileM={setFileM} />
            </form>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5, lg: 5 }} id='product_materials'>
          <PaperCard>
            <PaperCardHeader>
              <Text fw={'bold'} fz={'md'}>
                Cost & Pricing
              </Text>
            </PaperCardHeader>
            <PaperCardBody>
              <ProductCostAndPricing productCosts={productCosts} product={getProductData}/>
            </PaperCardBody>
          </PaperCard>
          <PaperCard>
            <PaperCardHeader>
              <Text fw={'bold'} fz={'md'}>
                Materials Information
              </Text>
            </PaperCardHeader>
            <PaperCardBody>
              <ProductMaterials 
              setProductCosts={setProductCosts}
              prodIntermediateGoods={getProductData.used_intermediate_goods} 
              product_id={getProductData.id} 
              edit = {true}
              prodMaterials={getProductData.materials} />
            </PaperCardBody>
          </PaperCard>
        </Grid.Col>
      </Grid>

    </>
  );
}

export default EditProduct