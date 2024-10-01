import { useForm, yupResolver } from "@mantine/form";
import * as yup from 'yup';
import { useState } from "react";

import { IconArrowRight, IconInfoCircle, IconPencil, IconPencilCancel, IconUser} from "@tabler/icons-react";
import { Alert, Button, Grid, LoadingOverlay, Text, TextInput, rem } from "@mantine/core";
import { BusinessModel } from "../../../requests/models/_business";
import { createBusiness } from "../../../requests/_businessRequests";
import { notify } from "../../../requests/general/toast";
import { AxiosError } from "axios";
import PaperCard from "../../../components/PaperCard";
import PaperCardHeader from "../../../components/PaperCardHeader";
import PaperCardBody from "../../../components/PaperCardBody";

const BusinessDetails = ({currentBusiness,setCurrentBusiness}:{
  currentBusiness:BusinessModel,
  setCurrentBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
}) => {

  const [businessFormloading, setBusinessFormLoading] = useState(false);
  const [enableBusiness, setEnableBusiness] = useState(true);

  const schema = yup.object().shape({
    name: yup.string()
      .required('Name is required')
      .min(2, 'Name should have at least 2 letters'),
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email'),
  });

  const businessForm = useForm({
    initialValues: {
      name: currentBusiness?.name,
      email: currentBusiness?.email,
    },
    validate: yupResolver(schema)
  });

  const enableBusinessForm = () => {
    setEnableBusiness((p) => { return !p})
    businessForm.reset();
  }

  const handleBusinessSubmit = async(values: typeof businessForm.values) => {

    setBusinessFormLoading(true);

    try{
      const sendData = await createBusiness({
        name: values.name,
        email: values.email,
        id: currentBusiness.id,
      })

      setCurrentBusiness(sendData.data);

      notify({
        type:'success',
        message: "Business details updated successfully",
        title: 'Successful'
      })

    } catch(error) {
        if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
          notify({
            type:'error',
            message: error.response?.data.error+" Please reload the page and try again.", // Use optional chaining to access data property
            title: 'Something went wrong'
          })
        } else {
          notify({
            type:'error',
            message: 'Please reload the page and try again.',
            title: 'Something went wrong'
          })
        }
    }
    
    setBusinessFormLoading(false);
  }

  return (
    <PaperCard>
      <PaperCardHeader>
        <Text>Basic Details</Text>
        {(enableBusiness)?(
          <Button variant="filled" size="sm" onClick={enableBusinessForm}
          leftSection={<IconPencil size={14} />}>Edit</Button>
        ):(
          <Button variant="light" color="red" size="sm" onClick={enableBusinessForm}
          leftSection={<IconPencilCancel size={14} />}>Cancel</Button>
        )}
      </PaperCardHeader>
      <PaperCardBody>
        <LoadingOverlay
            visible={businessFormloading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: 'blue', type: 'bars' }}
        />
        <Alert variant="light" mb={30} radius="md" 
        title="Click on the edit button above to enable the form below" icon={(<IconInfoCircle />)} />

        <form onSubmit={businessForm.onSubmit(handleBusinessSubmit)} method='POST'>

          <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

            {/* Name */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm:6 ,md: 6, lg: 6 }}>
              <TextInput
                {...businessForm.getInputProps('name')}
                key={businessForm.key('name')}
                radius={"md"}
                leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                disabled={enableBusiness}
                label="Name"
                withAsterisk
                required
                placeholder="Name"
              />
            </Grid.Col>

            {/* Email */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm:6, md: 6, lg: 6 }}>
              <TextInput type="email"
                {...businessForm.getInputProps('email')}
                key={businessForm.key('email')}
                radius={"md"}
                leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                disabled={enableBusiness}
                label="Email"
                required
                withAsterisk
                // description="Input description"
                placeholder="Email"
              />
            </Grid.Col>
              
            <Grid.Col pt={10} span={{ base: 12, md: 6, lg: 6 }}>
              <Button  type="submit"
                disabled={enableBusiness}
                px={40}
                variant="filled"
                rightSection={<IconArrowRight size={14} />}>
                Save
              </Button>
            </Grid.Col>
          </Grid>

        </form>
      </PaperCardBody>
    </PaperCard>
  )
}

export default BusinessDetails
