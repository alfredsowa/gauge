import { Button, Grid, Group, TextInput, Textarea } from '@mantine/core'
import { MouseEventHandler } from 'react';

// Define the type for generalInformation prop
interface GeneralInformation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getInputProps: (name: string) => any;
    key: (name: string) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: any;
  }

const SupplierForm = ({generalInformation,close}:{
    generalInformation: GeneralInformation, 
    close: MouseEventHandler<HTMLButtonElement> | undefined
}) => {

  return (
    <>
        {/* <Card radius={0} mb={'lg'} p={0} pt={30}> */}

            <Grid gutter={{ base: 5, xs: 'sm', md: 'md', xl: 30 }}>

            {/* Contact Person */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
                <TextInput
                {...generalInformation.getInputProps('contact_person')}
                key={generalInformation.key('contact_person')}
                radius={"md"}
                variant="filled"
                withAsterisk
                required
                // c={'dimmed'}
                
                label="Contact Person"
                placeholder="John Doe"
                />
            </Grid.Col>

            {/* Company Name */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
                <TextInput
                {...generalInformation.getInputProps('company_name')}
                key={generalInformation.key('company_name')}
                radius={"md"}
                variant="filled"
                // withAsterisk
                // required
                // c={'dimmed'}
                
                label="Company Name"
                placeholder="ABC Limited"
                />
            </Grid.Col>

            {/* Contact Details */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
                <TextInput
                {...generalInformation.getInputProps('contact_detail')}
                key={generalInformation.key('contact_detail')}
                radius={"md"}
                variant="filled"
                withAsterisk
                required
                // c={'dimmed'}
                
                label="Contact Details"
                placeholder="Email / Phone number"
                />
            </Grid.Col>
            
            {/* Location */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
                <TextInput
                {...generalInformation.getInputProps('location')}
                key={generalInformation.key('location')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Location"
                placeholder="Accra, Ghana"
                />
            </Grid.Col>

            {/* Notes */}
            <Grid.Col pt={5} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                {...generalInformation.getInputProps('note')}
                key={generalInformation.key('note')}
                radius={"md"}
                variant="filled"
                placeholder="Here can be any information you want to tag the supplier with"
                label="Notes"
                autosize
                minRows={3}
                />
            </Grid.Col>
                
            <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                <Group justify="flex-end" mt={15}>
                    <Button variant="default" onClick={close}>Cancel</Button>
                    <Button variant="filled" type="submit">Save Supplier</Button>
                </Group>
            </Grid.Col>
            </Grid>

        {/* </Card> */}
    </>
  )
}

export default SupplierForm
