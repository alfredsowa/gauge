import { useForm } from '@mantine/form';

import { Text, Button, ScrollArea, Table, NumberInput, Group, Switch, Textarea, LoadingOverlay, Alert  } from '@mantine/core'
import { useState } from 'react';
import { GetWithUnit } from '../../../requests/general/_numberHelper';
import { ReconciliationData, ReconciliationModel } from '../../../requests/models/_audit';
import { notify } from '../../../requests/general/toast';
import { AxiosError } from 'axios';
import { saveReconciliationData } from '../../../requests/_auditRequest';
import { IconInfoCircle } from '@tabler/icons-react';

const ReconcilingForm = ({reconciliation,setReconciliation}:
    {
        reconciliation: ReconciliationModel,
        setReconciliation: React.Dispatch<React.SetStateAction<ReconciliationModel|undefined>>
    }) => {
// const ReconcilingForm = ({materials,id}:{materials: string,id:number}) => {
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const form_fields = JSON.parse(reconciliation.data)
    
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            selected_materials: form_fields,
        }
    });

    const fields = form.getValues().selected_materials.map((item: ReconciliationData, index: number) => (
        <Table.Tr key={item.key}>
            <Table.Td>
                <Text fw={600}>
                    {item.name}<br/>
                    <Text component={'span'} fw={400} c={'dimmed'}>
                        {item.category}
                    </Text>
                </Text>
            </Table.Td>

            <Table.Td>
                <Text fw={500}>
                    <GetWithUnit figure={item.current_stock} unit={item.unit}  />
                </Text>
            </Table.Td>

            <Table.Td>
                <NumberInput
                placeholder="100"
                required={checked}
                withAsterisk
                min={0}
                step={0.01}
                key={form.key(`selected_materials.${index}.actual_stock`)}
                {...form.getInputProps(`selected_materials.${index}.actual_stock`)}
                />
            </Table.Td>

            <Table.Td>
                <Textarea
                placeholder="Comment"
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`selected_materials.${index}.note`)}
                {...form.getInputProps(`selected_materials.${index}.note`)}
                />
            </Table.Td>
        </Table.Tr>
    ));

    const handleSubmit = async(values: typeof form.values) => {
    
        const data = {
            id: Number(reconciliation.id),
            completed: checked,
            data: values.selected_materials,
        }
        setLoading(true);

        try{

            const response = await saveReconciliationData(data)
            
            if(response.data.saved) {

                setReconciliation(response.data.data)
                notify({
                type:'success',
                message: 'Reconciliation data saved. ',
                title: 'Great'
                })
                setLoading(false);

            }

        } catch(error) {
          
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.message, // Use optional chaining to access data property
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
        
        setLoading(false);
    }

  return (
    <>
    <Alert variant="light" color="gauge-primary" icon={<IconInfoCircle />}>
        Perform your manual item count and provide the results in the corresponding fields.
        You should provide a reason in the note field if necessary.
    </Alert>

    <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />
    <form method='POST' onSubmit={form.onSubmit(handleSubmit)}>
            
        <ScrollArea my={10}>
            <Table withRowBorders={false} highlightOnHover withColumnBorders={false} 
            horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" mb={20}>
                <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{ width: '200px' }}>
                    Material
                    </Table.Th>
                    
                    <Table.Th style={{ width: '140px' }}>
                        Current Level
                    </Table.Th>
                    
                    <Table.Th style={{ width: '140px' }}>
                        Actual Level
                    </Table.Th>
                    
                    <Table.Th style={{ width: '300px' }}>
                        Note
                    </Table.Th>
                </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {fields}
                </Table.Tbody>
            </Table>

        </ScrollArea>
        <Group justify='space-between' mt={10} mb={20}>
            <Switch
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                fw={600}
                label="I confirm that I have completed the Reconciliation. Proceed to submitting my report."
                />
            <Button type="submit" variant="primary">
                {checked?'Submit Report':'Save and continue'}
            </Button>
        </Group>
        </form>
    </>
  )
}

export default ReconcilingForm
