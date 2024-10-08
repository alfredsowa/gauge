import { Group, LoadingOverlay, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import PurchaseForm from "./components/PurchaseForm";
import { createPurchase, getSuppliers } from "../../requests/_purchaseRequests";
import { SupplierBasic } from "../../requests/models/_business";
import { notify } from "../../requests/general/toast";
import { purchaseStatusOptions } from "../../requests/general/options";
import PageTitle from "../../components/PageTitle";
import PurchaseSupplierQuickForm from "./components/PurchaseSupplierQuickForm";

const AddPurchase = () => {
  const [suppliers, setSuppliers] = useState<SupplierBasic[]|null>([]);
  const [formLoading, setFormLoading] = useState(false);
  const hiddenNewSupplier = useRef<HTMLAnchorElement>(null);

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
      material: '',
      purchase_date: '',
      status: '',
      quantity: '',
      actual_quantity: '',
      unit_price: '',
      amount_paid: '',
      purchase_details: '',
      discounts: '',
      shipping: '',
      invoice_number: '',
      supplier_id: '',
      notes: '',
    },
    validate: {
      material: (value) => ((parseInt(value) < 1) ? 'Invalid material selected' : null),
      purchase_date: (value) => (value.length < 10 ? 'Invalid date' : null),
      status: (value) => ((value !== purchaseStatusOptions[0] && value !== purchaseStatusOptions[1]) ? 'Invalid type selected' : null),
      quantity: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      actual_quantity: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      unit_price: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      amount_paid: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      discounts: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      shipping: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      invoice_number: (value) => (value.length > 0 && value.length < 2 ? 'Must be 2 or more characters' : null),
      purchase_details: (value) => value.length < 0 ?(value.length < 2 ? 'Description is too small' : null): null,
      // notes: (value) => value.length > 0 ?? (value.length < 2 ? 'Must be 2 or more characters' : null),
    },
  });

  const handleSubmit = async(values: typeof generalInformation.values) => {
    
    const data = {
      material_id: parseInt(values.material),
      supplier_id: parseInt(values.supplier_id),
      purchase_date: values.purchase_date,
      status: values.status,
      quantity: parseInt(values.quantity),
      actual_quantity: parseInt(values.actual_quantity),
      unit_price: parseInt(values.unit_price),
      amount_paid: parseInt(values.amount_paid),
      discounts: parseInt(values.discounts),
      purchase_details: values.purchase_details,
      shipping: parseInt(values.shipping),
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
    { title: 'Record New Purchase', href: '#' },
  ]

  return (
    <>
    <PageTitle title='New Purchase'>
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
        <PurchaseForm generalInformation={generalInformation} suppliers={suppliers} handleNewSupplierClick={handleNewSupplierClick}/>
      </form>
    </Stack>
    </>
  );
}

export default AddPurchase