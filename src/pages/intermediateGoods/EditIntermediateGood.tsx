import {Grid, LoadingOverlay, Stack, Text} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notify } from "../../requests/general/toast";
import { useLoaderData, } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import IntermediateGoodsForm from "./components/IntermediateGoodsForm.tsx";
import { createIntermediateGood } from "../../requests/_intermediateGoodsRequests.ts";
import {IntermediateGoodModel, IntermediateGoodSave} from "../../requests/models/_intermediateGood.tsx";
import PageTitle from "../../components/PageTitle";
import { AxiosError } from "axios";
import PaperCard from "../../components/PaperCard.tsx";
import PaperCardHeader from "../../components/PaperCardHeader.tsx";
import PaperCardBody from "../../components/PaperCardBody.tsx";
import IntermediateGoodsMaterials from "./components/IntermediateGoodsMaterials.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditIntermediateGood = () => {
  const [fileM, setFileM] = useState<File | null>(null)
  const getIntermediateGoodData = useLoaderData() as IntermediateGoodModel;
  const queryClient = useQueryClient();

  const {mutate: saveIntermediateGood,isPending} = useMutation({
      mutationKey: ['intermediateGoodsSave'],
      mutationFn: (good: IntermediateGoodSave) => {
          return createIntermediateGood(good)
      },
      onSuccess: (response) => {
          queryClient.invalidateQueries({queryKey:['intermediateGoods'], refetchType: "all"})
          notify({
            type:'success',
            message: response.data.message,
            title: 'Saved'
          })
      },
      onError: (error) => {
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
      }
  })
  
  const generalInformation = useForm({
    initialValues: {
      id: getIntermediateGoodData.id,
      name: getIntermediateGoodData.name,
      labour_cost: getIntermediateGoodData.labour_cost,
      stock_quantity: getIntermediateGoodData.stock_quantity,
      min_stock_quantity: getIntermediateGoodData.min_stock_quantity,
      category: getIntermediateGoodData.intermediate_goods_category_id,
      status: Number(getIntermediateGoodData.status) === 1,
      is_reusable_after_damaged: Number(getIntermediateGoodData.is_reusable_after_damaged) === 1,
      description: getIntermediateGoodData.description?getIntermediateGoodData.description:'',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too small' : null),
      labour_cost: (value) => ((Number(value) > 0 && Number(value) < 0) ? 'Enter a positive number' : null),
      category: (value) => ((Number(value) < 0) ? 'Incorrect category selected' : null),
      stock_quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      min_stock_quantity: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
      description: (value) => value.length < 0 ?(value.length < 5 ? 'Description is too small' : null):null,
    },
  });

  const handleSubmit = async(values: typeof generalInformation.values) => {
    
    if(fileM) {
      const formData = new FormData();
      formData.append('file', fileM);
    }
    else {
      setFileM(null)
    }

    saveIntermediateGood({
      id: getIntermediateGoodData.id,
      file: fileM,
      name: values.name,
      stock_quantity: Number(values.stock_quantity),
      min_stock_quantity: Number(values.min_stock_quantity),
      labour_cost: values.labour_cost,
      category: values.category,
      status: values.status,
      is_reusable_after_damaged: values.is_reusable_after_damaged,
      description: values.description,
    })
  }
  
  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Intermediate Goods', href: '/intermediate-goods' },
    { title: 'Edit Intermediate Good', href: '#' },
  ]

  return (
    <>
    <PageTitle title='Edit Intermediate Good'>
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

    {/*<Group mb={20} justify="flex-end">*/}
    {/*  <Button variant="light" component={Link} to={`/products/${getIntermediateGoodData.slug}/view#product_materials`}>Add IntermediateGood Materials</Button>*/}
    {/*</Group>*/}
      <Grid>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Stack pos={'relative'}>

            <LoadingOverlay
                visible={isPending}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 1 }}
                loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
            />

            <form method='POST' onReset={generalInformation.onReset} onSubmit={generalInformation.onSubmit(handleSubmit)}>
              <IntermediateGoodsForm generalInformation={generalInformation} imageUrl={getIntermediateGoodData.image} setFileM={setFileM} />
            </form>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 5 }} id='product_materials'>
          <PaperCard>
            <PaperCardHeader>
              <Text fw={'bold'} fz={'md'}>
                Materials Information
              </Text>
            </PaperCardHeader>
            <PaperCardBody>
              <IntermediateGoodsMaterials intermediate_good_id={getIntermediateGoodData.id} prodMaterials={getIntermediateGoodData.materials} />
            </PaperCardBody>
          </PaperCard>
        </Grid.Col>
      </Grid>

    </>
  );
}

export default EditIntermediateGood