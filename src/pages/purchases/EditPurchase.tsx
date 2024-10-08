import {  Group, LoadingOverlay, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {useEffect, useRef, useState} from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import PurchaseForm from "./components/PurchaseForm";
import { createPurchase, getSuppliers } from "../../requests/_purchaseRequests";
import { SupplierBasic } from "../../requests/models/_business";
import { notify } from "../../requests/general/toast";
import { PurchaseBasicModel } from "../../requests/models/_purchase";
import { purchaseStatusOptions } from "../../requests/general/options";
import PageTitle from "../../components/PageTitle";
import PurchaseSupplierQuickForm from "./components/PurchaseSupplierQuickForm";

const EditPurchase = () => {
  const [suppliers, setSuppliers] = useState<SupplierBasic[]|null>([]);
  const [formLoading, setFormLoading] = useState(false);
  const hiddenNewSupplier = useRef<HTMLAnchorElement>(null);
  const getPurchaseData = useLoaderData() as PurchaseBasicModel;

  const navigate = useNavigate()

  useEffect(()=>{
    const materialsResponse = async() => {
      const responseSuppliers = await getSuppliers();
      setSuppliers(responseSuppliers.data.data);
    }

    materialsResponse()
  },[])

  const handleNewSupplierClick = () => {
    hiddenNewSupplier.current?.click();
  };
  
  const generalInformation = useForm({
    initialValues: {
      material: (getPurchaseData.material_id)?String(getPurchaseData.material_id):'',
      purchase_date: (getPurchaseData.purchase_date)?new Date(getPurchaseData.purchase_date):'',
      status: (getPurchaseData.status)?String(getPurchaseData.status):'',
      quantity: (getPurchaseData.quantity)?Number(getPurchaseData.quantity):'',
      actual_quantity: (getPurchaseData.actual_quantity)?Number(getPurchaseData.actual_quantity):'',
      unit_price: (getPurchaseData.unit_price)?Number(getPurchaseData.unit_price):'',
      amount_paid: (getPurchaseData.amount_paid)?Number(getPurchaseData.amount_paid):'',
      purchase_details: (getPurchaseData.purchase_details)?String(getPurchaseData.purchase_details):'',
      discounts: (getPurchaseData.discounts)?Number(getPurchaseData.discounts):'',
      shipping: (getPurchaseData.shipping)?Number(getPurchaseData.shipping):'',
      invoice_number: (getPurchaseData.invoice_number)?String(getPurchaseData.invoice_number):'',
      supplier_id: (getPurchaseData.supplier_id)?String(getPurchaseData.supplier_id):'',
      notes: (getPurchaseData.notes)?String(getPurchaseData.notes):'',
    },
    validate: {
      material: (value) => ((parseInt(value) < 1) ? 'Invalid material selected' : null),
      // purchase_date: (value) => (value.length < 10 ? 'Invalid date' : null),
      status: (value) => ((value !== purchaseStatusOptions[0] && value !== purchaseStatusOptions[1]) ? 'Invalid type selected' : null),
      quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      actual_quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      unit_price: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      amount_paid: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      discounts: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      shipping: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      invoice_number: (value) => (value.length > 0 && value.length < 2 ? 'Must be 2 or more characters' : null),
      purchase_details: (value) => value.length < 0 ?(value.length < 2 ? 'Description is too small' : null):null,
    },
  });

  const handleSubmit = async(values: typeof generalInformation.values) => {

    
    const data = {
      id: Number(getPurchaseData.id),
      material_id: Number(values.material),
      supplier_id: Number(values.supplier_id),
      purchase_date: values.purchase_date,
      status: values.status,
      quantity: Number(values.quantity),
      actual_quantity: Number(values.actual_quantity),
      unit_price: Number(values.unit_price),
      amount_paid: Number(values.amount_paid),
      discounts: Number(values.discounts),
      purchase_details: values.purchase_details,
      shipping: Number(values.shipping),
      invoice_number: values.invoice_number,
      notes: values.notes,
    }
    
    setFormLoading(true);

    try{

      const response = await createPurchase(data)
      
      if(response.data.saved) {

        notify({
          type:'success',
          message: response.data.message,
          title: 'Great'
        })
        setFormLoading(false);

        generalInformation.reset()

        return navigate('/purchases')

      }

    } catch(error) {
      notify({
        type:'error',
        message: 'Ensure all compulsory fields are filled. Try again later',
        title: 'Something went wrong'
      })
      setFormLoading(false);
    }
    
    setFormLoading(false);
  }
  
  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Purchases', href: '/purchases' },
    { title: 'Edit Purchase', href: '#' },
  ]

  return (
    <>
    <PageTitle title='Edit Purchase'>
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

    <Group justify="flex-end">
    <PurchaseSupplierQuickForm setSuppliersList={setSuppliers} suppliersList={suppliers} hiddenNewSupplier={hiddenNewSupplier}/>
    </Group>

    <Stack mt={10} pos={'relative'}>

      <LoadingOverlay
        visible={formLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

      <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
        <PurchaseForm generalInformation={generalInformation} suppliers={suppliers} handleNewSupplierClick={handleNewSupplierClick} />
      </form>
    </Stack>
    </>
  );
}

export default EditPurchase