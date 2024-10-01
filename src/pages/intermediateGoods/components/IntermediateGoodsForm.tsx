/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button, Grid, Group, NumberInput, Switch, Text, TextInput, Textarea, Stack} from '@mantine/core'
import { IconArrowRight, IconReload } from '@tabler/icons-react'
import { ChangeEvent, useRef, useState } from 'react'
import { useAuth } from '../../../auth/core/Auth'
import TextFieldToolTip from '../../../components/TextFieldToolTip';
import { notify } from '../../../requests/general/toast';
import { removeImage } from '../../../requests/_productRequests';
import PaperCard from "../../../components/PaperCard.tsx";
import PaperCardHeader from "../../../components/PaperCardHeader.tsx";
import PaperCardBody from "../../../components/PaperCardBody.tsx";

const imageContainerClass = {
    width: '150px',
    overflow: 'hidden',
    height: '150px',
    borderRadius: '20px',
    backgroundColor: 'rgb(241 241 241)',
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

interface GeneralInformation {
    getInputProps: (name: string) => any;
    key: (name: string) => string;
    getValues: any;
}

const IntermediateGoodsForm = ({generalInformation,setFileM, imageUrl}:
                         {generalInformation: GeneralInformation, setFileM: React.Dispatch<React.SetStateAction<File|null>>,
                             imageUrl?:string|undefined}) => {
    const [hasImage, setHasImage] = useState(imageUrl);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const {currentBusiness} = useAuth()

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const output = document.getElementById('productImage') as HTMLImageElement;
        // const selectedFile = event.target.files[0];
        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        const selectedFile = files[0];

        if(selectedFile.size > 5000000) {
            (document.getElementById('productImage') as HTMLInputElement).value = '';
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
        const output = document.getElementById('productImage') as HTMLImageElement;
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
            <PaperCard>
                <PaperCardHeader>
                    <Text fw={'bold'} fz={'md'}>
                        Details
                    </Text>
                </PaperCardHeader>
                <PaperCardBody>
                <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

                    <Grid.Col span={{base: 12, sm: 12, md: 12, lg: 12}}>
                        {/* <Text size='sm' mb={5} fw={600} c={'dark'}>Image</Text> */}
                        <Group wrap="wrap">
                            <div style={imageContainerClass}>
                                <img
                                    id="intermediateGoodPhoto"
                                    src={hasImage}
                                    style={imgTagClass}
                                />
                            </div>
                            <Stack mt={10} justify="space-between">

                                <Button className="button-upload" variant="light" onClick={handleClick}>
                                    Choose Image
                                </Button>
                                <input type="file" id='productImage' accept='image/*' ref={hiddenFileInput}
                                       onChange={handleChange} style={fileInputClass}/>
                                {
                                    hasImage ? (
                                        <Button variant="light" disabled={hasImage ? false : true} mr={5} color='red'
                                                onClick={() => removePhoto(generalInformation.getValues().id)}>
                                            Remove
                                        </Button>
                                    ) : null
                                }
                            </Stack>
                        </Group>
                        <Text c={'orange'}>Image must be up to 5MB</Text>
                    </Grid.Col>

                    {/* Intermediate Good Name */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                        <TextInput
                            {...generalInformation.getInputProps('name')}
                            key={generalInformation.key('name')}
                            radius={"md"}
                            variant="filled"
                            // c={'dimmed'}
                            
                            label="Name"
                            withAsterisk
                            required
                            placeholder="Name"
                        />
                    </Grid.Col>

                    {/* Minimum Stock Quantity */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
                        <NumberInput
                            {...generalInformation.getInputProps('min_stock_quantity')}
                            key={generalInformation.key('min_stock_quantity')}
                            radius={"md"}
                            leftSection={<TextFieldToolTip title="A alert will be shown when level is equal or less"/>}
                            variant="filled"
                            // c={'dimmed'}
                            
                            min={0}
                            label="Min. Stock Quantity"
                            required
                            thousandSeparator=","
                            withAsterisk
                            placeholder="0"
                        />
                    </Grid.Col>

                    {/* Stock Quantity */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
                        <NumberInput
                            {...generalInformation.getInputProps('stock_quantity')}
                            key={generalInformation.key('stock_quantity')}
                            radius={"md"}
                            variant="filled"
                            // c={'dimmed'}
                            min={0}
                            
                            label="Stock Quantity"
                            withAsterisk
                            thousandSeparator=","
                            required
                            placeholder="0"
                        />
                    </Grid.Col>

                    {/* Labour Cost */}
                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
                        <NumberInput
                            {...generalInformation.getInputProps('labour_cost')}
                            key={generalInformation.key('labour_cost')}
                            radius={"md"}
                            variant="filled"
                            prefix={currentBusiness?.currency_symbol}
                            thousandSeparator=","
                            
                            step={0.01}
                            label="Labour Cost"
                            min={0}
                            placeholder="0"
                        />
                    </Grid.Col>

                    {/* Description */}
                    <Grid.Col pt={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                        <Textarea
                            {...generalInformation.getInputProps('description')}
                            key={generalInformation.key('description')}
                            radius={"md"}
                            variant="filled"
                            placeholder="You can add more information or specifications..."
                            label="Item Description"
                            autosize
                            minRows={3}
                        />
                    </Grid.Col>

                    {/*Status*/}
                    <Grid.Col pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                        <Switch
                            defaultChecked={generalInformation.getValues().status}
                            {...generalInformation.getInputProps('status')}
                            key={generalInformation.key('status')}
                            label="Active"
                            description={'All active intermediate goods are available for production'}
                        />
                    </Grid.Col>

                    {/*Is reusable*/}
                    <Grid.Col pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                        <Switch
                            defaultChecked={generalInformation.getValues().is_reusable_after_damaged}
                            {...generalInformation.getInputProps('is_reusable_after_damaged')}
                            key={generalInformation.key('is_reusable_after_damaged')}
                            label="This item is completely resuable after damaged final product production."
                            // description={'All active intermediate goods are available for production'}
                        />
                    </Grid.Col>

                    <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
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
                </PaperCardBody>
            </PaperCard>
        </>
    )
}

export default IntermediateGoodsForm
