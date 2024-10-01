import { Grid, LoadingOverlay, Stack, Text} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { notify } from "../../requests/general/toast";
import { useLoaderData } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import { saveProduction } from "../../requests/_productionRequests";
import { isStringInArray } from "../../requests/general/_stringHelper";
import { priorityOptions } from "../../requests/general/options";
import { getEmployees } from "../../requests/_employeeRequests";
import { EmployeeBasicModel } from "../../requests/models/_employee";
import ProductionForm from "./components/ProductionForm";
import { getProduct, getProducts } from "../../requests/_productRequests";
import { ProductBasicModel, ProductModel } from "../../requests/models/_product";
import { ProductionBasicModel } from "../../requests/models/_production";
import PageTitle from "../../components/PageTitle";
import { AxiosError } from "axios";
import { IntermediateGoodBasicModel } from "../../requests/models/_intermediateGood";
import { getIntermediateGood, getIntermediateGoods } from "../../requests/_intermediateGoodsRequests";
import ProductionMaterials from "./components/ProductionMaterials";
import { useDocumentTitle } from "@mantine/hooks";
import PaperCard from "../../components/PaperCard";
import PaperCardHeader from "../../components/PaperCardHeader";
import PaperCardBody from "../../components/PaperCardBody";
import ProductMaterialsList from "./components/ProductMaterialsList";
import IntermediateGoodMaterialsList from "./components/IntermediateGoodMaterialsList";
import InsufficientMaterialNotice from "./components/InsufficientMaterialNotice";
import DefaultProductMaterials from "./components/DefaultProductMaterials";

const EditProduction = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [assignees, setAssignees] = useState<EmployeeBasicModel[]|undefined>();
  const [products, setProducts] = useState<ProductBasicModel[]|undefined>();
  const [productSelected, setProductSelected] = useState<ProductModel|undefined>();
  const [intermediateGoodSelected, setIntermediateGoodSelected] = useState<IntermediateGoodBasicModel|undefined>();
  const [intermediateGoods, setIntermediateGoods] = useState<IntermediateGoodBasicModel[]|undefined>();
  const [selectedItem, setSelectedItem] = useState<IntermediateGoodBasicModel|ProductBasicModel|undefined>();
  const [insufficientNote, setInsufficientNote] = useState<string[]|undefined>();

  const getProductionData = useLoaderData() as ProductionBasicModel

  const [production, setProduction] = useState<ProductionBasicModel>(getProductionData);

  // const navigate  = useNavigate()

  useEffect(() => {
    const employees = async() => {
      const response = await getEmployees()
      setAssignees(response.data.data)
      
      const products = await getProducts()
      const active_products = products.data.data.filter(item => item.is_active)
      setProducts(active_products)
      
      const goods = await getIntermediateGoods()
      const active_good = goods.data.data.filter(item => item.status)
      setIntermediateGoods(active_good)

      if(production.product) {
        getProductSelected(production.product.slug)
      }

      if(production.intermediate_good) {
        getIntermediateGoodSelected(production.intermediate_good.slug)
      }
    }

    employees()
  },[production.intermediate_good,production.product])

  const productionInformation = useForm({
    // mode:'uncontrolled',
    initialValues: {
      id: Number(production.id),
      title: production.title,
      priority: production.priority,
      quantity: production.quantity,
      labour_cost: production.labour_cost,
      deadline_date: (production.deadline_date) ? new Date(production.deadline_date):'',
      start_date: (production.start_date) ? new Date(production.start_date):'',
      end_date: (production.end_date) ? new Date(production.end_date):'',
      type: production.type,
      estimated_hours: production.estimated_hours,
      assignee: (production.assignee?.id ? String(production.assignee?.id) : ''),
      product: (production.product_id) ? String(production.product_id) : '',
      intermediate_good: (production.intermediate_good_id) ? String(production.intermediate_good_id) : '',
      is_material: production.is_material,
      description: production.description ?production.description: '',
    },
    validate: {
      title: (value) => (value.length < 3 ? 'Title is too small' : null),
      priority: (value) => (isStringInArray(value, priorityOptions) ? null : 'Invalid priority'),
      quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      labour_cost: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      estimated_hours: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      assignee: (value) => ((Number(value) < 0) ? 'Invalid assignee' : null),
      product: (value, values) => values.type === 'product' && ((Number(value) < 0) ? 'Invalid product' : null),
      intermediate_good: (value, values) => values.type === 'intermediate_good' && ((Number(value) < 0) ? 'Invalid intermediate good' : null),
      description: (value) => value.length < 0 ?(value.length < 5 ? 'Description is too small' : null):null,
    },
  });

  const getProductSelected = async (slug: string) => {
    const response = await getProduct(slug)
    setProductSelected(response.data)
  }

  const getIntermediateGoodSelected = async (slug: string) => {
    const response = await getIntermediateGood(slug)
    setIntermediateGoodSelected(response.data)
  }

  productionInformation.watch('product', ({ value }) => {
    const itemSelected = products?.find((product) => product.id === Number(value))
    const labour_cost = production.labour_cost > 0 ? production.labour_cost : itemSelected?.labour_cost;
    productionInformation.setValues({labour_cost: labour_cost})
    if(itemSelected) getProductSelected(itemSelected.slug)
    setSelectedItem(itemSelected);
  });

  productionInformation.watch('intermediate_good', ({ value }) => {
    const itemSelected = intermediateGoods?.find((intermediateGood) => intermediateGood.id === Number(value))
    const labour_cost = production.labour_cost > 0 ? production.labour_cost : itemSelected?.labour_cost;
    productionInformation.setValues({labour_cost: labour_cost})
    if(itemSelected) getIntermediateGoodSelected(itemSelected.slug)
    setSelectedItem(itemSelected);
  });


  const handleSubmit = async(values: typeof productionInformation.values) => {

    setFormLoading(true);
    
    const data = {
      id: production.id,
      title: values.title,
      priority: values.priority,
      quantity: values.quantity,
      labour_cost: (values.labour_cost > 0) ? values.labour_cost : selectedItem?.labour_cost,
      type: values.type,
      assignee: parseInt(values.assignee),
      product: values.type === 'product' ? parseInt(values.product):null,
      intermediate_good_id: values.type === 'intermediate_good' ? parseInt(values.intermediate_good):null,
      deadline_date: values.deadline_date,
      start_date: values.start_date,
      end_date: values.end_date,
      estimated_hours: values.estimated_hours,
      is_material: values.is_material,
      description: values.description,
    }

    try{

      const response = await saveProduction(data)
      setInsufficientNote(undefined)
      if(response.data.saved) {

        setProduction(response.data.data)

        notify({
          type:'success',
          message: response.data.message,
          title: 'Great'
        })
        setFormLoading(false);

        // return navigate('/productions')

      }else {
        notify({
          type:'error',
          message: 'Insufficient material quantity',
          title: 'Sorry!'
        })
        setInsufficientNote(response.data.message)
        setFormLoading(false);
      }

    } catch(error) {
      // console.log(error);
      
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
    { title: 'Productions', href: '/productions' },
    { title: 'Edit production', href: '#' },
  ]
  
  useDocumentTitle("Edit Productions")
  return (
    <>
    <PageTitle title='Edit Production'>
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

    <Grid>
      <Grid.Col span={{base:12, lg: 7}}>
        <Stack pos={'relative'}>

          <LoadingOverlay
            visible={formLoading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
          />

          <form method='POST' onReset={productionInformation.onReset} onSubmit={productionInformation.onSubmit(handleSubmit)}>
            <ProductionForm category={production.category} productionInformation={productionInformation} 
            getProductionData={production}
            assignees={assignees} products={products} intermediate_goods={intermediateGoods} />
          </form>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{base:12, lg:5}}>
        {
          // isStringInArray(production.category,['training','sample']) || production.status !== 'backlog' ? (
          isStringInArray(production.category,['training','sample']) || production.status !== 'backlog' ? (
            <>
            {isStringInArray(production.type,['product','intermediate_good']) && isStringInArray(production.status,['in_progress','on_hold'])?
            (
              <DefaultProductMaterials production={production}  />
            ):null}
            <InsufficientMaterialNotice insufficientNote={insufficientNote}  />
            <ProductionMaterials prodMaterials={production.materials} prodIntermediateGoods={production.intermediate_goods}
            view = {false}
            category={production.category}
            proStage={production.status} production_id={production.id} 
            production_quantity={productionInformation.getValues().quantity} />
            </>
            
          ): 
          productionInformation.getValues().type === 'product'?
          (
            <>
            <InsufficientMaterialNotice insufficientNote={insufficientNote}  />
            <PaperCard>
                <PaperCardHeader>
                  <Text fw={600}>
                    Materials Per Unit Item
                  </Text>
                </PaperCardHeader>
                <PaperCardBody>
                    <ProductMaterialsList product={productSelected} />
                </PaperCardBody>
            </PaperCard></>
          ):
          productionInformation.getValues().type === 'intermediate_good'? (
            <>
            <InsufficientMaterialNotice insufficientNote={insufficientNote}  />
            <PaperCard>
                <PaperCardHeader>
                  <Text fw={600}>
                    Materials Per Unit Item
                  </Text>
                </PaperCardHeader>
                <PaperCardBody>
                <InsufficientMaterialNotice insufficientNote={insufficientNote}  />
                  <IntermediateGoodMaterialsList intermediateGood={intermediateGoodSelected} />
                </PaperCardBody>
            </PaperCard>
            </>
          ):null
        }
      
      </Grid.Col>
    </Grid>
    
    </>
  );
}

export default EditProduction