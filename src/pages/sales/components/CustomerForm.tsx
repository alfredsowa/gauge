import { Button, Card, Grid, TextInput, Textarea } from '@mantine/core'

// Define the type for generalInformation prop
interface GeneralInformation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getInputProps: (name: string) => any;
    key: (name: string) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: any;
  }

const CustomerForm = ({generalInformation}: {generalInformation: GeneralInformation}) => {

  return (
    <>
        <Card radius={'md'} mb={'lg'} p={30}>

            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

            {/* First name */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('first_name')}
                key={generalInformation.key('first_name')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="First name"
                required
                withAsterisk
                placeholder="John"
                />
            </Grid.Col>

            {/* Last name */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('last_name')}
                key={generalInformation.key('last_name')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Last name"
                required
                withAsterisk
                placeholder="Doe"
                />
            </Grid.Col>

            {/* Email */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                type='email'
                {...generalInformation.getInputProps('email')}
                key={generalInformation.key('email')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Email"
                required
                withAsterisk
                placeholder="john@mail.com"
                />
            </Grid.Col>

            {/* Phone */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('phone')}
                key={generalInformation.key('phone')}
                radius={"md"}
                type="number"
                variant="filled"
                // c={'dimmed'}
                
                label="Phone"
                required
                withAsterisk
                placeholder="0200000001"
                />
            </Grid.Col>

            {/* City */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('city')}
                key={generalInformation.key('city')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="City"
                required
                withAsterisk
                placeholder="Accra"
                />
            </Grid.Col>

            {/* State/Region */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('state')}
                key={generalInformation.key('state')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Region/State"
                placeholder="Greater Accra"
                />
            </Grid.Col>

            {/* Country */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('country')}
                key={generalInformation.key('country')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Country"
                required
                withAsterisk
                placeholder="Ghana"
                />
            </Grid.Col>

            {/* Company */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('company_name')}
                key={generalInformation.key('company_name')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Company name"
                placeholder="ABC Company"
                />
            </Grid.Col>

            {/* Contact person */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <TextInput
                {...generalInformation.getInputProps('contact_person')}
                key={generalInformation.key('contact_person')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Contact person"
                placeholder="Brian Cook"
                />
            </Grid.Col>

            {/* Address */}
            <Grid.Col pt={10} pb={10} span={12}>
                <TextInput
                {...generalInformation.getInputProps('address')}
                key={generalInformation.key('address')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Address"
                placeholder="House number 23, Cresent Street, East Legon - Accra"
                />
            </Grid.Col>

            {/* Additional information */}
            <Grid.Col pt={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                {...generalInformation.getInputProps('additional_info')}
                key={generalInformation.key('additional_info')}
                radius={"md"}
                variant="filled"
                placeholder="You can add more information or specifications..."
                label="Additional information"
                autosize
                minRows={3}
                />
            </Grid.Col>
                
            <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                <Button  
                type="submit"
                // disabled={enablePersonal}
                px={40}
                variant="filled">
                Save
                </Button>
            </Grid.Col>
            </Grid>

        </Card>
    </>
  )
}

export default CustomerForm
