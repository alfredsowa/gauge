// import { LoadingOverlay, Stack } from "@mantine/core";
// import { useForm } from "@mantine/form";
// import { useEffect, useState } from "react";
// import { notify } from "../../requests/general/toast";
// import { useNavigate } from "react-router-dom";
// import PageBreadCrumb from "../../components/PageBreadCrumb";
// import { LinkItem, } from "../../requests/models/_general";
// import { saveProduction } from "../../requests/_productionRequests";
// import { isStringInArray } from "../../requests/general/_stringHelper";
// import { priorityOptions, productionTypeOptions } from "../../requests/general/options";
// import { getEmployees } from "../../requests/_employeeRequests";
// import { EmployeeBasicModel } from "../../requests/models/_employee";
// // import ProductionForm from "./components/ProductionForm";
// import { getProducts } from "../../requests/_productRequests";
// import { ProductBasicModel } from "../../requests/models/_product";
// import PageTitle from "../../components/PageTitle";
// import { AxiosError } from "axios";
// // import { BackButton } from "../../components/BackButton";

// const AddProduction = () => {
//   const [formLoading, setFormLoading] = useState(false);
//   const [assignees, setAssignees] = useState<EmployeeBasicModel[]|undefined>();
//   const [products, setProducts] = useState<ProductBasicModel[]|undefined>();

//   const navigate  = useNavigate()

//   useEffect(() => {
//     const employees = async() => {
//       const response = await getEmployees()
//       setAssignees(response.data.data)
      
//       const products = await getProducts()
//       setProducts(products.data.data)
//     }
//     employees()
//   },[])
  
//   const productionInformation = useForm({
//     initialValues: {
//       title: '',
//       priority: '',
//       // status: '',
//       quantity: 1,
//       labour_cost: 0,
//       deadline_date: '',
//       start_date: '',
//       end_date: '',
//       type: '',
//       estimated_hours: 0,
//       assignee: '',
//       product: '',
//       is_material: false,
//       description: '',
//     },
//     validate: {
//       title: (value) => (value.length < 3 ? 'Title is too small' : null),
//       priority: (value) => (isStringInArray(value, priorityOptions) ? null : 'Invalid priority'),
//       // status: (value) => (isStringInArray(value, productionStatusOptions) ? null : 'Invalid status'),
//       quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
//       labour_cost: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
//       // deadline_date: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
//       // start_date: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
//       // end_date: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
//       type: (value) => (isStringInArray(value, productionTypeOptions) ? null : 'Invalid type'),
//       estimated_hours: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
//       assignee: (value) => ((parseInt(value) < 0) ? 'Invalid assignee' : null),
//       product: (value) => ((parseInt(value) < 0) ? 'Invalid product' : null),
//       description: (value) => value.length < 0 ?(value.length < 5 ? 'Description is too small' : null):null,
//     },
//   });

//   const handleSubmit = async(values: typeof productionInformation.values) => {

//     setFormLoading(true);
//     const data = {
//       title: values.title,
//       priority: values.priority,
//       // status: values.status,
//       quantity: values.quantity,
//       labour_cost: values.labour_cost,
//       type: values.type,
//       assignee: Number(values.assignee),
//       product: Number(values.product),
//       deadline_date: values.deadline_date,
//       start_date: values.start_date,
//       end_date: values.end_date,
//       estimated_hours: values.estimated_hours,
//       is_material: values.is_material,
//       description: values.description,
//     }

//     try{

//       const response = await saveProduction(data)
      
//       if(response.data.saved) {

//         notify({
//           type:'success',
//           message: response.data.message,
//           title: 'Great'
//         })
//         setFormLoading(false);

//         return navigate('/productions')

//       }

//     } catch(error) {
//       if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
//         notify({
//           type:'error',
//           message: error.response?.data.message, // Use optional chaining to access data property
//           title: 'Something went wrong'
//         })
//       } else {
//         notify({
//           type:'error',
//           message: 'An unexpected error occurred',
//           title: 'Something went wrong'
//         })
//       }
//       setFormLoading(false);
//     }
    
//     setFormLoading(false);
//   }
  
//   const items: Array<LinkItem> = [
//     { title: 'Dashboard', href: '/dashboard' },
//     { title: 'Productions', href: '/productions' },
//     { title: 'Add new production', href: '#' },
//   ]

//   return (
//     <>
//     <PageTitle title='New Production'>
//       <PageBreadCrumb pageBreadCrumbs={items} />
//     </PageTitle>

//     <Stack mt={40} pos={'relative'}>

//       <LoadingOverlay
//         visible={formLoading}
//         zIndex={1000}
//         overlayProps={{ radius: 'sm', blur: 1 }}
//         loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
//       />

//       <form method='POST' onReset={productionInformation.onReset} onSubmit={productionInformation.onSubmit(handleSubmit)}>
//         {/* <ProductionForm productionInformation={productionInformation} assignees={assignees} products={products} /> */}
//       </form>
//     </Stack>
//     </>
//   );
// }

// export default AddProduction