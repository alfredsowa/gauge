import { Button, Grid, LoadingOverlay, Modal, NumberInput, Text, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react"
import { useAuth } from "../../../auth/core/Auth";
import { saveOverhead } from "../../../requests/_businessRequests";
import { AxiosError } from "axios";
import { notify } from "../../../requests/general/toast";
import { Overhead } from "../../../requests/models/_business";


const OverheadCostForm = ({setOverheadCosts}:{
  setOverheadCosts: React.Dispatch<React.SetStateAction<Overhead[]|undefined>>
}) => {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const {currentBusiness} = useAuth()

  const overheadCost = useForm({
    initialValues: {
      title: '',
      cost: 0,
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Title is too small' : null),
      cost: (value) => (value < 0 ? 'Cost is 0 or more' : null),
    },
  });

  const addOverhead = () => {
    open()
  }

  const handleSubmit = async(values: typeof overheadCost.values) => {
    setLoading(true)
    const data = {
      title: values.title,
      cost: values.cost
    }

    try{

      const response = await saveOverhead(data)
      
      if(response.data.saved) {

        setOverheadCosts(response.data.overhead)
        notify({
          type:'success',
          message: response.data.message,
          title: 'Great'
        })
        setLoading(false);
        overheadCost.reset()

      }
      setLoading(false)

      close()

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
          message: 'An unexpected error occurred',
          title: 'Something went wrong'
        })
      }
      setLoading(false);
    }

    // TODO: Add overhead to business
    
  }

  return (
    <>
    <Modal opened={opened} size="xl" padding='xl' onClose={close} 
    title={<Text fw={600} fz={17}>Add Overhead Per Month</Text>}
    overlayProps={{
        backgroundOpacity: 0.5,
        blur: 1,
      }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

        <form method='POST' onSubmit={overheadCost.onSubmit(handleSubmit)}>
      <Grid mb={20}>
        <Grid.Col span={{ base:12, sm:6, md:6, lg:6 }}>
          <TextInput
            {...overheadCost.getInputProps('title')}
            key={overheadCost.key('title')}
            radius={"md"}
            variant="filled"
            withAsterisk
            required
            placeholder="Rent and Utilities"
          />
        </Grid.Col>
        <Grid.Col span={{ base:12, sm:6, md:6, lg:6 }}>
          <NumberInput
            placeholder="100"
            required
            radius={"md"}
            withAsterisk
            prefix={currentBusiness?.currency_symbol}
            variant="filled"
            min={0}
            step={0.01}
            {...overheadCost.getInputProps('cost')}
            key={overheadCost.key('cost')}
          />
        </Grid.Col>
        </Grid>
          <Button variant="filled" component="button" type="submit" aria-label="Save">
            Save
          </Button>
        </form>
    </Modal>
        <Button variant='filled' size="sm" onClick={addOverhead} leftSection={<IconPlus size={16} />}>Add</Button>
    </>
  )
}

export default OverheadCostForm
