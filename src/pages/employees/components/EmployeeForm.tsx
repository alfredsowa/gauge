/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Grid, Group, Text, TextInput, rem } from '@mantine/core'
import { IconArrowRight, IconAt, IconCalendar, IconPhone, IconReload } from '@tabler/icons-react'
import { ChangeEvent, useRef, useState } from 'react'
import { notify } from '../../../requests/general/toast';
import { removeImage } from '../../../requests/_employeeRequests';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';

const imageContainerClass = {
    width: '200px',
    overflow: 'hidden', 
    height: '200px', 
    borderRadius: '20px', 
    backgroundColor: 'var(--mantine-color-dark-1)', 
}

const imgTagClass = {
    width: 'auto', 
    height: '100%'
}

const fileInputClass = {
    marginBottom: '5px', 
    padding: '7px',
    border: 0,
    display:'none'
}

interface EmployeeInformation {
    getInputProps: (name: string) => any;
    key: (name: string) => string;
    getValues: () => any;
}

const EmployeeForm = ({employeeInformation,setFileM, imageUrl}:
    {employeeInformation: EmployeeInformation, setFileM: React.Dispatch<React.SetStateAction<File|null>>, 
        imageUrl?:string|undefined}) => {
    const [hasImage, setHasImage] = useState(imageUrl);
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const output = document.getElementById('employeeImage') as HTMLImageElement;
        // const selectedFile = event.target.files[0];

        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        const selectedFile = files[0];
    
        if(selectedFile.size > 5000000) {
            (document.getElementById('employeeImage') as HTMLInputElement).value = '';
            notify({
                type:'error',
                message: 'Image is too large. Please select a file less than 5MB.',
            })
            // selectedFile.value = null;
            setFileM(selectedFile);
            return
        }
    
        if (output) {
            const imageSRC = URL.createObjectURL(selectedFile);
            output.src = URL.createObjectURL(selectedFile);
            setHasImage(imageSRC)
            output.onload = function() {
                URL.revokeObjectURL(output.src) // free memory
            }
        }
        setFileM(selectedFile);
    }

    const clearImage = () => {
        const output = document.getElementById('employeeImage') as HTMLImageElement;
        URL.revokeObjectURL(output.src)
        setHasImage(undefined)
    }

    const removePhoto = async(id: number|null) => {
        
        try {
            if (id){
                const removePhotoForm = await removeImage(Number(id))
                if (removePhotoForm.data.saved) {
                    notify({
                        type:'success',
                        message: removePhotoForm.data.message,
                    })
                }
            }
            
            clearImage()
                
        } catch (err) {
            console.log(err);
        }
    }

  return (
    <>
        <Grid>
            <Grid.Col span={{ base: 12, sm: 3, md: 3, lg: 3 }}>
                <Group wrap="wrap" p={10}>

                    <div style={imageContainerClass}>
                        <img 
                            id="employeePhoto" 
                            src={hasImage} 
                            style={imgTagClass}
                        />
                    </div>

                    <Group justify='space-between'>
                        <Text size='sm' c={'dimmed'}>Add employee image. <span style={{fontWeight:'500'}}><br />It must be less than 5MB</span></Text>
                        <Button className="button-upload" variant="light" onClick={handleClick}>
                        Choose Image
                        </Button>
                        <input type="file" id='employeeImage' accept='image/*' ref={hiddenFileInput} onChange={handleChange} style={fileInputClass} />
                        {
                        hasImage?(
                            <Button variant="light" disabled={hasImage?false:true} mr={5} color='red' 
                            onClick={() => removePhoto(Number(employeeInformation.getValues().id))}>
                                Remove
                            </Button>
                        ):null
                        }
                    </Group>
                
                </Group>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 9, md: 9, lg: 9 }}>

                <Card radius={'md'} mb={'lg'} p={30}>

                    <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

                    {/* Employee First Name */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <TextInput
                        {...employeeInformation.getInputProps('first_name')}
                        key={employeeInformation.key('first_name')}
                        radius={"md"}
                        variant="filled"
                        // c={'dimmed'}
                        
                        label="First Name"
                        withAsterisk
                        required
                        placeholder="John"
                        />
                    </Grid.Col>

                    {/* Employee Last Name */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <TextInput
                        {...employeeInformation.getInputProps('last_name')}
                        key={employeeInformation.key('last_name')}
                        radius={"md"}
                        variant="filled"
                        // c={'dimmed'}
                        
                        label="Last Name"
                        withAsterisk
                        required
                        placeholder="Doe"
                        />
                    </Grid.Col>

                    {/* Phone Number */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <TextInput
                        {...employeeInformation.getInputProps('phone_number')}
                        key={employeeInformation.key('phone_number')}
                        radius={"md"}
                        leftSection={<IconPhone style={{ width: rem(16), height: rem(16) }} />}
                        variant="filled"
                        // c={'dimmed'}
                        
                        label="Phone Number"
                        required
                        withAsterisk
                        placeholder="0500000001"
                        />
                    </Grid.Col>

                    {/* Phone Number */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <TextInput
                        {...employeeInformation.getInputProps('alt_phone_number')}
                        key={employeeInformation.key('alt_phone_number')}
                        radius={"md"}
                        leftSection={<IconPhone style={{ width: rem(16), height: rem(16) }} />}
                        variant="filled"
                        // c={'dimmed'}
                        
                        label="Alt Phone Number"
                        placeholder="0500000002"
                        />
                    </Grid.Col>

                    {/* Email */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <TextInput
                        type='email'
                        {...employeeInformation.getInputProps('email')}
                        key={employeeInformation.key('email')}
                        radius={"md"}
                        leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
                        variant="filled"
                        // c={'dimmed'}
                        
                        label="Email"
                        placeholder="john@mail.com"
                        />
                    </Grid.Col>

                    {/* Job Title */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <TextInput
                        {...employeeInformation.getInputProps('title')}
                        key={employeeInformation.key('title')}
                        radius={"md"}
                        variant="filled"
                        // c={'dimmed'}
                        
                        label="Job Title"
                        placeholder="CEO"
                        />
                    </Grid.Col>

                    {/* Department */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <TextInput
                        {...employeeInformation.getInputProps('department')}
                        key={employeeInformation.key('department')}
                        radius={"md"}
                        variant="filled"
                        // c={'dimmed'}
                        
                        label="Department"
                        placeholder="Production"
                        />
                    </Grid.Col>

                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <DateInput
                        {...employeeInformation.getInputProps('hire_date')}
                        key={employeeInformation.key('hire_date')}
                        radius={"md"}
                        leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}
                        variant="filled"
                        // c={'dimmed'}
                        clearable
                        maxDate={dayjs(new Date()).toDate()}
                        
                        label="Hired Date"
                        required
                        withAsterisk
                        placeholder=""
                        />
                    </Grid.Col>

                    <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                        <Button 
                        mr={10}
                        mb={10}
                        type="submit"
                        px={40}
                        variant="filled"
                        rightSection={<IconArrowRight size={14} />}>
                        Save
                        </Button>
                        <Button  
                        mb={10}
                        type="reset"
                        px={40}
                        variant="light"
                        rightSection={<IconReload size={14} />}>
                        Reset
                        </Button>
                    </Grid.Col>

                    </Grid>

                </Card>
            
            </Grid.Col>
        </Grid>
    </>
  )
}

export default EmployeeForm
