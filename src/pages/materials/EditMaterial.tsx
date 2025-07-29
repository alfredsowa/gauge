import {
    Button,
    Card,
    Grid,
    Group,
    LoadingOverlay,
    Select,
    Switch,
    Text,
    TextInput,
    Textarea,
    rem,
    Anchor,
    NumberInput,
    Divider,
    Alert
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {IconInfoCircle, IconPlus, IconQrcode} from "@tabler/icons-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { changeImage, getMaterialCategories, removeImage, updateMaterial } from "../../requests/_materialsRequests";
import { MaterialCategory } from "../../requests/models/_business";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { notify } from "../../requests/general/toast";
import { LinkItem } from "../../requests/models/_general";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { MaterialModel } from "../../requests/models/_material";
import PageTitle from "../../components/PageTitle";
import { AxiosError } from "axios";
import MaterialCategoryForm from "./components/MaterialCategoryForm";
import TextFieldToolTip from "../../components/TextFieldToolTip";
import { unitsAndSymbols } from "../../requests/general/options";
import { useAuth } from "../../auth/core/Auth";


const EditMaterial = () => {
    const [categories, setCategories] = useState<MaterialCategory[]|undefined>();
    const [formLoading, setFormLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [hasImage, setHasImage] = useState<string|undefined>();
    const [fileM, setFileM] = useState<File | null>(null)
    const [enableSubmit, setEnableSubmit] = useState(false);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const hiddenNewCategory = useRef<HTMLAnchorElement>(null);
    const getMaterialData  = useLoaderData() as MaterialModel;
    const {currentBusiness} = useAuth()

    const navigate  = useNavigate()
    const imageContainerClass = {
        width: 'auto',
        textAlign: 'center',
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

    const {id} = useParams();

    useEffect(()=>{

        const categoriesResponse = async() => {
            const response = await getMaterialCategories();
            const data = response.data.data;
            setCategories(data);
        }

        getMaterialData?setHasImage(getMaterialData.image):setHasImage(undefined)

        categoriesResponse()
    },[getMaterialData])

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    const handleCategoryButtonClick = () => {
        hiddenNewCategory.current?.click();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const output = document.getElementById('materialPhoto') as HTMLImageElement;
        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }
        const selectedFile = files[0];

        if(selectedFile.size > 5000000) {
            (document.getElementById('materialPhoto') as HTMLInputElement).value = '';
            notify({
                type:'error',
                message: 'Image is too large. Please select a file less than 5MB.',
            })
            // selectedFile.value = null;
            setEnableSubmit(false);
            return
        }

        setEnableSubmit(true);
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

    const getImageFileObject = async() => {

        setImageLoading(true)

        try {
            if (fileM) {
                const formData = new FormData();
                formData.append('file', fileM);

                const data = {
                    id: id,
                    file: fileM
                }

                const changedPhoto = await changeImage(data);
                if (changedPhoto.data.saved) {
                    setHasImage(changedPhoto.data.path)
                    setImageLoading(false)
                    notify({
                        type:'success',
                        message: 'Image has been added.',
                    })
                }
                setImageLoading(false)
                return navigate('/materials')
            }
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
            setFormLoading(false);
        }
    }

    const removePhoto = async() => {
        try {
            const removePhotoForm = await removeImage(Number(id))
            if (removePhotoForm.data.saved) {
                setHasImage(undefined)
                setImageLoading(false)
                notify({
                    type:'success',
                    message: removePhotoForm.data.message,
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    const materialCatogories = useMemo(
        () => {
            return categories?.map((category) => ({
                value: `${category.id}`,
                label: category.title,
            }));
        },[categories]
    );


    const generalInformation = useForm({
        initialValues: {
            name: (getMaterialData.name)?getMaterialData.name:'',
            code: (getMaterialData.code)?getMaterialData.code:'',
            type: (getMaterialData.type)?getMaterialData.type:'',
            unit_of_measurement: (getMaterialData.unit_of_measurement)?getMaterialData.unit_of_measurement:"",
            cost_per_unit: (getMaterialData.cost_per_unit)?getMaterialData.cost_per_unit:0,
            minimum_stock_level: (getMaterialData.minimum_stock_level)?getMaterialData.minimum_stock_level:1,
            is_reusable_after_damaged: Number(getMaterialData.is_reusable_after_damaged) === 1 ? true : false,
            category: (getMaterialData.material_category_id)?String(getMaterialData.material_category_id):'',
            description: (getMaterialData.description)?getMaterialData.description:'',
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Name is too small' : null),
            code: (value) => (value.length > 0 && value.length < 2 ? 'Code is too small' : null),
            type: (value) => ((value !== 'In-house' && value !== 'Sourced') ? 'Invalid type selected' : null),
            minimum_stock_level: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
            category: (value) => (Number(value) < 1 ? 'Invalid category selected' : null),
            unit_of_measurement: (value) => (value.length < 2 ? 'Must be 2 or more characters' : null),
            cost_per_unit: (value) => ((Number(value) < 0) ? 'Enter a positive number' : null),
            description: (value) => value.length < 0 ?(value.length < 2 ? 'Description is too small' : null):null,
        },
    });

    const handleSubmit = async(values: typeof generalInformation.values) => {

        setFormLoading(true)

        const data = {
            id: Number(id),
            name: values.name,
            code: values.code,
            type: values.type,
            minimum_stock_level: values.minimum_stock_level,
            unit_of_measurement: values.unit_of_measurement,
            cost_per_unit: values.cost_per_unit,
            is_reusable_after_damaged: values.is_reusable_after_damaged,
            material_category_id: Number(values.category),
            description: values.description
        }

        try{

            const response = await updateMaterial(data)

            if(response.data.saved) {

                notify({
                    type:'success',
                    message: response.data.message,
                    title: 'Great'
                })
                setFormLoading(false);

                return navigate('/materials')

            }

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
            setFormLoading(false);
        }

        setFormLoading(false);
    }

    const items: Array<LinkItem> = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Materials', href: '/materials' },
        { title: 'Edit material', href: '#' },
    ]

    // @ts-ignore
    return (
        <>
            <PageTitle
                title="Edit Material"
                breadcrumb={<PageBreadCrumb pageBreadCrumbs={items} />}
            >

            </PageTitle>

            <Group justify="flex-end">
                <MaterialCategoryForm setCategories={setCategories} hiddenNewCategory={hiddenNewCategory} />
            </Group>

            <Grid mt={20}>
                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 9, md: 9, lg: 9 }}>

                    <LoadingOverlay
                        visible={formLoading}
                        zIndex={1000}
                        overlayProps={{ radius: 'sm', blur: 1 }}
                        loaderProps={{ color: 'blue', type: 'bars' }}
                    />

                    <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
                        <Card radius={'md'} mb={'lg'} p={40}>

                            <Grid gutter={{ base: 5, xs: 'md', md: 'lg', xl: 30 }}>

                                {/* Material Name */}
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

                                {/* Type */}
                                <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                                    <Select
                                        {...generalInformation.getInputProps('type')}
                                        key={generalInformation.key('type')}
                                        radius={"md"}
                                        variant="filled"
                                        checkIconPosition="right"
                                        // c={'dimmed'}
                                        required={getMaterialData.is_component !== 1}
                                        readOnly={getMaterialData.is_component === 1}
                                        withAsterisk={!getMaterialData.is_component}

                                        label="Type"
                                        placeholder="Pick one"
                                        data={['In-house', 'Sourced']}
                                    />
                                    {getMaterialData.is_component? (
                                        <Text fz='xs' c={'orange'}>Components defined materials are "In-house" types</Text>
                                    ):''}
                                </Grid.Col>

                                {/* Category */}
                                <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                                    <Select
                                        {...generalInformation.getInputProps('category')}
                                        key={generalInformation.key('category')}
                                        // defaultValue={getMaterialData.material_category_id}
                                        radius={"md"}
                                        variant="filled"
                                        checkIconPosition="right"
                                        // c={'dimmed'}
                                        required
                                        withAsterisk

                                        label="Category"
                                        placeholder="Pick one"
                                        data={materialCatogories}
                                        // searchable
                                        nothingFoundMessage="Not Found"
                                    />
                                    <Anchor variant='filled' fw={500} fz={'xs'} onClick={handleCategoryButtonClick}>
                                        <IconPlus size={10} /> Add New Category
                                    </Anchor>
                                </Grid.Col>

                                {/* Code */}
                                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                                    <TextInput
                                        {...generalInformation.getInputProps('code')}
                                        key={generalInformation.key('code')}
                                        radius={"md"}
                                        leftSection={<IconQrcode style={{ width: rem(16), height: rem(16) }} />}
                                        variant="filled"
                                        // c={'dimmed'}

                                        label="Code"
                                        placeholder="Code"
                                    />
                                </Grid.Col>

                                <Grid.Col pt={20} pb={15} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                                    <Divider mb={15} label="Tracking Metrics" labelPosition="left" />
                                    <Alert variant="light" color="blue" radius="md" fz={'md'} title="How it works" icon={<IconInfoCircle />}>
                                        <Text mb={5}><strong>Tracking Measurement Unit :</strong> The measure of unit in which the materials are to be tracked. </Text>
                                        <Text mb={5}><strong>Cost Per Tracking Unit :</strong> The cost of material per tracking unit.</Text>
                                        <Text mb={5}><strong>Current Stock Level : </strong> The current quantity of materials available in stock.
                                            Enter the current stock level of your material in the selected Tracking Measurement Unit.
                                            If the Tracking Measurement Unit is different from the actual materials unit, convert the stock level accordingly and enter the equivalent.</Text>
                                        <Text mb={5}><strong>Minimum Stock Level :</strong> The minimum quantity of materials that should be in stock. <br /></Text>
                                    </Alert>
                                </Grid.Col>

                                {/* Unit of measure */}
                                <Grid.Col pt={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                                    <Select
                                        {...generalInformation.getInputProps('unit_of_measurement')}
                                        key={generalInformation.key('unit_of_measurement')}
                                        radius={"md"}
                                        variant="filled"
                                        checkIconPosition="right"
                                        // c={'dimmed'}
                                        required
                                        withAsterisk

                                        label="Tracking Measurement Unit"
                                        placeholder="Pick one"
                                        data={unitsAndSymbols}
                                        searchable
                                        nothingFoundMessage="Not Found"
                                    />
                                </Grid.Col>

                                {/* Unit Cost */}
                                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                                    <NumberInput
                                        {...generalInformation.getInputProps('cost_per_unit')}
                                        key={generalInformation.key('cost_per_unit')}
                                        radius={"md"}
                                        variant="filled"
                                        prefix={currentBusiness?.currency_symbol}
                                        thousandSeparator=","
                                        step={0.01}
                                        label="Cost Per Tracking Unit"
                                        min={0}
                                        required
                                        withAsterisk
                                        placeholder="0"
                                    />
                                </Grid.Col>

                                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                                    <NumberInput
                                        radius={"md"}
                                        variant="filled"
                                        disabled
                                        min={0}
                                        value={getMaterialData.current_stock_level}
                                        label="Current Stock Level"
                                        thousandSeparator=","
                                        placeholder="0"
                                    />
                                </Grid.Col>

                                {/* Minimum Stock Level */}
                                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                                    <NumberInput
                                        {...generalInformation.getInputProps('minimum_stock_level')}
                                        key={generalInformation.key('minimum_stock_level')}
                                        radius={"md"}
                                        leftSection={<TextFieldToolTip title="A alert will be shown when level is equal or less"/>}
                                        variant="filled"
                                        // c={'dimmed'}

                                        min={0}
                                        label="Minimum Stock Level"
                                        required
                                        thousandSeparator=","
                                        withAsterisk
                                        placeholder="0"
                                    />
                                </Grid.Col>

                                {/* Reusability */}
                                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 8, md: 8, lg: 8 }}>
                                    <Switch mb={12} mt={12}
                                            disabled={getMaterialData.is_component === 1}
                                            defaultChecked={generalInformation.getValues().is_reusable_after_damaged}
                                            {...generalInformation.getInputProps('is_reusable_after_damaged')}
                                            key={generalInformation.key('is_reusable_after_damaged')}
                                            label="Is reusable after damage?"
                                            description="Resusable items are added back to inventory after a damaged production."
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

                                <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
                                    <Button
                                        type="submit"
                                        px={40}
                                        variant="filled"
                                    >
                                        Update
                                    </Button>
                                </Grid.Col>

                            </Grid>

                        </Card>

                    </form>
                </Grid.Col>

                <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 3, md: 3, lg: 3 }}>
                    <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
                        <Card radius={'md'} mb={'lg'} py={40}>

                            <LoadingOverlay
                                visible={imageLoading}
                                zIndex={1000}
                                overlayProps={{ radius: 'sm', blur: 1 }}
                                loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
                            />
                            <>

                                <div style={{ ...imageContainerClass, textAlign: 'center' as const }}>
                                    <img id="materialPhoto" src={hasImage} style={imgTagClass}/>
                                </div>
                                <>
                                    <Text mt={10} size='md'>Upload material image. <span style={{fontWeight:'500'}}><br />It must be less than 5MB</span></Text>
                                    <Button mt={10} className="button-upload" variant="light" onClick={handleClick}>
                                        Upload Photo
                                    </Button>
                                    <input type="file" id='materialImage' accept='image/*' ref={hiddenFileInput} onChange={handleChange} style={fileInputClass} />
                                    <Group mt={10} justify="space-between">
                                        <Button onClick={getImageFileObject} disabled={!enableSubmit} mr={0}>Upload</Button>

                                        {/* <Button color='red' variant='light' onClick={close}>Cancel</Button> */}
                                        {
                                            hasImage?(
                                                <Button variant="light" disabled={hasImage?false:true} mr={1} color='red' onClick={removePhoto} >
                                                    Remove
                                                </Button>
                                            ):null
                                        }
                                    </Group>

                                </>

                            </>

                        </Card>

                    </form>
                </Grid.Col>
            </Grid>
        </>
    );
}

export default EditMaterial